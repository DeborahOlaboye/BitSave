import axios from 'axios';
import type { User, Transaction, Balance, VaultInfo, ApiResponse } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const apiService = {
  // User endpoints
  async getUserByAddress(address: string): Promise<User | null> {
    try {
      const response = await api.get<ApiResponse<User>>(`/api/users/address/${address}`);
      return response.data.data || null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      const response = await api.get<ApiResponse<User>>(`/api/users/username/${username}`);
      return response.data.data || null;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async registerUser(username: string, walletAddress: string): Promise<User> {
    const response = await api.post<ApiResponse<User>>('/api/users/register', {
      username,
      walletAddress,
    });
    if (!response.data.data) {
      throw new Error(response.data.error || 'Registration failed');
    }
    return response.data.data;
  },

  // Transaction endpoints
  async getTransactions(userId: number): Promise<Transaction[]> {
    const response = await api.get<ApiResponse<Transaction[]>>(`/api/transactions/${userId}`);
    return response.data.data || [];
  },

  async createTransaction(transaction: Partial<Transaction>): Promise<Transaction> {
    const response = await api.post<ApiResponse<Transaction>>('/api/transactions', transaction);
    if (!response.data.data) {
      throw new Error(response.data.error || 'Failed to create transaction');
    }
    return response.data.data;
  },

  // Mezo endpoints
  async getBalances(address: string): Promise<Balance> {
    const response = await api.get<ApiResponse<Balance>>(`/api/mezo/balances/${address}`);
    if (!response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch balances');
    }
    return response.data.data;
  },

  async getVaultInfo(): Promise<VaultInfo> {
    const response = await api.get<ApiResponse<VaultInfo>>('/api/mezo/vault/info');
    if (!response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch vault info');
    }
    return response.data.data;
  },

  async getBtcPrice(): Promise<{ price: number }> {
    const response = await api.get<ApiResponse<{ price: number }>>('/api/mezo/btc-price');
    if (!response.data.data) {
      throw new Error(response.data.error || 'Failed to fetch BTC price');
    }
    return response.data.data;
  },
};
