import "@/styles/globals.css";
import { ThemeScript } from "@/components/ThemeScript";
import { Providers } from "@/providers/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <head>
        <ThemeScript />
      </head>
      <body suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
