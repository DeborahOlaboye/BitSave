'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useUser } from '@/lib/contexts/UserContext';
import { useToast } from '@/lib/contexts/ToastContext';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Button } from '@/components/Button';
import {
  useGetUserGoals,
  useGetTotalSavings,
  useCreateGoal,
  useDepositToGoal,
  useWithdrawFromGoal,
  useMUSDBalance,
  useMUSDAllowance,
  useApproveMUSD,
} from '@/lib/hooks/useContracts';
import { CONTRACT_ADDRESSES } from '@/lib/contracts/addresses';
import { ArrowLeft, PiggyBank, Plus, Calendar, Info, Target } from 'lucide-react';
import { formatUnits, parseUnits } from 'viem';

export default function Save() {
  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { user } = useUser();
  const { showToast } = useToast();

  // UI State
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);

  // Form state
  const [goalName, setGoalName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  // Contract hooks
  const { data: goals, refetch: refetchGoals } = useGetUserGoals(address);
  const { data: totalSavings, refetch: refetchTotal } = useGetTotalSavings(address);
  const { data: musdBalance } = useMUSDBalance(address);
  const { data: allowance, refetch: refetchAllowance } = useMUSDAllowance(address, CONTRACT_ADDRESSES.VAULT);

  const { createGoal, isPending: isCreating, isConfirming: isCreatingConfirming, isSuccess: createSuccess } = useCreateGoal();
  const { deposit, isPending: isDepositing, isConfirming: isDepositingConfirming, isSuccess: depositSuccess } = useDepositToGoal();
  const { withdraw, isPending: isWithdrawing, isConfirming: isWithdrawingConfirming, isSuccess: withdrawSuccess } = useWithdrawFromGoal();
  const { approve, isPending: isApproving, isConfirming: isApprovingConfirming } = useApproveMUSD();

  const balance = musdBalance ? formatUnits(musdBalance, 18) : '0.00';
  const total = totalSavings ? formatUnits(totalSavings, 18) : '0.00';

  useEffect(() => {
    if (!isConnected || !user) {
      router.push('/');
      return;
    }
  }, [isConnected, user, router]);

  // Handle successful operations
  useEffect(() => {
    if (createSuccess) {
      showToast('Goal created successfully!', 'success');
      setShowCreateGoal(false);
      setGoalName('');
      setTargetAmount('');
      setUnlockDate('');
      refetchGoals();
    }
  }, [createSuccess, showToast, refetchGoals]);

  useEffect(() => {
    if (depositSuccess) {
      showToast('Deposit successful!', 'success');
      setShowDepositModal(false);
      setDepositAmount('');
      refetchGoals();
      refetchTotal();
    }
  }, [depositSuccess, showToast, refetchGoals, refetchTotal]);

  useEffect(() => {
    if (withdrawSuccess) {
      showToast('Withdrawal successful!', 'success');
      refetchGoals();
      refetchTotal();
    }
  }, [withdrawSuccess, showToast, refetchGoals, refetchTotal]);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!goalName || !targetAmount) {
      showToast('Please fill in all required fields', 'warning');
      return;
    }

    try {
      const unlockTime = unlockDate ? BigInt(Math.floor(new Date(unlockDate).getTime() / 1000)) : BigInt(0);
      const targetAmountWei = parseUnits(targetAmount, 18);
      createGoal(goalName, targetAmountWei, unlockTime);
    } catch (error: any) {
      console.error('Error creating goal:', error);
      showToast(error.message || 'Failed to create goal', 'error');
    }
  };

  const handleDeposit = async () => {
    if (!depositAmount || selectedGoalId === null) {
      showToast('Please enter an amount', 'warning');
      return;
    }

    if (parseFloat(depositAmount) > parseFloat(balance)) {
      showToast('Insufficient balance', 'error');
      return;
    }

    try {
      // Check if approval is needed
      const amountWei = parseUnits(depositAmount, 18);
      const allowanceWei = allowance || BigInt(0);

      if (allowanceWei < amountWei) {
        showToast('Approving MUSD...', 'info');
        approve(CONTRACT_ADDRESSES.VAULT, amountWei);
        await refetchAllowance();
      } else {
        deposit(BigInt(selectedGoalId), amountWei);
      }
    } catch (error: any) {
      console.error('Error depositing:', error);
      showToast(error.message || 'Failed to deposit', 'error');
    }
  };

  const handleWithdraw = async (goalId: number) => {
    try {
      withdraw(BigInt(goalId), BigInt(0)); // 0 means withdraw all
    } catch (error: any) {
      console.error('Error withdrawing:', error);
      showToast(error.message || 'Failed to withdraw', 'error');
    }
  };

  const isProcessing = isCreating || isCreatingConfirming || isDepositing || isDepositingConfirming || isWithdrawing || isWithdrawingConfirming || isApproving || isApprovingConfirming;

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
              <h1 className="text-xl font-bold text-secondary">Savings Goals</h1>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Total Savings Card */}
        <div className="bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-700 rounded-2xl shadow-glow-lg p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-white/80 mb-2">Total Savings</p>
                <p className="text-5xl font-bold">${total}</p>
              </div>
              <div className="text-right">
                <p className="text-white/80 mb-2">Wallet Balance</p>
                <p className="text-3xl font-bold">${balance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Goal Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowCreateGoal(!showCreateGoal)}
            className="w-full md:w-auto"
          >
            <Plus className="w-5 h-5 mr-2" />
            Create New Goal
          </Button>
        </div>

        {/* Create Goal Form */}
        {showCreateGoal && (
          <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-border animate-scale-in">
            <h3 className="text-xl font-bold text-secondary mb-4">Create Savings Goal</h3>
            <form onSubmit={handleCreateGoal} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Goal Name
                </label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="e.g., Emergency Fund, Vacation"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Target Amount ($)
                </label>
                <input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="1000"
                  step="0.01"
                  min="0"
                  disabled={isProcessing}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Unlock Date (Optional)
                </label>
                <input
                  type="date"
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  min={new Date().toISOString().split('T')[0]}
                  disabled={isProcessing}
                />
                <p className="text-xs text-text-secondary mt-1">
                  Leave empty for no lock period
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={isProcessing || !goalName || !targetAmount}
                  loading={isCreating || isCreatingConfirming}
                  className="flex-1"
                >
                  {isCreating ? 'Confirm in wallet...' : isCreatingConfirming ? 'Creating...' : 'Create Goal'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowCreateGoal(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Goals List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals && goals.length > 0 ? (
            goals.map((goal, index) => {
              const amount = formatUnits(goal.amount, 18);
              const target = formatUnits(goal.targetAmount, 18);
              const progress = (parseFloat(amount) / parseFloat(target)) * 100;
              const isLocked = goal.unlockTime > 0 && Number(goal.unlockTime) * 1000 > Date.now();
              const unlockDateStr = goal.unlockTime > 0 ? new Date(Number(goal.unlockTime) * 1000).toLocaleDateString() : 'No lock';

              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-md p-6 border-2 transition-all ${
                    goal.isActive ? 'border-border hover:border-primary' : 'border-gray-300 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-secondary">{goal.name}</h3>
                      {isLocked && (
                        <p className="text-xs text-warning mt-1 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Locked until {unlockDateStr}
                        </p>
                      )}
                    </div>
                    <Target className="w-6 h-6 text-primary" />
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-text-secondary">Progress</span>
                      <span className="font-semibold">{progress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className="bg-gradient-to-r from-primary to-emerald-500 h-2 rounded-full transition-all"
                        style={{ width: `${Math.min(progress, 100)}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-text-secondary">${amount}</span>
                      <span className="font-semibold text-primary">${target}</span>
                    </div>
                  </div>

                  {goal.isActive && (
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedGoalId(index);
                          setShowDepositModal(true);
                        }}
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        disabled={isProcessing}
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Deposit
                      </Button>
                      {!isLocked && parseFloat(amount) > 0 && (
                        <Button
                          onClick={() => handleWithdraw(index)}
                          variant="secondary"
                          size="sm"
                          className="flex-1"
                          disabled={isProcessing}
                          loading={isWithdrawing || isWithdrawingConfirming}
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="col-span-2 text-center py-12">
              <PiggyBank className="w-16 h-16 text-text-secondary mx-auto mb-4 opacity-50" />
              <p className="text-text-secondary mb-4">No savings goals yet</p>
              <Button onClick={() => setShowCreateGoal(true)}>
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Goal
              </Button>
            </div>
          )}
        </div>

        {/* Deposit Modal */}
        {showDepositModal && selectedGoalId !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
              <h3 className="text-xl font-bold text-secondary mb-4">Deposit to Goal</h3>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-text-primary mb-2">
                  Amount ($)
                </label>
                <input
                  type="number"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-border rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={isProcessing}
                />
                <p className="text-xs text-text-secondary mt-1">
                  Available: ${balance}
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={handleDeposit}
                  disabled={isProcessing || !depositAmount || parseFloat(depositAmount) <= 0}
                  loading={isApproving || isApprovingConfirming || isDepositing || isDepositingConfirming}
                  className="flex-1"
                >
                  {isApproving ? 'Approve...' : isApprovingConfirming ? 'Approving...' : isDepositing ? 'Confirm...' : isDepositingConfirming ? 'Depositing...' : 'Deposit'}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowDepositModal(false);
                    setDepositAmount('');
                  }}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-8 p-6 bg-gradient-to-r from-info/10 to-blue-50 border border-info/20 rounded-xl">
          <div className="flex gap-3">
            <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
            <div className="text-sm text-info-dark">
              <p className="font-semibold mb-2">About Savings Goals</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Create multiple goals for different purposes</li>
                <li>Set target amounts and optional unlock dates</li>
                <li>Funds are held securely in the smart contract</li>
                <li>Withdraw anytime if not locked</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
