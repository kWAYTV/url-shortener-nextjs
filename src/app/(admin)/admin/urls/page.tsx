import { type Metadata } from 'next';

import { ContentLayout } from '@/components/core/admin/content-layout';
import { UrlFilter } from '@/components/core/admin/urls/url-filter';
import { UrlSearch } from '@/components/core/admin/urls/url-search';
import { UrlsTable } from '@/components/core/admin/urls/urls-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getAllUrls } from '@/server/actions/admin/urls/get-all-urls.action';

export const metadata: Metadata = {
  title: 'URL Management | Admin | ShortLink',
  description: 'Manage URLs in the ShortLink application'
};

export default async function AdminUrlsPage({
  searchParams
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
    filter?: string;
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
  const filter = (params.filter || 'all') as
    | 'all'
    | 'flagged'
    | 'security'
    | 'inappropriate'
    | 'other';

  const getHighlightStyle = () => {
    switch (filter) {
      case 'security':
        return 'security';
      case 'inappropriate':
        return 'inappropriate';
      case 'other':
        return 'other';
      default:
        return 'none';
    }
  };

  const response = await getAllUrls({
    page,
    limit: 10,
    search,
    sortBy,
    sortOrder,
    filter
  });

  const urls = response.success && response.data ? response.data.urls : [];
  const total = response.success && response.data ? response.data.total : 0;

  return (
    <ContentLayout title='URL Management'>
      <div className='grid gap-6'>
        <Card className='shadow-sm'>
          <CardHeader className='pb-3'>
            <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
              <div>
                <CardTitle>URLs</CardTitle>
                <CardDescription>
                  View and manage all URLs in the system.
                </CardDescription>
              </div>
              <UrlSearch initialSearch={search} />
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <UrlFilter initialFilter={filter} />
              <UrlsTable
                urls={urls}
                total={total}
                currentPage={page}
                currentSearch={search}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
                highlightStyle={getHighlightStyle()}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
