// Use Mezo Passport's getConfig instead of RainbowKit's getDefaultConfig
// This enables Bitcoin wallet support (Unisat, Xverse, OKX) alongside EVM wallets
import { getConfig } from '@mezo-org/passport';
import { mezoTestnet } from './chains';

export const wagmiConfig = getConfig({
  appName: 'BitSave',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  chains: [mezoTestnet],
  ssr: true,
});
