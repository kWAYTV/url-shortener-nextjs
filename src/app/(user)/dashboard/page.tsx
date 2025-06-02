'use client';

import { redirect } from 'next/navigation';

import { DashboardContent } from '@/components/core/user/dashboard/dashboard-content';
import { DashboardError } from '@/components/core/user/dashboard/dashboard-error';
import { useSession } from '@/lib/auth-client';

export default function DashboardPage() {
  const { data: session, error } = useSession();

  if (error) {
    return <DashboardError error={error} />;
  }

  if (!session) return redirect('/sign-in');

  const user = session?.user;

  return <DashboardContent user={user} />;
}
