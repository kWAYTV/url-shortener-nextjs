import { UrlShortenerForm } from '@/components/core/urls/url-shortener-form';

export default function Home() {
  return (
    <div className='container mx-auto flex flex-1 flex-col items-center justify-center px-6 py-16'>
      <div className='w-full max-w-2xl space-y-8 text-center'>
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold tracking-tight md:text-5xl'>
            Shorten Your Links
          </h1>
          <p className='text-muted-foreground text-lg'>
            Paste your long URL and get a shortened one. It&apos;s free and easy
            to use.
          </p>
        </div>

        <UrlShortenerForm />
      </div>
    </div>
  );
}
