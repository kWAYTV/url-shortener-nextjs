import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='bg-background/95 supports-[backdrop-filter]:bg-background/60 border-t backdrop-blur'>
      <div className='container mx-auto px-4 py-4'>
        <div className='text-muted-foreground flex flex-col items-center justify-between gap-4 text-sm md:flex-row'>
          <div className='flex items-center gap-4'>
            <Link
              href='/'
              className='text-foreground text-xl font-bold transition-transform duration-200 ease-in-out hover:scale-110'
            >
              url.io
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
              href='/account'
              className='hover:text-foreground transition-colors'
            >
              Account
            </Link>
          </div>
          <div className='flex items-center gap-4'>
            <p className='flex items-center gap-1'>
              Made with <Heart className='size-4 text-red-500' /> using Next.js
            </p>
            <span className='hidden md:inline'>•</span>
            <p className='hidden md:block'>
              © {new Date().getFullYear()} url.io
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
