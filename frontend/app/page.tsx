'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useUser } from '@/lib/contexts/UserContext';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Wallet, Send, TrendingUp, Shield, Zap, ArrowRight, Bitcoin, Lock, Coins } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { user, loading } = useUser();

  useEffect(() => {
    if (isConnected && user) {
      router.push('/dashboard');
    } else if (isConnected && !loading && !user) {
      router.push('/register');
    }
  }, [isConnected, user, loading, router]);

  const features = [
    {
      icon: Wallet,
      title: 'Save & Earn',
      description: 'Deposit Bitcoin, get MUSD stablecoin, and earn 5% APY on your savings through Mezo&apos;s secure vault',
    },
    {
      icon: Send,
      title: 'Send Money',
      description: 'Transfer MUSD instantly to anyone using just their @username. Fast, simple, and free',
    },
    {
      icon: Coins,
      title: 'Receive Payments',
      description: 'Get paid with your unique username. No complicated wallet addresses needed',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Instant Transactions',
      description: 'Send and receive money in seconds, not days',
    },
    {
      icon: Shield,
      title: '100% Secure',
      description: 'Your Bitcoin stays on secure Layer 2, you control it',
    },
    {
      icon: Lock,
      title: 'Non-Custodial',
      description: 'You hold the keys. Your crypto, your control',
    },
    {
      icon: TrendingUp,
      title: '5% APY',
      description: 'Earn while you save with competitive yields',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="BitSave Logo"
                width={48}
                height={48}
                className="rounded-lg"
              />
              <span className="text-2xl font-bold text-secondary">
                Bit<span className="text-primary">Save</span>
              </span>
            </div>
            <ConnectWallet />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-8">
              <Bitcoin className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Built on Mezo Protocol</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl font-bold text-secondary mb-6 leading-tight">
              Bank on Your <span className="text-primary">Bitcoin</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
              Save, send, and earn with Bitcoin-backed stablecoin. No banks, no borders, no fees.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <ConnectWallet />
              <a
                href="https://mezo.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white border-2 border-gray-200 text-secondary rounded-xl font-semibold hover:border-primary hover:text-primary transition-all duration-300 flex items-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">$0</div>
                <div className="text-sm text-gray-600">Transaction Fees</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">5%</div>
                <div className="text-sm text-gray-600">Savings APY</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">&lt;1s</div>
                <div className="text-sm text-gray-600">Transaction Speed</div>
              </div>
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <div className="text-3xl font-bold text-primary mb-1">100%</div>
                <div className="text-sm text-gray-600">Secure</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Simple, powerful tools for your Bitcoin financial journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 border-2 border-gray-100 hover:border-primary hover:shadow-xl transition-all duration-300"
              >
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                  <feature.icon className="w-8 h-8 text-primary" />
                </div>

                <h3 className="text-2xl font-bold text-secondary mb-3">
                  {feature.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
              Why Choose BitSave?
            </h2>
            <p className="text-xl text-gray-600">
              Built for security, designed for simplicity
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
                  <benefit.icon className={`w-8 h-8 ${index % 2 === 0 ? 'text-primary' : 'text-secondary-light'}`} />
                </div>
                <h3 className="text-lg font-bold text-secondary mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-secondary mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Get started in three simple steps
            </p>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-2xl p-8 border-2 border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Connect Your Wallet</h3>
                <p className="text-gray-600">Connect your MetaMask or any Web3 wallet to get started in seconds</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-2xl p-8 border-2 border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 bg-secondary-light rounded-full flex items-center justify-center text-white font-bold text-xl">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Deposit Bitcoin</h3>
                <p className="text-gray-600">Deposit Bitcoin as collateral and get MUSD stablecoin to use instantly</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-start gap-6 bg-white rounded-2xl p-8 border-2 border-gray-100">
              <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold text-secondary mb-2">Save, Send & Earn</h3>
                <p className="text-gray-600">Start saving to earn 5% APY or send money to anyone instantly</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-secondary rounded-3xl p-12 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Connect your wallet and start your Bitcoin banking journey today
            </p>
            <ConnectWallet />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            Powered by{' '}
            <a
              href="https://mezo.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Mezo Protocol
            </a>
            {' '}— The Bitcoin Layer 2 for DeFi
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2024 BitSave. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
