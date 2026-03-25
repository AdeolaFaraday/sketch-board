export function FeatureGrid() {
  const features = [
    { icon: '👥', label: 'Live Presence', desc: 'See cursors & actions instantly' },
    { icon: '🪄', label: 'Smart Sketch', desc: 'Vector-based precision tools' },
    { icon: '⚡', label: 'Zero Latency', desc: 'Powered by WebSockets' },
  ];

  return (
    <div className="relative z-10 mt-20 w-full max-w-[800px] mx-auto select-none">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map(({ icon, label, desc }) => (
          <div
            key={label}
            className="group flex flex-col items-center text-center gap-4 bg-[#0a0f1c]/60 hover:bg-[#0f172a]/80 border border-white/[0.02] hover:border-blue-500/10 rounded-[28px] p-6 transition-all duration-500 shadow-2xl backdrop-blur-sm"
          >
            <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-white/[0.02] text-2xl shadow-inner group-hover:bg-blue-500/[0.05] group-hover:scale-110 transition-all duration-500 border border-white/[0.01]">
              <span className="opacity-90 group-hover:opacity-100 transition-opacity">{icon}</span>
            </div>
            <div>
              <p className="text-[13px] font-semibold tracking-wide text-white/90 group-hover:text-blue-200 transition-colors uppercase">{label}</p>
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
