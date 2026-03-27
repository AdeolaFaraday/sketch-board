interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeMap = {
  sm: 'text-2xl',
  md: 'text-4xl',
  lg: 'text-6xl',
};

export function Logo({ size = 'md', className = '' }: LogoProps) {
  return (
    <span
      className={`font-black tracking-tighter ${sizeMap[size]} ${className} text-white select-none leading-none`}
    >
      SKETCH<span className="text-blue-500">BOARD</span>
    </span>
  );
}
