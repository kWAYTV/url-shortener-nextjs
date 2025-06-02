import MagicLinkForm from '@/components/core/auth/magic-link/magic-link-form';

export default function MagicLinkPage() {
  return (
    <div className='container mx-auto flex min-h-screen flex-col items-center justify-center px-6'>
      <div className='w-full max-w-sm space-y-6'>
        <div className='space-y-2 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Magic Link Sign In
          </h1>
          <p className='text-muted-foreground text-sm'>
            Enter your email address and we&apos;ll send you a magic link to
            sign in.
          </p>
        </div>

        <MagicLinkForm />
      </div>
    </div>
  );
}
