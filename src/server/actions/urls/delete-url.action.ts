'use server';

import { revalidatePath } from 'next/cache';

import { getSession } from '@/lib/auth-utils';
import { db, eq } from '@/lib/db';
import { urls } from '@/schemas/db.schema';
import { type ApiResponse } from '@/types/api';

export async function deleteUrlAction(
  urlId: number
): Promise<ApiResponse<null>> {
  try {
    // Input validation
    if (!urlId || typeof urlId !== 'number' || urlId <= 0) {
      return {
        success: false,
        error: 'Invalid URL ID'
      };
    }

    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to delete URLs'
      };
    }

    // Find and verify ownership in a single query
    const url = await db.query.urls.findFirst({
      where: (urls, { eq, and }) =>
        and(eq(urls.id, urlId), eq(urls.userId, session.user.id)),
      columns: { id: true, shortCode: true } // Only select needed columns
    });

    if (!url) {
      return {
        success: false,
        error: "URL not found or you don't have permission to delete it"
      };
    }

    // Delete the URL
    await db.delete(urls).where(eq(urls.id, urlId));

    revalidatePath('/dashboard');

    return {
      success: true,
      data: null
    };
  } catch (error) {
    console.error('Error deleting URL:', error);
    return {
      success: false,
      error: 'Failed to delete URL. Please try again.'
    };
  }
}
