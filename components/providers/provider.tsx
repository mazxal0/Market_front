'use client';

import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { ReactNode } from 'react';
import {AuthProvider} from "@/components/providers/AuthProvider";
import QueryProvider from "@/components/providers/QuertProvider";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <MantineProvider
      forceColorScheme="dark"
      theme={{
        fontFamily: 'var(--font-inter), sans-serif',
        headings: {
          fontFamily: 'var(--font-inter), sans-serif',
        },
      }}
    >
      <ModalsProvider>
        <AuthProvider/>
          <QueryProvider>
            {children}
          </QueryProvider>

      </ModalsProvider>
    </MantineProvider>
  );
}
