import { ArrowRight, CheckCircle, Mail, XCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export default function EmailVerifiedContent({
  error
}: {
  error: string | null;
}) {
  // Handle invalid token error
  if (error === 'invalid_token') {
    return (
      <>
        <Card>
          <CardContent className='space-y-6 p-8 text-center'>
            {/* Error Icon */}
            <div className='bg-muted mx-auto flex size-16 items-center justify-center rounded-full'>
              <XCircle className='size-8 text-red-600' />
            </div>

            {/* Heading */}
            <div className='space-y-2'>
              <h1 className='text-2xl font-semibold tracking-tight'>
                Invalid Verification Link
              </h1>
              <p className='text-muted-foreground'>
                This email verification link is invalid or has expired.
              </p>
            </div>

            <Separator />

            {/* Additional Info */}
            <div className='bg-muted rounded-lg p-4 text-sm'>
              <div className='flex items-start gap-3'>
                <Mail className='text-primary mt-0.5 size-4 flex-shrink-0' />
                <div className='text-left'>
                  <p className='font-medium'>What should I do?</p>
                  <p className='text-muted-foreground mt-1'>
                    Please check your email for a new verification link or
                    request a new one from your account settings.
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Action Buttons */}
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Button asChild className='flex-1'>
                <Link href='/sign-in'>
                  Sign In
                  <ArrowRight className='ml-2 size-4' />
                </Link>
              </Button>
              <Button asChild variant='outline' className='flex-1'>
                <Link href='/'>Back to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Additional Help */}
        <div className='text-muted-foreground text-center text-sm'>
          <p>
            Still having trouble?{' '}
            <Link href='/support' className='text-primary hover:underline'>
              Contact support
            </Link>
          </p>
        </div>
      </>
    );
  }

  // Success state - email verified
  return (
    <>
      <Card>
        <CardContent className='space-y-6 p-8 text-center'>
          {/* Success Icon */}
          <div className='bg-muted mx-auto flex size-16 items-center justify-center rounded-full'>
            <CheckCircle className='size-8 text-green-600' />
          </div>

          {/* Heading */}
          <div className='space-y-2'>
            <h1 className='text-2xl font-semibold tracking-tight'>
              Email Verified!
            </h1>
            <p className='text-muted-foreground'>
              Your email has been successfully verified. You can now access all
              features.
            </p>
          </div>

          <Separator />

          {/* Additional Info */}
          <div className='bg-muted rounded-lg p-4 text-sm'>
            <div className='flex items-start gap-3'>
              <Mail className='text-primary mt-0.5 size-4 flex-shrink-0' />
              <div className='text-left'>
                <p className='font-medium'>What&apos;s next?</p>
                <p className='text-muted-foreground mt-1'>
                  Start shortening URLs and track your analytics from the
                  dashboard.
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className='flex flex-col gap-3 sm:flex-row'>
            <Button asChild className='flex-1'>
              <Link href='/dashboard'>
                Go to Dashboard
                <ArrowRight className='ml-2 size-4' />
              </Link>
            </Button>
            <Button asChild variant='outline' className='flex-1'>
              <Link href='/'>Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Additional Help */}
      <div className='text-muted-foreground text-center text-sm'>
        <p>
          Having trouble?{' '}
          <Link href='/support' className='text-primary hover:underline'>
            Contact support
          </Link>
        </p>
      </div>
    </>
  );
}
