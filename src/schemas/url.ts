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

export const deleteUrlSchema = z.object({
  urlId: z.number()
});

export const editUrlSchema = z.object({
  customCode: z
    .string()
    .min(3, 'Custom code must be at least 3 characters')
    .max(255, 'Custom code must be less than 255 characters')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Custom code must be alphanumeric or hyphen')
});

export type UrlSchemaType = z.infer<typeof urlSchema>;
export type ShortenUrlSchemaType = z.infer<typeof shortenUrlSchema>;
export type DeleteUrlSchemaType = z.infer<typeof deleteUrlSchema>;
export type EditUrlFormData = z.infer<typeof editUrlSchema>;
