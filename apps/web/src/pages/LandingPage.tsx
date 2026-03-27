import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '@sketch-battle/hooks';
import { LandingHero } from '../components/landing/LandingHero.js';
import { BoardAccessCard } from '../components/landing/BoardAccessCard.js';

export function LandingPage() {
  const navigate = useNavigate();
  const { isJoined, boardState } = useBoardStore();

  useEffect(() => {
    if (isJoined && boardState?.roomCode) {
      navigate(`/board/${boardState.roomCode}`);
    }
  }, [isJoined, boardState, navigate]);

  return (
    <div className="min-h-screen bg-[#020617] relative flex flex-col items-center justify-center px-6 overflow-hidden font-sans">
      {/* Subtle top ambient glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full py-16 flex flex-col items-center justify-center flex-1">
        <LandingHero />
        <BoardAccessCard />
      </div>

      <p className="relative z-10 pb-8 mt-auto text-[10px] font-semibold text-slate-500 uppercase tracking-[0.4em]">
        SketchBoard &copy; {new Date().getFullYear()}
      </p>
    </div>
  );
}
