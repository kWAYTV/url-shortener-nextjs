'use client';

import { formatDistanceToNow } from 'date-fns';
import { Copy, Edit, ExternalLink, QrCode, Trash2Icon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { EditUrlModal } from '@/components/core/modals/edit-url-modal';
import { QRCodeModal } from '@/components/core/modals/qr-code-modal';
import { Button } from '@/components/ui/button';
import { env } from '@/env';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';
import { deleteUrlAction } from '@/server/actions/urls/delete-url.action';
import { type Url } from '@/types/url';

interface UserUrlsTableProps {
  urls: Url[];
}

interface EditUrlState {
  id: number;
  shortCode: string;
}

// Helper function to get base URL
const getBaseUrl = () => {
  return (
    env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== 'undefined' ? window.location.origin : '')
  );
};

// Helper function to create short URL
const createShortUrl = (shortCode: string) => {
  return `${getBaseUrl()}/r/${shortCode}`;
};

export default function UserUrlsTable({ urls }: UserUrlsTableProps) {
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [localUrls, setLocalUrls] = useState<Url[]>(urls);
  const [, copy] = useCopyToClipboard();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [qrCodeShortCode, setQrCodeShortCode] = useState<string>('');
  const [isQrCodeModalOpen, setIsQrCodeModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState<EditUrlState | null>(null);

  const handleDelete = async (id: number) => {
    setIsDeleting(id);

    try {
      const response = await deleteUrlAction(id);

      if (response.success) {
        setLocalUrls(prev => prev.filter(url => url.id !== id));
        toast.success('URL deleted successfully');
      } else {
        toast.error(response.error || 'Failed to delete URL');
      }
    } catch {
      toast.error('Failed to delete URL');
    } finally {
      setIsDeleting(null);
    }
  };

  const showQrCode = (shortCode: string) => {
    const shortUrl = createShortUrl(shortCode);
    setQrCodeUrl(shortUrl);
    setQrCodeShortCode(shortCode);
    setIsQrCodeModalOpen(true);
  };

  const closeQrModal = () => {
    setIsQrCodeModalOpen(false);
    setQrCodeUrl('');
    setQrCodeShortCode('');
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setUrlToEdit(null);
  };

  const handleCopy = async (text: string) => {
    const success = await copy(text);
    if (success) {
      toast.success('Copied to clipboard');
    } else {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleEdit = (id: number, shortCode: string) => {
    setUrlToEdit({ id, shortCode });
    setIsEditModalOpen(true);
  };

  const handleEditSuccess = (newShortCode: string) => {
    if (!urlToEdit) return;

    setLocalUrls(prev =>
      prev.map(url =>
        url.id === urlToEdit.id ? { ...url, shortCode: newShortCode } : url
      )
    );

    closeEditModal();
  };

  // Memoize URL data with short URLs to avoid recalculation
  const urlsWithShortUrls = useMemo(() => {
    return localUrls.map(url => ({
      ...url,
      shortUrl: createShortUrl(url.shortCode)
    }));
  }, [localUrls]);

  if (localUrls.length === 0) {
    return (
      <div className='py-8 text-center'>
        <p className='text-muted-foreground'>
          You haven&apos;t created any short URLs yet. Create your first short
          URL above.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className='overflow-x-auto'>
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
            {urlsWithShortUrls.map(url => (
              <tr key={url.id} className='hover:bg-muted/50 border-b'>
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-2'>
                    <div className='max-w-xs truncate' title={url.originalUrl}>
                      {url.originalUrl}
                    </div>
                    <a
                      href={url.originalUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-muted-foreground hover:text-foreground'
                      aria-label='Open original URL'
                    >
                      <ExternalLink className='size-4' />
                    </a>
                  </div>
                </td>
                <td className='px-4 py-3'>
                  <div className='flex items-center gap-2'>
                    <div className='truncate' title={url.shortUrl}>
                      {url.shortUrl}
                    </div>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleCopy(url.shortUrl)}
                      className='size-8'
                      aria-label='Copy short URL'
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
                <td className='px-4 py-3'>
                  <div className='flex justify-end gap-1'>
                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => showQrCode(url.shortCode)}
                      className='text-primary hover:text-primary size-8'
                      aria-label='Generate QR code'
                    >
                      <QrCode className='size-4' />
                    </Button>

                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleEdit(url.id, url.shortCode)}
                      className='text-primary hover:text-primary size-8'
                      aria-label='Edit URL'
                    >
                      <Edit className='size-4' />
                    </Button>

                    <Button
                      variant='ghost'
                      size='icon'
                      onClick={() => handleDelete(url.id)}
                      disabled={isDeleting === url.id}
                      className='text-destructive hover:text-destructive size-8'
                      aria-label='Delete URL'
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
            ))}
          </tbody>
        </table>
      </div>

      <QRCodeModal
        isOpen={isQrCodeModalOpen}
        url={qrCodeUrl}
        shortCode={qrCodeShortCode}
        onClose={closeQrModal}
      />

      {urlToEdit && (
        <EditUrlModal
          isOpen={isEditModalOpen}
          onOpenChange={closeEditModal}
          urlId={urlToEdit.id}
          currentShortCode={urlToEdit.shortCode}
          onSuccess={handleEditSuccess}
        />
      )}
    </>
  );
}
