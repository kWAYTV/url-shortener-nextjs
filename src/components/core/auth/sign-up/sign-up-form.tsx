'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { signUp } from '@/lib/auth-client';
import { type SignUpSchema, signUpSchema } from '@/schemas/auth';

export default function SignUpForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      image: ''
    }
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64Image = await convertImageToBase64(file);
        form.setValue('image', base64Image);
        setImagePreview(base64Image);
        toast.success('Image uploaded');
      } catch {
        toast.error('Failed to upload image');
      }
    }
  };

  const handleImageRemove = () => {
    form.setValue('image', '');
    setImagePreview(null);
    toast.success('Image removed');
  };

  const handleSignUp = async (data: SignUpSchema) => {
    await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      image: data.image || '',
      callbackURL: '/dashboard',
      fetchOptions: {
        onRequest: () => {
          setLoading(true);
          toast('Creating account...');
        },
        onResponse: () => {
          setLoading(false);
        },
        onError: ctx => {
          toast.error(ctx.error.message);
          setLoading(false);
        },
        onSuccess: async () => {
          toast.success(
            'Account created. Please check your email for verification.'
          );
        }
      }
    });
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSignUp)}
            className='grid gap-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <div className='grid gap-2'>
                    <FormLabel htmlFor='name'>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        id='name'
                        placeholder='John Doe'
                        required
                        {...field}
                        autoComplete='name'
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

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
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <FormControl>
                      <Input
                        id='password'
                        type='password'
                        {...field}
                        autoComplete='new-password'
                        placeholder='Password'
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
                        {...field}
                        autoComplete='new-password'
                        placeholder='Confirm Password'
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='image'
              render={() => (
                <FormItem>
                  <div className='grid gap-2'>
                    <FormLabel htmlFor='image'>
                      Profile Image (optional)
                    </FormLabel>
                    <div className='flex items-end gap-4'>
                      {imagePreview && (
                        <div className='relative h-16 w-16 overflow-hidden rounded-sm'>
                          <Image
                            src={imagePreview}
                            alt='Profile preview'
                            layout='fill'
                            objectFit='cover'
                          />
                        </div>
                      )}
                      <div className='flex w-full items-center gap-2'>
                        <Input
                          id='image'
                          type='file'
                          accept='image/*'
                          onChange={handleImageChange}
                          className='w-full'
                        />
                        {imagePreview && (
                          <X
                            className='cursor-pointer'
                            onClick={handleImageRemove}
                          />
                        )}
                      </div>
                    </div>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Separator />

            <Button type='submit' className='w-full' disabled={loading}>
              {loading ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                'Create an account'
              )}
            </Button>

            <div className='text-center text-sm'>
              <span className='text-muted-foreground'>
                Already have an account?{' '}
              </span>
              <Button variant='link' asChild className='h-auto p-0 text-sm'>
                <Link href='/sign-in'>Sign in</Link>
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
