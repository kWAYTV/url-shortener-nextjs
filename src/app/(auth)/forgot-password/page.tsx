import ForgotPassword from '@/components/core/auth/forgot-password/forgot-password-form';

export default function ForgotPasswordPage() {
  return (
    <div className='container mx-auto flex min-h-screen flex-col items-center justify-center px-6'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Forgot Password?
          </h1>
          <p className='text-muted-foreground text-sm'>
            No worries! Enter your email and we&apos;ll help you reset it.
          </p>
        </div>

        <ForgotPassword />
      </div>
    </div>
  );
}
