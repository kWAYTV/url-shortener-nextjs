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

        <Card>
          <CardContent>
            <Skeleton className='h-10 w-full' />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
