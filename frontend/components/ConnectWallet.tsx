'use client';

import { useAccount, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi';
import { useWallet, useConnectModal } from '@reown/appkit';
import { Button } from './Button';
import { useEffect, useState } from 'react';

export const ConnectWallet = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { disconnect } = useDisconnect();
  const { switchNetwork } = useSwitchNetwork();
  const { openConnectModal } = useConnectModal();
  const { wallet } = useWallet();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button size="lg" disabled>
        Loading...
      </Button>
    );
  }

  if (!isConnected || !wallet) {
    return (
      <Button onClick={openConnectModal} size="lg">
        Connect Wallet
      </Button>
    );
  }

  // Check if connected to a supported network
  const isUnsupported = chain?.unsupported;
  const supportedChains = [1, 42161]; // Mainnet and Arbitrum

  if (isUnsupported && switchNetwork) {
    return (
      <Button 
        onClick={() => switchNetwork(supportedChains[0])} 
        variant="danger" 
        size="lg"
      >
        Switch Network
      </Button>
    );
  }

  // Format address
  const formatAddress = (addr: string) => {
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
  };

  return (
    <div className="flex gap-3">
      <div className="px-4 py-2 bg-white border-2 border-border rounded-lg flex items-center gap-2 font-medium">
        {chain?.name || 'Unknown Network'}
      </div>
      
      <Button 
        onClick={() => disconnect()}
        variant="outline"
      >
        {formatAddress(address || '')}
      </Button>
    </div>
  );
};
