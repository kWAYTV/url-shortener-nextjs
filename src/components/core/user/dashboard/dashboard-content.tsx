import { AlertTriangle } from 'lucide-react';

import { UrlShortenerForm } from '@/components/core/urls/url-shortener-form';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { type Session } from '@/lib/auth';

interface DashboardContentProps {
  user: Session['user'];
}

export function DashboardContent({ user }: DashboardContentProps) {
  // Handle case where user data is missing
  if (!user) {
    return (
      <div className='container mx-auto min-h-screen px-6 pt-20 pb-8'>
        <div className='mx-auto max-w-2xl space-y-6'>
          <Card className='border-destructive/20'>
            <CardContent className='pt-6'>
              <div className='flex items-center space-x-4'>
                <div className='bg-destructive/10 flex h-16 w-16 items-center justify-center rounded-full'>
                  <AlertTriangle className='text-destructive h-8 w-8' />
                </div>
                <div>
                  <h1 className='text-destructive text-2xl font-bold'>
                    User data unavailable
                  </h1>
                  <p className='text-muted-foreground'>
                    Unable to load your profile information. Please try
                    refreshing the page.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto min-h-screen px-6 pt-20 pb-8'>
      <div className='mx-auto max-w-2xl space-y-6'>
        <Card>
          <CardContent>
            <div className='flex items-center space-x-4'>
              <Avatar className='h-16 w-16'>
                <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                <AvatarFallback className='text-lg'>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className='text-2xl font-bold'>
                  Welcome, {user?.name || 'User'}!
                </h1>
                <p className='text-muted-foreground'>
                  {user?.email || 'No email available'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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
      </div>
    </div>
  );
}
