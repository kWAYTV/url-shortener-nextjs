import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';

import { env } from '@/env';
import { db } from '@/lib/db';
import { hashPassword, verifyPassword } from '@/lib/hash';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg'
  }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: false,
    requireEmailVerification: true,

    password: {
      hash: hashPassword,
      verify: verifyPassword
    }
  },

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
      enabled: false
    }
  },

  plugins: [admin(), nextCookies()]
});

export type Session = typeof auth.$Infer.Session;
export type ErrorCode = keyof typeof auth.$ERROR_CODES | 'UNKNOWN';
