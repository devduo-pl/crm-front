import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['pl', 'en'],

  // Used when no locale matches
  defaultLocale: 'pl',
  
  // Use locale prefix for paths when needed
  localePrefix: 'as-needed'
});

// Export for use in middleware
export const locales = ['pl', 'en'] as const;
export const defaultLocale = 'pl' as const;

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);

