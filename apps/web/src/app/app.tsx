import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { socketService } from '@sketch-battle/services';
import { LandingView } from '../views/LandingView.js';
import { BoardView } from '../views/BoardView.js';

export function App() {
  useEffect(() => {
    socketService.connect();
    return () => socketService.disconnect();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingView />} />
      <Route path="/board/:id" element={<BoardView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
