'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useUser } from '@/lib/contexts/UserContext';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Wallet, Send, ShoppingCart, TrendingUp, Shield, Zap, ArrowRight, Bitcoin } from 'lucide-react';
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
      title: 'Save',
      description: 'Deposit Bitcoin, borrow MUSD at 1:1.5 ratio, and earn 5% APY through Mezo\'s savings vault',
      gradient: 'from-emerald-500 to-teal-600',
    },
    {
      icon: Send,
      title: 'Send',
      description: 'Send money instantly to anyone by username. Zero fees, zero delays, maximum convenience',
      gradient: 'from-blue-500 to-indigo-600',
    },
    {
      icon: ShoppingCart,
      title: 'Spend',
      description: 'Buy airtime, data bundles, and gift cards for 150+ countries directly from your wallet',
      gradient: 'from-purple-500 to-pink-600',
    },
  ];

  const stats = [
    { label: 'Zero Fees', value: '$0', icon: TrendingUp },
    { label: 'APY', value: '5%', icon: TrendingUp },
    { label: 'Transaction Speed', value: '<1s', icon: Zap },
    { label: 'Security', value: '100%', icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-secondary-light to-secondary relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1000ms' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12">
        <div className="max-w-7xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2 mb-6">
              <Bitcoin className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary-light font-medium">Built on Mezo Protocol</span>
            </div>

            {/* Logo and Title */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Image
                src="/logo.png"
                alt="BitSave Logo"
                width={80}
                height={80}
                className="animate-scale-in"
              />
              <h1 className="text-6xl md:text-8xl font-extrabold text-white leading-tight">
                Bit<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-primary to-primary-dark">Save</span>
              </h1>
            </div>

            <p className="text-2xl md:text-3xl text-gray-300 mb-4 font-light">
              Bank on Your Bitcoin
            </p>

            <p className="text-lg text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed">
              Save, Send, and Spend with Bitcoin-backed MUSD. Experience the future of finance with instant transactions,
              zero fees, and complete self-custody. No banks, no borders, no limits.
            </p>

            <div className="flex justify-center mb-12">
              <div className="transform hover:scale-105 transition-transform duration-standard">
                <ConnectWallet />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-16">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 hover:bg-white/10 transition-all duration-standard animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 hover:border-primary/50 transition-all duration-standard hover:-translate-y-2 hover:shadow-glow-lg animate-fade-in"
                style={{ animationDelay: `${200 + index * 150}ms` }}
              >
                {/* Icon with gradient background */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-3.5 mb-6 group-hover:scale-110 transition-transform duration-standard shadow-lg`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>

                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary transition-colors">
                  {feature.title}
                </h3>

                <p className="text-gray-400 leading-relaxed mb-4">
                  {feature.description}
                </p>

                <div className="flex items-center text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-standard">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform duration-standard" />
                </div>

                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-standard pointer-events-none`}></div>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary-dark to-primary rounded-2xl p-12 shadow-glow-lg animate-fade-in" style={{ animationDelay: '800ms' }}>
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Bitcoin Banking Journey?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Connect your wallet and experience the future of financial freedom powered by Bitcoin
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <ConnectWallet />
              <a
                href="https://mezo.org/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white rounded-xl font-semibold transition-all duration-standard hover:scale-105 flex items-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400">
              Powered by{' '}
              <a
                href="https://mezo.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-light font-medium transition-colors"
              >
                Mezo Protocol
              </a>
              {' '}— The Bitcoin L2 for DeFi
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
