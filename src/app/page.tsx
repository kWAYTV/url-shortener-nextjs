import { UrlShortenerForm } from '@/components/core/urls/url-shortener-form';

export default function Home() {
  return (
    <div className='flex flex-1 flex-col items-center justify-center p-6 md:p-24'>
      <div className='mx-auto w-full max-w-3xl text-center'>
        <h1 className='mb-4 text-4xl font-bold tracking-tight md:text-5xl'>
          Shorten Your Links
        </h1>
        <p className='text-muted-foreground mx-auto mb-8 max-w-2xl text-lg'>
          Paste your long URL and get a shortened one. It&apos;s free and easy
          to use.
        </p>

        <UrlShortenerForm />
      </div>
    </div>
  );
}
