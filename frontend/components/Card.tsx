import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'feature' | 'balance';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default',
  onClick,
}) => {
  const variants = {
    default: 'card',
    feature: 'card-feature',
    balance: 'bg-gradient-to-br from-primary to-secondary text-white rounded-2xl p-8 shadow-glow-lg',
  };

  return (
    <div className={`${variants[variant]} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};
