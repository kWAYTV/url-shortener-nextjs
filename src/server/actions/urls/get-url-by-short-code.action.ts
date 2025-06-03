'use server';

import { db, eq, sql } from '@/lib/db';
import { urls } from '@/schemas/db.schema';
import { type ApiResponse } from '@/types/api';

interface GetUrlResult {
  originalUrl: string;
  flagged?: boolean;
  flagReason?: string | null;
}

// Get URL data without incrementing clicks
export async function getUrlByShortCodeAction(
  shortCode: string
): Promise<ApiResponse<GetUrlResult>> {
  try {
    // Input validation
    if (
      !shortCode ||
      typeof shortCode !== 'string' ||
      shortCode.trim() === ''
    ) {
      return {
        success: false,
        error: 'Invalid short code provided'
      };
    }

    const url = await db.query.urls.findFirst({
      where: (urls, { eq }) => eq(urls.shortCode, shortCode.trim())
    });

    if (!url) {
      return {
        success: false,
        error: 'URL not found'
      };
    }

    return {
      success: true,
      data: {
        originalUrl: url.originalUrl,
        flagged: url.flagged || false,
        flagReason: url.flagReason || null
      }
    };
  } catch (error) {
    console.error('Error fetching URL by short code:', error);
    return {
      success: false,
      error: 'An error occurred while fetching the URL'
    };
  }
}

// Increment click count atomically
export async function incrementUrlClickAction(
  shortCode: string
): Promise<ApiResponse<{ success: boolean; clicks?: number }>> {
  try {
    if (
      !shortCode ||
      typeof shortCode !== 'string' ||
      shortCode.trim() === ''
    ) {
      return {
        success: false,
        error: 'Invalid short code provided'
      };
    }

    // Use atomic increment to prevent race conditions
    await db
      .update(urls)
      .set({
        clicks: sql`${urls.clicks} + 1`,
        updatedAt: new Date()
      })
      .where(eq(urls.shortCode, shortCode.trim()));

    return {
      success: true,
      data: { success: true }
    };
  } catch (error) {
    console.error('Error incrementing click count:', error);
    return {
      success: false,
      error: 'Failed to increment click count'
    };
  }
}
