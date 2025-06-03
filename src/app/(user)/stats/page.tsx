import { count, sql } from 'drizzle-orm';
import { type Metadata } from 'next';

import AuthPromotionCard from '@/components/core/stats/public-stats/auth-promotion-card';
import PublicStatsCards from '@/components/core/stats/public-stats/public-stats-cards';
import PublicStatsHeader from '@/components/core/stats/public-stats/public-stats-header';
import { db } from '@/lib/db';
import { urls } from '@/schemas/db.schema';

export const metadata: Metadata = {
  title: 'Statistics | ShortLink',
  description: 'Statistics about our URL shortener service'
};

export default async function PublicStatsPage() {
  // Get total number of URLs
  const [urlCount] = await db.select({ value: count() }).from(urls);
  const totalUrls = urlCount?.value || 0;

  // Get total number of clicks
  const [clicksResult] = await db
    .select({ total: sql<number>`sum(${urls.clicks})` })
    .from(urls);
  const totalClicks = clicksResult?.total || 0;

  return (
    <div className='container mx-auto max-w-4xl px-4 py-10'>
      <PublicStatsHeader />

      <PublicStatsCards totalUrls={totalUrls} totalClicks={totalClicks} />

      <AuthPromotionCard />
    </div>
  );
}
