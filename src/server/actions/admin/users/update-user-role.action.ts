'use server';

import { revalidatePath } from 'next/cache';

import { getSession } from '@/lib/auth-utils';
import { db, eq } from '@/lib/db';
import { user, userRoles } from '@/schemas/db.schema';
import { type ApiResponse } from '@/types/api';

export async function updateUserRoleAction(
  userId: string,
  role: 'user' | 'admin'
): Promise<ApiResponse<null>> {
  try {
    // Verify authentication and admin role
    const session = await getSession();

    if (!session?.user) {
      return {
        success: false,
        error: 'Unauthorized'
      };
    }

    if (session.user.role !== 'admin') {
      return {
        success: false,
        error: 'Insufficient permissions'
      };
    }

    // Prevent changing own role
    if (session.user.id === userId) {
      return {
        success: false,
        error: 'You cannot change your own role'
      };
    }

    if (!userRoles.enumValues.includes(role)) {
      return {
        success: false,
        error: 'Invalid role'
      };
    }

    const userToUpdate = await db.query.user.findFirst({
      where: (user, { eq }) => eq(user.id, userId)
    });

    if (!userToUpdate) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    await db
      .update(user)
      .set({
        role,
        updatedAt: new Date()
      })
      .where(eq(user.id, userId));

    revalidatePath('/admin/users');

    return {
      success: true,
      data: null
    };
  } catch (error) {
    console.error('Error updating user role:', error);
    return {
      success: false,
      error: 'An error occurred while updating user'
    };
  }
}
