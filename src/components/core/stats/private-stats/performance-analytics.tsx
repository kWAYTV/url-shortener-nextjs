'use client';

import { TrendingDown, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis
} from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Url {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
}

interface PerformanceAnalyticsProps {
  userUrls: Url[];
  topUrls: Url[];
  totalClicks: number;
  avgClicks: number;
}

export default function PerformanceAnalytics({
  userUrls,
  topUrls,
  totalClicks,
  avgClicks
}: PerformanceAnalyticsProps) {
  // prepare data for the bar chart
  const barChartData = useMemo(() => {
    return topUrls.map(url => ({
      url: url.shortCode,
      clicks: url.clicks,
      originalUrl: url.originalUrl
    }));
  }, [topUrls]);

  // prepare data for the pie chart
  const pieChartData = useMemo(() => {
    return topUrls.map((url, index) => ({
      browser: url.shortCode,
      visitors: url.clicks,
      fill: `hsl(var(--chart-${(index % 5) + 1}))`
    }));
  }, [topUrls]);

  // prepare data for line chart (URLs created over time)
  const lineChartData = useMemo(() => {
    const dateGroups = userUrls.reduce(
      (acc, url) => {
        const date = new Date(url.createdAt).toLocaleDateString();
        if (!acc[date]) {
          acc[date] = { date, urls: 0, clicks: 0 };
        }
        acc[date].urls += 1;
        acc[date].clicks += url.clicks;
        return acc;
      },
      {} as Record<string, { date: string; urls: number; clicks: number }>
    );

    return Object.values(dateGroups)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7); // Last 7 data points
  }, [userUrls]);

  // prepare data for area chart
  const areaChartData = useMemo(() => {
    return topUrls.map(url => ({
      name: url.shortCode,
      clicks: url.clicks
    }));
  }, [topUrls]);

  // chart configs
  const barChartConfig = {
    clicks: {
      label: 'Clicks',
      color: 'hsl(var(--chart-1))'
    },
    ...topUrls.reduce(
      (acc, url, index) => {
        acc[url.shortCode] = {
          label: url.shortCode,
          color: `hsl(var(--chart-${(index % 5) + 1}))`
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>
    )
  } satisfies ChartConfig;

  const pieChartConfig = {
    visitors: {
      label: 'Clicks'
    },
    ...topUrls.reduce(
      (acc, url, index) => {
        acc[url.shortCode] = {
          label: url.shortCode,
          color: `hsl(var(--chart-${(index % 5) + 1}))`
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>
    )
  } satisfies ChartConfig;

  const lineChartConfig = {
    urls: {
      label: 'URLs Created',
      color: 'hsl(var(--chart-1))'
    },
    clicks: {
      label: 'Total Clicks',
      color: 'hsl(var(--chart-2))'
    }
  } satisfies ChartConfig;

  const areaChartConfig = {
    clicks: {
      label: 'Clicks',
      color: 'hsl(var(--chart-1))'
    }
  } satisfies ChartConfig;

  if (barChartData.length === 0) {
    return (
      <Card className='mb-8 shadow-sm'>
        <CardHeader>
          <CardTitle>Performance Analytics</CardTitle>
          <CardDescription>
            Visualize your URL performance with different chart types
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className='text-muted-foreground py-8 text-center'>
            No URL data available yet. Create some short URLs to see the stats.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='mb-8 shadow-sm'>
      <CardHeader>
        <CardTitle>Performance Analytics</CardTitle>
        <CardDescription>
          Visualize your URL performance with different chart types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='bar' className='w-full'>
          <TabsList className='mb-4'>
            <TabsTrigger value='bar'>Bar Chart</TabsTrigger>
            <TabsTrigger value='line'>Line Chart</TabsTrigger>
            <TabsTrigger value='area'>Area Chart</TabsTrigger>
            <TabsTrigger value='pie'>Pie Chart</TabsTrigger>
          </TabsList>

          <TabsContent value='bar' className='mt-4 min-h-[400px]'>
            <Card>
              <CardHeader>
                <CardTitle>URL Performance</CardTitle>
                <CardDescription>Top 5 URLs with most clicks</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={barChartConfig}>
                  <BarChart accessibilityLayer data={barChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey='url'
                      tickLine={false}
                      tickMargin={10}
                      axisLine={false}
                    />
                    <ChartTooltip
                      cursor={false}
                      content={
                        <ChartTooltipContent
                          indicator='dashed'
                          labelFormatter={label => `URL: ${label}`}
                        />
                      }
                    />
                    <Bar dataKey='clicks' radius={4}>
                      {barChartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex gap-2 leading-none font-medium'>
                  {avgClicks > 5 ? (
                    <>
                      Trending up by {((avgClicks / 5) * 100).toFixed(1)}% this
                      month <TrendingUp className='size-4 text-green-500' />
                    </>
                  ) : (
                    <>
                      Could improve with only{' '}
                      {Math.max(0, 5 - avgClicks).toFixed(1)} more clicks{' '}
                      <TrendingDown className='size-4 text-amber-500' />
                    </>
                  )}
                </div>
                <div className='text-muted-foreground leading-none'>
                  Showing click count for your top {topUrls.length} URLs
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='line' className='mt-4 min-h-[400px]'>
            <Card>
              <CardHeader>
                <CardTitle>URL Creation Trends</CardTitle>
                <CardDescription>
                  URLs created and clicks over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={lineChartConfig}>
                  <LineChart accessibilityLayer data={lineChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey='date'
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Line
                      dataKey='urls'
                      type='monotone'
                      stroke='var(--color-urls)'
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      dataKey='clicks'
                      type='monotone'
                      stroke='var(--color-clicks)'
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex gap-2 leading-none font-medium'>
                  Activity trends over the last 7 periods{' '}
                  <TrendingUp className='size-4' />
                </div>
                <div className='text-muted-foreground leading-none'>
                  Showing URL creation and click patterns
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='area' className='mt-4 min-h-[400px]'>
            <Card>
              <CardHeader>
                <CardTitle>Click Distribution</CardTitle>
                <CardDescription>Area view of URL performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={areaChartConfig}>
                  <AreaChart accessibilityLayer data={areaChartData}>
                    <CartesianGrid vertical={false} />
                    <XAxis
                      dataKey='name'
                      tickLine={false}
                      axisLine={false}
                      tickMargin={8}
                    />
                    <YAxis />
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent />}
                    />
                    <Area
                      dataKey='clicks'
                      type='natural'
                      fill='var(--color-clicks)'
                      fillOpacity={0.4}
                      stroke='var(--color-clicks)'
                    />
                  </AreaChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex gap-2 leading-none font-medium'>
                  Performance distribution across top URLs{' '}
                  <TrendingUp className='size-4' />
                </div>
                <div className='text-muted-foreground leading-none'>
                  Showing relative performance levels
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='pie' className='mt-4 min-h-[400px]'>
            <Card className='flex flex-col'>
              <CardHeader className='items-center pb-0'>
                <CardTitle>URL Clicks Distribution</CardTitle>
                <CardDescription>
                  Top {topUrls.length} URLs with most clicks
                </CardDescription>
              </CardHeader>
              <CardContent className='flex-1 pb-0'>
                <ChartContainer
                  config={pieChartConfig}
                  className='mx-auto aspect-square max-h-[350px]'
                >
                  <PieChart>
                    <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    />
                    <Pie
                      data={pieChartData}
                      dataKey='visitors'
                      nameKey='browser'
                      innerRadius={60}
                      strokeWidth={5}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor='middle'
                                dominantBaseline='middle'
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className='fill-foreground text-3xl font-bold'
                                >
                                  {totalClicks.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 20) + 20}
                                  className='fill-muted-foreground text-xs'
                                >
                                  Total Clicks
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </Pie>
                  </PieChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className='flex-col gap-2 text-sm'>
                <div className='flex items-center gap-2 leading-none font-medium'>
                  {avgClicks > 5 ? (
                    <>
                      Trending up by {((avgClicks / 5) * 100).toFixed(1)}% this
                      month <TrendingUp className='size-4 text-green-500' />
                    </>
                  ) : (
                    <>
                      Could improve with only{' '}
                      {Math.max(0, 5 - avgClicks).toFixed(1)} more clicks{' '}
                      <TrendingDown className='size-4 text-amber-500' />
                    </>
                  )}
                </div>
                <div className='text-muted-foreground leading-none'>
                  Showing click count for your top {topUrls.length} URLs
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
