import { LogIn, UserPlus } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function AuthPromotionCard() {
  return (
    <div className='text-center'>
      <Card className='mb-8 shadow-sm'>
        <CardHeader>
          <CardTitle>Want to see your personal statistics?</CardTitle>
          <CardDescription>
            Sign up for an account to track your own shortened URLs and view
            detailed statistics.
          </CardDescription>
        </CardHeader>
        <CardContent className='flex justify-center gap-4'>
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
        </CardContent>
      </Card>
    </div>
  );
}
