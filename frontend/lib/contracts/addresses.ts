// Contract addresses on Mezo Testnet
export const CONTRACT_ADDRESSES = {
  MUSD: process.env.NEXT_PUBLIC_MUSD_CONTRACT as `0x${string}`,
  REGISTRY: process.env.NEXT_PUBLIC_REGISTRY_CONTRACT as `0x${string}`,
  VAULT: process.env.NEXT_PUBLIC_VAULT_CONTRACT as `0x${string}`,
  PAYMENTS: process.env.NEXT_PUBLIC_PAYMENTS_CONTRACT as `0x${string}`,
} as const;

// Validate addresses are set
if (typeof window !== 'undefined') {
  Object.entries(CONTRACT_ADDRESSES).forEach(([key, value]) => {
    if (!value || value.length < 42) {
      console.warn(`${key} contract address not set in environment variables`);
    }
  });
}
