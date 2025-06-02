'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { type ApiResponse } from '@/types/api';

export async function getUserUrls(userId: string): Promise<
  ApiResponse<
    Array<{
      id: number;
      originalUrl: string;
      shortCode: string;
      createdAt: Date;
      clicks: number;
    }>
  >
> {
  try {
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
      data: userUrls.map(url => ({
        id: url.id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        createdAt: url.createdAt,
        clicks: url.clicks
      }))
    };
  } catch (error) {
    console.error('Error getting user URLs', error);
    return {
      success: false,
      error: 'An error occurred'
    };
  }
}
