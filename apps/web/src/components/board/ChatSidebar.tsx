import { Message } from '@sketch-battle/types';
import { Input } from '@sketch-battle/ui';
import { SendIcon } from '../svg/SendIcon';
import { ChatItem } from './ChatItem';
import { useChat } from '../../hooks/useChat';
import { CloseIcon } from '../svg/CloseIcon';

interface ChatSidebarProps {
  messages: Message[];
  currentMemberId?: string;
  onSendMessage: (text: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export function ChatSidebar({ 
  messages, 
  currentMemberId, 
  onSendMessage, 
  isOpen, 
  onClose 
}: ChatSidebarProps) {
  const { chatMessage, setChatMessage, handleSubmit, bottomRef } = useChat({
    messages,
    onSendMessage,
  });

  return (
    <aside className={`
      fixed inset-y-0 right-0 z-50 w-80 bg-slate-900 shadow-2xl transition-transform duration-300 transform
      lg:static lg:translate-x-0 lg:w-72 lg:bg-slate-900/60 lg:shadow-none lg:rounded-2xl lg:border lg:border-white/[0.05] lg:backdrop-blur-sm
      ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      flex flex-col overflow-hidden
    `}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/[0.05] bg-slate-800/30 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            Activity &amp; Chat
          </p>
          <span className="text-[10px] font-bold text-slate-600 tabular-nums bg-slate-800/60 px-1.5 py-0.5 rounded-md">
            {messages.length}
          </span>
        </div>

        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
        >
          <CloseIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 py-8 opacity-50">
            <p className="text-[11px] text-slate-500 text-center">No messages yet.<br />Start the conversation!</p>
          </div>
        )}
        {messages.map((msg) => (
          <ChatItem
            key={msg.id}
            message={msg}
            isOwn={msg.senderId === currentMemberId}
          />
        ))}
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
