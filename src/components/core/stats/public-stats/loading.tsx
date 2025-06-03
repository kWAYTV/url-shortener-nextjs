import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function PublicStatsLoading() {
  return (
    <div className='container mx-auto max-w-4xl px-4 py-10'>
      {/* Header Skeleton */}
      <div className='mb-8 text-center'>
        <Skeleton className='mx-auto mb-2 h-9 w-64' />
        <Skeleton className='mx-auto h-4 w-80' />
      </div>

      {/* Stats Cards Skeleton */}
      <div className='mb-8 grid gap-8 md:grid-cols-2'>
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className='shadow-sm'>
            <CardHeader className='pb-2'>
              <Skeleton className='h-5 w-40' />
              <Skeleton className='h-4 w-48' />
            </CardHeader>
            <CardContent>
              <Skeleton className='h-10 w-16' />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Auth Promotion Card Skeleton */}
      <div className='text-center'>
        <Card className='mb-8 shadow-sm'>
          <CardHeader>
            <Skeleton className='mx-auto h-6 w-72' />
            <Skeleton className='mx-auto h-4 w-96' />
          </CardHeader>
          <CardContent className='flex justify-center gap-4'>
            <Skeleton className='h-10 w-20' />
            <Skeleton className='h-10 w-20' />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
