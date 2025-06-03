'use client';

import { redirect } from 'next/navigation';
import { useEffect, useState } from 'react';

import PrivateStatsLoading from '@/components/core/stats/private-stats/loading';
import PerformanceAnalytics from '@/components/core/stats/private-stats/performance-analytics';
import StatsCards from '@/components/core/stats/private-stats/stats-cards';
// Import reusable components
import StatsHeader from '@/components/core/stats/private-stats/stats-header';
import TopUrlsList from '@/components/core/stats/private-stats/top-urls-list';
import { useSession } from '@/lib/auth-client';
import { getUserUrlsAction } from '@/server/actions/urls/get-user-urls.action';

interface Url {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
}

export default function StatsPage() {
  const { data: session, isPending } = useSession();
  const [userUrls, setUserUrls] = useState<Url[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;

    if (!session?.user?.id) {
      redirect('/sign-in');
    }

    const fetchUserUrls = async () => {
      try {
        if (!session?.user?.id) return;
        const response = await getUserUrlsAction(session.user.id);
        if (response.success && response.data) {
          setUserUrls(response.data);
        }
      } catch (error) {
        console.error('Error fetching user URLs', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserUrls();
  }, [session, isPending]);

  // calculate total clicks
  const totalClicks = userUrls.reduce((sum, url) => sum + url.clicks, 0);

  // calculate average clicks per URL
  const avgClicks =
    userUrls.length > 0
      ? Math.round((totalClicks / userUrls.length) * 10) / 10
      : 0;

  // get top performing URLs
  const topUrls = [...userUrls].sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  if (isPending || loading) {
    return <PrivateStatsLoading />;
  }

  return (
    <div className='container mx-auto max-w-6xl px-4 py-8'>
      <StatsHeader />

      <StatsCards
        totalUrls={userUrls.length}
        totalClicks={totalClicks}
        avgClicks={avgClicks}
      />

      <PerformanceAnalytics
        userUrls={userUrls}
        topUrls={topUrls}
        totalClicks={totalClicks}
        avgClicks={avgClicks}
      />

      <TopUrlsList topUrls={topUrls} />
    </div>
  );
}
