import Link from 'next/link';

import { UrlShortenerForm } from '@/components/core/urls/url-shortener-form';
import UserUrlsTable from '@/components/core/urls/user-urls-table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { type Session } from '@/lib/auth';
import { getUserUrlsAction } from '@/server/actions/urls/get-user-urls.action';

interface DashboardContentProps {
  user: Session['user'];
}

export async function DashboardContent({ user }: DashboardContentProps) {
  if (!user?.id) {
    return null;
  }

  const userUrlsResponse = await getUserUrlsAction(user.id);
  const userUrls = userUrlsResponse.success ? userUrlsResponse.data || [] : [];

  return (
    <div className='container mx-auto px-6 pt-20 pb-8'>
      <div className='mx-auto max-w-6xl space-y-6'>
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle>Create New URL</CardTitle>
            <CardDescription>
              Create a new short URL for your long URL.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UrlShortenerForm />
          </CardContent>
        </Card>

        <Card className='border border-dashed shadow-sm'>
          <CardHeader>
            <CardTitle>Your URLs</CardTitle>
            <CardDescription>
              Manage and track your shortened URLs.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserUrlsTable urls={userUrls} />
          </CardContent>
        </Card>

        {user.role === 'admin' && (
          <div className='mt-4 text-center'>
            <Link
              href='/admin'
              className='text-muted-foreground hover:text-primary text-sm underline'
            >
              Admin
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
