import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBoardStore } from '@sketch-battle/hooks';
import { LandingHero } from '../components/landing/LandingHero.js';
import { BoardAccessCard } from '../components/landing/BoardAccessCard.js';
import { FeatureGrid } from '../components/landing/FeatureGrid.js';

export function LandingView() {
  const navigate = useNavigate();
  const { isJoined, boardState } = useBoardStore();

  useEffect(() => {
    if (isJoined && boardState?.roomCode) {
      navigate(`/board/${boardState.roomCode}`);
    }
  }, [isJoined, boardState, navigate]);

  return (
    <div className="min-h-screen bg-[#020617] relative flex flex-col items-center justify-center px-6 overflow-hidden font-sans selection:bg-blue-500/30">
      {/* Deep, Premium Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDIwNjE3Ij48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNmZmZmZmYwNCI+PC9yZWN0Pgo8L3N2Zz4=')] opacity-60" />

      {/* Subtle top ambient glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative w-full py-16 flex flex-col items-center justify-center flex-1">
        <LandingHero />
        <BoardAccessCard />
        {/* <FeatureGrid /> */}
      </div>

      <p className="relative z-10 pb-8 mt-auto text-[10px] font-semibold text-slate-500 uppercase tracking-[0.4em]">
        SketchBoard &copy; 2024
      </p>
    </div>
  );
}
