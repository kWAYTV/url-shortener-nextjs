'use client';

import { BarChart3Icon, Menu } from 'lucide-react';
import Link from 'next/link';

import AuthButtons from '@/components/core/auth/shared/auth-buttons';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/ui/mode-toggle';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

export default function Navbar() {
  return (
    <header className='bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 right-0 left-0 z-50 border-b backdrop-blur'>
      <div className='container mx-auto flex items-center justify-between p-4'>
        <Link
          href='/'
          className='text-xl font-bold transition-transform duration-200 ease-in-out hover:scale-110'
        >
          url.io
        </Link>

        {/* Desktop nav */}
        <nav className='hidden items-center gap-2 md:flex'>
          <ModeToggle />
          <Button variant='ghost' size='sm' asChild>
            <Link href='/stats' className='flex items-center gap-1'>
              <BarChart3Icon className='size-4' />
              Stats
            </Link>
          </Button>
          <AuthButtons />
        </nav>

        {/* Mobile nav */}
        <div className='flex items-center gap-2 md:hidden'>
          <ModeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Menu className='size-5' />
                <span className='sr-only'>Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='right' className='w-[250px] sm:w-[300px]'>
              <SheetHeader>
                <SheetTitle>Navigation Menu</SheetTitle>
              </SheetHeader>
              <nav className='mt-6 flex flex-col gap-4'>
                <SheetClose asChild>
                  <Button variant='ghost' size='sm' asChild>
                    <Link
                      href='/stats'
                      className='flex w-full items-center justify-start gap-2'
                    >
                      <BarChart3Icon className='size-4' />
                      Stats
                    </Link>
                  </Button>
                </SheetClose>
                <div className='flex flex-col gap-2'>
                  <AuthButtons />
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
