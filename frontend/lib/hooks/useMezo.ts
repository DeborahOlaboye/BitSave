import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { MEZO_CONTRACTS } from '../contracts/mezo-addresses';
import {
  MezoBorrowerOperationsABI,
  MezoTroveManagerABI,
  MezoPriceFeedABI,
} from '../contracts/abis/MezoBorrowerOperations';

// Hook to open a trove (deposit BTC and borrow MUSD)
export function useOpenTrove() {
  const { writeContract, data: hash, ...rest } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const openTrove = async (btcAmount: string, musdAmount: string) => {
    // For hints, we use zero addresses for simplicity
    // In production, use HintHelpers contract to get optimal hints
    const upperHint = '0x0000000000000000000000000000000000000000';
    const lowerHint = '0x0000000000000000000000000000000000000000';

    const btcValue = parseEther(btcAmount);
    const debtAmount = parseEther(musdAmount);

    // @ts-ignore - wagmi type issue
    await writeContract({
      address: MEZO_CONTRACTS.BORROWER_OPERATIONS,
      abi: MezoBorrowerOperationsABI,
      functionName: 'openTrove',
      args: [debtAmount, upperHint, lowerHint],
      value: btcValue,
    });
  };

  return {
    openTrove,
    hash,
    isConfirming,
    isSuccess,
    ...rest,
  };
}

// Hook to get user's trove position
export function useGetTrovePosition(address: `0x${string}` | undefined) {
  const { data: debt } = useReadContract({
    address: MEZO_CONTRACTS.TROVE_MANAGER,
    abi: MezoTroveManagerABI,
    functionName: 'getTroveDebt',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && MEZO_CONTRACTS.TROVE_MANAGER !== '0x0000000000000000000000000000000000000000',
    },
  });

  const { data: collateral } = useReadContract({
    address: MEZO_CONTRACTS.TROVE_MANAGER,
    abi: MezoTroveManagerABI,
    functionName: 'getTroveColl',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && MEZO_CONTRACTS.TROVE_MANAGER !== '0x0000000000000000000000000000000000000000',
    },
  });

  const { data: status } = useReadContract({
    address: MEZO_CONTRACTS.TROVE_MANAGER,
    abi: MezoTroveManagerABI,
    functionName: 'getTroveStatus',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && MEZO_CONTRACTS.TROVE_MANAGER !== '0x0000000000000000000000000000000000000000',
    },
  });

  return {
    debt,
    collateral,
    status,
    hasPosition: status !== undefined && status !== 0n,
  };
}

// Hook to get BTC price from Mezo's oracle
export function useGetBtcPrice() {
  return useReadContract({
    address: MEZO_CONTRACTS.PRICE_FEED,
    abi: MezoPriceFeedABI,
    functionName: 'lastGoodPrice',
    query: {
      enabled: MEZO_CONTRACTS.PRICE_FEED !== '0x0000000000000000000000000000000000000000',
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });
}

// Hook to repay MUSD and close trove
export function useCloseTrove() {
  const { writeContract, data: hash, ...rest } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const closeTrove = async () => {
    // @ts-ignore - wagmi type issue
    await writeContract({
      address: MEZO_CONTRACTS.BORROWER_OPERATIONS,
      abi: MezoBorrowerOperationsABI,
      functionName: 'closeTrove',
    });
  };

  return {
    closeTrove,
    hash,
    isConfirming,
    isSuccess,
    ...rest,
  };
}
