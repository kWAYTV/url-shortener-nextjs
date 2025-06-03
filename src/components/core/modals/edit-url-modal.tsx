import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { type EditUrlFormData, editUrlSchema } from '@/schemas/url.schema';
import { updateUrlAction } from '@/server/actions/urls/update-url.action';

interface EditUrlModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  urlId: number;
  currentShortCode: string;
  onSuccess: (newShortCode: string) => void;
}

export function EditUrlModal({
  isOpen,
  onOpenChange,
  urlId,
  currentShortCode,
  onSuccess
}: EditUrlModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

  const form = useForm<EditUrlFormData>({
    resolver: zodResolver(editUrlSchema),
    defaultValues: {
      customCode: currentShortCode
    }
  });

  useEffect(
    () => form.reset({ customCode: currentShortCode }),
    [currentShortCode, form]
  );

  const onSubmit = async (data: EditUrlFormData) => {
    setIsLoading(true);

    try {
      const response = await updateUrlAction({
        id: urlId,
        customCode: data.customCode
      });

      if (response.success && response.data) {
        toast.success('URL updated successfully');
        onSuccess(data.customCode);
        onOpenChange(false);
      } else {
        toast.error(response.error || 'Failed to update URL');
      }
    } catch {
      toast.error('Failed to update URL');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle>Edit Short URL</DialogTitle>
          <DialogDescription>
            Customize the short code for this URL. The short code must be unique
            and can only contain letters, numbers, hyphens, and underscores.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='customCode'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='flex items-center'>
                      <span className='text-muted-foreground mr-2 text-sm'>
                        {baseUrl}/r/
                      </span>
                      <Input
                        placeholder='Custom code'
                        {...field}
                        disabled={isLoading}
                        className='flex-1'
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className='sm:justify-end'>
              <Button
                type='button'
                variant='outline'
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                <X className='size-4' />
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 size-4 animate-spin' />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className='size-4' />
                    Save Changes
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
