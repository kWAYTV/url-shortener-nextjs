import { Heart } from 'lucide-react';
import Link from 'next/link';

export function Footer() {
  return (
    <div className='bg-background/95 supports-[backdrop-filter]:bg-background/60 z-20 w-full shadow backdrop-blur'>
      <div className='mx-4 flex h-14 items-center md:mx-8'>
        <div className='text-muted-foreground flex flex-1 items-center justify-between text-sm'>
          <div className='flex items-center gap-4'>
            <Link
              href='/'
              className='text-foreground text-lg font-bold transition-transform duration-200 ease-in-out hover:scale-110'
            >
              aris.sh
            </Link>
            <span className='hidden md:inline'>•</span>
            <Link
              href='/dashboard'
              className='hover:text-foreground transition-colors'
            >
              Dashboard
            </Link>
            <span>•</span>
            <Link
              href='/admin'
              className='hover:text-foreground transition-colors'
            >
              Admin
            </Link>
          </div>
          <div className='hidden items-center gap-1 md:flex'>
            Made with <Heart className='size-4 text-red-500' /> using Next.js
          </div>
        </div>
      </div>
    </div>
  );
}
