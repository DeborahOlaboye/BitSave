'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useUser } from '@/lib/contexts/UserContext';
import { useToast } from '@/lib/contexts/ToastContext';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Button } from '@/components/Button';
import { ArrowLeft, Bitcoin, DollarSign, TrendingUp, Info, AlertTriangle, Shield, Zap } from 'lucide-react';

export default function Deposit() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { user } = useUser();
  const { showToast } = useToast();
  const [btcAmount, setBtcAmount] = useState('');
  const [loading, setLoading] = useState(false);
  // TODO: Fetch BTC price from a price oracle or API (CoinGecko, CoinMarketCap)
  const [btcPrice, setBtcPrice] = useState(50000); // Fallback price

  useEffect(() => {
    if (!isConnected || !user) {
      router.push('/');
      return;
    }

    loadBtcPrice();
  }, [isConnected, user, router]);

  const loadBtcPrice = async () => {
    try {
      // TODO: Integrate with a price oracle or free API
      // For now, use fallback price
      setBtcPrice(50000);
    } catch (error) {
      console.error('Error loading BTC price:', error);
      setBtcPrice(50000);
    }
  };

  const usdValue = btcAmount ? (parseFloat(btcAmount) * btcPrice).toFixed(2) : '0.00';
  const expectedMusd = btcAmount ? (parseFloat(btcAmount) * btcPrice * 0.66).toFixed(2) : '0.00'; // 150% collateral ratio = 66% LTV
  const collateralRatio = 150;
  const interestRate = 1; // 1% annual interest
  const minDepositUsd = 1800;
  const minDepositBtc = (minDepositUsd / btcPrice).toFixed(6);

  const handleDeposit = async () => {
    if (!btcAmount || parseFloat(btcAmount) <= 0) {
      showToast('Please enter a valid BTC amount', 'warning');
      return;
    }

    if (parseFloat(usdValue) < minDepositUsd) {
      showToast(`Minimum deposit is $${minDepositUsd} (${minDepositBtc} BTC)`, 'warning');
      return;
    }

    setLoading(true);

    try {
      // TODO: Implement BTC deposit and MUSD borrowing through Mezo Protocol
      // For now, show a message that this feature is coming soon
      showToast('BTC deposit and MUSD borrowing feature coming soon! Please get MUSD from testnet faucet for now.', 'info');

      // Alternative: Users can get testnet MUSD from a faucet or airdrop
      // The savings and payment features are fully functional

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error: any) {
      console.error('Deposit error:', error);
      showToast(error.message || 'Deposit failed', 'error');
    } finally {
      setLoading(false);
    }
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
              <Bitcoin className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-secondary">Deposit BTC</h1>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Info Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-orange-50 border border-primary/20 rounded-2xl p-6 mb-8 animate-fade-in">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Info className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-secondary mb-2">How it Works</h3>
              <p className="text-text-secondary leading-relaxed">
                Deposit Bitcoin as collateral and borrow MUSD (Bitcoin-backed stablecoin) against it.
                Your BTC remains secure while you get instant access to dollar liquidity.
                Maintain at least 150% collateral ratio to avoid liquidation.
              </p>
            </div>
          </div>
        </div>

        {/* Main Deposit Card */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8 border border-border animate-scale-in" style={{ animationDelay: '200ms' }}>
          <div className="bg-gradient-to-r from-primary to-primary-dark p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm mb-1">BTC Price (USD)</p>
                <p className="text-3xl font-bold">${btcPrice.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Bitcoin className="w-10 h-10" />
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* BTC Amount Input */}
            <div className="mb-6">
              <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                <Bitcoin className="w-4 h-4 text-primary" />
                BTC Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-text-secondary font-light">₿</span>
                <input
                  type="number"
                  value={btcAmount}
                  onChange={(e) => setBtcAmount(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 text-2xl border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="0.00000000"
                  disabled={loading}
                  step="0.00000001"
                  min="0"
                />
              </div>
              <p className="text-sm text-text-secondary mt-2">
                USD Value: <span className="font-semibold text-text-primary">${parseFloat(usdValue).toLocaleString()}</span>
              </p>
            </div>

            {/* Quick Select */}
            <div className="grid grid-cols-4 gap-3 mb-8">
              {[
                { btc: '0.01', label: '0.01' },
                { btc: '0.05', label: '0.05' },
                { btc: '0.1', label: '0.1' },
                { btc: '0.5', label: '0.5' },
              ].map((option) => (
                <button
                  key={option.btc}
                  onClick={() => setBtcAmount(option.btc)}
                  className="py-3 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
                  disabled={loading}
                >
                  {option.label} BTC
                </button>
              ))}
            </div>

            {/* Minimum Deposit Warning */}
            {btcAmount && parseFloat(usdValue) < minDepositUsd && (
              <div className="mb-6 p-4 bg-warning/10 border border-warning rounded-xl animate-scale-in">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-warning-dark">Minimum Deposit Required</p>
                    <p className="text-sm text-warning-dark/70 mt-1">
                      You need to deposit at least ${minDepositUsd} ({minDepositBtc} BTC) to borrow MUSD.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Transaction Summary */}
            {btcAmount && parseFloat(btcAmount) > 0 && parseFloat(usdValue) >= minDepositUsd && (
              <div className="mb-8 space-y-4 animate-fade-in">
                <h3 className="text-lg font-bold text-secondary">Transaction Summary</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-5 h-5 text-blue-600" />
                      <p className="text-sm font-medium text-text-secondary">You&apos;ll Receive</p>
                    </div>
                    <p className="text-3xl font-bold text-blue-600">${parseFloat(expectedMusd).toLocaleString()}</p>
                    <p className="text-xs text-text-secondary mt-1">MUSD</p>
                  </div>

                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-5 h-5 text-emerald-600" />
                      <p className="text-sm font-medium text-text-secondary">Collateral Ratio</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-600">{collateralRatio}%</p>
                    <p className="text-xs text-text-secondary mt-1">Safe ratio</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-background to-gray-50 border border-border rounded-xl p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">BTC Collateral</span>
                      <span className="text-sm font-semibold text-text-primary">{btcAmount} BTC</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Collateral Value</span>
                      <span className="text-sm font-semibold text-text-primary">${parseFloat(usdValue).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">Annual Interest Rate</span>
                      <span className="text-sm font-semibold text-text-primary">{interestRate}%</span>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <span className="text-sm font-semibold text-text-primary">MUSD to Receive</span>
                      <span className="text-lg font-bold text-primary">${parseFloat(expectedMusd).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Deposit Button */}
            <Button
              onClick={handleDeposit}
              disabled={loading || !btcAmount || parseFloat(btcAmount) <= 0 || parseFloat(usdValue) < minDepositUsd}
              loading={loading}
              className="w-full"
              size="lg"
            >
              <Bitcoin className="w-5 h-5 mr-2" />
              Deposit BTC & Borrow MUSD
            </Button>

            {/* Info Footer */}
            <div className="mt-6 p-4 bg-gradient-to-r from-info/10 to-blue-50 border border-info/20 rounded-xl">
              <div className="flex gap-3">
                <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm text-info-dark">
                  <p>
                    <strong>Non-custodial:</strong> Your Bitcoin remains on Mezo&apos;s secure Bitcoin Layer 2.
                    You maintain full control of your collateral.
                  </p>
                  <p>
                    <strong>Liquidation Protection:</strong> Keep your collateral ratio above 150% to avoid liquidation.
                    You can add more BTC anytime or repay your MUSD loan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '400ms' }}>
          <div className="bg-white rounded-xl shadow-md p-6 border border-border hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-secondary mb-2">Instant Borrowing</h3>
            <p className="text-sm text-text-secondary">
              Get MUSD in seconds after depositing your Bitcoin. No credit checks or paperwork.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-border hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-secondary mb-2">100% Secure</h3>
            <p className="text-sm text-text-secondary">
              Your BTC is secured on Mezo&apos;s Bitcoin Layer 2. Smart contracts ensure safety.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-border hover:shadow-lg transition-all">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-lg font-bold text-secondary mb-2">Low Interest</h3>
            <p className="text-sm text-text-secondary">
              Only {interestRate}% annual interest on your MUSD loan. No hidden fees.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
