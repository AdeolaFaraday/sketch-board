import React, { useState } from 'react';
import { socketService } from '@sketch-battle/services';
import { useBoardStore } from '@sketch-battle/hooks';
import { Canvas } from '../components/Canvas.js';
import { Logo, RoomCodeBadge, MemberCard, Button } from '@sketch-battle/ui';

export function BoardView() {
  const { boardState, messages, currentMember } = useBoardStore();
  const [chatMessage, setChatMessage] = useState('');

  const members = boardState?.members ?? [];
  const roomCode = boardState?.roomCode ?? '---';

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    socketService.sendMessage(chatMessage.trim());
    setChatMessage('');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-white overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md shrink-0 shadow-lg relative z-20">
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 bg-slate-800/80 border border-slate-700/50 rounded-lg px-3 py-1.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Board</span>
            <span className="text-white text-xs font-bold font-mono tracking-wider">{roomCode}</span>
          </div>
          <RoomCodeBadge code={roomCode} />
          <Button variant="secondary" className="hidden md:flex h-9 px-4 text-xs font-bold uppercase tracking-wider">
            Share Board
          </Button>
        </div>
      </header>

      {/* Main Board Area */}
      <main className="flex-1 flex overflow-hidden p-3 gap-3 min-h-0 relative z-10">
        {/* Left: Collaborators Sidebar */}
        <aside className="w-64 shrink-0 flex flex-col gap-3 overflow-hidden bg-slate-900/30 rounded-2xl border border-slate-800/50 p-3 backdrop-blur-sm">
          <div className="flex items-center justify-between px-1">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Collaborators
            </p>
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
          </div>
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1 custom-scrollbar">
            {members.map((member) => (
              <MemberCard
                key={member.id}
                name={member.name}
                color={member.color}
                isHost={member.isHost}
                joinedAt={member.joinedAt}
                status={member.status}
                isCurrentMember={member.id === currentMember?.id}
              />
            ))}
          </div>
        </aside>

        {/* Centre: Main Canvas */}
        <section className="flex-1 flex flex-col bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl min-w-0 relative">
          <div className="flex-1 relative min-h-0 bg-white/[0.02] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px]">
            <Canvas
              strokes={boardState?.strokes || []}
              isReadOnly={false}
              onStrokeEnd={(stroke) => socketService.sendDrawEvent({ ...stroke, memberId: currentMember?.id || '' })}
            />
          </div>

          {/* Toolbar Overlay (Conceptual) */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-2xl p-2 flex gap-1 shadow-2xl ring-1 ring-white/10">
            {['✏️', '🪄', '🧹', '💾'].map((tool, i) => (
              <button key={i} className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${i === 0 ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-400 font-medium text-lg'}`}>
                {tool}
              </button>
            ))}
          </div>
        </section>

        {/* Right: Messages/Activity */}
        <aside className="w-72 shrink-0 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          <div className="px-4 py-3.5 border-b border-slate-800 bg-slate-800/30 flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Activity & Chat
            </p>
            <span className="text-[10px] font-bold text-slate-600 tabular-nums">{messages.length}</span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col gap-1 ${msg.type === 'SYSTEM' ? 'items-center py-1' : ''}`}
              >
                {msg.type === 'SYSTEM' ? (
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest bg-slate-800/50 px-2.5 py-1 rounded-full border border-slate-700/30">
                    {msg.text}
                  </span>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 px-0.5">
                      <span className="text-[10px] font-bold text-slate-400">{msg.senderName}</span>
                      <span className="text-[9px] text-slate-600 font-medium tabular-nums">
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.senderId === currentMember?.id
                        ? 'bg-blue-600/10 border border-blue-500/20 text-blue-100'
                        : 'bg-slate-800/80 border border-slate-700/50 text-slate-300'
                      }`}>
                      {msg.text}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="p-4 bg-slate-900/50 border-t border-slate-800/50">
            <div className="relative">
              <input
                type="text"
                id="chat-input"
                placeholder="Type a message…"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-10 py-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-inner"
              />
              <button type="submit" className="absolute right-2 top-2 w-8 h-8 flex items-center justify-center text-blue-500 hover:text-blue-400 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </form>
        </aside>
      </main>
    </div>
  );
}
