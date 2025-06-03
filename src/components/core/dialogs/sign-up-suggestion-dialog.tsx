import { Check, Copy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface SignupSuggestionDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  shortUrl: string;
}

export function SignupSuggestionDialog({
  isOpen,
  onOpenChange,
  shortUrl
}: SignupSuggestionDialogProps) {
  const router = useRouter();
  const [copiedText, copy] = useCopyToClipboard();

  const handleSignup = () => {
    onOpenChange(false);
    router.push('/sign-up');
  };

  const handleSignin = () => {
    onOpenChange(false);
    router.push('/sign-in');
  };

  const handleCopy = async () => {
    await copy(shortUrl);
    toast.success('Copied to clipboard');
  };

  const isCopied = copiedText === shortUrl;

  if (!shortUrl) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>URL Shortened Successfully</DialogTitle>
          <DialogDescription>
            Your link has been shortened and is ready to use. Want to save and
            track this link?
          </DialogDescription>
        </DialogHeader>
        <div className='flex flex-col space-y-4 py-4'>
          <div className='bg-muted rounded-md p-4'>
            <div className='flex items-center justify-between gap-2'>
              <div className='min-w-0 flex-1'>
                <p className='text-sm font-medium'>Your shortened URL</p>
                <p className='mt-1 font-mono text-sm break-all'>{shortUrl}</p>
              </div>
              <Button
                variant='ghost'
                size='icon'
                onClick={handleCopy}
                className='shrink-0 transition-all duration-200'
                disabled={isCopied}
              >
                {isCopied ? (
                  <Check className='animate-in zoom-in-50 h-4 w-4 text-green-600 duration-200' />
                ) : (
                  <Copy className='h-4 w-4' />
                )}
              </Button>
            </div>
          </div>
          <div className='space-y-2'>
            <h4 className='text-sm font-medium'>Create an account to:</h4>
            <ul className='ml-4 list-disc space-y-1 text-sm'>
              <li>Save all your shortened links</li>
              <li>Track link analytics</li>
              <li>Customize your shortened links</li>
            </ul>
          </div>
        </div>
        <DialogFooter className='flex flex-col gap-2 sm:flex-row sm:justify-between'>
          <Button
            variant='destructive'
            className='w-full sm:w-auto'
            onClick={() => onOpenChange(false)}
          >
            Maybe Later
          </Button>
          <div className='flex flex-col gap-2 sm:flex-row'>
            <Button
              variant='outline'
              className='w-full sm:w-auto'
              onClick={handleSignin}
            >
              Log In
            </Button>
            <Button className='w-full sm:w-auto' onClick={handleSignup}>
              Sign Up
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
