import { useState, useRef, useEffect } from 'react';
import { Message } from '@sketch-battle/types';

interface UseChatProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export function useChat({ messages, onSendMessage }: UseChatProps) {
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

  return {
    chatMessage,
    setChatMessage,
    handleSubmit,
    bottomRef,
  };
}
