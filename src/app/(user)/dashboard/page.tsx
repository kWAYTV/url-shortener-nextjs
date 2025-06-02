import { getSession } from '@/lib/auth-client';

export default async function DasboardPage() {
  const { data: session } = await getSession();

  if (!session) return <div>Unauthorized</div>;

  const user = session?.user;

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name}</p>
    </div>
  );
}
