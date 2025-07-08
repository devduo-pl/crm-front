import { locales, type Locale } from "@/i18n";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

export function getLocaleFromUrl(url: string): Locale | null {
  const match = url.match(/^\/([a-z]{2})\//);
  const locale = match?.[1];
  return locale && isValidLocale(locale) ? locale : null;
}
