/* import { AdminSidebar } from '@/components/admin/admin-sidebar'; */
import { redirect } from 'next/navigation';
import { type ReactNode } from 'react';

import AdminPanelLayout from '@/components/core/admin/admin-panel-layout';
import { getUser } from '@/lib/auth-utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  if (user.role !== 'admin') {
    redirect('/dashboard');
  }

  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
