import type { Metadata } from 'next';

import '../styles/globals.css';

import { geistMono, geistSans } from '@/assets/fonts';

export const metadata: Metadata = {
  title: 'L E A',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
