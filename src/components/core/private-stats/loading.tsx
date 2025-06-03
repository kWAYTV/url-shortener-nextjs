import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PrivateStatsLoading() {
  return (
    <div className='container mx-auto max-w-6xl px-4 py-8'>
      {/* Stats Header Skeleton */}
      <div className='mb-8 text-center'>
        <Skeleton className='mx-auto h-9 w-64' />
      </div>

      {/* Stats Grid Skeleton */}
      <div className='mb-8 grid gap-8 md:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className='shadow-sm'>
            <CardHeader className='pb-2'>
              <Skeleton className='h-5 w-20' />
              <Skeleton className='h-4 w-32' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-9 w-12' />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section Skeleton */}
      <Card className='mb-8 shadow-sm'>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-4 w-64' />
        </CardHeader>
        <CardContent>
          {/* Tabs Skeleton */}
          <div className='mb-4'>
            <div className='bg-muted flex w-fit space-x-1 rounded-md p-1'>
              <Skeleton className='h-8 w-20' />
              <Skeleton className='h-8 w-20' />
              <Skeleton className='h-8 w-20' />
              <Skeleton className='h-8 w-20' />
            </div>
          </div>
          {/* Chart Area Skeleton */}
          <Skeleton className='h-[400px] w-full rounded-md' />
        </CardContent>
      </Card>

      {/* Top URLs List Skeleton */}
      <Card className='shadow-sm'>
        <CardHeader>
          <Skeleton className='h-6 w-48' />
          <Skeleton className='h-4 w-40' />
        </CardHeader>
        <CardContent>
          <div className='space-y-4'>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className='flex items-center justify-between rounded-lg border p-3'
              >
                <div className='flex items-center space-x-3'>
                  <Skeleton className='h-8 w-8 rounded-full' />
                  <div>
                    <Skeleton className='mb-1 h-4 w-20' />
                    <Skeleton className='h-3 w-48' />
                  </div>
                </div>
                <div className='text-right'>
                  <Skeleton className='mb-1 h-6 w-8' />
                  <Skeleton className='h-3 w-10' />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
