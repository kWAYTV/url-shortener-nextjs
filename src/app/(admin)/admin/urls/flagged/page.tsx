import { AlertTriangle, ArrowLeft, ShieldAlert } from 'lucide-react';
import { type Metadata } from 'next';
import Link from 'next/link';

import { ContentLayout } from '@/components/core/admin/content-layout';
import { UrlsTable } from '@/components/core/admin/urls/urls-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getAllUrls } from '@/server/actions/admin/urls/get-all-urls.action';

export const metadata: Metadata = {
  title: 'Flagged URLs | Admin | ShortLink',
  description: 'Review potentially unsafe URLs in the ShortLink application'
};

export default async function FlaggedURLsPage({
  searchParams
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  const params = await searchParams;

  const page = params.page ? parseInt(params.page) : 1;
  const search = params.search || '';
  const sortBy = (params.sortBy || 'createdAt') as
    | 'originalUrl'
    | 'shortCode'
    | 'createdAt'
    | 'clicks'
    | 'userName';
  const sortOrder = (params.sortOrder || 'desc') as 'asc' | 'desc';

  const response = await getAllUrls({
    page,
    limit: 10,
    search,
    sortBy,
    sortOrder
  });

  const urls =
    response.success && response.data
      ? response.data.urls.filter(url => url.flagged)
      : [];

  const total = urls.length;

  const categorizedUrls = urls.reduce(
    (acc, url) => {
      const reason = url.flagReason || 'unknown';
      const category = reason.toLowerCase().includes('inappropriate')
        ? 'inappropriate'
        : reason.toLowerCase().includes('security') ||
            reason.toLowerCase().includes('malware') ||
            reason.toLowerCase().includes('phishing') ||
            reason.toLowerCase().includes('suspicious')
          ? 'security'
          : 'other';

      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(url);
      return acc;
    },
    {} as Record<string, typeof urls>
  );

  return (
    <ContentLayout title='Flagged URLs'>
      <div className='mb-6 flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-sm text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'>
            <AlertTriangle className='size-4' />
            <span className='font-medium'>{total} URLs</span> Requires Review
          </div>
        </div>
        <Link href={'/admin/urls'} passHref>
          <Button variant={'outline'} size={'sm'} className='gap-2'>
            <ArrowLeft className='size-4' />
            Back to All URLs
          </Button>
        </Link>
      </div>

      {total === 0 ? (
        <div>
          <Card className='border-green-200 shadow-sm dark:border-green-800'>
            <CardContent className='flex flex-col items-center justify-center pt-6 pb-8'>
              <div className='mb-4 flex size-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30'>
                <AlertTriangle className='size-8 text-green-500 dark:text-green-400' />
              </div>
              <h3 className='mb-2 text-xl font-medium'>No Flagged URLs</h3>
              <p className='text-muted-foreground max-w-md text-center'>
                All flagged URLs have been reviewed and are safe to use.
              </p>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className='grid gap-8'>
          <Card className='border-yellow-200 shadow-sm dark:border-yellow-800'>
            <CardHeader className='border-b border-yellow-100 bg-yellow-50/50 px-3 py-1 dark:border-yellow-900/50 dark:bg-yellow-900/20'>
              <div className='flex items-center gap-2'>
                <AlertTriangle className='size-5 text-yellow-600 dark:text-yellow-400' />
                <CardTitle className='text-yellow-800 dark:text-yellow-300'>
                  Flagged URLs
                </CardTitle>
              </div>
              <CardDescription>
                These URLs have been automatically flagged by our AI system as
                potentially unsafe or inappropriate. Please review each URL
                carefully before taking action.
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-6'>
              {categorizedUrls.security &&
                categorizedUrls.security.length > 0 && (
                  <div className='mb-8'>
                    <div className='mb-4 flex items-center gap-2'>
                      <ShieldAlert className='size-5 text-red-500 dark:text-red-400' />
                      <h3 className='text-lg font-medium text-red-700 dark:text-red-400'>
                        Security Concerns
                      </h3>
                    </div>
                    <Card className='mb-6 border-red-200 bg-red-50/30 shadow-sm dark:border-red-900/50 dark:bg-red-900/10'>
                      <CardContent className='pt-4'>
                        <p className='mb-2 text-sm text-red-700 dark:text-red-400'>
                          These URLs have been flagged due to security concerns.
                          Please review each URL carefully before taking action.
                        </p>
                      </CardContent>
                    </Card>
                    <UrlsTable
                      urls={categorizedUrls.security}
                      total={categorizedUrls.security.length}
                      currentPage={page}
                      currentSearch={search}
                      currentSortBy={sortBy}
                      currentSortOrder={sortOrder}
                      highlightStyle='security'
                    />
                  </div>
                )}

              {categorizedUrls.inappropriate &&
                categorizedUrls.inappropriate.length > 0 && (
                  <div className='mb-8'>
                    <div className='mb-4 flex items-center gap-2'>
                      <ShieldAlert className='size-5 text-red-500 dark:text-red-400' />
                      <h3 className='text-lg font-medium text-red-700 dark:text-red-400'>
                        Security Concerns
                      </h3>
                    </div>
                    <Card className='mb-6 border-red-200 bg-red-50/30 shadow-sm dark:border-red-900/50 dark:bg-red-900/10'>
                      <CardContent className='pt-4'>
                        <p className='mb-2 text-sm text-red-700 dark:text-red-400'>
                          These URLs have been flagged due to inappropriate
                          content. Please review each URL carefully before
                          taking action.
                        </p>
                      </CardContent>
                    </Card>
                    <UrlsTable
                      urls={categorizedUrls.inappropriate}
                      total={categorizedUrls.inappropriate.length}
                      currentPage={page}
                      currentSearch={search}
                      currentSortBy={sortBy}
                      currentSortOrder={sortOrder}
                      highlightStyle='inappropriate'
                    />
                  </div>
                )}

              {categorizedUrls.other && categorizedUrls.other.length > 0 && (
                <div className='mb-8'>
                  <div className='mb-4 flex items-center gap-2'>
                    <AlertTriangle className='size-5 text-yellow-500 dark:text-yellow-400' />
                    <h3 className='text-lg font-medium text-yellow-700 dark:text-yellow-400'>
                      Other Concerns
                    </h3>
                  </div>
                  <Card className='mb-6 border-yellow-200 bg-yellow-50/30 shadow-sm dark:border-yellow-900/50 dark:bg-yellow-900/10'>
                    <CardContent className='pt-4'>
                      <p className='mb-2 text-sm text-yellow-700 dark:text-yellow-400'>
                        These URLs have been flagged due to inappropriate
                        content. Please review each URL carefully before taking
                        action.
                      </p>
                    </CardContent>
                  </Card>
                  <UrlsTable
                    urls={categorizedUrls.other}
                    total={categorizedUrls.other.length}
                    currentPage={page}
                    currentSearch={search}
                    currentSortBy={sortBy}
                    currentSortOrder={sortOrder}
                    highlightStyle='other'
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </ContentLayout>
  );
}
