import { AlertTriangle, Home } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

export function UrlNotFound() {
  return (
    <div className='flex h-[calc(100vh-64px)] items-center justify-center px-4'>
      <div className='mx-auto w-full max-w-md text-center'>
        <div className='mb-6 flex justify-center'>
          <div className='bg-destructive/10 flex size-16 items-center justify-center rounded-full'>
            <AlertTriangle className='text-destructive size-8' />
          </div>
        </div>

        <h1 className='text-destructive mb-4 text-2xl font-bold'>
          URL Not Found
        </h1>

        <p className='text-muted-foreground mb-6'>
          The short link you&apos;re trying to access doesn&apos;t exist or has
          been removed.
        </p>

        <Button asChild>
          <Link href='/' className='flex items-center gap-2'>
            <Home className='size-4' />
            Return to Homepage
          </Link>
        </Button>
      </div>
    </div>
  );
}
