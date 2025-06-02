import { type ApiResponse } from '@/types/api';

/**
 * Create a standardized unauthorized response
 */
export function createUnauthorizedResponse(): ApiResponse<never> {
  return {
    success: false,
    error: 'You must be logged in to perform this action'
  };
}

/**
 * Create a standardized validation error response
 */
export function createValidationErrorResponse(
  message: string
): ApiResponse<never> {
  return {
    success: false,
    error: message
  };
}

/**
 * Create a standardized server error response
 */
export function createServerErrorResponse(
  message = 'An unexpected error occurred. Please try again.'
): ApiResponse<never> {
  return {
    success: false,
    error: message
  };
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data
  };
}

/**
 * Get base URL for generating short URLs
 */
export function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}

/**
 * Validate user ownership of a resource
 */
export function validateUserOwnership(
  resourceUserId: string | null,
  currentUserId: string
): boolean {
  return resourceUserId === currentUserId;
}

/**
 * Handle async action with standardized error handling
 */
export async function handleAsyncAction<T>(
  action: () => Promise<T>,
  errorMessage?: string
): Promise<ApiResponse<T>> {
  try {
    const result = await action();
    return createSuccessResponse(result);
  } catch {
    return createServerErrorResponse(
      errorMessage || 'An unexpected error occurred'
    );
  }
}
