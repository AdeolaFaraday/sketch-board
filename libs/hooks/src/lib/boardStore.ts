import { create } from 'zustand';
import { BoardState, Message, Member } from '@sketch-battle/types';

interface BoardStore {
  boardState: BoardState | null;
  messages: Message[];
  currentMember: Member | null;
  isJoined: boolean;
  
  setBoardState: (state: BoardState) => void;
  addMessage: (message: Message) => void;
  setCurrentMember: (member: Member) => void;
  setIsJoined: (isJoined: boolean) => void;
  clearSession: () => void;
}

export const useBoardStore = create<BoardStore>((set) => ({
  boardState: null,
  messages: [],
  currentMember: null,
  isJoined: false,

  setBoardState: (boardState) => set({ boardState }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message].slice(-50) 
  })),
  setCurrentMember: (currentMember) => set({ currentMember }),
  setIsJoined: (isJoined) => set({ isJoined }),
  clearSession: () => set({ boardState: null, messages: [], isJoined: false }),
}));
