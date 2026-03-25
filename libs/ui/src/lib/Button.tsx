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
    'bg-blue-600 hover:bg-blue-500 text-white shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(37,99,235,0.6)]',
  secondary:
    'bg-slate-800/80 hover:bg-slate-700/80 text-white border border-white/[0.05] shadow-lg',
  ghost:
    'bg-transparent hover:bg-white/[0.02] text-slate-400 hover:text-slate-200',
  danger:
    'bg-red-600 hover:bg-red-500 text-white shadow-[0_8px_20px_-4px_rgba(220,38,38,0.4)]',
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
    'inline-flex items-center justify-center gap-2 font-bold rounded-2xl px-6 py-4 text-[13px] uppercase tracking-[0.1em] transition-all duration-300 active:scale-[0.98] select-none focus:outline-none focus:ring-4 focus:ring-blue-500/10';
  const width = fullWidth ? 'w-full' : '';
  const disabledCls =
    disabled || loading ? 'opacity-50 pointer-events-none' : '';

  return (
    <button
      className={`${base} ${variantClasses[variant]} ${width} ${disabledCls} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
}
