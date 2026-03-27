import { useState } from 'react';
import { Logo, RoomCodeBadge, Button } from '@sketch-battle/ui';
import { ShareIcon } from '../svg/ShareIcon';
import { ChatIcon } from '../svg/ChatIcon';
import { UsersIcon } from '../svg/UsersIcon';

interface BoardHeaderProps {
  roomCode: string;
  onToggleMembers?: () => void;
  onToggleChat?: () => void;
  hasNewMessages?: boolean;
}

export function BoardHeader({ roomCode, onToggleMembers, onToggleChat, hasNewMessages }: BoardHeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const shareData = {
      title: 'Join my SketchBoard',
      text: `Join me on this collaborative board: ${roomCode}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      navigator.share(shareData).catch((err) => {
        // Fallback to clipboard if share was cancelled or failed
        if (err.name !== 'AbortError') {
          copyToClipboard();
        }
      });
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <header className="flex items-center justify-between px-3 sm:px-5 py-2.5 sm:py-3 border-b border-white/[0.04] bg-slate-950/80 backdrop-blur-md shrink-0 relative z-20">
      <div className="flex items-center gap-1 sm:gap-4">
        <Logo size="sm" className="text-lg sm:text-2xl" />
        
        {/* Mobile: Member list toggle */}
        <button
          onClick={onToggleMembers}
          className="lg:hidden p-1.5 sm:p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors shrink-0"
          title="Members"
        >
          <UsersIcon className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="flex items-center gap-1 sm:gap-3">
        {/* Active board label – hidden on mobile/tablet */}
        <div className="hidden lg:flex items-center gap-2.5 bg-slate-800/60 border border-white/[0.06] rounded-xl px-3.5 py-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" />
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em]">Live Board</span>
          <span className="text-white text-xs font-bold font-mono tracking-wider">{roomCode}</span>
        </div>

        <div className="scale-[0.6] xs:scale-75 sm:scale-100 origin-right">
          <RoomCodeBadge code={roomCode} />
        </div>

        <Button
          variant={copied ? "primary" : "secondary"}
          onClick={handleShare}
          className={`flex items-center gap-1.5 sm:gap-2 h-8 sm:h-9 px-2 sm:px-4 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all duration-300 ${
            copied ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500/30' : ''
          }`}
        >
          <ShareIcon className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          <span className="hidden md:inline">{copied ? 'Copied!' : 'Share'}</span>
        </Button>

        {/* Mobile: Chat toggle */}
        <button
          onClick={onToggleChat}
          className="lg:hidden relative p-2 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="Chat"
        >
          <ChatIcon className="w-5 h-5" />
          {hasNewMessages && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-500 border border-slate-900" />
          )}
        </button>
      </div>
    </header>
  );
}
