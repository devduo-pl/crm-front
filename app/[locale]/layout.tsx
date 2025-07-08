import { generateStaticParams as generateI18nStaticParams } from "@/lib/i18n-utils";

export function generateStaticParams() {
  return generateI18nStaticParams();
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params to satisfy Next.js 15 requirements
  const { locale } = await params; // eslint-disable-line @typescript-eslint/no-unused-vars

  // Locale layout is now just a passthrough since
  // IntlProvider is handled at the root level
  return <>{children}</>;
}
