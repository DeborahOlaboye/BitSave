import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BitSaveVaultABI } from './abis';
import { CONTRACT_ADDRESSES } from './config';
import { parseUnits } from 'viem';

// Types
export interface SavingsGoal {
  name: string;
  amount: bigint;
  targetAmount: bigint;
  unlockTime: bigint;
  isActive: boolean;
}

// Read hooks
export function useGetUserGoals(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.VAULT,
    abi: BitSaveVaultABI,
    functionName: 'getUserGoals',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useGetTotalSavings(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.VAULT,
    abi: BitSaveVaultABI,
    functionName: 'getTotalSavings',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useGetGoalCount(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.VAULT,
    abi: BitSaveVaultABI,
    functionName: 'goalCount',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useGetSavingsGoal(address: `0x${string}` | undefined, goalId: bigint | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.VAULT,
    abi: BitSaveVaultABI,
    functionName: 'savingsGoals',
    args: address && goalId !== undefined ? [address, goalId] : undefined,
    query: {
      enabled: !!address && goalId !== undefined,
    },
  });
}

// Write hooks
export function useCreateGoal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const createGoal = async (name: string, targetAmount: string, unlockTime: number = 0) => {
    const targetAmountWei = parseUnits(targetAmount, 18);
    // @ts-ignore - wagmi type issue with writeContract
    return writeContract({
      address: CONTRACT_ADDRESSES.VAULT,
      abi: BitSaveVaultABI,
      functionName: 'createGoal',
      args: [name, targetAmountWei, BigInt(unlockTime)],
    });
  };

  return {
    createGoal,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useDepositToGoal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const deposit = async (goalId: number, amount: string) => {
    const amountWei = parseUnits(amount, 18);
    // @ts-ignore - wagmi type issue with writeContract
    return writeContract({
      address: CONTRACT_ADDRESSES.VAULT,
      abi: BitSaveVaultABI,
      functionName: 'deposit',
      args: [BigInt(goalId), amountWei],
    });
  };

  return {
    deposit,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useWithdrawFromGoal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const withdraw = async (goalId: number, amount: string = '0') => {
    const amountWei = amount === '0' ? BigInt(0) : parseUnits(amount, 18);
    // @ts-ignore - wagmi type issue with writeContract
    return writeContract({
      address: CONTRACT_ADDRESSES.VAULT,
      abi: BitSaveVaultABI,
      functionName: 'withdraw',
      args: [BigInt(goalId), amountWei],
    });
  };

  return {
    withdraw,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}

export function useCloseGoal() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const closeGoal = async (goalId: number) => {
    // @ts-ignore - wagmi type issue with writeContract
    return writeContract({
      address: CONTRACT_ADDRESSES.VAULT,
      abi: BitSaveVaultABI,
      functionName: 'closeGoal',
      args: [BigInt(goalId)],
    });
  };

  return {
    closeGoal,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
