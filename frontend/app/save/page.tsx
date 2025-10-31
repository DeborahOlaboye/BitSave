'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useUser } from '@/lib/contexts/UserContext';
import { useToast } from '@/lib/contexts/ToastContext';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Button } from '@/components/Button';
import { apiService } from '@/lib/services/api';
import { mezoService } from '@/lib/services/mezo';
import { ArrowLeft, TrendingUp, Wallet, PiggyBank, Calendar, Clock, DollarSign, Info, Sparkles } from 'lucide-react';

export default function Save() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { user } = useUser();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [vaultInfo, setVaultInfo] = useState({ apy: '5.00', totalDeposits: '0', userDeposits: '0' });
  const [balance, setBalance] = useState({ musdBalance: '0.00', vaultBalance: '0.00' });

  useEffect(() => {
    if (!isConnected || !user) {
      router.push('/');
      return;
    }

    loadData();
  }, [isConnected, user, router]);

  const loadData = async () => {
    if (!address) return;

    try {
      const [vaultData, balanceData] = await Promise.all([
        apiService.getVaultInfo(),
        apiService.getBalances(address),
      ]);

      setVaultInfo(vaultData);
      setBalance({
        musdBalance: balanceData.musdBalance,
        vaultBalance: balanceData.vaultBalance,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'warning');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance.musdBalance)) {
      showToast('Insufficient balance', 'error');
      return;
    }

    setLoading(true);

    try {
      const txHash = await mezoService.depositToVault(amount);

      // Record transaction
      if (user) {
        await apiService.createTransaction({
          userId: user.id,
          type: 'vault_deposit',
          amount,
          txHash: txHash,
          status: 'completed',
        });
      }

      showToast('Deposit successful!', 'success');
      setAmount('');
      await loadData();
    } catch (error: any) {
      console.error('Deposit error:', error);
      showToast(error.message || 'Deposit failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'warning');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance.vaultBalance)) {
      showToast('Insufficient vault balance', 'error');
      return;
    }

    setLoading(true);

    try {
      const txHash = await mezoService.withdrawFromVault(amount);

      // Record transaction
      if (user) {
        await apiService.createTransaction({
          userId: user.id,
          type: 'vault_withdraw',
          amount,
          txHash: txHash,
          status: 'completed',
        });
      }

      showToast('Withdrawal successful!', 'success');
      setAmount('');
      await loadData();
    } catch (error: any) {
      console.error('Withdrawal error:', error);
      showToast(error.message || 'Withdrawal failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const setQuickAmount = (value: string) => {
    setAmount(value);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-quick" />
              <span className="font-medium">Back</span>
            </button>
            <div className="flex items-center gap-2">
              <PiggyBank className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-secondary">Save & Earn</h1>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Vault Info Card - Brand Styled */}
        <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 rounded-2xl shadow-glow-lg p-8 md:p-10 mb-8 text-white relative overflow-hidden animate-fade-in">
          {/* Decorative background */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            {/* APY Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                <Sparkles className="w-4 h-4" />
                <span className="text-sm font-medium">Earn While You Save</span>
              </div>
              <div className="flex items-baseline justify-center gap-2 mb-2">
                <TrendingUp className="w-8 h-8 text-white/80" />
                <h2 className="text-6xl md:text-7xl font-bold">{vaultInfo.apy}%</h2>
              </div>
              <p className="text-white/80 font-medium">Annual Percentage Yield (APY)</p>
            </div>

            {/* Balance Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-standard">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <PiggyBank className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Vault Balance</p>
                    <p className="text-xs text-white/60">Earning interest</p>
                  </div>
                </div>
                <p className="text-3xl font-bold">${balance.vaultBalance}</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-standard">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium">Wallet Balance</p>
                    <p className="text-xs text-white/60">Available to deposit</p>
                  </div>
                </div>
                <p className="text-3xl font-bold">${balance.musdBalance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8 border border-border animate-scale-in" style={{ animationDelay: '200ms' }}>
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`flex-1 py-4 font-semibold transition-all duration-standard relative ${
                activeTab === 'deposit'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <span className="relative z-10">Deposit</span>
              {activeTab === 'deposit' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`flex-1 py-4 font-semibold transition-all duration-standard relative ${
                activeTab === 'withdraw'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <span className="relative z-10">Withdraw</span>
              {activeTab === 'withdraw' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark"></div>
              )}
            </button>
          </div>

          <div className="p-8">
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                <DollarSign className="w-4 h-4 text-primary" />
                Amount (MUSD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-text-secondary font-light">$</span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 pr-4 py-4 text-2xl border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="0.00"
                  disabled={loading}
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            {/* Quick Select */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {['25', '50', '100'].map((val) => (
                <button
                  key={val}
                  onClick={() => setQuickAmount(val)}
                  className="py-3 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
                  disabled={loading}
                >
                  ${val}
                </button>
              ))}
              <button
                onClick={() =>
                  setQuickAmount(activeTab === 'deposit' ? balance.musdBalance : balance.vaultBalance)
                }
                className="py-3 border-2 border-primary bg-primary/5 text-primary rounded-xl hover:bg-primary/10 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
                disabled={loading}
              >
                Max
              </button>
            </div>

            {/* Action Button */}
            <Button
              onClick={activeTab === 'deposit' ? handleDeposit : handleWithdraw}
              disabled={loading || !amount || parseFloat(amount) <= 0}
              loading={loading}
              className="w-full"
              size="lg"
            >
              {activeTab === 'deposit' ? 'Deposit to Vault' : 'Withdraw from Vault'}
            </Button>

            {/* Info */}
            <div className="mt-6 p-4 bg-gradient-to-r from-info/10 to-blue-50 border border-info/20 rounded-xl">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                <p className="text-sm text-info-dark leading-relaxed">
                  {activeTab === 'deposit'
                    ? `Your deposits earn ${vaultInfo.apy}% APY automatically. Funds can be withdrawn instantly at any time with no penalties or lock-up periods.`
                    : 'Withdraw your funds from the vault back to your wallet instantly. Your earned interest will be included in the withdrawal.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Projected Earnings */}
        {activeTab === 'deposit' && amount && parseFloat(amount) > 0 && (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-border animate-scale-in">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
              <h3 className="text-2xl font-bold text-secondary">Projected Earnings</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 hover:shadow-md transition-all duration-standard">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-emerald-600" />
                  <p className="text-sm font-medium text-text-secondary">Daily</p>
                </div>
                <p className="text-3xl font-bold text-emerald-600">
                  ${((parseFloat(amount) * parseFloat(vaultInfo.apy)) / 100 / 365).toFixed(2)}
                </p>
                <p className="text-xs text-text-secondary mt-1">Per day</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 hover:shadow-md transition-all duration-standard">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  <p className="text-sm font-medium text-text-secondary">Monthly</p>
                </div>
                <p className="text-3xl font-bold text-emerald-600">
                  ${((parseFloat(amount) * parseFloat(vaultInfo.apy)) / 100 / 12).toFixed(2)}
                </p>
                <p className="text-xs text-text-secondary mt-1">Per month</p>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-6 hover:shadow-md transition-all duration-standard">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  <p className="text-sm font-medium text-text-secondary">Yearly</p>
                </div>
                <p className="text-3xl font-bold text-emerald-600">
                  ${((parseFloat(amount) * parseFloat(vaultInfo.apy)) / 100).toFixed(2)}
                </p>
                <p className="text-xs text-text-secondary mt-1">Per year</p>
              </div>
            </div>
            <div className="mt-6 p-4 bg-gradient-to-r from-warning/10 to-orange-50 border border-warning/30 rounded-xl">
              <p className="text-sm text-warning-dark">
                <strong>Note:</strong> Earnings are calculated based on the current APY of {vaultInfo.apy}% and compound continuously. Actual earnings may vary.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
