import { useState } from 'react';


interface RoomCodeBadgeProps {
  code: string;
}

export function RoomCodeBadge({ code }: RoomCodeBadgeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code).catch(() => null);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Click to copy room code"
      className="flex items-center gap-2 bg-slate-800 border border-slate-700 hover:border-slate-500 rounded-xl px-4 py-2 transition-colors duration-150 group"
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mr-1">
        Room
      </span>
      <span className="font-mono text-sm font-bold tracking-widest text-white uppercase">
        {code}
      </span>
      <span className="text-slate-500 group-hover:text-slate-300 transition-colors ml-1">
        {copied ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-emerald-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        )}
      </span>
    </button>
  );
}
