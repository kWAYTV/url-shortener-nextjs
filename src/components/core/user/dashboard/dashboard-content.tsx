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
import { getUserUrls } from '@/server/actions/urls/get-user-urls.action';

interface DashboardContentProps {
  user: Session['user'];
}

export async function DashboardContent({ user }: DashboardContentProps) {
  if (!user) return null;

  const userUrlsResponse = await getUserUrls(user.id);
  const userUrls =
    userUrlsResponse.success && userUrlsResponse.data
      ? userUrlsResponse.data
      : [];

  return (
    <div className='container mx-auto min-h-screen px-6 pt-20 pb-8'>
      <div className='mx-auto max-w-6xl space-y-6'>
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle>Create New Url</CardTitle>
            <CardDescription>
              Create a new short url for your long url.
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
      </div>
    </div>
  );
}
