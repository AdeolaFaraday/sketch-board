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
  deleteStroke: (strokeId: string) => void;
  clearStrokes: () => void;
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
    const existing = state.boardState.strokes.findIndex(s => s.id === stroke.id);
    const newStrokes = existing >= 0
      ? state.boardState.strokes.map((s, i) => i === existing ? stroke : s)
      : [...state.boardState.strokes, stroke];
    return {
      boardState: {
        ...state.boardState,
        strokes: newStrokes
      }
    };
  }),
  addMessage: (message: Message) => set((state: BoardStore) => ({ 
    messages: [...state.messages, message].slice(-50) 
  })),
  deleteStroke: (strokeId: string) => set((state: BoardStore) => {
    if (!state.boardState) return state;
    return {
      boardState: {
        ...state.boardState,
        strokes: state.boardState.strokes.filter((s) => s.id !== strokeId)
      }
    };
  }),
  clearStrokes: () => set((state: BoardStore) => {
    if (!state.boardState) return state;
    return {
      boardState: {
        ...state.boardState,
        strokes: []
      }
    };
  }),
  setCurrentMember: (currentMember: Member) => set({ currentMember }),
  setIsJoined: (isJoined: boolean) => set({ isJoined }),
  clearSession: () => set({ boardState: null, messages: [], isJoined: false }),
}));
