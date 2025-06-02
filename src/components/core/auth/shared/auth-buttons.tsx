'use client';

import Link from 'next/link';

import SignoutButton from '@/components/core/auth/shared/sign-out-button';
import { Button } from '@/components/ui/button';
import { useSession } from '@/lib/auth-client';

export default function AuthButtons() {
  const { data: session, isPending } = useSession();

  if (isPending) return <div>Loading...</div>;

  return !session ? (
    <div className='flex justify-center gap-2'>
      <Link href='/sign-in'>
        <Button>Sign In</Button>
      </Link>
      <Link href='/sign-up'>
        <Button>Sign Up</Button>
      </Link>
    </div>
  ) : (
    <div className='flex items-center gap-2'>
      <SignoutButton />
    </div>
  );
}
