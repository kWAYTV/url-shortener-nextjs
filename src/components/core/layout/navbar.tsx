import Link from 'next/link';

import AuthButtons from '@/components/core/auth/shared/auth-buttons';

export default function Navbar() {
  return (
    <nav className='fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 py-3'>
      <Link href='/' className='text-xl font-bold'>
        short
      </Link>
      <AuthButtons />
    </nav>
  );
}
