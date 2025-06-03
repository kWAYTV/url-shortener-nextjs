import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';
import { magicLink } from 'better-auth/plugins';
import { haveIBeenPwned } from 'better-auth/plugins';

import { env } from '@/env';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/hash';
import { sendEmailAction } from '@/server/actions/email/send-email.action';

export const auth = betterAuth({
  baseURL: env.NEXT_PUBLIC_APP_URL,

  database: drizzleAdapter(db, {
    provider: 'pg'
  }),

  socialProviders: {
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    }
  },

  session: {
    expiresIn: 30 * 24 * 60 * 60,

    cookieCache: {
      enabled: true,
      maxAge: 5 * 60
    }
  },

  account: {
    accountLinking: {
      enabled: true
    }
  },

  rateLimit: {
    storage: 'database',
    modelName: 'ratelimit'
  },

  trustedOrigins: [
    'better-auth://',
    'http://localhost:3000',
    env.NEXT_PUBLIC_APP_URL
  ],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    requireEmailVerification: true,

    password: {
      hash: hashPassword,
      verify: verifyPassword
    },

    sendResetPassword: async ({ user, url }) => {
      await sendEmailAction({
        to: user.email,
        subject: 'Reset your password',
        html: `<p>Please click the link below to reset your password.</p><a href="${String(url)}">Reset password</a>`
      });
    }
  },

  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,

    sendVerificationEmail: async ({ user, url }) => {
      const link = new URL(url);
      link.searchParams.set('callbackURL', '/email-verified');

      await sendEmailAction({
        to: user.email,
        subject: 'Verify your email address',
        html: `<p>Please verify your email address to complete the registration process.</p><a href="${String(link)}">Verify email</a>`
      });
    }
  },

  plugins: [
    admin(),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendEmailAction({
          to: email,
          subject: 'Magic Link Login',
          html: `<p>Please click the link below to log in.</p><a href="${String(url)}">Log in</a>`
        });
      }
    }),
    haveIBeenPwned({
      customPasswordCompromisedMessage: 'Please choose a more secure password.'
    }),
    nextCookies()
  ]
});

export type Session = typeof auth.$Infer.Session;
export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN';
