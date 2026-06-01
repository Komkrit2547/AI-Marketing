'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <DashboardLayout>{children}</DashboardLayout>
        </QueryClientProvider>
      </body>
    </html>
  );
}
