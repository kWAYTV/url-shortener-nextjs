'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { Suspense, useState } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { resetPassword } from '@/lib/auth-client';
import { type ResetPasswordSchema, resetPasswordSchema } from '@/schemas/auth';

function ResetPasswordFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const [isPending, setIsPending] = useState(false);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    setIsPending(true);
    await resetPassword({
      newPassword: data.password,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
          toast('Resetting password...');
        },
        onSuccess: () => {
          toast.success('Password reset successful. Login to continue.');
          router.push('/sign-in');
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

  if (error === 'invalid_token') {
    return (
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-lg md:text-xl'>
            Invalid Reset Link
          </CardTitle>
          <CardDescription className='text-xs md:text-sm'>
            This password reset link is invalid or has expired.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='grid gap-4'>
            <p className='text-muted-foreground text-center text-sm'>
              Please request a new password reset link to continue.
            </p>

            <Separator />

            <div className='text-center'>
              <Link href='/forgot-password' className='text-sm underline'>
                Request New Link
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-lg md:text-xl'>Reset Password</CardTitle>
        <CardDescription className='text-xs md:text-sm'>
          Enter your new password below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='grid gap-2'>
                    <FormLabel htmlFor='password'>New Password</FormLabel>
                    <FormControl>
                      <Input
                        id='password'
                        type='password'
                        placeholder='Enter your new password'
                        required
                        {...field}
                        autoComplete='new-password'
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <div className='grid gap-2'>
                    <FormLabel htmlFor='confirmPassword'>
                      Confirm Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        id='confirmPassword'
                        type='password'
                        placeholder='Confirm your new password'
                        required
                        {...field}
                        autoComplete='new-password'
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
                'Reset Password'
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

export default function ResetPasswordForm() {
  return (
    <Suspense
      fallback={
        <Card className='w-full max-w-sm'>
          <CardHeader>
            <Skeleton className='h-6 w-32' />
            <Skeleton className='mt-2 h-4 w-48' />
          </CardHeader>
          <CardContent>
            <div className='grid gap-4'>
              <div className='grid gap-2'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-10 w-full' />
              </div>
              <div className='grid gap-2'>
                <Skeleton className='h-4 w-24' />
                <Skeleton className='h-10 w-full' />
              </div>
              <Skeleton className='h-10 w-full' />
              <Skeleton className='h-px w-full' />
              <Skeleton className='mx-auto h-4 w-24' />
            </div>
          </CardContent>
        </Card>
      }
    >
      <ResetPasswordFormContent />
    </Suspense>
  );
}
