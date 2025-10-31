'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAccount } from 'wagmi';
import { useUser } from '../contexts/UserContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface ProtectedPageProps {
  children: React.ReactNode;
  requireUser?: boolean;
}

export const ProtectedPage: React.FC<ProtectedPageProps> = ({ children, requireUser = true }) => {
  const router = useRouter();
  const { isConnected } = useAccount();
  const { user, loading } = useUser();

  useEffect(() => {
    if (!loading) {
      if (!isConnected) {
        router.push('/');
      } else if (requireUser && !user) {
        router.push('/register');
      }
    }
  }, [isConnected, user, loading, requireUser, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isConnected || (requireUser && !user)) {
    return null;
  }

  return <>{children}</>;
};
