
const BG_COLORS = [
  'bg-blue-600',
  'bg-violet-600',
  'bg-emerald-600',
  'bg-orange-600',
  'bg-pink-600',
  'bg-cyan-600',
  'bg-yellow-600',
  'bg-rose-600',
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return BG_COLORS[Math.abs(hash) % BG_COLORS.length];
}

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
};

export function Avatar({ name, size = 'md' }: AvatarProps) {
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div
      className={`${sizeMap[size]} ${getAvatarColor(name)} rounded-full flex items-center justify-center font-bold text-white shrink-0 select-none`}
    >
      {initials}
    </div>
  );
}
