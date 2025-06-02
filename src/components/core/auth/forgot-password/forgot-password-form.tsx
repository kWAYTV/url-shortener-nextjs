'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
import { forgetPassword } from '@/lib/auth-client';
import {
  type ForgotPasswordSchema,
  forgotPasswordSchema
} from '@/schemas/auth';

export default function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ForgotPasswordSchema) => {
    setIsPending(true);

    await forgetPassword({
      email: data.email,
      redirectTo: '/reset-password',
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
          toast('Sending reset link...');
        },
        onSuccess: () => {
          toast.success(
            'If an account exists with this email, you will receive a password reset link.'
          );
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: ctx => {
          toast.error(ctx.error.message);
          setIsPending(false);
        }
      }
    });
  };

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-lg md:text-xl'>
          Reset your password
        </CardTitle>
        <CardDescription className='text-xs md:text-sm'>
          Enter your email address and we&apos;ll send you a link to reset your
          password
        </CardDescription>
      </CardHeader>
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
                        required
                        {...field}
                        autoComplete='email'
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
                'Send Reset Link'
              )}
            </Button>

            <Separator />

            <div className='text-center'>
              <Link href='/sign-in' className='text-sm underline'>
                Back to Sign In
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
