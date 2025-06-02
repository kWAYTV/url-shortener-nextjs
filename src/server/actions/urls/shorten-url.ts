'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { ensureHttps } from '@/lib/utils';
import { urls } from '@/schemas/db';
import { shortenUrlSchema } from '@/schemas/url';
import { type ApiResponse } from '@/types/api';

export async function shortenUrl(url: string): Promise<
  ApiResponse<{
    shortUrl: string;
    shortCode: string;
  }>
> {
  try {
    const validatedFields = shortenUrlSchema.safeParse({ url });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors.map(err => err.message).join(', ')
      };
    }

    const originalUrl = ensureHttps(validatedFields.data.url);
    let shortCode = nanoid(6);

    let attempts = 0;
    const maxAttempts = 10;

    // Handle collisions with a retry limit
    while (attempts < maxAttempts) {
      const existingUrl = await db.query.urls.findFirst({
        where: (urls, { eq }) => eq(urls.shortCode, shortCode)
      });

      if (!existingUrl) break;

      shortCode = nanoid(6);
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return {
        success: false,
        error: 'Unable to generate unique short code. Please try again.'
      };
    }

    await db.insert(urls).values({
      originalUrl,
      shortCode,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/r/${shortCode}`;

    revalidatePath('/');

    return {
      success: true,
      data: {
        shortUrl,
        shortCode
      }
    };
  } catch (error) {
    console.error('Failed to shorten URL:', error);

    return {
      success: false,
      error: 'Internal server error. Please try again.'
    };
  }
}
