import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = '', id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-[10px] font-semibold uppercase tracking-widest text-slate-400/90 ml-1"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-4 text-slate-500 pointer-events-none text-sm">
              {icon}
            </span>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-[#0f172a]/60 shadow-inner border ${error ? 'border-red-500/50' : 'border-white/[0.06] hover:border-blue-500/30'
              } rounded-[16px] px-5 py-3.5 text-[16px] text-white placeholder-slate-600 focus:outline-none focus:bg-[#1e293b]/50 focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/20 transition-all duration-300 ${icon ? 'pl-11' : ''
              } ${className}`}
            {...rest}
          />
        </div>
        {error && <p className="text-xs text-red-500/90 mt-1 ml-1">{error}</p>}
      </div>
    );
  }
);
