'use client';

import { useState, useEffect } from 'react';
import type { Transaction } from '@/lib/types';
import { apiService } from '@/lib/services/api';
import { LoadingSpinner } from './LoadingSpinner';
import { EmptyState } from './EmptyState';
import { ErrorMessage } from './ErrorMessage';
import { Button } from './Button';
import { Receipt } from 'lucide-react';

interface TransactionHistoryProps {
  userId: number;
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userId }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTransactions();
  }, [userId]);

  const loadTransactions = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await apiService.getTransactions(userId);
      setTransactions(data);
    } catch (err) {
      console.error('Error loading transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'send':
        return '↗';
      case 'receive':
        return '↙';
      case 'deposit':
        return '⬇';
      case 'withdraw':
        return '⬆';
      case 'vault_deposit':
        return '💰';
      case 'vault_withdraw':
        return '💸';
      case 'spend':
        return '🛒';
      default:
        return '•';
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'send':
      case 'withdraw':
      case 'vault_withdraw':
      case 'spend':
        return 'text-error';
      case 'receive':
      case 'deposit':
      case 'vault_deposit':
        return 'text-success';
      default:
        return 'text-text-secondary';
    }
  };

  const getTransactionLabel = (type: string) => {
    switch (type) {
      case 'send':
        return 'Sent';
      case 'receive':
        return 'Received';
      case 'deposit':
        return 'Deposited';
      case 'withdraw':
        return 'Withdrew';
      case 'vault_deposit':
        return 'Vault Deposit';
      case 'vault_withdraw':
        return 'Vault Withdrawal';
      case 'spend':
        return 'Purchase';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <LoadingSpinner size="md" />
        <p className="text-text-secondary mt-4">Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-8">
        <ErrorMessage message={error} className="mb-4" />
        <div className="flex justify-center">
          <Button onClick={loadTransactions} variant="secondary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={Receipt}
        title="No transactions yet"
        description="Your transaction history will appear here"
      />
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => (
        <div
          key={tx.id}
          className="bg-background border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all duration-quick"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getTransactionIcon(tx.type)}</div>
              <div>
                <p className="font-semibold text-text-primary">{getTransactionLabel(tx.type)}</p>
                {tx.recipientUsername && (
                  <p className="text-sm text-text-secondary">
                    {tx.type === 'send' ? 'to' : 'from'} <span className="font-medium">@{tx.recipientUsername}</span>
                  </p>
                )}
                {tx.note && <p className="text-sm text-text-secondary italic">&quot;{tx.note}&quot;</p>}
                <p className="text-xs text-text-secondary mt-1">{formatDate(tx.createdAt)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-bold text-lg ${getTransactionColor(tx.type)}`}>
                {['send', 'withdraw', 'vault_withdraw', 'spend'].includes(tx.type) ? '-' : '+'}$
                {parseFloat(tx.amount).toFixed(2)}
              </p>
              <p
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  tx.status === 'completed'
                    ? 'bg-success/10 text-success'
                    : tx.status === 'pending'
                    ? 'bg-warning/10 text-warning'
                    : 'bg-error/10 text-error'
                }`}
              >
                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
              </p>
            </div>
          </div>
          {tx.txHash && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs text-text-secondary font-mono break-all">
                TX: {tx.txHash.slice(0, 10)}...{tx.txHash.slice(-8)}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
