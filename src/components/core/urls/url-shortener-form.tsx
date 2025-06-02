'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { urlSchema, type UrlSchemaType } from '@/schemas/url';
import { shortenUrl } from '@/server/actions/urls/shorten-url';

export function UrlShortenerForm() {
  const router = useRouter();
  const pathname = usePathname();

  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [shortCode, setShortCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<UrlSchemaType>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: ''
    }
  });

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
        </form>
      </Form>
    </div>
  );
}
