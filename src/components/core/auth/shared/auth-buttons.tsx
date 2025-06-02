'use client';

import Link from 'next/link';

import { UserNav } from '@/components/core/auth/shared/user-nav';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';

export default function AuthButtons() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;

  return !session ? (
    <div className='flex justify-center gap-2'>
      <Link href='/sign-in'>
        <Button variant='link'>Sign In</Button>
      </Link>
      <Link href='/sign-up'>
        <Button variant='link'>Sign Up</Button>
      </Link>
    </div>
  ) : (
    <div className='flex items-center gap-2'>
      <UserNav />
    </div>
  );
}
