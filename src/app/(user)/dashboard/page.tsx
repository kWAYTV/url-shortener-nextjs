import { getUser } from '@/lib/auth-utils';
import { redirect } from 'next/navigation';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default async function DasboardPage() {
  const user = await getUser();

  if (!user) return redirect('/sign-in');

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
                  Welcome back, {user?.name}!
                </h1>
                <p className='text-muted-foreground'>{user?.email}</p>
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
                <Badge variant='secondary' className='mt-1'>
                  {user?.role}
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
                  {user?.createdAt?.toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className='text-muted-foreground text-sm font-medium'>
                  Last Updated
                </p>
                <p className='text-sm'>
                  {user?.updatedAt?.toLocaleDateString()}
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
          </CardContent>
        </Card>

        {/* Placeholder notice */}
        <Card className='border-dashed'>
          <CardContent className='pt-6'>
            <div className='text-muted-foreground text-center'>
              <p className='text-sm'>This dashboard is a placeholder.</p>
              <p className='mt-1 text-xs'>More features coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
