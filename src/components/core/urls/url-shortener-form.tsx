'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Copy } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

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
import { env } from '@/env';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { useSession } from '@/lib/auth-client';
import { urlSchema, type UrlSchemaType } from '@/schemas/url.schema';
import { shortenUrlAction } from '@/server/actions/urls/shorten-url.action';

interface ShortenedUrlResult {
  shortUrl: string;
  shortCode: string;
  customCode?: string;
}

export function UrlShortenerForm() {
  const { data: session } = useSession();

  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();

  const [result, setResult] = useState<ShortenedUrlResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

  const onSubmit = async (data: UrlSchemaType) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await shortenUrlAction(data.url);

      if (response.success && response.data) {
        setResult({
          shortUrl: response.data.shortUrl,
          shortCode: response.data.shortCode,
          customCode: data.customCode || undefined
        });
      } else {
        setError(response.error || 'Failed to shorten URL');
      }

      if (user && pathname.includes('/dashboard')) {
        router.refresh();
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
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
              'Shorten'
            )}
          </Button>
        </div>

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
              </div>
            </CardContent>
          </Card>
        )}
      </form>
    </Form>
  );
}
