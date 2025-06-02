import EmailVerifiedContent from '@/components/core/auth/email-verified/email-verified-content';

export default function EmailVerifiedPage() {
  return (
    <div className='container mx-auto flex min-h-screen flex-col items-center justify-center px-6'>
      <div className='w-full max-w-md space-y-6'>
        <EmailVerifiedContent />
      </div>
    </div>
  );
}
