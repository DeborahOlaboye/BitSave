'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useUser } from '@/lib/contexts/UserContext';
import { useToast } from '@/lib/contexts/ToastContext';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Button } from '@/components/Button';
import { apiService } from '@/lib/services/api';
import { ArrowLeft, ShoppingCart, Phone, Wifi, Gift, Sparkles, Info } from 'lucide-react';

type Category = 'airtime' | 'data' | 'giftcards';

export default function Spend() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { user } = useUser();
  const { showToast } = useToast();
  const [category, setCategory] = useState<Category>('airtime');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState('0.00');

  useEffect(() => {
    if (!isConnected || !user) {
      router.push('/');
      return;
    }

    loadBalance();
  }, [isConnected, user, router]);

  const loadBalance = async () => {
    if (!address) return;

    try {
      const balanceData = await apiService.getBalances(address);
      setBalance(balanceData.musdBalance);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  const handlePurchase = async () => {
    if (!phoneNumber) {
      showToast('Please enter a phone number', 'warning');
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      showToast('Please enter a valid amount', 'warning');
      return;
    }

    if (parseFloat(amount) > parseFloat(balance)) {
      showToast('Insufficient balance', 'error');
      return;
    }

    setLoading(true);

    try {
      // In production, this would integrate with Bitrefill API
      // For now, we'll just record the transaction

      if (user) {
        await apiService.createTransaction({
          userId: user.id,
          type: 'spend',
          amount,
          status: 'completed',
          note: `${category} purchase for ${phoneNumber}`,
          metadata: {
            category,
            phoneNumber,
          },
        });
      }

      showToast(`Purchase successful! $${amount} ${category} sent to ${phoneNumber}`, 'success');
      setPhoneNumber('');
      setAmount('');
      await loadBalance();
    } catch (error: any) {
      console.error('Purchase error:', error);
      showToast(error.message || 'Purchase failed', 'error');
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
              <ShoppingCart className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-secondary">Spend</h1>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Balance Card */}
        <div className="bg-gradient-to-br from-purple-500 via-purple-600 to-purple-700 rounded-2xl shadow-glow-lg p-8 mb-8 text-white relative overflow-hidden animate-fade-in">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10">
            <p className="text-white/80 text-sm mb-1 font-medium">Available Balance</p>
            <h2 className="text-5xl font-bold mb-2">${balance}</h2>
            <p className="text-white/70 text-sm">Ready to spend on airtime, data & more</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8 border border-border animate-scale-in" style={{ animationDelay: '200ms' }}>
          <div className="flex border-b border-border">
            <button
              onClick={() => setCategory('airtime')}
              className={`flex-1 py-4 font-semibold transition-all duration-standard relative ${
                category === 'airtime'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Phone className="w-5 h-5" />
                Airtime
              </span>
              {category === 'airtime' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark"></div>
              )}
            </button>
            <button
              onClick={() => setCategory('data')}
              className={`flex-1 py-4 font-semibold transition-all duration-standard relative ${
                category === 'data'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Wifi className="w-5 h-5" />
                Data
              </span>
              {category === 'data' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark"></div>
              )}
            </button>
            <button
              onClick={() => setCategory('giftcards')}
              className={`flex-1 py-4 font-semibold transition-all duration-standard relative ${
                category === 'giftcards'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Gift className="w-5 h-5" />
                Gift Cards
              </span>
              {category === 'giftcards' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark"></div>
              )}
            </button>
          </div>

          <div className="p-8">
            {category !== 'giftcards' ? (
              <>
                {/* Phone Number */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                    <Phone className="w-4 h-4 text-primary" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="+234 XXX XXX XXXX"
                    disabled={loading}
                  />
                </div>

                {/* Amount */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                    <Sparkles className="w-4 h-4 text-primary" />
                    Amount (USD)
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
                  {['5', '10', '20', '50'].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAmount(val)}
                      className="py-3 border-2 border-border rounded-xl hover:border-primary hover:bg-primary/5 text-sm font-semibold transition-all active:scale-95 disabled:opacity-50"
                      disabled={loading}
                    >
                      ${val}
                    </button>
                  ))}
                </div>

                {/* Purchase Button */}
                <Button
                  onClick={handlePurchase}
                  disabled={loading || !phoneNumber || !amount || parseFloat(amount) <= 0}
                  loading={loading}
                  className="w-full"
                  size="lg"
                >
                  Purchase {category === 'airtime' ? 'Airtime' : 'Data'}
                </Button>

                {/* Info */}
                <div className="mt-6 p-4 bg-gradient-to-r from-info/10 to-blue-50 border border-info/20 rounded-xl">
                  <div className="flex gap-3">
                    <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-info-dark">
                      {category === 'airtime'
                        ? 'Instant airtime top-up powered by Bitrefill. Delivered in seconds.'
                        : 'Instant data bundle purchase. Available for major carriers.'}
                    </p>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-primary/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Gift className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Gift Cards Coming Soon</h3>
                <p className="text-text-secondary max-w-md mx-auto leading-relaxed">
                  Purchase gift cards for Amazon, iTunes, Google Play, and more with MUSD.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Supported Providers */}
        {category !== 'giftcards' && (
          <div className="bg-white rounded-2xl shadow-md p-8 border border-border animate-fade-in" style={{ animationDelay: '400ms' }}>
            <h3 className="text-lg font-bold text-secondary mb-6">Supported Providers</h3>
            <div className="grid grid-cols-3 gap-4">
              {['MTN', 'Airtel', 'Glo', '9mobile', 'Smile', '+ More'].map((provider, index) => (
                <div
                  key={provider}
                  className="text-center p-4 bg-gradient-to-br from-background to-gray-50 rounded-xl border border-border hover:border-primary/30 hover:shadow-md transition-all duration-standard"
                  style={{ animationDelay: `${(index + 1) * 50}ms` }}
                >
                  <p className={`font-semibold ${provider === '+ More' ? 'text-text-secondary' : 'text-text-primary'}`}>
                    {provider}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
