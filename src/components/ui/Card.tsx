import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        'bg-white/90 backdrop-blur-sm rounded-2xl border border-lofi-sand/60 p-6 shadow-md',
        hover && 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-lofi-brown/40 cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  );
}
