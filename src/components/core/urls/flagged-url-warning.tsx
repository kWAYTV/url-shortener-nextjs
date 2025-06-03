import { AlertTriangle, ExternalLink, Home } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';

interface RedirectData {
  originalUrl: string;
  flagged?: boolean;
  flagReason?: string | null;
}

interface FlaggedUrlWarningProps {
  data: RedirectData;
}

export function FlaggedUrlWarning({ data }: FlaggedUrlWarningProps) {
  return (
    <div className='flex h-[calc(100vh-64px)] items-center justify-center px-4'>
      <div className='mx-auto w-full max-w-md text-center'>
        <div className='mb-6 flex justify-center'>
          <div className='flex size-16 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/30'>
            <AlertTriangle className='size-8 text-yellow-600 dark:text-yellow-400' />
          </div>
        </div>

        <h1 className='mb-4 text-2xl font-bold text-yellow-600 dark:text-yellow-400'>
          Caution: Flagged URL
        </h1>

        <p className='text-muted-foreground mb-2'>
          This link has been flagged by our safety system and is pending review
          by an administrator.
        </p>

        {data.flagReason && (
          <div className='mb-6 rounded-md bg-yellow-50 p-3 text-sm text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400'>
            <strong>Reason:</strong> {data.flagReason}
          </div>
        )}

        <div className='mt-6 flex flex-col justify-center gap-3 sm:flex-row'>
          <Button asChild variant='outline'>
            <Link href='/' className='flex items-center gap-2'>
              <Home className='size-4' />
              Return to Homepage
            </Link>
          </Button>
          <Button asChild variant='destructive'>
            <a
              href={data.originalUrl}
              target='_blank'
              rel='noopener noreferrer'
              className='flex items-center gap-2'
            >
              Proceed Anyway
              <ExternalLink className='size-4' />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
