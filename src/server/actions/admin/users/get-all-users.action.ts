'use server';

import { getSession } from '@/lib/auth-utils';
import { db } from '@/lib/db';
import { type ApiResponse } from '@/types/api';

export type UserWithoutPassword = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  image: string | null;
};

type GetAllUsersOptions = {
  page?: number;
  limit?: number;
  sortBy?: 'name' | 'email' | 'role' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  search?: string;
};

export async function getAllUsersAction(
  options: GetAllUsersOptions = {}
): Promise<ApiResponse<{ users: UserWithoutPassword[]; total: number }>> {
  try {
    const session = await getSession();

    if (!session?.user) {
      return { success: false, error: 'Not authenticated' };
    }

    if (session.user.role !== 'admin') {
      return { success: false, error: 'Not authorized' };
    }

    const {
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      search = ''
    } = options;

    const offset = (page - 1) * limit;

    let allUsers = await db.query.user.findMany({
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        image: true,
        emailVerified: false,
        updatedAt: false
      }
    });

    if (search) {
      const searchLower = search.toLowerCase();
      allUsers = allUsers.filter(
        user =>
          user.email?.toLowerCase().includes(searchLower) ||
          user.name?.toLowerCase().includes(searchLower)
      );
    }

    const total = allUsers.length;

    if (sortBy && sortOrder) {
      allUsers.sort((a, b) => {
        let valueA: string | Date = a[sortBy];
        let valueB: string | Date = b[sortBy];

        if (valueA === null) valueA = '';
        if (valueB === null) valueB = '';

        if (sortOrder === 'asc') {
          return valueA < valueB ? -1 : valueA > valueB ? 1 : 0;
        } else {
          return valueA > valueB ? -1 : valueA < valueB ? 1 : 0;
        }
      });
    }

    const paginatedUsers = allUsers.slice(offset, offset + limit);

    return {
      success: true,
      data: {
        users: paginatedUsers,
        total
      }
    };
  } catch (error) {
    console.error('Error getting all users', error);
    return { success: false, error: 'Error getting all users' };
  }
}
