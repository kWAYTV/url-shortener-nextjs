'use client';

import { redirect } from 'next/navigation';

import { DashboardContent } from '@/components/core/user/dashboard/dashboard-content';
import { useSession } from '@/lib/auth-client';

export default function DashboardPage() {
  const { data: session, isPending, error } = useSession();

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  if (!session) return redirect('/sign-in');

  const user = session?.user;

  return <DashboardContent user={user} />;
}
