import { ArrowLeft, RotateCcw } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface EmailSentProps {
  onSendAnother: () => void;
}

export default function EmailSent({ onSendAnother }: EmailSentProps) {
  return (
    <Card>
      <CardContent>
        <div className='grid gap-4'>
          <p className='text-muted-foreground text-center text-sm'>
            Click the link in your email to sign in. The link will expire in 15
            minutes.
          </p>

          <Separator />

          <div className='flex flex-col gap-2'>
            <Button
              variant='outline'
              onClick={onSendAnother}
              className='w-full'
            >
              <RotateCcw className='size-4' />
              Send Another Link
            </Button>
            <div className='text-center'>
              <Link
                href='/sign-in'
                className='flex items-center justify-center gap-1 text-sm underline'
              >
                <ArrowLeft className='size-4' />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
