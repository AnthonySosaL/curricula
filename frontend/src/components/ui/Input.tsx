import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-[var(--color-text)]">{label}</label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 rounded-lg border text-sm bg-white',
          'border-[var(--color-border)] text-[var(--color-text)]',
          'placeholder:text-[var(--color-text-muted)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          error && 'border-[var(--color-danger)] focus:ring-[var(--color-danger)]',
          className,
        )}
        {...props}
      />
      {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
    </div>
  ),
);

Input.displayName = 'Input';
