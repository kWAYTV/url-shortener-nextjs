'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';

import { getSession } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { ensureHttps } from '@/lib/url-utils';
import { urls } from '@/schemas/db.schema';
import { urlSchema } from '@/schemas/url.schema';
import { type ApiResponse } from '@/types/api';

interface ShortenUrlResult {
  shortUrl: string;
  shortCode: string;
}

interface ShortenUrlParams {
  url: string;
  customCode?: string;
}

export async function shortenUrlAction(
  params: ShortenUrlParams
): Promise<ApiResponse<ShortenUrlResult>> {
  try {
    const session = await getSession();

    if (!session?.user?.id) {
      return {
        success: false,
        error: 'You must be logged in to shorten URLs'
      };
    }

    const validatedFields = urlSchema.safeParse(params);

    if (!validatedFields.success) {
      return {
        success: false,
        error: validatedFields.error.errors.map(err => err.message).join(', ')
      };
    }

    const { url, customCode } = validatedFields.data;
    const originalUrl = ensureHttps(url);

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

    // Use custom code if provided, otherwise generate a random one
    let shortCode = customCode || nanoid(6);
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const existingUrl = await db.query.urls.findFirst({
        where: (urls, { eq }) => eq(urls.shortCode, shortCode),
        columns: { id: true } // Only select id for performance
      });

      if (!existingUrl) break;

      // If custom code is already taken, return error
      if (customCode) {
        return {
          success: false,
          error: 'This custom code is already in use'
        };
      }

      // Generate new random code
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
