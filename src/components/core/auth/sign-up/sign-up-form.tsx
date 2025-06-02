'use client';

import { Loader2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { signUp } from '@/lib/auth-client';

export default function SignUp() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      toast.success('Image uploaded');
    }
  };

  const handleImageRemove = () => {
    setImage(null);
    setImagePreview(null);
    toast.success('Image removed');
  };

  const handleSignUp = async () => {
    await signUp.email({
      email,
      password,
      name: `${firstName} ${lastName}`,
      image: image ? await convertImageToBase64(image) : '',
      callbackURL: '/dashboard',
      fetchOptions: {
        onRequest: () => setLoading(true),
        onResponse: () => setLoading(false),
        onError: ctx => {
          toast.error(ctx.error.message);
        },
        onSuccess: async () => {
          router.push('/dashboard');
          toast.success(
            'Account created. Please check your email for verification.'
          );
        }
      }
    });
  };

  return (
    <Card className='z-50 max-w-md rounded-md rounded-t-none'>
      <CardHeader>
        <CardTitle className='text-lg md:text-xl'>Sign Up</CardTitle>
        <CardDescription className='text-xs md:text-sm'>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='first-name'>First name</Label>
              <Input
                id='first-name'
                placeholder='John'
                required
                onChange={e => setFirstName(e.target.value)}
                value={firstName}
              />
            </div>
            <div className='grid gap-2'>
              <Label htmlFor='last-name'>Last name</Label>
              <Input
                id='last-name'
                placeholder='Doe'
                required
                onChange={e => setLastName(e.target.value)}
                value={lastName}
              />
            </div>
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              placeholder='email@example.com'
              required
              onChange={e => setEmail(e.target.value)}
              value={email}
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete='new-password'
              placeholder='Password'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='password'>Confirm Password</Label>
            <Input
              id='password_confirmation'
              type='password'
              value={passwordConfirmation}
              onChange={e => setPasswordConfirmation(e.target.value)}
              autoComplete='new-password'
              placeholder='Confirm Password'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='image'>Profile Image (optional)</Label>
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
                  <X className='cursor-pointer' onClick={handleImageRemove} />
                )}
              </div>
            </div>
          </div>

          <Separator />

          <Button
            type='submit'
            className='w-full'
            disabled={loading}
            onClick={handleSignUp}
          >
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
        </div>
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
