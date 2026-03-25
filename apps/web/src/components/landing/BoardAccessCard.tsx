import React, { useState } from 'react';
import { socketService } from '@sketch-battle/services';

type Tab = 'create' | 'join';

export function BoardAccessCard() {
  const [tab, setTab] = useState<Tab>('create');
  const [name, setName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [nameError, setNameError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!name.trim()) {
      setNameError('Please enter your name');
      return false;
    }
    if (tab === 'join' && !roomCode.trim()) {
      setNameError('Please enter a board code');
      return false;
    }
    setNameError('');
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    socketService.joinBoard(name.trim(), tab === 'join' ? roomCode.trim() : undefined);

    // Safety timeout in case of backend delay, though ideally handled by store state
    setTimeout(() => setLoading(false), 3000);
  };

  return (
    <div className="relative z-10 w-full max-w-[420px] bg-[#0a0f1c]/70 backdrop-blur-2xl border border-white/[0.04] rounded-[32px] overflow-hidden shadow-[0_24px_64px_-16px_rgba(0,0,0,0.6)] mx-auto">
      {/* Tab Header */}
      <div className="flex p-2 gap-2 bg-white/[0.01] border-b border-white/[0.02]">
        <button
          onClick={() => { setTab('create'); setNameError(''); }}
          className={`flex-1 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-[24px] transition-all duration-300 ${tab === 'create'
            ? 'bg-[#1e293b]/60 text-white shadow-sm border border-white/[0.05]'
            : 'text-slate-500/80 hover:text-slate-300 hover:bg-white/[0.02]'
            }`}
        >
          Create Board
        </button>
        <button
          onClick={() => { setTab('join'); setNameError(''); }}
          className={`flex-1 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-[24px] transition-all duration-300 ${tab === 'join'
            ? 'bg-[#1e293b]/60 text-white shadow-sm border border-white/[0.05]'
            : 'text-slate-500/80 hover:text-slate-300 hover:bg-white/[0.02]'
            }`}
        >
          Join Board
        </button>
      </div>

      {/* Form Area */}
      <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
        <div className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="member-name" className="text-[10px] font-semibold uppercase tracking-widest text-slate-400/90 ml-1">
              Collaborator Name
            </label>
            <input
              id="member-name"
              placeholder="e.g. Alex Rivera"
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(''); }}
              autoComplete="off"
              maxLength={20}
              className={`w-full bg-[#0f172a]/60 border ${nameError ? 'border-red-500/50' : 'border-white/[0.04]'} rounded-[16px] px-5 py-3.5 text-[14px] text-white placeholder-slate-600 focus:outline-none focus:bg-[#1e293b]/50 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-inner`}
            />
            {nameError && <p className="text-xs text-red-400/90 mt-1 ml-1">{nameError}</p>}
          </div>

          {tab === 'join' && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="board-code" className="text-[10px] font-semibold uppercase tracking-widest text-slate-400/90 ml-1">
                Board Code
              </label>
              <input
                id="board-code"
                placeholder="e.g. DESIGN-XP"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                autoComplete="off"
                maxLength={12}
                className="w-full bg-[#0f172a]/60 border border-white/[0.04] rounded-[16px] px-5 py-3.5 text-[14px] text-white placeholder-slate-600 focus:outline-none focus:bg-[#1e293b]/50 focus:border-blue-500/40 focus:ring-4 focus:ring-blue-500/10 transition-all duration-300 shadow-inner font-mono tracking-[0.15em] uppercase"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full flex items-center justify-center gap-2 py-4 text-[13px] font-bold tracking-[0.1em] uppercase bg-blue-600 group hover:bg-blue-500 text-white shadow-[0_8px_20px_-4px_rgba(37,99,235,0.4)] hover:shadow-[0_12px_24px_-4px_rgba(37,99,235,0.6)] active:scale-[0.98] transition-all duration-300 rounded-[16px] disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : tab === 'create' ? "Launch Board →" : "Connect →"}
        </button>
      </form>
    </div>
  );
}
