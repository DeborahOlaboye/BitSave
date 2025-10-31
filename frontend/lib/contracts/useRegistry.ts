import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { BitSaveRegistryABI } from './abis';
import { CONTRACT_ADDRESSES } from './config';

// Read hooks
export function useIsUsernameAvailable(username: string) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.registry,
    abi: BitSaveRegistryABI,
    functionName: 'isUsernameAvailable',
    args: [username],
    query: {
      enabled: !!username && username.length > 0,
    },
  });
}

export function useResolveUsername(username: string) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.registry,
    abi: BitSaveRegistryABI,
    functionName: 'resolveUsername',
    args: [username],
    query: {
      enabled: !!username && username.length > 0,
    },
  });
}

export function useGetUsernameByAddress(address: `0x${string}` | undefined) {
  return useReadContract({
    address: CONTRACT_ADDRESSES.registry,
    abi: BitSaveRegistryABI,
    functionName: 'getUsernameByAddress',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
}

// Write hooks
export function useRegisterUsername() {
  const { data: hash, writeContract, isPending, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const registerUsername = async (username: string) => {
    return writeContract({
      address: CONTRACT_ADDRESSES.registry,
      abi: BitSaveRegistryABI,
      functionName: 'registerUsername',
      args: [username],
    });
  };

  return {
    registerUsername,
    isPending,
    isConfirming,
    isSuccess,
    error,
    hash,
  };
}
