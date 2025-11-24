'use client';

import { useAccount, useDisconnect } from 'wagmi';
import { Button } from './Button';
import { useEffect, useState } from 'react';

export const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
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

  if (!isConnected) {
    return <appkit-button />;
  }

  if (!isConnected || !isReownConnected) {
    return (
      <Button 
        onClick={() => connect()} 
        size="lg"
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : 'Connect Wallet'}
      </Button>
    );
  }

  // Format address
  const formatAddress = (addr: string) => {
    return `${addr?.substring(0, 6)}...${addr?.substring(addr.length - 4)}`;
  };

  return (
    <div className="flex gap-3">
      <Button 
        onClick={() => disconnect()}
        variant="outline"
      >
        {formatAddress(address)}
      </Button>
    </div>
  );
};
