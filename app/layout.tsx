import { AppShell, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import Header from "@/components/Header";
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers/provider';
import { Metadata } from 'next';
import {CartModal} from "@/components/Modals/CartModal";
import dynamic from 'next/dynamic';

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'My App',
  description: 'My App Description',
};


export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning className={inter.variable}>
    <head>
      <ColorSchemeScript forceColorScheme="dark"/>
      <style>{`
          :root[data-mantine-color-scheme="dark"] {
            --mantine-color-body: #000 !important;
          }
        `}</style>
    </head>
    <body>
    <Providers>
      <AppShell
        header={{ height: 60 }}
        padding={0}
      >
        <Header height={60} />
        <div style={{ paddingTop: '60px' }}>
          {children}
          <CartModal />
        </div>
      </AppShell>
    </Providers>
    </body>
    </html>
  );
}
