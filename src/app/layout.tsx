import '@/app/globals.css';

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import Footer from '@/components/core/layout/footer';
import Navbar from '@/components/core/layout/navbar';
import { Providers } from '@/components/core/providers/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'short',
  description: 'NextJS URL shortener built with better-auth.'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className='flex min-h-screen flex-col'>
            <Navbar />
            <main className='flex-1 pt-16'>{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
