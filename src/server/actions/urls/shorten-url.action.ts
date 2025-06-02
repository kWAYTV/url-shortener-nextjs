'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';

import { getSession } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { ensureHttps } from '@/lib/url-utils';
import { urls } from '@/schemas/db.schema';
import { shortenUrlSchema } from '@/schemas/url.schema';
import { type ApiResponse } from '@/types/api';

interface ShortenUrlResult {
  shortUrl: string;
  shortCode: string;
}

export async function shortenUrlAction(
  url: string
): Promise<ApiResponse<ShortenUrlResult>> {
  try {
    // Input validation
    if (!url || typeof url !== 'string') {
      return {
        success: false,
        error: 'URL is required'
      };
    }

    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to shorten URLs'
      };
    }

    const validatedFields = shortenUrlSchema.safeParse({ url: url.trim() });

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors.map(err => err.message).join(', ')
      };
    }

    const originalUrl = ensureHttps(validatedFields.data.url);

    // Check for existing URL for this user to prevent duplicates
    const existingUrlForUser = await db.query.urls.findFirst({
      where: (urls, { eq, and }) =>
        and(eq(urls.originalUrl, originalUrl), eq(urls.userId, session.user.id))
    });

    if (existingUrlForUser) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      return {
        success: true,
        data: {
          shortUrl: `${baseUrl}/r/${existingUrlForUser.shortCode}`,
          shortCode: existingUrlForUser.shortCode
        }
      };
    }

    // Generate unique short code with collision handling
    let shortCode = nanoid(6);
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const existingUrl = await db.query.urls.findFirst({
        where: (urls, { eq }) => eq(urls.shortCode, shortCode),
        columns: { id: true } // Only select id for performance
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

    const now = new Date();
    await db.insert(urls).values({
      originalUrl,
      shortCode,
      createdAt: now,
      updatedAt: now,
      userId: session.user.id,
      clicks: 0
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/r/${shortCode}`;

    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        shortUrl,
        shortCode
      }
    };
  } catch {
    return {
      success: false,
      error: 'Failed to shorten URL. Please try again.'
    };
  }
}
