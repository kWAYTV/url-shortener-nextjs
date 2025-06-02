import SignUp from '@/components/core/auth/sign-up/sign-up-form';

export default function SignUpPage() {
  return (
    <div className='container mx-auto flex min-h-screen flex-col items-center justify-center px-6'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Create an account
          </h1>
          <p className='text-muted-foreground text-sm'>
            Enter your details to create an account.
          </p>
        </div>

        <SignUp />
      </div>
    </div>
  );
}
