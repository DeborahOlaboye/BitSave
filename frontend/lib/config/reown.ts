import { createConfig, http } from 'wagmi';
import { mainnet, arbitrum } from 'viem/chains';
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
  throw new Error('Project ID is not defined. Please set NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID in your .env.local file');
}

// Create Wagmi config
const wagmiConfig = createConfig({
  chains: [mainnet, arbitrum],
  transports: {
    [mainnet.id]: http(),
    [arbitrum.id]: http(),
  },
});

// Create Wagmi adapter for Reown
export const wagmiAdapter = new WagmiAdapter({
  wagmiConfig,
  projectId,
  ssr: true,
});

export const config = {
  adapters: [wagmiAdapter],
  projectId,
  chains: [mainnet, arbitrum],
  metadata: {
    name: 'BitSave',
    description: 'BitSave - Save and earn with Bitcoin',
    url: typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000',
    icons: ['/logo.png']
  }
};