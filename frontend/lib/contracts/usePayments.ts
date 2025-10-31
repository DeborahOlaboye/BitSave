import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BitSavePaymentsABI, ERC20ABI } from './abis';
import { CONTRACT_ADDRESSES } from './config';
import { parseUnits } from 'viem';

// Payment types enum
export enum PaymentType {
  P2P = 0,
  AIRTIME = 1,
  DATA = 2,
  GIFTCARD = 3,
}

// Read hooks
export function useGetUserPayments(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.payments,
    abi: BitSavePaymentsABI,
    functionName: 'getUserPayments',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useGetPayment(paymentId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.payments,
    abi: BitSavePaymentsABI,
    functionName: 'getPayment',
    args: paymentId !== undefined ? [paymentId] : undefined,
    query: {
      enabled: paymentId !== undefined,
    },
  });
}

export function useGetRecentPayments(count: number = 10) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.payments,
    abi: BitSavePaymentsABI,
    functionName: 'getRecentPayments',
    args: [BigInt(count)],
  });
}

export function useGetTotalPayments() {
  return useReadContract({
    address: CONTRACT_ADDRESSES.payments,
    abi: BitSavePaymentsABI,
    functionName: 'getTotalPayments',
  });
}

// MUSD token hooks
export function useMUSDBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.musd,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useMUSDAllowance(owner: `0x${string}` | undefined, spender: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.musd,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: owner ? [owner, spender] : undefined,
    query: {
      enabled: !!owner,
    },
  });
}

// Write hooks
export function useApproveMUSD() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const approve = async (spender: `0x${string}`, amount: string) => {
    const amountWei = parseUnits(amount, 18); // MUSD has 18 decimals
    return writeContract({
      address: CONTRACT_ADDRESSES.musd,
      abi: ERC20ABI,
      functionName: 'approve',
      args: [spender, amountWei],
    });
  };

  return {
    approve,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useSendToUsername() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const sendToUsername = async (username: string, amount: string, note: string = '') => {
    const amountWei = parseUnits(amount, 18);
    return writeContract({
      address: CONTRACT_ADDRESSES.payments,
      abi: BitSavePaymentsABI,
      functionName: 'sendToUsername',
      args: [username, amountWei, note],
    });
  };

  return {
    sendToUsername,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useSendToAddress() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const sendToAddress = async (recipient: `0x${string}`, amount: string, note: string = '') => {
    const amountWei = parseUnits(amount, 18);
    return writeContract({
      address: CONTRACT_ADDRESSES.payments,
      abi: BitSavePaymentsABI,
      functionName: 'sendToAddress',
      args: [recipient, amountWei, note],
    });
  };

  return {
    sendToAddress,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useRecordPurchase() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const recordPurchase = async (amount: string, purchaseType: PaymentType, details: string) => {
    const amountWei = parseUnits(amount, 18);
    return writeContract({
      address: CONTRACT_ADDRESSES.payments,
      abi: BitSavePaymentsABI,
      functionName: 'recordPurchase',
      args: [amountWei, purchaseType, details],
    });
  };

  return {
    recordPurchase,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
