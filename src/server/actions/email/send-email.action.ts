'use server';

import { env } from '@/env';
import { resend } from '@/lib/resend';
import { type ApiResponse } from '@/types/api';

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

interface SendEmailResult {
  id: string;
  message?: string;
}

export async function sendEmailAction({
  to,
  subject,
  html
}: SendEmailParams): Promise<ApiResponse<SendEmailResult>> {
  try {
    // Input validation
    if (!to || typeof to !== 'string' || !to.includes('@')) {
      return {
        success: false,
        error: 'Invalid email address'
      };
    }

    if (
      !subject ||
      typeof subject !== 'string' ||
      subject.trim().length === 0
    ) {
      return {
        success: false,
        error: 'Subject is required'
      };
    }

    if (!html || typeof html !== 'string' || html.trim().length === 0) {
      return {
        success: false,
        error: 'Email content is required'
      };
    }

    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM_EMAIL,
      to: to.trim(),
      subject: subject.trim(),
      html
    });

    if (error) {
      return {
        success: false,
        error: error.message || 'Failed to send email'
      };
    }

    if (!data?.id) {
      return {
        success: false,
        error: 'Email was sent but no confirmation received'
      };
    }

    return {
      success: true,
      data: {
        id: data.id,
        message: 'Email sent successfully'
      }
    };
  } catch {
    return {
      success: false,
      error: 'Failed to send email'
    };
  }
}
