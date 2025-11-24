import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';
import { createConfig, http } from 'wagmi';
import { mainnet, arbitrum } from 'viem/chains';

// Get projectId from Reown Dashboard
export const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

if (!projectId) {
  throw new Error('Project ID is not defined');
}

export const networks = [mainnet, arbitrum];

// Create a custom storage implementation
const createStorage = () => {
  return {
    getItem: (key: string) => {
      if (typeof window === 'undefined') return null;
      return localStorage.getItem(key);
    },
    setItem: (key: string, value: string) => {
      if (typeof window === 'undefined') return;
      localStorage.setItem(key, value);
    },
    removeItem: (key: string) => {
      if (typeof window === 'undefined') return;
      localStorage.removeItem(key);
    },
  };
};

// Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: {
    key: 'wagmi',
    storage: createStorage(),
  },
  ssr: true,
  projectId,
  chains: networks,
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
  },
  batch: { multicall: true },
  pollingInterval: 10_000,
});