'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config, wagmiAdapter } from '@/lib/config/reown';
import { UserProvider } from '@/lib/contexts/UserContext';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import { PropsWithChildren, useEffect, useState } from 'react';
import { createAppKit } from '@reown/appkit/react';

// Create a QueryClient instance
const queryClient = new QueryClient();

export function Providers({ children }: PropsWithChildren) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </UserProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}