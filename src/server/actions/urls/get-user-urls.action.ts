'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { type ApiResponse } from '@/types/api';

interface UserUrl {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
}

export async function getUserUrlsAction(
  userId: string
): Promise<ApiResponse<UserUrl[]>> {
  try {
    // Validate userId parameter
    if (!userId || typeof userId !== 'string') {
      return {
        success: false,
        error: 'Invalid user ID'
      };
    }

    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user || session.user.id !== userId) {
      return {
        success: false,
        error: 'Unauthorized'
      };
    }

    const userUrls = await db.query.urls.findMany({
      where: (urls, { eq }) => eq(urls.userId, userId),
      orderBy: (urls, { desc }) => [desc(urls.createdAt)]
    });

    return {
      success: true,
      data: userUrls.map(
        (url): UserUrl => ({
          id: url.id,
          originalUrl: url.originalUrl,
          shortCode: url.shortCode,
          createdAt: url.createdAt,
          clicks: url.clicks
        })
      )
    };
  } catch (error) {
    console.error('Error getting user URLs:', error);
    return {
      success: false,
      error: 'Failed to retrieve URLs'
    };
  }
}
