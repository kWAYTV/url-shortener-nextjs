'use client';

import { Check, Copy } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface Url {
  id: number;
  originalUrl: string;
  shortCode: string;
  createdAt: Date;
  clicks: number;
}

interface TopUrlsListProps {
  topUrls: Url[];
}

export default function TopUrlsList({ topUrls }: TopUrlsListProps) {
  const [, copy] = useCopyToClipboard();
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = async (url: Url) => {
    const shortUrl = `${window.location.origin}/r/${url.shortCode}`;
    const success = await copy(shortUrl);
    if (success) {
      setCopiedId(url.id);
      toast.success('Short URL copied to clipboard');
    }
  };

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copiedId) {
      const timer = setTimeout(() => {
        setCopiedId(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedId]);

  return (
    <Card className='shadow-sm'>
      <CardHeader>
        <CardTitle>Top Performing URLs</CardTitle>
        <CardDescription>Your most clicked short links</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          {topUrls.length > 0 ? (
            topUrls.map((url, index) => (
              <div
                key={url.id}
                className='flex items-center justify-between rounded-lg border p-3'
              >
                <div className='flex items-center space-x-3'>
                  <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium'>
                    {index + 1}
                  </div>
                  <div className='flex-1'>
                    <div className='flex items-center gap-2'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => handleCopy(url)}
                            className='group hover:text-primary flex items-center gap-2 text-sm font-medium transition-colors'
                          >
                            <span>{url.shortCode}</span>
                            {copiedId === url.id ? (
                              <Check className='size-3 text-green-500' />
                            ) : (
                              <Copy className='size-3 opacity-0 transition-opacity group-hover:opacity-100' />
                            )}
                          </button>
                        </TooltipTrigger>
                        <TooltipContent>
                          {copiedId === url.id
                            ? 'Copied!'
                            : 'Click to copy short URL'}
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <p className='text-muted-foreground max-w-[300px] cursor-help truncate text-xs'>
                          {url.originalUrl}
                        </p>
                      </TooltipTrigger>
                      <TooltipContent side='bottom' className='max-w-[400px]'>
                        <p className='break-all'>{url.originalUrl}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-bold'>{url.clicks}</p>
                  <p className='text-muted-foreground text-xs'>clicks</p>
                </div>
              </div>
            ))
          ) : (
            <p className='text-muted-foreground py-4 text-center'>
              No URLs created yet
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
