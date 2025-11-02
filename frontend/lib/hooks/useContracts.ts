import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES } from '../contracts/addresses';
import {
  BitSaveRegistryABI,
  BitSaveVaultABI,
  BitSavePaymentsABI,
  ERC20ABI,
} from '../contracts/abis';

// Registry Contract Hooks
export function useRegisterUsername() {
  const { writeContract, data: hash, isSuccess: writeSuccess, ...rest } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const registerUsername = (username: string) => {
    // @ts-ignore - wagmi type issue with writeContract
    writeContract({
      address: CONTRACT_ADDRESSES.REGISTRY,
      abi: BitSaveRegistryABI,
      functionName: 'registerUsername',
      args: [username],
    });
  };

  return {
    registerUsername,
    hash,
    isConfirming,
    isSuccess,
    ...rest,
  };
}

export function useCheckUsernameAvailability(username: string) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.REGISTRY,
    abi: BitSaveRegistryABI,
    functionName: 'isUsernameAvailable',
    args: [username],
    query: {
      enabled: username.length > 0,
    },
  });
}

export function useGetUsername(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.REGISTRY,
    abi: BitSaveRegistryABI,
    functionName: 'getUsernameByAddress',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useResolveUsername(username: string) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.REGISTRY,
    abi: BitSaveRegistryABI,
    functionName: 'resolveUsername',
    args: [username],
    query: {
      enabled: username.length > 0,
    },
  });
}

// MUSD Token Hooks
export function useMUSDBalance(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MUSD,
    abi: ERC20ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useApproveMUSD() {
  const { writeContract, data: hash, isSuccess: writeSuccess, ...rest } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const approve = (spender: `0x${string}`, amount: bigint) => {
    // @ts-ignore - wagmi type issue with writeContract
    writeContract({
      address: CONTRACT_ADDRESSES.MUSD,
      abi: ERC20ABI,
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  return {
    approve,
    hash,
    isConfirming,
    isSuccess,
    ...rest,
  };
}

export function useMUSDAllowance(owner: `0x${string}` | undefined, spender: `0x${string}`) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.MUSD,
    abi: ERC20ABI,
    functionName: 'allowance',
    args: owner ? [owner, spender] : undefined,
    query: {
      enabled: !!owner,
    },
  });
}

// Vault Contract Hooks
export function useCreateGoal() {
  const { writeContract, data: hash, isSuccess: writeSuccess, ...rest } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const createGoal = (name: string, targetAmount: bigint, unlockTime: bigint) => {
    // @ts-ignore - wagmi type issue with writeContract
    writeContract({
      address: CONTRACT_ADDRESSES.VAULT,
      abi: BitSaveVaultABI,
      functionName: 'createGoal',
      args: [name, targetAmount, unlockTime],
    });
  };

  return {
    createGoal,
    hash,
    isConfirming,
    isSuccess,
    ...rest,
  };
}

export function useDepositToGoal() {
  const { writeContract, data: hash, isSuccess: writeSuccess, ...rest } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const deposit = (goalId: bigint, amount: bigint) => {
    // @ts-ignore - wagmi type issue with writeContract
    writeContract({
      address: CONTRACT_ADDRESSES.VAULT,
      abi: BitSaveVaultABI,
      functionName: 'deposit',
      args: [goalId, amount],
    });
  };

  return {
    deposit,
    hash,
    isConfirming,
    isSuccess,
    ...rest,
  };
}

export function useWithdrawFromGoal() {
  const { writeContract, data: hash, isSuccess: writeSuccess, ...rest } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const withdraw = (goalId: bigint, amount: bigint) => {
    // @ts-ignore - wagmi type issue with writeContract
    writeContract({
      address: CONTRACT_ADDRESSES.VAULT,
      abi: BitSaveVaultABI,
      functionName: 'withdraw',
      args: [goalId, amount],
    });
  };

  return {
    withdraw,
    hash,
    isConfirming,
    isSuccess,
    ...rest,
  };
}

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

// Payments Contract Hooks
export function useSendToUsername() {
  const { writeContract, data: hash, isSuccess: writeSuccess, ...rest } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const sendToUsername = (username: string, amount: bigint, note: string) => {
    // @ts-ignore - wagmi type issue with writeContract
    writeContract({
      address: CONTRACT_ADDRESSES.PAYMENTS,
      abi: BitSavePaymentsABI,
      functionName: 'sendToUsername',
      args: [username, amount, note],
    });
  };

  return {
    sendToUsername,
    hash,
    isConfirming,
    isSuccess,
    ...rest,
  };
}

export function useSendToAddress() {
  const { writeContract, data: hash, isSuccess: writeSuccess, ...rest } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const sendToAddress = (recipient: `0x${string}`, amount: bigint, note: string) => {
    // @ts-ignore - wagmi type issue with writeContract
    writeContract({
      address: CONTRACT_ADDRESSES.PAYMENTS,
      abi: BitSavePaymentsABI,
      functionName: 'sendToAddress',
      args: [recipient, amount, note],
    });
  };

  return {
    sendToAddress,
    hash,
    isConfirming,
    isSuccess,
    ...rest,
  };
}

export function useGetUserPayments(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.PAYMENTS,
    abi: BitSavePaymentsABI,
    functionName: 'getUserPayments',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

export function useGetPayment(paymentId: bigint) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.PAYMENTS,
    abi: BitSavePaymentsABI,
    functionName: 'getPayment',
    args: [paymentId],
  });
}
