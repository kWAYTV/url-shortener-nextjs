'use server';

import { db, eq } from '@/lib/db';
import { urls } from '@/schemas/db.schema';
import { type ApiResponse } from '@/types/api';

interface GetUrlResult {
  originalUrl: string;
  flagged?: boolean;
  flagReason?: string | null;
}

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

    // Update click count atomically
    await db
      .update(urls)
      .set({
        clicks: url.clicks + 1,
        updatedAt: new Date()
      })
      .where(eq(urls.shortCode, shortCode.trim()));

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
