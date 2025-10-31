'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useUser } from '@/lib/contexts/UserContext';
import { useToast } from '@/lib/contexts/ToastContext';
import { apiService } from '@/lib/services/api';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import Image from 'next/image';

export default function Register() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { setUser, refreshUser, user } = useUser();
  const { showToast } = useToast();
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      setError('Please connect your wallet first');
      return;
    }

    if (username.length < 3 || username.length > 20) {
      setError('Username must be between 3 and 20 characters');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const newUser = await apiService.registerUser(username, address);
      setUser(newUser);
      await refreshUser();
      showToast('Account created successfully!', 'success');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.error || 'Registration failed. Username may already be taken.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary-light to-secondary flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-glow-lg p-8 text-center animate-scale-in">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Image src="/logo.png" alt="BitSave" width={60} height={60} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">Connect Your Wallet</h2>
          <p className="text-white/80 mb-6">Please connect your wallet to create an account</p>
          <ConnectWallet />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary-light to-secondary flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-glow-lg p-8 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Image src="/logo.png" alt="BitSave" width={60} height={60} />
          </div>
          <h1 className="text-4xl font-bold text-secondary mb-2">Welcome to BitSave</h1>
          <p className="text-text-secondary">Choose your username</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-semibold text-text-primary mb-2">
              Username
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-primary text-xl font-bold">
                @
              </span>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-quick"
                placeholder="johndoe"
                disabled={loading}
                autoComplete="off"
              />
            </div>
            <p className="mt-2 text-sm text-text-secondary">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          {error && (
            <div className="bg-error/10 border-2 border-error/30 text-error px-4 py-3 rounded-lg text-sm font-medium flex items-center gap-2">
              <span>⚠</span> {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading || !username}
            loading={loading}
            className="w-full"
            size="lg"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-text-secondary">
            Connected: <span className="font-mono">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
