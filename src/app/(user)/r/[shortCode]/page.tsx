import { type Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { FlaggedUrlWarning } from '@/components/core/urls/flagged-url-warning';
import { ServerError } from '@/components/core/urls/server-error';
import { UrlNotFound } from '@/components/core/urls/url-not-found';
import { getUrlByShortCodeAction } from '@/server/actions/urls/get-url-by-short-code.action';

// Types
interface PageProps {
  params: Promise<{ shortCode: string }>;
}

// Dynamic metadata generation
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  try {
    const { shortCode } = await props.params;
    const response = await getUrlByShortCodeAction(shortCode);

    if (response.success && response.data) {
      const hostname = new URL(response.data.originalUrl).hostname;
      return {
        title: `Redirecting to ${hostname}`,
        description: `You are being redirected to ${hostname}`,
        robots: 'noindex, nofollow'
      };
    }
  } catch {
    // Fallback metadata
  }

  return {
    title: 'Redirecting...',
    description: 'You are being redirected to the original URL',
    robots: 'noindex, nofollow'
  };
}

// Main page component
export default async function RedirectPage(props: PageProps) {
  try {
    const { shortCode } = await props.params;

    // Validate shortCode format
    if (!shortCode || shortCode.length === 0) {
      notFound();
    }

    const response = await getUrlByShortCodeAction(shortCode);

    // Handle different response states
    if (!response.success) {
      if (
        response.error === 'URL not found' ||
        response.error === 'Invalid short code provided'
      ) {
        return <UrlNotFound />;
      }
      return <ServerError error={response.error || 'Unknown error occurred'} />;
    }

    if (!response.data) {
      return <UrlNotFound />;
    }

    // Handle flagged URLs
    if (response.data.flagged) {
      return <FlaggedUrlWarning data={response.data} />;
    }

    // Redirect to the original URL
    redirect(response.data.originalUrl);
  } catch (error) {
    console.error('Unexpected error in RedirectPage:', error);
    return <ServerError error='An unexpected error occurred.' />;
  }
}
