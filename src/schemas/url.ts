import { z } from 'zod';

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

export type UrlSchemaType = z.infer<typeof urlSchema>;
