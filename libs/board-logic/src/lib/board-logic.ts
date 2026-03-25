import { BoardState } from '@sketch-battle/types';

export function createInitialBoardState(roomCode: string): BoardState {
  return {
    id: roomCode,
    name: `Board ${roomCode}`,
    status: 'LOBBY',
    members: [],
    roomCode,
    createdAt: Date.now(),
    strokes: [],
  };
}
