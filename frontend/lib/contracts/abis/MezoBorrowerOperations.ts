// Mezo BorrowerOperations ABI
// Source: https://github.com/mezo-org/musd/blob/main/solidity/contracts/BorrowerOperations.sol

export const MezoBorrowerOperationsABI = [
  // Main functions for opening and managing troves (positions)
  {
    inputs: [
      { internalType: 'uint256', name: '_debtAmount', type: 'uint256' },
      { internalType: 'address', name: '_upperHint', type: 'address' },
      { internalType: 'address', name: '_lowerHint', type: 'address' },
    ],
    name: 'openTrove',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_collWithdrawal', type: 'uint256' },
      { internalType: 'uint256', name: '_debtChange', type: 'uint256' },
      { internalType: 'bool', name: '_isDebtIncrease', type: 'bool' },
      { internalType: 'address', name: '_upperHint', type: 'address' },
      { internalType: 'address', name: '_lowerHint', type: 'address' },
    ],
    name: 'adjustTrove',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'closeTrove',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'address', name: '_upperHint', type: 'address' },
      { internalType: 'address', name: '_lowerHint', type: 'address' },
    ],
    name: 'withdrawMUSD',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'address', name: '_upperHint', type: 'address' },
      { internalType: 'address', name: '_lowerHint', type: 'address' },
    ],
    name: 'repayMUSD',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      { internalType: 'uint256', name: '_amount', type: 'uint256' },
      { internalType: 'address', name: '_upperHint', type: 'address' },
      { internalType: 'address', name: '_lowerHint', type: 'address' },
    ],
    name: 'withdrawColl',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const;

// HintHelpers ABI for finding insertion hints
export const MezoHintHelpersABI = [
  {
    inputs: [
      { internalType: 'uint256', name: '_CR', type: 'uint256' },
      { internalType: 'uint256', name: '_numTrials', type: 'uint256' },
      { internalType: 'uint256', name: '_inputRandomSeed', type: 'uint256' },
    ],
    name: 'getApproxHint',
    outputs: [
      { internalType: 'address', name: 'hintAddress', type: 'address' },
      { internalType: 'uint256', name: 'diff', type: 'uint256' },
      { internalType: 'uint256', name: 'latestRandomSeed', type: 'uint256' },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// TroveManager ABI for reading trove data
export const MezoTroveManagerABI = [
  {
    inputs: [{ internalType: 'address', name: '_borrower', type: 'address' }],
    name: 'getTroveStatus',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_borrower', type: 'address' }],
    name: 'getTroveDebt',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [{ internalType: 'address', name: '_borrower', type: 'address' }],
    name: 'getTroveColl',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

// PriceFeed ABI for getting BTC price
export const MezoPriceFeedABI = [
  {
    inputs: [],
    name: 'fetchPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'lastGoodPrice',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
