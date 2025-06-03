'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, LinkIcon, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import EmailSent from '@/components/core/auth/magic-link/magic-link-email-sent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signIn } from '@/lib/auth-client';
import {
  type SignInWithMagicLinkSchema,
  signInWithMagicLinkSchema
} from '@/schemas/auth.schema';

export default function MagicLinkForm() {
  const [isPending, setIsPending] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const form = useForm<SignInWithMagicLinkSchema>({
    resolver: zodResolver(signInWithMagicLinkSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: SignInWithMagicLinkSchema) => {
    await signIn.magicLink({
      email: data.email,
      name: data.email.split('@')[0],
      callbackURL: '/dashboard',
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
          toast('Sending magic link...');
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: ctx => {
          toast.error(ctx.error.message);
          setIsPending(false);
        },
        onSuccess: () => {
          toast.success('Magic link sent! Check your email.');
          setEmailSent(true);
        }
      }
    });
  };

  const handleSendAnother = () => {
    setEmailSent(false);
    form.reset();
  };

  if (emailSent) {
    return <EmailSent onSendAnother={handleSendAnother} />;
  }

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <div className='grid gap-2'>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <FormControl>
                      <Input
                        id='email'
                        type='email'
                        placeholder='email@example.com'
                        autoComplete='email'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <>
                  <LinkIcon size={16} className='mr-2' />
                  Send Magic Link
                </>
              )}
            </Button>

            <Separator />

            <div className='text-center'>
              <Link
                href='/sign-in'
                className='flex items-center justify-center gap-1 text-sm underline'
              >
                <ArrowLeft className='size-4' />
                Back to Sign In
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
