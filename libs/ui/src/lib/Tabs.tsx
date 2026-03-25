interface TabOption<T extends string> {
  id: T;
  label: string;
}

interface TabsProps<T extends string> {
  options: TabOption<T>[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
}

export function Tabs<T extends string>({
  options,
  activeTab,
  onTabChange,
  className = '',
}: TabsProps<T>) {
  return (
    <div className={`flex p-2 gap-2 bg-transparent ${className}`}>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onTabChange(option.id)}
          className={`flex-1 py-3.5 text-[11px] font-bold uppercase tracking-[0.15em] rounded-full transition-all duration-300 ${activeTab === option.id
              ? 'bg-slate-800/90 text-white shadow-lg border border-white/10'
              : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
            }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
