'use server';

import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { db, eq } from '@/lib/db';
import { urls } from '@/schemas/db.schema';
import { type ApiResponse } from '@/types/api';

export async function deleteUrlAction(
  urlId: number
): Promise<ApiResponse<null>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized'
      };
    }

    const [url] = await db.select().from(urls).where(eq(urls.id, urlId));

    if (!url) {
      return {
        success: false,
        error: 'URL not found'
      };
    }

    if (url.userId && url.userId !== session.user.id) {
      return {
        success: false,
        error: 'Unauthorized'
      };
    }

    await db.delete(urls).where(eq(urls.id, urlId));

    return {
      success: true,
      data: null
    };
  } catch (error) {
    console.error('Error deleting URL', error);
    return {
      success: false,
      error: 'An error occurred'
    };
  }
}
