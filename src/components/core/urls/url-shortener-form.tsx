'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { urlSchema, type UrlSchemaType } from '@/schemas/url';

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
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <FormField
              control={form.control}
              name='url'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit'>Shorten</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
