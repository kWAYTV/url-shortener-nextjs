'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

import EmailVerifiedFormContent from '@/components/core/auth/email-verified/email-verified-content';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

function EmailVerifiedPageContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return <EmailVerifiedFormContent error={error} />;
}

export default function EmailVerifiedPage() {
  return (
    <div className='container mx-auto flex min-h-screen flex-col items-center justify-center px-6'>
      <div className='w-full max-w-md space-y-6'>
        <Suspense
          fallback={
            <Card>
              <CardContent className='space-y-6 p-8 text-center'>
                {/* Loading Icon */}
                <div className='bg-muted mx-auto flex size-16 items-center justify-center rounded-full'>
                  <Skeleton className='size-8 rounded-full' />
                </div>

                {/* Loading Heading */}
                <div className='space-y-2'>
                  <Skeleton className='mx-auto h-8 w-48' />
                  <Skeleton className='mx-auto h-4 w-64' />
                </div>

                <Skeleton className='h-px w-full' />

                {/* Loading Info Box */}
                <div className='bg-muted rounded-lg p-4'>
                  <div className='flex items-start gap-3'>
                    <Skeleton className='mt-0.5 size-4 flex-shrink-0' />
                    <div className='flex-1 space-y-2'>
                      <Skeleton className='h-4 w-20' />
                      <Skeleton className='h-3 w-full' />
                      <Skeleton className='h-3 w-3/4' />
                    </div>
                  </div>
                </div>

                <Skeleton className='h-px w-full' />

                {/* Loading Buttons */}
                <div className='flex flex-col gap-3 sm:flex-row'>
                  <Skeleton className='h-10 flex-1' />
                  <Skeleton className='h-10 flex-1' />
                </div>
              </CardContent>
            </Card>
          }
        >
          <EmailVerifiedPageContent />
        </Suspense>
      </div>
    </div>
  );
}
