import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

interface PublicStatsCardsProps {
  totalUrls: number;
  totalClicks: number;
}

export default function PublicStatsCards({
  totalUrls,
  totalClicks
}: PublicStatsCardsProps) {
  return (
    <div className='mb-8 grid gap-8 md:grid-cols-2'>
      <Card className='shadow-sm'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg'>Total URLs Shortened</CardTitle>
          <CardDescription>
            Number of URLs shortened with our service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-4xl font-bold'>{totalUrls.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card className='shadow-sm'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-lg'>Total Clicks</CardTitle>
          <CardDescription>
            Total number of redirects through our service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className='text-4xl font-bold'>{totalClicks.toLocaleString()}</p>
        </CardContent>
      </Card>
    </div>
  );
}
