'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { UserProvider } from '@/lib/contexts/UserContext';
import { ToastProvider } from '@/lib/contexts/ToastContext';
import { useState } from 'react';
import { wagmiConfig, mezoTestnet } from '@/lib/config/wagmi';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          initialChain={mezoTestnet}
          theme={darkTheme({
            accentColor: '#FF8C00', // BitSave Bitcoin Orange
            accentColorForeground: 'white',
            borderRadius: 'medium',
          })}
        >
          <UserProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </UserProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
