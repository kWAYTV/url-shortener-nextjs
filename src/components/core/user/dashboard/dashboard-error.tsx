import { AlertCircle, Home, LogIn } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardErrorProps {
  error: {
    message?: string;
  };
}

export function DashboardError({ error }: DashboardErrorProps) {
  return (
    <div className='container mx-auto flex min-h-screen flex-col items-center justify-center px-6'>
      <div className='w-full max-w-6xl space-y-6'>
        <Card>
          <CardContent className='space-y-6 p-8 text-center'>
            {/* Error Icon */}
            <div className='bg-muted mx-auto flex size-16 items-center justify-center rounded-full'>
              <AlertCircle className='size-8 text-red-600' />
            </div>

            {/* Heading */}
            <div className='space-y-2'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Something went wrong
              </h1>
              <p className='text-muted-foreground'>
                {error.message ||
                  'An unexpected error occurred while loading your dashboard.'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Button asChild className='flex-1'>
                <Link href='/sign-in' className='flex items-center gap-2'>
                  <LogIn className='size-4' />
                  Sign In Again
                </Link>
              </Button>
              <Button asChild variant='outline' className='flex-1'>
                <Link href='/' className='flex items-center gap-2'>
                  <Home className='size-4' />
                  Back to Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className='text-muted-foreground text-center text-sm'>
          <p>
            Need help?{' '}
            <Link href='/support' className='text-primary hover:underline'>
              Contact support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
