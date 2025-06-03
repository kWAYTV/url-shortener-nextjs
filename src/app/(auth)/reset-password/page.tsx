import { redirect } from 'next/navigation';

import ResetPasswordForm from '@/components/core/auth/reset-password/reset-password-form';

interface PageProps {
  searchParams: Promise<{ token: string }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const token = (await searchParams).token;

  if (!token) redirect('/sign-in');

  return (
    <div className='container mx-auto flex flex-col items-center justify-center px-6 py-20'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Create New Password
          </h1>
          <p className='text-muted-foreground text-sm'>
            Your new password must be different from previous passwords.
          </p>
        </div>

        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
}
