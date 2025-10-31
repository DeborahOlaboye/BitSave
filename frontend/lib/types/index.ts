// User types
export interface User {
  id: number;
  username: string;
  walletAddress: string;
  mezoBorrowPositionId?: string;
  profileData?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Transaction types
export type TransactionType =
  | 'deposit'
  | 'withdraw'
  | 'send'
  | 'receive'
  | 'spend'
  | 'vault_deposit'
  | 'vault_withdraw';

export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: number;
  userId: number;
  type: TransactionType;
  amount: string;
  recipientUsername?: string;
  recipientAddress?: string;
  txHash?: string;
  status: TransactionStatus;
  note?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

// Balance types
export interface Balance {
  musdBalance: string;
  vaultBalance: string;
  totalBalance: string;
}

// Vault info
export interface VaultInfo {
  apy: string;
  totalDeposits: string;
  userDeposits: string;
}

// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}
