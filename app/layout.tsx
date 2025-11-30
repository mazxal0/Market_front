import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import '@mantine/core/styles.css';
import Header from "@/components/Header";

export const metadata = {
  title: 'My App',
  description: 'My App Description',
};

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
    <head>
      <ColorSchemeScript forceColorScheme="dark" />
    </head>
    <body>
    <MantineProvider forceColorScheme="dark">
      <Header/>
      {children}
    </MantineProvider>
    </body>
    </html>
  );
}
