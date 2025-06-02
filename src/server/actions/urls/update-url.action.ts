'use server';
import { revalidatePath } from 'next/cache';

import { getSession } from '@/lib/auth-utils';
import { db, eq } from '@/lib/db';
import { urls } from '@/schemas/db.schema';
import { updateUrlSchema } from '@/schemas/url.schema';
import { type ApiResponse } from '@/types/api';

interface UpdateUrlParams {
  id: number;
  customCode: string;
}

interface UpdateUrlResult {
  shortUrl: string;
  shortCode: string;
}

export async function updateUrlAction(
  params: UpdateUrlParams
): Promise<ApiResponse<UpdateUrlResult>> {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to update URLs'
      };
    }

    const validatedFields = updateUrlSchema.safeParse(params);

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;
      const errorMessage =
        errors.id?.[0] || errors.customCode?.[0] || 'Invalid data';

      return {
        success: false,
        error: errorMessage
      };
    }

    const { id, customCode } = validatedFields.data;

    // Check if URL exists and belongs to user
    const existingUrl = await db.query.urls.findFirst({
      where: (urls, { eq, and }) =>
        and(eq(urls.id, id), eq(urls.userId, session.user.id))
    });

    if (!existingUrl) {
      return {
        success: false,
        error: "URL not found or you don't have permission to update it"
      };
    }

    // Check if custom code is already in use by another URL
    const codeExists = await db.query.urls.findFirst({
      where: (urls, { eq, and, ne }) =>
        and(eq(urls.shortCode, customCode), ne(urls.id, id)),
      columns: { id: true } // Only select id for performance
    });

    if (codeExists) {
      return {
        success: false,
        error: 'This custom code is already in use'
      };
    }

    // Update the URL
    await db
      .update(urls)
      .set({
        shortCode: customCode,
        updatedAt: new Date()
      })
      .where(eq(urls.id, id));

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/r/${customCode}`;

    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        shortUrl,
        shortCode: customCode
      }
    };
  } catch {
    return {
      success: false,
      error: 'Failed to update URL. Please try again.'
    };
  }
}
