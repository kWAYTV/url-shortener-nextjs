import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface StatsCardsProps {
  totalUrls: number;
  totalClicks: number;
  avgClicks: number;
}

export default function StatsCards({
  totalUrls,
  totalClicks,
  avgClicks
}: StatsCardsProps) {
  return (
    <div className='mb-8 grid gap-8 md:grid-cols-3'>
      <Card className='shadow-sm'>
        <CardHeader className='pb-2'>
          <CardTitle>Total URLs</CardTitle>
          <CardDescription>Number of URLs you&apos;ve created</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-bold'>{totalUrls}</p>
        </CardContent>
      </Card>

      <Card className='shadow-sm'>
        <CardHeader className='pb-2'>
          <CardTitle>Total Clicks</CardTitle>
          <CardDescription>Total clicks across all URLs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-bold'>{totalClicks}</p>
        </CardContent>
      </Card>

      <Card className='shadow-sm'>
        <CardHeader className='pb-2'>
          <CardTitle>Average Clicks</CardTitle>
          <CardDescription>Average clicks per URL</CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-3xl font-bold'>{avgClicks}</p>
        </CardContent>
      </Card>
    </div>
  );
}
