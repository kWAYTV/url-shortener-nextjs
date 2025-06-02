'use client';

import { LayoutGrid, LogOut, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { signOut, useSession } from '@/lib/auth-client';

export function UserNav() {
  const { data: session } = useSession();
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleSignOut = async () => {
    setPending(true);

    await signOut({
      fetchOptions: {
        onRequest: () => {
          setPending(true);
          toast('Signing out...');
        },
        onSuccess: () => {
          router.push('/sign-in');
          toast.success('Signed out successfully');
        },
        onResponse: () => {
          setPending(false);
        },
        onError: ctx => {
          toast.error(ctx.error.message);
          setPending(false);
        }
      }
    });
  };

  const userInitials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
    : 'U';

  return (
    <DropdownMenu>
      <TooltipProvider disableHoverableContent>
        <Tooltip delayDuration={100}>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                className='relative h-8 w-8 rounded-full'
              >
                <Avatar className='h-8 w-8'>
                  <AvatarImage src={session?.user?.image || '#'} alt='Avatar' />
                  <AvatarFallback className='bg-transparent'>
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent side='bottom'>Profile</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col space-y-1'>
            <p className='text-sm leading-none font-medium'>
              {session?.user?.name || 'User'}
            </p>
            <p className='text-muted-foreground text-xs leading-none'>
              {session?.user?.email || 'user@example.com'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem className='hover:cursor-pointer' asChild>
            <Link href='/dashboard' className='flex items-center'>
              <LayoutGrid className='text-muted-foreground mr-3 h-4 w-4' />
              Dashboard
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='hover:cursor-pointer' asChild>
            <Link href='/account' className='flex items-center'>
              <User className='text-muted-foreground mr-3 h-4 w-4' />
              Account
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className='hover:cursor-pointer'
          onClick={handleSignOut}
          disabled={pending}
        >
          <LogOut className='text-muted-foreground mr-3 h-4 w-4' />
          {pending ? 'Signing out...' : 'Sign out'}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
