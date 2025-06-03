import ResendVerificationEmailForm from '@/components/core/auth/resend-verification-email/resend-verification-email-form';

export default function ResendVerificationEmailPage() {
  return (
    <div className='container mx-auto flex flex-col items-center justify-center px-6 py-20'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Resend Verification Email
          </h1>
          <p className='text-muted-foreground text-sm'>
            Enter your email address and we&apos;ll send you a new link to
            verify your email
          </p>
        </div>

        <ResendVerificationEmailForm />
      </div>
    </div>
  );
}
