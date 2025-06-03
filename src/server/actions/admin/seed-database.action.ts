'use server';

import { revalidatePath } from 'next/cache';

import { getSession } from '@/lib/auth-utils';
import { seed } from '@/server/db/seed';
import { type ApiResponse } from '@/types/api';

/**
 * Server action to seed the database with test data
 * This should only be used in development
 */
export async function seedDatabaseAction(): Promise<ApiResponse<null>> {
  try {
    // Only allow in development environment
    if (process.env.NODE_ENV !== 'development') {
      return {
        success: false,
        error: 'This action is only available in development mode'
      };
    }

    // Check if user is authenticated and has admin privileges
    const session = await getSession();
    if (!session?.user) {
      return {
        success: false,
        error: 'You must be logged in to perform this action'
      };
    }

    // Check if user has admin role
    if (session.user.role !== 'admin') {
      return {
        success: false,
        error: 'You must have admin privileges to perform this action'
      };
    }

    // Run the seed function
    const result = await seed();

    if (!result.success) {
      return {
        success: false,
        error: 'Failed to seed database'
      };
    }

    // Revalidate all pages that might display the seeded data
    revalidatePath('/');
    revalidatePath('/dashboard');

    return {
      success: true,
      data: null
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      error: 'An unexpected error occurred'
    };
  }
}
