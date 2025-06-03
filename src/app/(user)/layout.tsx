import Footer from '@/components/core/layout/footer';
import Navbar from '@/components/core/layout/navbar';

export default function UserLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='flex min-h-screen flex-col'>
      <Navbar />
      <main className='flex flex-1 flex-col pt-16'>{children}</main>
      <Footer />
    </div>
  );
}
