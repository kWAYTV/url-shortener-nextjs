'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LinkIcon, Loader2, LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { type SignInSchema, signInSchema } from '@/schemas/auth.schema';

export default function SignInForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<SignInSchema>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleEmailSignIn = async (data: SignInSchema) => {
    await signIn.email({
      email: data.email,
      password: data.password,
      rememberMe,
      callbackURL: '/dashboard',
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
          toast('Signing in...');
        },
        onResponse: () => {
          setLoading(false);
        },
        onSuccess: async () => {
          toast.success('Signed in successfully');
          setRememberMe(false);
        },
        onError: ctx => {
          toast.error(ctx.error.message);
          setLoading(false);
        }
      }
    });
  };

  const handleSocialSignIn = async (provider: 'github' | 'google') => {
    await signIn.social({
      provider,
      callbackURL: '/dashboard',
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
          toast('Signing in...');
        },
        onResponse: () => {
          setLoading(false);
        },
        onSuccess: () => {
          toast.success('Signed in successfully');
          setRememberMe(false);
        },
        onError: ctx => {
          toast.error(ctx.error.message);
          setLoading(false);
        }
      }
    });
  };

  const handleMagicLinkSignIn = async () => {
    router.push('/sign-in/magic-link');
  };

  return (
    <Card className='max-w-md'>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEmailSignIn)}
            className='grid gap-4'
          >
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

            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <div className='grid gap-2'>
                    <div className='flex items-center'>
                      <FormLabel htmlFor='password'>Password</FormLabel>
                      <Link
                        href='/forgot-password'
                        className='ml-auto inline-block text-sm underline'
                      >
                        Forgot your password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        id='password'
                        type='password'
                        placeholder='Password'
                        autoComplete='current-password'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <>
                  <LogIn className='size-4' />
                  Login
                </>
              )}
            </Button>

            <div className='flex items-center gap-2'>
              <Checkbox
                id='remember'
                checked={rememberMe}
                onCheckedChange={() => setRememberMe(!rememberMe)}
              />
              <Label htmlFor='remember'>Remember me</Label>
            </div>

            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <Separator className='w-full' />
              </div>
              <div className='relative flex justify-center text-xs uppercase'>
                <span className='text-muted-foreground px-2'>
                  Or continue with
                </span>
              </div>
            </div>

            <div
              className={cn(
                'flex w-full items-center gap-2',
                'flex-col justify-between'
              )}
            >
              <Button
                variant='outline'
                className={cn('w-full gap-2')}
                disabled={loading}
                onClick={() => handleSocialSignIn('github')}
                type='button'
              >
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='1em'
                  height='1em'
                  viewBox='0 0 24 24'
                >
                  <path
                    fill='currentColor'
                    d='M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2'
                  ></path>
                </svg>
                Sign in with Github
              </Button>
              <Button
                variant='outline'
                className={cn('w-full gap-2')}
                disabled={loading}
                onClick={() => handleMagicLinkSignIn()}
                type='button'
              >
                <LinkIcon size={16} />
                Sign in with Magic Link
              </Button>
            </div>

            <div className='text-center text-sm'>
              <span className='text-muted-foreground'>
                Don&apos;t have an account?{' '}
              </span>
              <Button variant='link' asChild className='h-auto p-0 text-sm'>
                <Link href='/sign-up'>
                  <UserPlus className='size-4' />
                  Sign up
                </Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
