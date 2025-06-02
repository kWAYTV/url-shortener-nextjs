import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function DashboardLoading() {
  return (
    <div className='container mx-auto min-h-screen px-6 pt-20 pb-8'>
      <div className='mx-auto max-w-2xl space-y-6'>
        {/* Welcome Section Skeleton */}
        <Card>
          <CardContent className='pt-6'>
            <div className='flex items-center space-x-4'>
              <Skeleton className='h-16 w-16 rounded-full' />
              <div className='space-y-2'>
                <Skeleton className='h-8 w-48' />
                <Skeleton className='h-4 w-32' />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info Skeleton */}
        <Card>
          <CardHeader>
            <CardTitle>
              <Skeleton className='h-6 w-40' />
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-12' />
                <Skeleton className='h-6 w-16' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-14' />
                <Skeleton className='h-6 w-16' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-20' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-4 w-20' />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder notice Skeleton */}
        <Card className='border-dashed'>
          <CardContent className='pt-6'>
            <div className='space-y-2 text-center'>
              <Skeleton className='mx-auto h-4 w-48' />
              <Skeleton className='mx-auto h-3 w-36' />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
