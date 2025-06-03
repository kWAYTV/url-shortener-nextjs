import { adminClient } from 'better-auth/client/plugins';
import { magicLinkClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
import { toast } from 'sonner';

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,

  fetchOptions: {
    onError: async context => {
      const { response } = context;

      if (response.status === 429) {
        const retryAfter = response.headers.get('X-Retry-After');
        toast.error(`Please try again after ${retryAfter} seconds.`);
      }
    }
  },

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
