import { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface AlertProps {
  type: 'success' | 'warning' | 'error' | 'info';
  title?: string;
  children: ReactNode;
  className?: string;
  onClose?: () => void;
}

export function Alert({ type, title, children, className, onClose }: AlertProps) {
  const styles = {
    success: 'bg-lofi-sage/10 border-lofi-sage text-lofi-sage',
    warning: 'bg-lofi-peach/20 border-lofi-peach text-lofi-darkBrown',
    error: 'bg-lofi-rose/20 border-lofi-rose text-lofi-coffee',
    info: 'bg-lofi-lavender/10 border-lofi-lavender text-lofi-coffee',
  };

  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕',
    info: 'ⓘ',
  };

  return (
    <div
      className={cn(
        'relative p-4 border-l-4 rounded-r-lg animate-fade-in',
        styles[type],
        className
      )}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <span className="text-xl font-bold flex-shrink-0 mt-0.5">
          {icons[type]}
        </span>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="font-semibold mb-1">{title}</h4>
          )}
          <div className="text-sm opacity-90">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
            aria-label="Close alert"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
