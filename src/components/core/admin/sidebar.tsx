'use client';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { Menu } from '@/components/core/admin/menu';
import { SidebarToggle } from '@/components/core/admin/sidebar-toggle';
import { Button } from '@/components/ui/button';
import { useSidebar } from '@/hooks/use-sidebar';
import { useStore } from '@/hooks/use-store';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const sidebar = useStore(useSidebar, x => x);
  if (!sidebar) return null;
  const { isOpen, toggleOpen, getOpenState, setIsHover, settings } = sidebar;
  return (
    <aside
      className={cn(
        'fixed top-0 left-0 z-20 h-screen -translate-x-full transition-[width] duration-300 ease-in-out lg:translate-x-0',
        !getOpenState() ? 'w-[90px]' : 'w-72',
        settings.disabled && 'hidden'
      )}
    >
      <SidebarToggle isOpen={isOpen} setIsOpen={toggleOpen} />
      <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        className='relative flex h-full flex-col overflow-y-auto px-3 py-4 shadow-md dark:shadow-zinc-800'
      >
        <Button
          className={cn(
            'mb-1 transition-transform duration-300 ease-in-out',
            !getOpenState() ? 'translate-x-1' : 'translate-x-0'
          )}
          variant='link'
          asChild
        >
          <Link href='/dashboard' className='flex items-center gap-2'>
            <ArrowRight className='mr-1 h-6 w-6' />
            <h1
              className={cn(
                'text-lg font-bold whitespace-nowrap transition-[transform,opacity,display] duration-300 ease-in-out',
                !getOpenState()
                  ? 'hidden -translate-x-96 opacity-0'
                  : 'translate-x-0 opacity-100'
              )}
            >
              short
            </h1>
          </Link>
        </Button>
        <Menu isOpen={getOpenState()} />
      </div>
    </aside>
  );
}
