'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useUser } from '@/lib/contexts/UserContext';
import { useToast } from '@/lib/contexts/ToastContext';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Button } from '@/components/Button';
import {
  useMUSDBalance,
  useMUSDAllowance,
  useApproveMUSD,
  useSendToUsername,
  useResolveUsername,
} from '@/lib/hooks/useContracts';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { QRCodeSVG as QRCode } from 'qrcode.react';
import { ArrowLeft, Send as SendIcon, Download, User, DollarSign, MessageSquare, CheckCircle, XCircle, Copy, Wallet, Zap, Shield } from 'lucide-react';
import { formatUnits, parseUnits } from 'viem';

export default function Send() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { user } = useUser();
  const { showToast } = useToast();
  const [mode, setMode] = useState<'send' | 'receive'>('send');
  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [recipientFound, setRecipientFound] = useState<any>(null);

  // Contract hooks
  const { data: musdBalance, refetch: refetchBalance } = useMUSDBalance(address);
  const { data: allowance, refetch: refetchAllowance } = useMUSDAllowance(address, CONTRACT_ADDRESSES.PAYMENTS);
  const { approve, isPending: isApproving, isConfirming: isApprovingConfirming } = useApproveMUSD();
  const { sendToUsername, isPending: isSending, isConfirming: isSendingConfirming, isSuccess: sendSuccess, hash } = useSendToUsername();

  const balance = musdBalance ? formatUnits(musdBalance, 18) : '0.00';

  useEffect(() => {
    if (!isConnected || !user) {
      router.push('/');
      return;
    }
  }, [isConnected, user, router]);

  // Handle successful transaction
  useEffect(() => {
    if (sendSuccess && hash && recipientFound && address) {
      // Transaction recorded on blockchain, no backend needed
      showToast(`Successfully sent $${amount} to @${recipientFound.username}!`, 'success');
      setUsername('');
      setAmount('');
      setNote('');
      setRecipientFound(null);
      refetchBalance();
    }
  }, [sendSuccess, hash, recipientFound, address, amount, showToast, refetchBalance]);

  const loadBalance = () => {
    refetchBalance();
    refetchAllowance();
  };

  const searchUser = async () => {
    if (!username || username.length < 3) {
      setRecipientFound(null);
      return;
    }

    setSearchLoading(true);
    try {
      // Search for user on blockchain
      // This will be implemented when we add useResolveUsername hook
      // For now, just show that user search needs blockchain integration
      setRecipientFound(null);
      showToast('Username search will be implemented with blockchain', 'info');
    } catch (error) {
      setRecipientFound(null);
    } finally {
      setSearchLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (username) {
        searchUser();
      } else {
        setRecipientFound(null);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [username]);

  const handleSend = async () => {
    if (!recipientFound) {
      showToast('Please enter a valid username', 'warning');
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

    try {
      // Check if approval is needed
      const amountWei = parseUnits(amount, 18);
      const allowanceWei = allowance || BigInt(0);

      if (allowanceWei < amountWei) {
        showToast('Approving MUSD for payment...', 'info');
        approve(CONTRACT_ADDRESSES.PAYMENTS, amountWei);
        await refetchAllowance();
      } else {
        // Send payment through contract
        sendToUsername(username, amountWei, note || '');
      }
      // The success case is handled by the useEffect hook above
    } catch (error: any) {
      console.error('Send error:', error);
      showToast(error.message || 'Transaction failed', 'error');
    }
  };

  const isLoading = isApproving || isApprovingConfirming || isSending || isSendingConfirming;
  const loadingText = isApproving
    ? 'Approve in wallet...'
    : isApprovingConfirming
    ? 'Approving...'
    : isSending
    ? 'Confirm in wallet...'
    : isSendingConfirming
    ? 'Sending...'
    : 'Send Payment';

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    showToast(`${label} copied to clipboard!`, 'success');
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
              <SendIcon className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-secondary">Send & Receive</h1>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Mode Tabs */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8 border border-border animate-fade-in">
          <div className="flex border-b border-border">
            <button
              onClick={() => setMode('send')}
              className={`flex-1 py-4 font-semibold transition-all duration-standard relative ${
                mode === 'send'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <SendIcon className="w-5 h-5" />
                Send Money
              </span>
              {mode === 'send' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark"></div>
              )}
            </button>
            <button
              onClick={() => setMode('receive')}
              className={`flex-1 py-4 font-semibold transition-all duration-standard relative ${
                mode === 'receive'
                  ? 'text-primary'
                  : 'text-text-secondary hover:text-text-primary hover:bg-background'
              }`}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Receive Money
              </span>
              {mode === 'receive' && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-primary-dark"></div>
              )}
            </button>
          </div>

          {mode === 'send' ? (
            <div className="p-8 animate-scale-in">
              {/* Balance Display */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-blue-700 font-medium">Available Balance</p>
                      <p className="text-3xl font-bold text-blue-900">${balance}</p>
                    </div>
                  </div>
                  <Button
                    onClick={loadBalance}
                    variant="secondary"
                    size="sm"
                  >
                    Refresh
                  </Button>
                </div>
              </div>

              {/* Recipient Search */}
              <div className="mb-6">
                <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                  <User className="w-4 h-4 text-primary" />
                  Send To
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary text-lg">@</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-12 py-4 text-lg border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                    placeholder="username"
                    disabled={isLoading}
                  />
                  {searchLoading && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>

                {/* User Found */}
                {recipientFound && (
                  <div className="mt-3 p-4 bg-gradient-to-r from-success/10 to-green-50 border border-success rounded-xl animate-scale-in">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-6 h-6 text-success flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-success-dark">
                          User found: @{recipientFound.username}
                        </p>
                        <p className="text-xs text-success-dark/70 font-mono mt-1">
                          {recipientFound.walletAddress.slice(0, 10)}...{recipientFound.walletAddress.slice(-8)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* User Not Found */}
                {username && !recipientFound && !searchLoading && username.length >= 3 && (
                  <div className="mt-3 p-4 bg-error/10 border border-error rounded-xl animate-scale-in">
                    <div className="flex items-center gap-3">
                      <XCircle className="w-5 h-5 text-error flex-shrink-0" />
                      <p className="text-sm text-error-dark">User not found. Please check the username.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Amount Input */}
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
                    disabled={isLoading}
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              {/* Note Input */}
              <div className="mb-8">
                <label className="flex items-center gap-2 text-sm font-semibold text-text-primary mb-3">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  Note (Optional)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="What's this payment for?"
                  disabled={isLoading}
                  maxLength={100}
                />
                <p className="text-xs text-text-secondary mt-2">{note.length}/100 characters</p>
              </div>

              {/* Send Button */}
              <Button
                onClick={handleSend}
                disabled={isLoading || !recipientFound || !amount || parseFloat(amount) <= 0}
                loading={isLoading}
                className="w-full"
                size="lg"
              >
                <SendIcon className="w-5 h-5 mr-2" />
                {loadingText}
              </Button>

              {/* Features Grid */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="text-center p-4 bg-background rounded-xl">
                  <Zap className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-text-primary">Instant</p>
                  <p className="text-xs text-text-secondary mt-1">&lt;1 second</p>
                </div>
                <div className="text-center p-4 bg-background rounded-xl">
                  <DollarSign className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-text-primary">Zero Fees</p>
                  <p className="text-xs text-text-secondary mt-1">No charges</p>
                </div>
                <div className="text-center p-4 bg-background rounded-xl">
                  <Shield className="w-6 h-6 text-primary mx-auto mb-2" />
                  <p className="text-xs font-semibold text-text-primary">Secure</p>
                  <p className="text-xs text-text-secondary mt-1">Non-custodial</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center animate-scale-in">
              {/* QR Code */}
              <div className="mb-8">
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 p-8 rounded-2xl inline-block border-4 border-white shadow-lg">
                  <QRCode
                    value={JSON.stringify({
                      username: user.username,
                      address: address,
                    })}
                    size={256}
                    level="H"
                    className="rounded-xl"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="mb-6 space-y-4">
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-6 border border-primary/20">
                  <p className="text-sm text-text-secondary mb-2">Your Username</p>
                  <div className="flex items-center justify-center gap-3">
                    <p className="text-3xl font-bold text-primary">@{user.username}</p>
                    <button
                      onClick={() => copyToClipboard(user.username, 'Username')}
                      className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
                    >
                      <Copy className="w-5 h-5 text-primary" />
                    </button>
                  </div>
                </div>

                <div className="bg-background rounded-xl p-6 border border-border">
                  <p className="text-sm text-text-secondary mb-2">Your Wallet Address</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-sm font-mono bg-white px-4 py-2 rounded-lg border border-border break-all">
                      {address}
                    </p>
                    <button
                      onClick={() => copyToClipboard(address || '', 'Address')}
                      className="p-2 hover:bg-border rounded-lg transition-colors flex-shrink-0"
                    >
                      <Copy className="w-5 h-5 text-text-secondary" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-gradient-to-r from-info/10 to-blue-50 border border-info/20 rounded-xl p-6">
                <h3 className="text-lg font-bold text-info-dark mb-3">How to Receive Payments</h3>
                <ul className="text-left space-y-2 text-sm text-info-dark">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Share your username (@{user.username}) with the sender</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Or let them scan your QR code</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">•</span>
                    <span>Funds arrive instantly with zero fees</span>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
