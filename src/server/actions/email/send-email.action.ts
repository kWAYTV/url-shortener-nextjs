'use server';

import { type CreateEmailResponseSuccess, type ErrorResponse } from 'resend';

import { env } from '@/env';
import { resend } from '@/lib/resend';

export async function sendEmailAction({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<CreateEmailResponseSuccess | ErrorResponse> {
  try {
    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to,
      subject,
      html
    });

    if (error) {
      return error;
    }

    if (!data) {
      return {
        message: 'Failed to send email',
        name: 'internal_server_error'
      } as ErrorResponse;
    }

    return data;
  } catch (error) {
    return {
      message:
        error instanceof Error ? error.message : 'Unknown error occurred',
      name: 'internal_server_error'
    } as ErrorResponse;
  }
}
