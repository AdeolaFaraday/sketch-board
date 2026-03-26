import React, { useState, useRef, useEffect } from 'react';
import { Message } from '@sketch-battle/types';
import { Input } from '@sketch-battle/ui';
import { SendIcon } from '../svg/SendIcon';

interface ChatSidebarProps {
  messages: Message[];
  currentMemberId?: string;
  onSendMessage: (text: string) => void;
}

export function ChatSidebar({ messages, currentMemberId, onSendMessage }: ChatSidebarProps) {
  const [chatMessage, setChatMessage] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = chatMessage.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setChatMessage('');
  };

  return (
    <aside className="w-72 shrink-0 flex flex-col rounded-2xl border border-white/[0.05] bg-slate-900/60 backdrop-blur-sm overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.05] bg-slate-800/30 flex items-center justify-between shrink-0">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
          Activity &amp; Chat
        </p>
        <span className="text-[10px] font-bold text-slate-600 tabular-nums bg-slate-800/60 px-1.5 py-0.5 rounded-md">
          {messages.length}
        </span>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 opacity-50">
            <p className="text-[11px] text-slate-500 text-center">No messages yet.<br />Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => {
          const isOwn = msg.senderId === currentMemberId;
          const isSystem = msg.type === 'SYSTEM';
          return (
            <div key={msg.id} className={`flex flex-col gap-1 ${isSystem ? 'items-center' : ''}`}>
              {isSystem ? (
                <span className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest bg-slate-800/40 px-3 py-1 rounded-full border border-white/[0.04]">
                  {msg.text}
                </span>
              ) : (
                <>
                  <div className={`flex items-center gap-1.5 px-0.5 ${isOwn ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] font-bold text-slate-400">{msg.senderName}</span>
                    <span className="text-[9px] text-slate-600 font-medium tabular-nums">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div
                    className={`px-3 py-2.5 rounded-2xl text-xs leading-relaxed max-w-[90%] ${isOwn
                      ? 'self-end bg-blue-600/15 border border-blue-500/20 text-blue-100 rounded-tr-sm'
                      : 'self-start bg-slate-800/70 border border-white/[0.05] text-slate-300 rounded-tl-sm'
                      }`}
                  >
                    {msg.text}
                  </div>
                </>
              )}
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Chat input */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 p-3 pt-2 border-t border-white/[0.05] bg-slate-900/40"
      >
        <div className="relative flex items-center gap-2">
          <Input
            id="chat-input"
            placeholder="Type a message…"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
          />
          <button
            type="submit"
            title="Send message"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-blue-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all"
          >
            <SendIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </aside>
  );
}
