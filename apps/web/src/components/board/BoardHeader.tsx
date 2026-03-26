import { Logo, RoomCodeBadge, Button } from '@sketch-battle/ui';
import { ShareIcon } from '../svg/ShareIcon';

interface BoardHeaderProps {
  roomCode: string;
}

export function BoardHeader({ roomCode }: BoardHeaderProps) {
  return (
    <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.04] bg-slate-950/80 backdrop-blur-md shrink-0 relative z-20">
      <Logo size="sm" />

      <div className="flex items-center gap-3">
        {/* Active board label – hidden on small screens */}
        <div className="hidden sm:flex items-center gap-2.5 bg-slate-800/60 border border-white/[0.06] rounded-xl px-3.5 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em]">Live Board</span>
          <span className="text-white text-xs font-bold font-mono tracking-wider">{roomCode}</span>
        </div>

        <RoomCodeBadge code={roomCode} />

        <Button
          variant="secondary"
          className="hidden md:flex items-center gap-2 h-9 px-4 text-xs font-bold uppercase tracking-wider"
        >
          <ShareIcon className="w-3.5 h-3.5" />
          Share
        </Button>
      </div>
    </header>
  );
}
