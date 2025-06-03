'use client';

import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface ServerErrorProps {
  error: string;
}

export function ServerError({ error }: ServerErrorProps) {
  return (
    <div className='flex h-[calc(100vh-64px)] items-center justify-center px-4'>
      <div className='mx-auto w-full max-w-md text-center'>
        <div className='mb-6 flex justify-center'>
          <div className='bg-destructive/10 flex size-16 items-center justify-center rounded-full'>
            <AlertTriangle className='text-destructive size-8' />
          </div>
        </div>

        <h1 className='text-destructive mb-4 text-2xl font-bold'>
          Something went wrong
        </h1>

        <p className='text-muted-foreground mb-6'>
          {error ||
            'An unexpected error occurred while processing your request.'}
        </p>

        <div className='flex flex-col justify-center gap-3 sm:flex-row'>
          <Button asChild variant='outline'>
            <Link href='/' className='flex items-center gap-2'>
              <Home className='size-4' />
              Return to Homepage
            </Link>
          </Button>
          <Button onClick={() => window.location.reload()} variant='secondary'>
            <RotateCcw className='size-4' />
            Try Again
          </Button>
        </div>
      </div>
    </div>
  );
}
