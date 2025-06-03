import { ArrowLeft } from 'lucide-react';
import { type Metadata } from 'next';
import Link from 'next/link';

import { ContentLayout } from '@/components/core/admin/content-layout';
import { UserSearch } from '@/components/core/admin/users/user-search';
import { UsersTable } from '@/components/core/admin/users/users-table';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { getAllUsersAction } from '@/server/actions/admin/users/get-all-users.action';

export const metadata: Metadata = {
  title: 'User Management | Admin | ShortLink',
  description: 'Manage users in the ShortLink application'
};

export default async function UserManagementPage({
  searchParams
}: {
  searchParams: Promise<{
    page?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
  }>;
}) {
  // Parse search params
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const search = params.search || '';
  const sortBy = (params.sortBy || 'createdAt') as
    | 'name'
    | 'email'
    | 'role'
    | 'createdAt';
  const sortOrder = (params.sortOrder || 'desc') as 'asc' | 'desc';

  const response = await getAllUsersAction({
    page,
    search,
    sortBy,
    sortOrder
  });

  const users = response.success && response.data ? response.data.users : [];
  const total = response.success && response.data ? response.data.total : 0;

  return (
    <ContentLayout title='User Management'>
      <div className='mb-6 flex items-center justify-between'>
        <Link href='/admin' passHref>
          <Button variant={'outline'} size={'sm'} className='gap-2'>
            <ArrowLeft className='size-4' />
            Back to Admin
          </Button>
        </Link>
      </div>

      <div className='grid gap-6'>
        <Card className='shadow-sm'>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>
              View and manage all users in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              <UserSearch initialSearch={search} />
              <UsersTable
                users={users}
                total={total}
                currentPage={page}
                currentSearch={search}
                currentSortBy={sortBy}
                currentSortOrder={sortOrder}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </ContentLayout>
  );
}
