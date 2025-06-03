'use server';

import { nanoid } from 'nanoid';
import { revalidatePath } from 'next/cache';

import { getSession } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { ensureHttps } from '@/lib/url-utils';
import { urls } from '@/schemas/db.schema';
import { urlSchema } from '@/schemas/url.schema';
import { checkUrlSafety } from '@/server/actions/urls/check-url-safety.action';
import { type ApiResponse } from '@/types/api';

interface ShortenUrlParams {
  url: string;
  customCode?: string;
}

interface ShortenUrlResult {
  shortUrl: string;
  shortCode: string;
  flagged: boolean;
  flagReason: string | null;
  message?: string;
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

    const safetyCheck = await checkUrlSafety(originalUrl);
    let flagged = false;
    let flagReason = null;

    if (safetyCheck.success && safetyCheck.data) {
      flagged = safetyCheck.data.flagged;
      flagReason = safetyCheck.data.reason;

      if (
        safetyCheck.data.category === 'malicious' &&
        safetyCheck.data.confidence > 0.7 &&
        session?.user?.role !== 'admin'
      ) {
        return {
          success: false,
          error: 'This URL is flagged as malicious'
        };
      }
    }

    // Use custom code if provided, otherwise generate a random one
    const shortCode = customCode || nanoid(6);

    // check if short code is already in use
    const existingUrl = await db.query.urls.findFirst({
      where: (urls, { eq }) => eq(urls.shortCode, shortCode)
    });

    if (existingUrl) {
      if (customCode) {
        return {
          success: false,
          error: 'Custom code already in use'
        };
      }
      return shortenUrlAction({ url: originalUrl, customCode: shortCode });
    }

    const now = new Date();
    await db.insert(urls).values({
      originalUrl,
      shortCode,
      createdAt: now,
      updatedAt: now,
      userId: session.user.id,
      clicks: 0,
      flagged,
      flagReason
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const shortUrl = `${baseUrl}/r/${shortCode}`;

    revalidatePath('/dashboard');

    return {
      success: true,
      data: {
        shortUrl,
        shortCode,
        flagged,
        flagReason,
        message: flagged
          ? 'This URL has been flagged for review by our safety system. It may be temporarily limited until approved by an administrator.'
          : undefined
      }
    };
  } catch {
    return {
      success: false,
      error: 'Failed to shorten URL. Please try again.'
    };
  }
}
