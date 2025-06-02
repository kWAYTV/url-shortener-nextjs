import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;

  try {
    const urlObj = new URL(url);
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

export function ensureHttps(url: string): string {
  if (!url || typeof url !== 'string') return url;

  const trimmedUrl = url.trim();

  // Already has https
  if (trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // Convert http to https
  if (trimmedUrl.startsWith('http://')) {
    return trimmedUrl.replace('http://', 'https://');
  }

  // Add https prefix
  return `https://${trimmedUrl}`;
}
