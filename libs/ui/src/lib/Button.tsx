import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border-blue-600',
  secondary:
    'bg-transparent hover:bg-slate-800 active:bg-slate-700 text-slate-200 border-slate-600',
  ghost:
    'bg-transparent hover:bg-slate-800 active:bg-slate-700 text-slate-400 border-transparent',
  danger:
    'bg-red-700 hover:bg-red-600 active:bg-red-800 text-white border-red-700',
};

export function Button({
  variant = 'primary',
  fullWidth = false,
  loading = false,
  children,
  className = '',
  disabled,
  ...rest
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 border font-semibold rounded-xl px-5 py-3 text-sm tracking-wide transition-colors duration-150 active:scale-95 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';
  const width = fullWidth ? 'w-full' : '';
  const disabledCls =
    disabled || loading ? 'opacity-50 pointer-events-none' : '';

  return (
    <button
      className={`${base} ${variantClasses[variant]} ${width} ${disabledCls} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading && (
        <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  );
}
