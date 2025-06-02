import { redirect } from 'next/navigation';

import { DashboardContent } from '@/components/core/user/dashboard/dashboard-content';
import { getUser } from '@/lib/auth-utils';

export default async function DashboardPage() {
  const user = await getUser();

  if (!user) return redirect('/sign-in');

  return <DashboardContent user={user} />;
}
