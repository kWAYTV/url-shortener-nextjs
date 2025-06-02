'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { urlSchema, type UrlSchemaType } from '@/schemas/url';
import { Button } from '@/components/ui/button';

export function UrlShortenerForm() {
  const form = useForm<UrlSchemaType>({
    resolver: zodResolver(urlSchema),
    defaultValues: {
      url: ''
    }
  });

  const onSubmit = (data: UrlSchemaType) => {
    console.info(data);
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
                      disabled={false}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' disabled={false}>
              Shorten
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
