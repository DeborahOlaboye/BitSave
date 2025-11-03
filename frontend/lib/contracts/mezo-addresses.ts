export const MEZO_CONTRACTS = {
  // MUSD Token
  MUSD: '0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503' as `0x${string}`,

  // This is a proxy contract - found at https://explorer.test.mezo.org/address/0xCdF7028ceAB81fA0C6971208e83fa7872994beE5
  BORROWER_OPERATIONS: '0x575539e5c36d2293b0f506AC34b09FF7e2ae0771' as `0x${string}`,

  TROVE_MANAGER: '0xE47c80e8c23f6B4A1aE41c34837a0599D5D16bb0' as `0x${string}`, // Optional
  PRICE_FEED: '0x86bCF0841622a5dAC14A313a15f96A95421b9366' as `0x${string}`, // Optional
  SORTED_TROVES: '0x722E4D24FD6Ff8b0AC679450F3D91294607268fA' as `0x${string}`, // Optional
  HINT_HELPERS: '0x0000000000000000000000000000000000000000' as `0x${string}`, // Optional
} as const;

// Chain configuration
export const MEZO_TESTNET = {
  id: 31611,
  name: 'Mezo Testnet',
  rpcUrl: 'https://rpc.test.mezo.org',
  explorerUrl: 'https://explorer.test.mezo.org',
} as const;

// Instructions for finding contract addresses:
// 1. Go to https://explorer.test.mezo.org/
// 2. Search for MUSD token: 0x118917a40FAF1CD7a13dB0Ef56C86De7973Ac503
// 3. Look at transactions to find BorrowerOperations contract interactions
// 4. Alternatively, check Mezo's Discord or GitHub for deployed addresses
