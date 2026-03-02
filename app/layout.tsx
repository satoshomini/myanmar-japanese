import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "မြန်မာ Japanese",
  description: "ミャンマー人のための日本語学習アプリ",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#030712" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-gray-950 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
