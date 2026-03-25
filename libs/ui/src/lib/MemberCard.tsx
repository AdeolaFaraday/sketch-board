import { Avatar } from './Avatar.js';

interface MemberCardProps {
  name: string;
  isHost?: boolean;
  joinedAt?: number;
  status?: 'IN_LOBBY' | 'ACTIVE' | 'AWAY';
  isCurrentMember?: boolean;
  color?: string;
}

export function MemberCard({
  name,
  isHost = false,
  joinedAt,
  status = 'IN_LOBBY',
  isCurrentMember = false,
  color = '#3b82f6',
}: MemberCardProps) {
  const timeStr = joinedAt ? new Date(joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group ${
        isCurrentMember
          ? 'bg-slate-800 border-slate-600 shadow-lg ring-1 ring-slate-700'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="relative">
        <Avatar name={name} size="md" />
        <span 
          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-slate-900 rounded-full ${
            status === 'IN_LOBBY' ? 'bg-emerald-500' : status === 'ACTIVE' ? 'bg-blue-500' : 'bg-slate-500'
          }`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {name}
          </p>
          {isCurrentMember && (
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400 font-medium">
              You
            </span>
          )}
          {isHost && (
            <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-500 font-bold uppercase tracking-tight">
              Host
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 truncate">
          {status === 'IN_LOBBY' ? 'Connected' : 'Active'} • {timeStr || 'Just now'}
        </p>
      </div>

      <div className="shrink-0">
        <div 
          className="w-2 h-8 rounded-full opacity-40 group-hover:opacity-100 transition-opacity"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}
