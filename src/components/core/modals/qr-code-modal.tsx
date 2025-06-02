'use client';

import { Download } from 'lucide-react';
import Image from 'next/image';
import QRCode from 'qrcode';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';

interface QRCodeModalProps {
  isOpen: boolean;
  url: string;
  shortCode: string;
  onClose?: () => void;
}

export function QRCodeModal({
  isOpen,
  url,
  shortCode,
  onClose
}: QRCodeModalProps) {
  const [open, setOpen] = useState(isOpen);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen && onClose) {
      onClose();
    }
  };

  const generateQRCode = useCallback(async () => {
    if (!url) return;

    setIsGenerating(true);

    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#ffffff'
        }
      });

      setQrCodeDataUrl(dataUrl);
    } catch {
      toast.error('Failed to generate QR code');
    } finally {
      setIsGenerating(false);
    }
  }, [url]);

  useEffect(() => {
    if (isOpen && url) {
      generateQRCode();
    }
  }, [isOpen, url, generateQRCode]);

  const downloadQRCode = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement('a');
    link.href = qrCodeDataUrl;
    link.download = `shortlink-${shortCode}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('QR code downloaded');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>QR Code for your Short URL</DialogTitle>
        </DialogHeader>
        <div className='flex flex-col items-center justify-center p-4'>
          {isGenerating ? (
            <div className='flex h-[300px] w-[300px] items-center justify-center'>
              <div className='border-primary size-8 animate-spin rounded-full border-4 border-t border-t-transparent' />
            </div>
          ) : qrCodeDataUrl ? (
            <div className='flex flex-col items-center space-y-4'>
              <Image
                src={qrCodeDataUrl}
                alt='QR code'
                width={300}
                height={300}
                className='rounded-md border'
                unoptimized
              />
              <p className='text-muted-foreground text-center text-sm'>
                Scan the QR code to open the link in your device&apos;s browser.
              </p>
              <Button onClick={downloadQRCode} className='w-full'>
                <Download className='mr-2 size-4' />
                Download QR Code
              </Button>
            </div>
          ) : (
            <div className='text-muted-foreground text-center'>
              Failed to generate QR code
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
