'use server';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { auth } from '@/lib/auth';
import { db, eq } from '@/lib/db';
import { urls } from '@/schemas/db.schema';
import { updateUrlSchema } from '@/schemas/url.schema';
import { type ApiResponse } from '@/types/api';

export async function updateUrlAction(
  formData: FormData
): Promise<ApiResponse<{ shortUrl: string }>> {
  try {
    const session = await auth.api.getSession({
      headers: await headers()
    });

    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        error: 'You must be logged in to update a URL'
      };
    }

    const validatedFields = updateUrlSchema.safeParse({
      id: formData.get('id'),
      customCode: formData.get('customCode')
    });

    if (!validatedFields.success) {
      return {
        success: false,
        error:
          validatedFields.error.flatten().fieldErrors.id?.[0] ||
          validatedFields.error.flatten().fieldErrors.customCode?.[0] ||
          'Invalid URL ID'
      };
    }

    const { id, customCode } = validatedFields.data;

    const existingUrl = await db.query.urls.findFirst({
      where: (urls, { eq, and }) =>
        and(eq(urls.id, id), eq(urls.userId, userId))
    });

    if (!existingUrl) {
      return {
        success: false,
        error: "URL not found or you don't have permission to update it"
      };
    }

    const codeExists = await db.query.urls.findFirst({
      where: (urls, { eq, and, ne }) =>
        and(eq(urls.shortCode, customCode), ne(urls.id, id))
    });

    if (codeExists) {
      return {
        success: false,
        error: 'Custom code already exists'
      };
    }

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
      data: { shortUrl }
    };
  } catch (error) {
    console.error('Failed to update URL', error);
    return {
      success: false,
      error: 'An error occurred'
    };
  }
}
