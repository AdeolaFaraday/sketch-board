import { useBoardStore } from '@sketch-battle/hooks';
import { socketService } from '@sketch-battle/services';
import { Logo, RoomCodeBadge, MemberCard, Button } from '@sketch-battle/ui';

export function LobbyPage() {
  const { boardState, currentMember } = useBoardStore();
  const members = boardState?.members ?? [];
  const roomCode = boardState?.roomCode ?? '---';

  // First player in the list is the host
  const isHost = currentMember?.isHost ?? false;
  const canStart = members.length >= 1; // Boards can start with 1, but usually 2+

  const handleStart = () => {
    socketService.startSession();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 py-4 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-10">
        <Logo size="sm" />
        <div className="flex items-center gap-3">
          <span className="hidden sm:block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Board ID</span>
          <RoomCodeBadge code={roomCode} />
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 gap-8 max-w-md mx-auto w-full">
        {/* Status Banner */}
        <div className="w-full flex items-center justify-between bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 shadow-xl">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Session Status
            </p>
            <p className="text-sm font-bold text-white mt-1">
              Preparing Workspace…
            </p>
          </div>
          <div className="flex items-center gap-2 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
              Lobby
            </span>
          </div>
        </div>

        {/* Member List */}
        <div className="w-full">
          <div className="flex items-center justify-between mb-4 px-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Active Collaborators
            </p>
            <div className="flex items-center gap-1.5 bg-slate-800/50 px-2 py-0.5 rounded-md text-[10px] font-bold text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              {members.length} Online
            </div>
          </div>
          <div className="flex flex-col gap-2.5">
            {members.length === 0 ? (
              <p className="text-sm text-slate-600 text-center py-10 border border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
                Connecting to board services…
              </p>
            ) : (
              members.map((member) => (
                <MemberCard
                  key={member.id}
                  name={member.name}
                  color={member.color}
                  joinedAt={member.joinedAt}
                  isHost={member.isHost}
                  status={member.status}
                  isCurrentMember={member.id === currentMember?.id}
                />
              ))
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="w-full bg-blue-600/5 border border-blue-600/10 rounded-2xl p-5 flex gap-4">
          <div className="shrink-0 w-10 h-10 rounded-full bg-blue-600/10 flex items-center justify-center text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="16" x2="12" y2="12" />
              <line x1="12" y1="8" x2="12.01" y2="8" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">Collaboration Tip</p>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Anyone with the board ID can join and contribute. Share the code to start brainstorming with your team.
            </p>
          </div>
        </div>
      </main>

      {/* Footer Actions */}
      <footer className="sticky bottom-0 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800 px-4 py-6">
        <div className="max-w-md mx-auto flex flex-col gap-4">
          {isHost ? (
            <Button
              id="start-session-btn"
              fullWidth
              onClick={handleStart}
              className="py-4 text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-600/20"
            >
              🚀 Launch Session
            </Button>
          ) : (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
              <p className="text-center text-xs text-slate-400 font-medium">
                Waiting for host to launch the workspace…
              </p>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
