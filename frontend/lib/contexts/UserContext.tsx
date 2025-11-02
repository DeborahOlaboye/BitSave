'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useGetUsername } from '../hooks/useContracts';

interface User {
  username: string;
  walletAddress: string;
}

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
  const [error, setError] = useState<string | null>(null);
  const { address, isConnected } = useAccount();

  // Fetch username from blockchain
  const { data: username, isLoading: usernameLoading, refetch } = useGetUsername(address);

  const refreshUser = async () => {
    if (!address || !isConnected) {
      setUser(null);
      return;
    }

    try {
      // Refetch username from blockchain
      const result = await refetch();
      const fetchedUsername = result.data as string | undefined;

      // Username exists if it's not empty string
      if (fetchedUsername && fetchedUsername.length > 0) {
        setUser({
          username: fetchedUsername,
          walletAddress: address,
        });
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('Failed to load user data');
      setUser(null);
    }
  };

  useEffect(() => {
    if (isConnected && address) {
      // Check if username exists (not empty string)
      if (username && username.length > 0) {
        setUser({
          username,
          walletAddress: address,
        });
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [address, isConnected, username]);

  return (
    <UserContext.Provider value={{ user, loading: usernameLoading, error, setUser, refreshUser }}>
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
