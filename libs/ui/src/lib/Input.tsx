import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({ label, error, icon, className = '', id, ...rest }: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-semibold uppercase tracking-widest text-slate-400"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {icon && (
          <span className="absolute left-4 text-slate-500 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={inputId}
          className={`w-full bg-slate-800 border ${
            error ? 'border-red-500' : 'border-slate-700'
          } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors duration-150 ${
            icon ? 'pl-11' : ''
          } ${className}`}
          {...rest}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
