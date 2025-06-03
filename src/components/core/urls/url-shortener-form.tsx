'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Copy, Link, QrCode } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { QRCodeModal } from '@/components/core/modals/qr-code-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { env } from '@/env';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useSession } from '@/lib/auth-client';
import { urlSchema, type UrlSchemaType } from '@/schemas/url.schema';
import { shortenUrlAction } from '@/server/actions/urls/shorten-url.action';

import { SignupSuggestionDialog } from '../dialogs/sign-up-suggestion-dialog';

interface ShortenedUrlResult {
  shortUrl: string;
  shortCode: string;
  customCode?: string;
}

export function UrlShortenerForm() {
  const { data: session, isPending } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();

  const [result, setResult] = useState<ShortenedUrlResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSignupDialog, setShowSignupDialog] = useState(false);
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [flaggedInfo, setFlaggedInfo] = useState<{
    flagged: boolean;
    reason: string | null;
    message: string | undefined;
  } | null>(null);

  const [, copy] = useCopyToClipboard();

  const form = useForm<UrlSchemaType>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: '',
      customCode: ''
    }
  });

  const handleCopy = async (text: string) => {
    const success = await copy(text);
    if (success) {
      toast.success('Copied to clipboard');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const showQrCode = () => {
    if (!result?.shortUrl || !result?.shortCode) return;
    setIsQrCodeModalOpen(true);
  };

  const onSubmit = async (data: UrlSchemaType) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setFlaggedInfo(null);

    try {
      const response = await shortenUrlAction({
        url: data.url,
        customCode: data.customCode || undefined
      });

      if (response.success && response.data) {
        setResult({
          shortUrl: response.data.shortUrl,
          shortCode: response.data.shortCode,
          customCode: data.customCode || undefined
        });

        if (response.data.flagged) {
          setFlaggedInfo({
            flagged: response.data.flagged,
            reason: response.data.flagReason,
            message: response.data.message
          });
          toast.warning(response.data.message || 'This URL is flagged', {
            description: response.data.flagReason
          });
        } else {
          toast.success('URL shortened successfully');
        }
      } else {
        setError(response.error || 'Failed to shorten URL');
      }

      if (user && pathname.includes('/dashboard')) {
        router.refresh();
      }

      if (!session?.user) {
        setShowSignupDialog(true);
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <div className='flex flex-col gap-2 sm:flex-row'>
              <FormField
                control={form.control}
                name='url'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormControl>
                      <Input
                        placeholder='Paste your url here'
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type='submit' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className='mr-2 size-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                    Shortening...
                  </>
                ) : (
                  <>
                    <Link className='size-4' />
                    Shorten
                  </>
                )}
              </Button>
            </div>

            {!isMounted || isPending ? (
              <div className='flex items-center'>
                <Skeleton className='mr-2 h-4 w-24' />
                <Skeleton className='h-9 flex-1' />
              </div>
            ) : (
              session?.user && (
                <FormField
                  control={form.control}
                  name='customCode'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className='flex items-center'>
                          <span className='text-muted-foreground mr-2 text-sm'>
                            {env.NEXT_PUBLIC_APP_URL || window.location.origin}
                            /r/
                          </span>
                          <Input
                            placeholder='Custom code (optional)'
                            {...field}
                            value={field.value || ''}
                            onChange={e => field.onChange(e.target.value || '')}
                            disabled={isLoading}
                            className='flex-1'
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )
            )}

            {error && (
              <div className='bg-destructive/10 text-destructive rounded-md p-3 text-sm'>
                {error}
              </div>
            )}

            {result && (
              <Card>
                <CardContent className='p-4'>
                  <p className='text-muted-foreground mb-2 text-sm font-medium'>
                    Your shortened URL:
                  </p>
                  <div className='flex items-center gap-2'>
                    <Input
                      type='text'
                      value={result.shortUrl}
                      readOnly
                      className='font-medium'
                    />

                    <Button
                      type='button'
                      variant='outline'
                      className='flex-shrink-0'
                      onClick={() => handleCopy(result.shortUrl)}
                    >
                      <Copy className='mr-1 size-4' />
                      Copy
                    </Button>

                    <Button
                      type='button'
                      variant='outline'
                      className='flex-shrink-0'
                      onClick={showQrCode}
                    >
                      <QrCode className='size-4' />
                    </Button>
                  </div>

                  {flaggedInfo && flaggedInfo.flagged && (
                    <div className='mt-3 rounded-md border border-yellow-200 bg-yellow-50 p-3 dark:border-yellow-800 dark:bg-yellow-900/20'>
                      <div className='flex items-start gap-2'>
                        <AlertTriangle className='mt-0.5 size-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400' />
                        <div>
                          <p className='text-sm font-medium text-yellow-800 dark:text-yellow-300'>
                            This URL has been flagged for review
                          </p>
                          <p className='mt-1 text-xs text-yellow-700 dark:text-yellow-400'>
                            {flaggedInfo.message ||
                              'This URL will be reviewed by an administrator before it becomes fully active.'}
                          </p>
                          {flaggedInfo.reason && (
                            <p className='mt-2 text-sm text-yellow-600 dark:text-yellow-400'>
                              <span className='font-medium'>Reason:</span>{' '}
                              {flaggedInfo.reason || 'Unknown reason'}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </form>
        </Form>

        <SignupSuggestionDialog
          isOpen={showSignupDialog}
          onOpenChange={setShowSignupDialog}
          shortUrl={result?.shortUrl || ''}
        />

        {result?.shortUrl && result?.shortCode && (
          <QRCodeModal
            isOpen={isQrCodeModalOpen}
            url={result.shortUrl}
            shortCode={result.shortCode}
            onClose={() => setIsQrCodeModalOpen(false)}
          />
        )}
      </div>
    </>
  );
}
