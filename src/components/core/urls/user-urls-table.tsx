/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { formatDistanceToNow } from 'date-fns';
import { Copy, Edit, ExternalLink, QrCode, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { env } from '@/env';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { deleteUrl } from '@/server/actions/urls/delete-url.action';
import { type Url } from '@/types/url';

interface UserUrlsTableProps {
  urls: Url[];
}

export default function UserUrlsTable({ urls }: UserUrlsTableProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [localUrls, setLocalUrls] = useState<Url[]>(urls);
  const [copied, copy] = useCopyToClipboard();

  const handleDelete = async (id: number) => {
    setIsDeleting(id);

    try {
      const response = await deleteUrl(id);
      if (response.success) {
        setLocalUrls(prev => prev.filter(url => url.id !== id));
        toast.success('URL deleted successfully', {
          description: 'The URL has been deleted successfully'
        });
      } else {
        toast.error('Failed to delete URL', {
          description: response.error || 'An error occurred'
        });
      }
    } catch (error) {
      console.error('Failed to delete URL', error);
      toast.error('Failed to delete URL', {
        description: 'An error occurred'
      });
    } finally {
      setIsDeleting(null);
    }
  };

  const handleCopy = async (text: string) => {
    const success = await copy(text);
    if (success) {
      toast.success('Copied to clipboard');
    }
  };

  return (
    <>
      <table className='w-full'>
        <thead>
          <tr className='border-b'>
            <th className='px-4 py-3 text-left font-medium'>Original URL</th>
            <th className='px-4 py-3 text-left font-medium'>Short URL</th>
            <th className='px-4 py-3 text-left font-medium'>Clicks</th>
            <th className='px-4 py-3 text-left font-medium'>Created At</th>
            <th className='px-4 py-3 text-left font-medium'>Actions</th>
          </tr>
        </thead>
        <tbody>
          {localUrls.map(url => {
            const baseUrl =
              env.NEXT_PUBLIC_APP_URL ||
              (typeof window !== 'undefined' ? window.location.origin : '');
            const shortUrl = `${baseUrl}/r/${url.shortCode}`;

            return (
              <tr key={url.id} className='hover:bg-muted/50 border-b'>
                <td className='px-4 py-3'>
                  <div className='flex items-center'>
                    <div className='max-w-xs truncate' title={url.originalUrl}>
                      {url.originalUrl}
                    </div>
                    <a
                      href={url.originalUrl}
                      target='_blank'
                      className='text-muted-foreground hover:text-foreground ml-2'
                    >
                      <ExternalLink className='size-4' />
                    </a>
                  </div>
                </td>
                <td className='px-4 py-3'>
                  <div className='flex items-center'>
                    <div className='truncate' title={shortUrl}>
                      {shortUrl}
                    </div>
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      onClick={() => handleCopy(shortUrl)}
                      className='ml-2 size-8'
                    >
                      <Copy className='size-4' />
                    </Button>
                  </div>
                </td>
                <td className='text-muted-foreground px-4 py-3'>
                  {url.clicks}
                </td>
                <td className='text-muted-foreground px-4 py-3'>
                  {formatDistanceToNow(new Date(url.createdAt), {
                    addSuffix: true
                  })}
                </td>
                <td className='px-4 py-3 text-right'>
                  <div className='flex justify-end'>
                    {/* <Button
                      variant={'ghost'}
                      size={'icon'}
                      onClick={() => showQrCode(url.shortCode)}
                      className='text-primary hover:text-primary size-8'
                    >
                      <QrCode className='size-4' />
                    </Button>
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      onClick={() => handleEdit(url.id, url.shortCode)}
                      className='text-primary hover:text-primary size-8'
                    >
                      <Edit className='size-4' />
                    </Button> */}
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      onClick={() => handleDelete(url.id)}
                      disabled={isDeleting === url.id}
                      className='text-destructive hover:text-destructive size-8'
                    >
                      {isDeleting === url.id ? (
                        <div className='size-4 animate-spin rounded-full border-2 border-current border-t-transparent' />
                      ) : (
                        <Trash2Icon className='size-4' />
                      )}
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
