import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Адамант",
  description:
    "Строительство загородных домов под ключ в Санкт-Петербурге и Ленинградской области.",
  icons: {
    icon: "/logo-new.PNG",
    shortcut: "/logo-new.PNG",
    apple: "/logo-new.PNG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
