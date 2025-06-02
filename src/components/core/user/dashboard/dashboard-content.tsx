import { AlertTriangle } from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        {/* Welcome Section */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center space-x-4'>
              <Avatar className='h-16 w-16'>
                <AvatarImage src={user?.image || ''} alt={user?.name || ''} />
                <AvatarFallback className='text-lg'>
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className='text-2xl font-bold'>
                  Welcome back, {user?.name || 'User'}!
                </h1>
                <p className='text-muted-foreground'>
                  {user?.email || 'No email available'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  Role
                </p>
                <Badge
                  variant={user?.role === 'admin' ? 'destructive' : 'secondary'}
                  className='mt-1'
                >
                  {user?.role || 'Unknown'}
                </Badge>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  Status
                </p>
                <Badge
                  variant={user?.banned ? 'destructive' : 'default'}
                  className='mt-1'
                >
                  {user?.banned ? 'Banned' : 'Active'}
                </Badge>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  Member Since
                </p>
                <p className='text-sm'>
                  {user?.createdAt
                    ? user.createdAt.toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  Last Updated
                </p>
                <p className='text-sm'>
                  {user?.updatedAt
                    ? user.updatedAt.toLocaleDateString()
                    : 'Unknown'}
                </p>
              </div>
            </div>

            {user?.banned && user?.banReason && (
              <div className='border-destructive/20 bg-destructive/10 rounded-lg border p-4'>
                <p className='text-destructive text-sm font-medium'>
                  Ban Reason
                </p>
                <p className='text-destructive/80 text-sm'>{user.banReason}</p>
                {user?.banExpires && (
                  <p className='text-destructive/60 mt-1 text-xs'>
                    Expires: {user.banExpires.toLocaleString()}
                  </p>
                )}
              </div>
            )}

            {user?.banned && !user?.banReason && (
              <div className='border-destructive/20 bg-destructive/10 rounded-lg border p-4'>
                <p className='text-destructive text-sm font-medium'>
                  Account Banned
                </p>
                <p className='text-destructive/80 text-sm'>
                  Your account has been suspended. Please contact support for
                  more information.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
