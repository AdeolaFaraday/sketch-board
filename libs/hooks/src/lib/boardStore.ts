import { create } from 'zustand';
import { BoardState, Message, Member, DrawingStroke } from '@sketch-battle/types';

interface BoardStore {
  boardState: BoardState | null;
  messages: Message[];
  currentMember: Member | null;
  isJoined: boolean;
  
  setBoardState: (state: BoardState) => void;
  addStroke: (stroke: DrawingStroke) => void;
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

  setBoardState: (boardState: BoardState) => set({ boardState }),
  addStroke: (stroke: DrawingStroke) => set((state: BoardStore) => {
    if (!state.boardState) return state;
    return {
      boardState: {
        ...state.boardState,
        strokes: [...state.boardState.strokes, stroke]
      }
    };
  }),
  addMessage: (message: Message) => set((state: BoardStore) => ({ 
    messages: [...state.messages, message].slice(-50) 
  })),
  setCurrentMember: (currentMember: Member) => set({ currentMember }),
  setIsJoined: (isJoined: boolean) => set({ isJoined }),
  clearSession: () => set({ boardState: null, messages: [], isJoined: false }),
}));
