"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { locales, type Locale } from "@/i18n";

export function useLanguage() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Use the i18n-aware router which handles locale prefixes automatically
    router.replace(pathname, { locale: newLocale });
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
