import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface BadgeProps {
  variant: 'success' | 'warning' | 'error' | 'info' | 'default';
  children: ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  const styles = {
    success: 'bg-status-success/20 text-status-success border-status-success',
    warning: 'bg-status-warning/20 text-status-warning border-status-warning',
    error: 'bg-status-error/20 text-status-error border-status-error',
    info: 'bg-status-info/20 text-status-info border-status-info',
    default: 'bg-brand-muted/20 text-brand-text border-brand-muted',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full border',
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
