'use client';

import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

import { UserNav } from '@/components/core/auth/shared/user-nav';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useSession } from '@/lib/auth-client';

export default function AuthButtons() {
  const { data: session, isPending } = useSession();

  if (isPending) return <Skeleton className='h-8 w-8 rounded-full' />;

  return !session ? (
    <div className='flex justify-center gap-2'>
      <Link href='/sign-in'>
        <Button variant='link'>
          <LogIn className='size-4' />
          Sign In
        </Button>
      </Link>
      <Link href='/sign-up'>
        <Button variant='link'>
          <UserPlus className='size-4' />
          Sign Up
        </Button>
      </Link>
    </div>
  ) : (
    <div className='flex items-center gap-2'>
      <UserNav />
    </div>
  );
}
