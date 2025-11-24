'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { config, wagmiAdapter } from '@/lib/config/reown';
import { UserProvider } from '@/lib/contexts/UserContext';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import { useState, useEffect } from 'react';
import { AppKitProvider } from '@reown/appkit';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render anything until we're on the client
  if (!mounted) {
    return null;
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppKitProvider adapter={wagmiAdapter}>
          <UserProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </UserProvider>
        </AppKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
