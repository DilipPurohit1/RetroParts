import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'glow';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:border-accent';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-[13px] gap-1.5',
    md: 'px-4 py-2 text-[14px] gap-2',
    lg: 'px-5 py-2.5 text-[15px] gap-2.5',
  };

  const variantStyles = {
    primary:
      'bg-accent hover:bg-accent-hover text-white border border-transparent',
    secondary:
      'bg-surface hover:bg-surface-raised text-text-primary border border-border hover:border-border-strong',
    outline:
      'bg-transparent hover:bg-surface text-text-secondary hover:text-text-primary border border-border hover:border-border-strong',
    glow:
      'bg-accent hover:bg-accent-hover text-white border border-transparent',
    ghost:
      'bg-transparent hover:bg-surface text-text-muted hover:text-text-primary border border-transparent',
    danger:
      'bg-surface hover:bg-surface-raised text-danger border border-danger/40 hover:border-danger',
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
      ) : (
        leftIcon && <span className="shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  );
};
