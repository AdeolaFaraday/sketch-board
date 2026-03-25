interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizeMap = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
};

export function Logo({ size = 'md' }: LogoProps) {
  return (
    <span
      className={`font-black tracking-tighter ${sizeMap[size]} text-white select-none leading-none`}
    >
      SKETCH<span className="text-blue-500">BATTLE</span>
    </span>
  );
}
