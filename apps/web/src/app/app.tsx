import { useEffect } from 'react';
import { useBoardStore } from '@sketch-battle/hooks';
import { socketService } from '@sketch-battle/services';
import { LandingView } from '../views/LandingView.js';
import { LobbyView } from '../views/LobbyView.js';
import { BoardView } from '../views/BoardView.js';

export function App() {
  const { isJoined, boardState } = useBoardStore();

  useEffect(() => {
    socketService.connect();
    return () => socketService.disconnect();
  }, []);

  // ── Route ─────────────────────────────────────────────────
  if (!isJoined) return <LandingView />;
  if (boardState?.status === 'LOBBY') return <LobbyView />;
  return <BoardView />;
}
