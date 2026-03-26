import { Message } from '@sketch-battle/types';

interface ChatItemProps {
  message: Message;
  isOwn: boolean;
}

export function ChatItem({ message, isOwn }: ChatItemProps) {
  const isSystem = message.type === 'SYSTEM';

  if (isSystem) {
    return (
      <div className="flex items-center justify-center my-2 px-4">
        <span className="text-[10px] font-bold text-slate-500/80 uppercase tracking-[0.2em] bg-slate-800/20 px-4 py-1.5 rounded-full border border-white/[0.02] backdrop-blur-md">
          {message.text}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1 w-full ${isOwn ? 'items-end' : 'items-start'}`}>
      <div className={`flex items-center gap-2 px-1 ${isOwn ? 'flex-row-reverse' : ''}`}>
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">
          {isOwn ? 'You' : message.senderName}
        </span>
        <span className="text-[9px] text-slate-600/80 font-bold tabular-nums">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      <div
        className={`relative px-4 py-2.5 rounded-[18px] text-[13px] leading-relaxed max-w-[85%] shadow-xl transition-all duration-300 group ${isOwn
          ? 'bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-tr-[4px] border border-white/10 shadow-indigo-900/20'
          : 'bg-[#1e293b]/60 border border-white/[0.06] text-slate-200 rounded-tl-[4px] backdrop-blur-md'
          }`}
      >
        {isOwn && (
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[18px] pointer-events-none" />
        )}
        <p className="relative z-10">{message.text}</p>
      </div>
    </div>
  );
}
