import { redirect } from 'next/navigation';

import { DashboardContent } from '@/components/core/user/dashboard/dashboard-content';
import { getUser } from '@/lib/auth-utils';
/* import { DashboardError } from '@/components/core/user/dashboard/dashboard-error';
import { useSession } from '@/lib/auth-client'; */

export default async function DashboardPage() {
  /* const { data: session, error } = useSession();

  if (error) {
    return <DashboardError error={error} />;
  } */

  const user = await getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return <DashboardContent user={user} />;
}
