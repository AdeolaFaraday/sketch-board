import { Logo } from '@sketch-battle/ui';

export function LandingHero() {
  return (
    <div className="flex flex-col items-center gap-8 mb-14 text-center">
      {/* Logo badge */}
      <div className="inline-flex px-6 py-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <Logo size="lg" />
      </div>

      {/* Tagline */}
      <div className="space-y-4 max-w-lg">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          Where teams think{' '}
          <span className="text-blue-400">visually</span>
        </h1>
        <p className="text-slate-400 text-base leading-relaxed">
          A real-time collaborative whiteboard for modern teams. Sketch ideas, share boards, and build together — instantly.
        </p>
      </div>

      {/* Social proof strip */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <span className="flex -space-x-2">
          {['🧑‍💻', '👩‍🎨', '👨‍🚀'].map((emoji, i) => (
            <span key={i} className="w-7 h-7 rounded-full flex items-center justify-center bg-slate-800 border border-slate-700 text-xs">
              {emoji}
            </span>
          ))}
        </span>
        <span>Loved by <strong className="text-slate-300">1,200+</strong> teams</span>
        <span className="mx-1">·</span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-emerald-400 font-medium">Live now</span>
        </span>
      </div>
    </div>
  );
}
