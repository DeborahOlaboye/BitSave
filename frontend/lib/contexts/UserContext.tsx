'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import type { User } from '../types';
import { apiService } from '../services/api';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  const refreshUser = async () => {
    if (!address || !isConnected) {
      setUser(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const userData = await apiService.getUserByAddress(address);
      setUser(userData);
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to load user data');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      refreshUser();
    } else {
      setUser(null);
    }
  }, [address, isConnected]);

  return (
    <UserContext.Provider value={{ user, loading, error, setUser, refreshUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
