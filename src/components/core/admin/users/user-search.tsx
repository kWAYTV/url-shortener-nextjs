'use client';

import { Search, X } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface UserSearchProps {
  initialSearch?: string;
}

export function UserSearch({ initialSearch }: UserSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const params = new URLSearchParams(searchParams.toString());

    if (searchParams) {
      params.set('search', searchTerm);
    } else {
      params.delete('search');
    }

    params.set('page', '1');

    router.push(`/admin/users?${params.toString()}`);
  };

  const clearSearch = () => {
    setSearchTerm('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.set('page', '1');
    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className='flex gap-2'>
      <div className='relative flex-1'>
        <Search className='text-muted-foreground absolute top-2.5 left-2.5 size-4' />
        <Input
          type='text'
          placeholder='Search users'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className='pl-9'
        />
        {searchTerm && (
          <button
            type='button'
            onClick={clearSearch}
            className='text-muted-foreground absolute top-2.5 right-2.5 size-4'
          >
            <X className='size-4' />
          </button>
        )}
      </div>
      <Button type='submit'>Search</Button>
    </form>
  );
}
