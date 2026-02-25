import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

/**
 * Merge Tailwind CSS classes with clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format a date in the organization's timezone
 */
export function formatDateTime(date: string | Date, timezone: string = 'UTC'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    try {
        return new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            dateStyle: 'medium',
            timeStyle: 'short',
        }).format(d);
    } catch {
        return format(d, 'MMM d, yyyy h:mm a');
    }
}

/**
 * Format a time string (HH:mm) for display
 */
export function formatTime(time: string): string {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Generate a URL-safe slug from a string
 */
export function generateSlug(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Get the absolute URL for a path
 */
export function getAbsoluteUrl(path: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return `${baseUrl}${path}`;
}

/**
 * Days of the week labels
 */
export const DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
] as const;
