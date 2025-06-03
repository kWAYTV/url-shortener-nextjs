import EmailVerifiedPage from '@/components/core/auth/email-verified/email-verified-page';

export default function Page() {
  return (
    <div className='container mx-auto flex flex-col items-center justify-center px-6 py-20'>
      <div className='w-full max-w-sm space-y-6'>
        <EmailVerifiedPage />
      </div>
    </div>
  );
}
