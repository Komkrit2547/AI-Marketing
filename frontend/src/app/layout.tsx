'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Kanit } from 'next/font/google';
import './globals.css';

const kanit = Kanit({
  variable: '--font-kanit',
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700', '900'],
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en" className={kanit.className}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
      </head>
      <body className={kanit.className}>
        <QueryClientProvider client={queryClient}>
          <DashboardLayout>{children}</DashboardLayout>
        </QueryClientProvider>
      </body>
    </html>
  );
}
