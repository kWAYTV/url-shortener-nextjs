/* eslint-disable @typescript-eslint/no-unused-vars */
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
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { urlSchema, type UrlSchemaType } from '@/schemas/url';
import { shortenUrl } from '@/server/actions/urls/shorten-url';

export function UrlShortenerForm() {
  const router = useRouter();
  const pathname = usePathname();

  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, copy] = useCopyToClipboard();

  const form = useForm<UrlSchemaType>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: ''
    }
  });

  const handleCopy = async (text: string) => {
    const success = await copy(text);
    if (success) {
      toast.success('Copied to clipboard');
    }
  };

  const onSubmit = async (data: UrlSchemaType) => {
    setIsLoading(true);
    setError(null);
    setShortUrl(null);
    setShortCode(null);

    try {
      const response = await shortenUrl(data.url);

      if (response.success && response.data) {
        setShortUrl(response.data.shortUrl);
        setShortCode(response.data.shortCode);
      } else {
        setError(response.error || 'Failed to shorten URL');
      }
    } catch (error) {
      console.error('Failed to shorten URL:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='mx-auto w-full max-w-2xl'>
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
              {isLoading ? 'Shortening...' : 'Shorten'}
            </Button>
          </div>

          {error && (
            <div className='bg-destructive/10 text-destructive rounded-md p-3 text-sm'>
              {error}
            </div>
          )}

          {shortUrl && (
            <Card>
              <CardContent className='p-4'>
                <p className='text-muted-foreground mb-2 text-sm font-medium'>
                  Your shortened URL:
                </p>
                <div className='flex items-center gap-2'>
                  <Input
                    type='text'
                    value={shortUrl}
                    readOnly
                    className='font-medium'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    className='flex-shrink-0'
                    onClick={() => handleCopy(shortUrl)}
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
    </div>
  );
}
