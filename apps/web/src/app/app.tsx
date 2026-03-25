import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { socketService } from '@sketch-battle/services';
import { LandingPage } from '../pages/LandingPage.js';
import { BoardPage } from '../pages/BoardPage.js';

export function App() {
  useEffect(() => {
    socketService.connect();
    return () => socketService.disconnect();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/board/:id" element={<BoardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
