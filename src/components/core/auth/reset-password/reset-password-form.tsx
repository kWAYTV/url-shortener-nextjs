'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import { resetPassword } from '@/lib/auth-client';
import { type ResetPasswordSchema, resetPasswordSchema } from '@/schemas/auth';

interface ResetPasswordFormProps {
  token: string;
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token,
      password: '',
      confirmPassword: ''
    }
  });

  const onSubmit = async (data: ResetPasswordSchema) => {
    await resetPassword({
      newPassword: data.password,
      token: data.token,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
          toast('Resetting password...');
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: ctx => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success('Password reset successful. Login to continue.');
          router.push('/sign-in');
        }
      }
    });
  };

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
                        autoComplete='new-password'
                        {...field}
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
                        autoComplete='new-password'
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
