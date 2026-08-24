import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'condition' | 'verified' | 'warning' | 'danger' | 'success' | 'copper' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
  icon,
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[12px] gap-1',
    md: 'px-2.5 py-1 text-[13px] gap-1.5',
  };

  const variantStyles = {
    default: 'bg-surface-raised text-text-secondary border-border',
    condition: 'bg-surface-raised text-text-secondary border-border',
    verified: 'bg-verified/15 text-verified border-verified/30',
    warning: 'bg-warning/15 text-warning border-warning/30',
    danger: 'bg-danger/15 text-danger border-danger/30',
    success: 'bg-success/15 text-success border-success/30',
    copper: 'bg-accent-muted text-accent border-accent/40',
    accent: 'bg-accent-muted text-accent border-accent/40',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center font-medium rounded border',
          sizeStyles[size],
          variantStyles[variant] || variantStyles.default,
          className
        )
      )}
    >
      {icon}
      <span>{children}</span>
    </span>
  );
};
