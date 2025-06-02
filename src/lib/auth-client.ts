import { adminClient } from 'better-auth/client/plugins';
import { magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  plugins: [adminClient(), magicLinkClient()]
});

export const {
  signIn,
  signOut,
  signUp,
  useSession,
  forgetPassword,
  resetPassword,
  sendVerificationEmail
} = authClient;
