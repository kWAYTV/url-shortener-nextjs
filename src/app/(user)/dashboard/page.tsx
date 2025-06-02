import { getSession } from '@/lib/auth-client';
import { redirect } from 'next/navigation';

export default async function DasboardPage() {
  const { data: session } = await getSession();

  if (!session) return redirect('/sign-in');

  const user = session?.user;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
    </div>
  );
}
