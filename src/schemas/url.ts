import { z } from 'zod';

import { isValidUrl } from '@/lib/url-utils';

export const urlSchema = z.object({
  url: z.string().min(1, 'URL is required'),
  customCode: z
    .string()
    .max(20, 'Custom code must be less than 255 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Custom code must be alphanumeric or hyphen')
    .optional()
    .or(z.literal(''))
    .transform(val => (val === '' ? undefined : val))
});

export const shortenUrlSchema = z.object({
  url: z.string().refine(isValidUrl, {
    message: 'Please enter a valid URL'
  })
});

export type UrlSchemaType = z.infer<typeof urlSchema>;
