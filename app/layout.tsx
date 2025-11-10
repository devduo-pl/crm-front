import "@/styles/globals.css";
import { Providers } from "@/providers/Providers";
import { ThemeScript } from "@/components/ThemeScript";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
