'use server';

import { getSession } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import {
  createServerErrorResponse,
  createSuccessResponse,
  createUnauthorizedResponse,
  createValidationErrorResponse
} from '@/server/actions/utils';
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
    // Input validation
    if (!userId || typeof userId !== 'string') {
      return createValidationErrorResponse('Invalid user ID');
    }

    const session = await getSession();

    if (!session?.user || session.user.id !== userId) {
      return createUnauthorizedResponse();
    }

    const userUrls = await db.query.urls.findMany({
      where: (urls, { eq }) => eq(urls.userId, userId),
      orderBy: (urls, { desc }) => [desc(urls.createdAt)]
    });

    const mappedUrls: UserUrl[] = userUrls.map(url => ({
      id: url.id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      createdAt: url.createdAt,
      clicks: url.clicks
    }));

    return createSuccessResponse(mappedUrls);
  } catch {
    return createServerErrorResponse('Failed to retrieve URLs');
  }
}
