"use client";

import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { defaultLocale, type Locale, locales } from "@/i18n";

interface IntlProviderProps {
  children: ReactNode;
}

export function IntlProvider({ children }: IntlProviderProps) {
  const pathname = usePathname();
  const [messages, setMessages] = useState<Record<string, string> | null>(null);
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  useEffect(() => {
    // Extract locale from pathname
    const pathLocale = pathname.split("/")[1] as Locale;
    const currentLocale = locales.includes(pathLocale)
      ? pathLocale
      : defaultLocale;

    setLocale(currentLocale);

    // Load messages for the current locale
    const loadMessages = async () => {
      try {
        const messages = await import(`../locales/${currentLocale}.json`);
        setMessages(messages.default);
      } catch (error) {
        console.error("Failed to load messages:", error);
        // Fallback to default locale messages
        if (currentLocale !== defaultLocale) {
          const fallbackMessages = await import(
            `../locales/${defaultLocale}.json`
          );
          setMessages(fallbackMessages.default);
        }
      }
    };

    loadMessages();
  }, [pathname]);

  // Don't render until messages are loaded
  if (!messages) {
    return <div>Loading...</div>;
  }

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      {children}
    </NextIntlClientProvider>
  );
}
