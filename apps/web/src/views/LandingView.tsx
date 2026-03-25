import React, { useState } from 'react';
import { socketService } from '@sketch-battle/services';
import { Logo, Input, Button } from '@sketch-battle/ui';

type Tab = 'create' | 'join';

export function LandingView() {
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
      setNameError('Please enter a board code to join');
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
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4">
      {/* Hero */}
      <div className="flex flex-col items-center gap-3 mb-10 text-center">
        <Logo size="lg" />
        <p className="text-slate-400 text-sm tracking-wide max-w-[280px]">
          Real-time collaborative whiteboard for modern teams. 🚀
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        {/* Tab Toggle */}
        <div className="grid grid-cols-2 border-b border-slate-800">
          <button
            id="tab-create"
            onClick={() => { setTab('create'); setNameError(''); }}
            className={`py-3.5 text-sm font-semibold transition-colors duration-150 ${
              tab === 'create'
                ? 'text-white bg-slate-800'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Create Board
          </button>
          <button
            id="tab-join"
            onClick={() => { setTab('join'); setNameError(''); }}
            className={`py-3.5 text-sm font-semibold transition-colors duration-150 ${
              tab === 'join'
                ? 'text-white bg-slate-800'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            Join Board
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <Input
            id="member-name"
            label="Your Name"
            placeholder="e.g. Alex Rivera"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setName(e.target.value); setNameError(''); }}
            error={nameError}
            autoComplete="off"
            maxLength={20}
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            }
          />

          {tab === 'join' && (
            <Input
              id="board-code"
              label="Board Code"
              placeholder="e.g. DESIGN-XP"
              value={roomCode}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoomCode(e.target.value.toUpperCase())}
              autoComplete="off"
              maxLength={12}
              className="uppercase tracking-widest font-mono"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                </svg>
              }
            />
          )}

          <Button
            type="submit"
            id="submit-btn"
            fullWidth
            loading={loading}
            className="mt-2 py-4 text-base"
          >
            {tab === 'create' ? "Launch Board →" : "Connect to Board →"}
          </Button>
        </form>
      </div>

      {/* Benefits */}
      <div className="mt-12 w-full max-w-sm">
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600 mb-6">
          Core Features
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: '👥', label: 'Presence', desc: 'See who is active in real-time' },
            { icon: '🪄', label: 'Sketch', desc: 'Dynamic tools for brainstorming' },
            { icon: '⚡', label: 'Sync', desc: 'Ultra-low latency collaboration' },
          ].map(({ icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center text-center gap-1.5 bg-slate-900/50 border border-slate-800/50 rounded-xl p-3 backdrop-blur-sm"
            >
              <span className="text-xl mb-1">{icon}</span>
              <p className="text-[11px] font-bold text-white">{label}</p>
              <p className="text-[10px] text-slate-500 leading-tight">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
