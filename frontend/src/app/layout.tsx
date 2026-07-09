'use client';

import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from '@tanstack/react-query';
import { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Kanit } from 'next/font/google';
import './globals.css';

const kanit = Kanit({
  variable: '--font-kanit',
  subsets: ['thai', 'latin'],
  weight: ['400', '500', '600', '700', '900'],
});

function GlobalErrorFallback({ error, resetErrorBoundary }: { error: any; resetErrorBoundary: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-gray-900 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-red-100 text-center">
        <span className="material-symbols-outlined text-6xl text-red-500 mb-4">error</span>
        <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6 text-sm">{error.message || 'An unexpected error occurred in the application.'}</p>
        <button 
          onClick={resetErrorBoundary}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        console.error('Global Query Error:', error);
        // Here you could trigger a global toast notification
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        console.error('Global Mutation Error:', error);
        // Here you could trigger a global toast notification
      },
    }),
    defaultOptions: {
      queries: {
        retry: 2, // Automatically retry failed requests twice
        staleTime: 1000 * 60 * 5, // 5 minutes cache
        refetchOnWindowFocus: false, // Prevent excessive refetching
      },
    },
  }));

  return (
    <html lang="en" className={kanit.className}>
      <head>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" />
      </head>
      <body className={kanit.className}>
        <ErrorBoundary FallbackComponent={GlobalErrorFallback}>
          <QueryClientProvider client={queryClient}>
            <DashboardLayout>{children}</DashboardLayout>
          </QueryClientProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
