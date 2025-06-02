import SignInForm from '@/components/core/auth/sign-in/sign-in-form';

export default function SignInPage() {
  return (
    <div className='container mx-auto flex min-h-screen flex-col items-center justify-center px-6'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Welcome back!
          </h1>
          <p className='text-muted-foreground text-sm'>
            Enter your credentials below to log in to your account.
          </p>
        </div>

        <SignInForm />
      </div>
    </div>
  );
}
