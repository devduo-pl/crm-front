// Re-export routing configuration for easier imports
export { locales, defaultLocale, routing } from "./routing";

// Type for supported locales - derived from the locales array
export type Locale = (typeof locales)[number];

