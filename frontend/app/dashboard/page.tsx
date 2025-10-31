'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useUser } from '@/lib/contexts/UserContext';
import { ConnectWallet } from '@/components/ConnectWallet';
import { TransactionHistory } from '@/components/TransactionHistory';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { apiService } from '@/lib/services/api';
import type { Balance } from '@/lib/types';
import { Wallet, Send, ShoppingCart, RefreshCw, TrendingUp, ArrowRight, Sparkles, Bitcoin } from 'lucide-react';
import Image from 'next/image';

export default function Dashboard() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { user, loading: userLoading } = useUser();
  const [balance, setBalance] = useState<Balance | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isConnected) {
      router.push('/');
      return;
    }

    if (!userLoading && !user) {
      router.push('/register');
      return;
    }

    if (user && address) {
      loadBalance();
    }
  }, [isConnected, user, userLoading, address, router]);

  const loadBalance = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const balanceData = await apiService.getBalances(address);
      setBalance(balanceData);
    } catch (error) {
      console.error('Error loading balance:', error);
      setBalance({
        musdBalance: '0.00',
        vaultBalance: '0.00',
        totalBalance: '0.00',
      });
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-gray-100 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <LoadingSpinner size="lg" />
          <p className="text-text-secondary text-lg mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const actionCards = [
    {
      icon: Bitcoin,
      title: 'Deposit',
      description: 'Deposit BTC and borrow MUSD instantly',
      route: '/deposit',
      gradient: 'from-primary to-orange-600',
      iconBg: 'bg-gradient-to-br from-primary to-orange-600',
    },
    {
      icon: Wallet,
      title: 'Save',
      description: 'Earn 5% APY on your MUSD in the vault',
      route: '/save',
      gradient: 'from-emerald-500 to-teal-600',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600',
    },
    {
      icon: Send,
      title: 'Send',
      description: 'Send money instantly by username',
      route: '/send',
      gradient: 'from-blue-500 to-indigo-600',
      iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600',
    },
    {
      icon: ShoppingCart,
      title: 'Spend',
      description: 'Buy airtime, data, and gift cards',
      route: '/spend',
      gradient: 'from-purple-500 to-pink-600',
      iconBg: 'bg-gradient-to-br from-purple-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Image src="/logo.png" alt="BitSave" width={40} height={40} className="rounded-xl" />
              <h1 className="text-2xl font-bold text-secondary">BitSave</h1>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-3xl md:text-4xl font-bold text-secondary">
              Welcome back, <span className="text-primary">@{user.username}</span>!
            </h2>
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <p className="text-text-secondary flex items-center gap-2">
            <span className="inline-flex items-center gap-2 bg-background px-3 py-1 rounded-lg font-mono text-sm border border-border">
              {address?.slice(0, 6)}...{address?.slice(-4)}
            </span>
          </p>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-primary-dark via-primary to-primary-light rounded-2xl shadow-glow-lg p-8 mb-8 text-white relative overflow-hidden animate-fade-in">
          {/* Decorative background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-white/80" />
                  <p className="text-white/80 text-sm font-medium">Total Balance</p>
                </div>
                {loading ? (
                  <div className="h-12 w-48 bg-white/20 rounded-lg animate-pulse"></div>
                ) : (
                  <h3 className="text-5xl md:text-6xl font-bold tracking-tight">
                    ${balance?.totalBalance || '0.00'}
                  </h3>
                )}
                <p className="text-white/60 text-sm mt-2">MUSD (Bitcoin-backed)</p>
              </div>
              <button
                onClick={loadBalance}
                disabled={loading}
                className="group bg-white/20 hover:bg-white/30 px-5 py-3 rounded-xl transition-all duration-standard disabled:opacity-50 hover:scale-105 active:scale-95 flex items-center gap-2 backdrop-blur-sm border border-white/20"
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : 'group-hover:rotate-180'} transition-transform duration-slow`} />
                <span className="font-medium">Refresh</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-standard">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <p className="text-white/80 text-sm font-medium">Wallet Balance</p>
                </div>
                <p className="text-3xl font-bold">${balance?.musdBalance || '0.00'}</p>
                <p className="text-white/60 text-xs mt-1">Available to send or spend</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 hover:bg-white/15 transition-all duration-standard">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <p className="text-white/80 text-sm font-medium">Vault Balance</p>
                </div>
                <p className="text-3xl font-bold">${balance?.vaultBalance || '0.00'}</p>
                <p className="text-white/60 text-xs mt-1">Earning 5% APY</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
            <span>Quick Actions</span>
            <ArrowRight className="w-6 h-6 text-primary" />
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {actionCards.map((card, index) => (
              <button
                key={index}
                onClick={() => router.push(card.route)}
                className="group relative bg-white rounded-2xl shadow-md hover:shadow-xl p-8 text-left transition-all duration-standard hover:-translate-y-2 border border-border hover:border-primary/30 overflow-hidden animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-standard`}></div>

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-standard shadow-lg`}>
                    <card.icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-secondary mb-3 group-hover:text-primary transition-colors duration-standard">
                    {card.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-4">
                    {card.description}
                  </p>

                  {/* Arrow */}
                  <div className="flex items-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-standard">
                    <span className="text-sm">Get Started</span>
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-standard" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 border border-border animate-fade-in" style={{ animationDelay: '400ms' }}>
          <h3 className="text-2xl font-bold text-secondary mb-6 flex items-center gap-2">
            <span>Recent Transactions</span>
            <div className="flex-1 h-0.5 bg-gradient-to-r from-primary/20 to-transparent"></div>
          </h3>
          <TransactionHistory userId={user.id} />
        </div>
      </main>
    </div>
  );
}
