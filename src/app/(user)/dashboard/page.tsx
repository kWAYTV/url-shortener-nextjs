import { BarChart3, Copy, Eye, Link, Plus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className='container mx-auto space-y-8 px-6 py-8'>
      {/* Header */}
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Manage your shortened URLs and view analytics.
          </p>
        </div>
        <Button>
          <Plus className='mr-2 size-4' />
          Create Short URL
        </Button>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total URLs</CardTitle>
            <Link className='text-muted-foreground size-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>24</div>
            <p className='text-muted-foreground text-xs'>+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Clicks</CardTitle>
            <Eye className='text-muted-foreground size-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>1,247</div>
            <p className='text-muted-foreground text-xs'>
              +180 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Click Rate</CardTitle>
            <BarChart3 className='text-muted-foreground size-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>12.5%</div>
            <p className='text-muted-foreground text-xs'>
              +2.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Active URLs</CardTitle>
            <Link className='text-muted-foreground size-4' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>18</div>
            <p className='text-muted-foreground text-xs'>75% of total URLs</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent URLs */}
      <div className='grid gap-6 lg:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>Recent URLs</CardTitle>
            <CardDescription>
              Your most recently created short URLs.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {[1, 2, 3].map(item => (
              <div
                key={item}
                className='flex items-center justify-between space-x-4'
              >
                <div className='flex-1 space-y-1'>
                  <p className='text-sm font-medium'>short.ly/abc{item}23</p>
                  <p className='text-muted-foreground truncate text-xs'>
                    https://example-very-long-url-{item}.com/path/to/resource
                  </p>
                </div>
                <div className='flex items-center space-x-2'>
                  <span className='text-muted-foreground text-sm'>
                    {Math.floor(Math.random() * 100)} clicks
                  </span>
                  <Button variant='outline' size='sm'>
                    <Copy className='size-3' />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Performing URLs</CardTitle>
            <CardDescription>
              URLs with the highest click rates this month.
            </CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            {[1, 2, 3].map(item => (
              <div
                key={item}
                className='flex items-center justify-between space-x-4'
              >
                <div className='flex-1 space-y-1'>
                  <p className='text-sm font-medium'>short.ly/top{item}</p>
                  <p className='text-muted-foreground truncate text-xs'>
                    Popular link #{item}
                  </p>
                </div>
                <div className='flex items-center space-x-2'>
                  <span className='text-sm font-medium text-green-600'>
                    {500 - item * 100} clicks
                  </span>
                  <Button variant='outline' size='sm'>
                    <BarChart3 className='size-3' />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
