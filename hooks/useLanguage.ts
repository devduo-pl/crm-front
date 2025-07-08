"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { locales, type Locale, defaultLocale } from "@/i18n";

export function useLanguage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Remove current locale from pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, "") || "/";

    // Create new path with new locale
    const newPath =
      newLocale === defaultLocale
        ? pathWithoutLocale === "/"
          ? "/"
          : pathWithoutLocale
        : `/${newLocale}${pathWithoutLocale}`;

    router.push(newPath);
  };

  const switchToEnglish = () => switchLanguage("en");
  const switchToPolish = () => switchLanguage("pl");

  return {
    currentLocale: locale,
    availableLocales: locales,
    switchLanguage,
    switchToEnglish,
    switchToPolish,
    isEnglish: locale === "en",
    isPolish: locale === "pl",
  };
}
