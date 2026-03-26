import React from 'react';
import { PenIcon } from '../svg/PenIcon';
import { EraserIcon } from '../svg/EraserIcon';
import { LineIcon } from '../svg/LineIcon';
import { ClearIcon } from '../svg/ClearIcon';

export type ActiveTool = 'pen' | 'eraser' | 'line';

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  isDanger?: boolean;
  onClick: () => void;
}

function ToolButton({ icon, label, isActive, isDanger, onClick }: ToolButtonProps) {
  return (
    <button
      title={label}
      onClick={onClick}
      className={`
        relative group w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150
        ${isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
          : isDanger
            ? 'text-slate-400 hover:bg-red-500/10 hover:text-red-400'
            : 'text-slate-400 hover:bg-slate-700/60 hover:text-white'
        }
      `}
    >
      <span className="w-[18px] h-[18px]">{icon}</span>

      {/* Tooltip */}
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-800 border border-white/[0.06] text-white text-[10px] font-semibold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
        {label}
      </span>
    </button>
  );
}

interface BoardToolbarProps {
  activeTool: ActiveTool;
  onToolChange: (tool: ActiveTool) => void;
  strokeColor: string;
  onColorChange: (color: string) => void;
  strokeWidth: number;
  onWidthChange: (width: number) => void;
  onClear: () => void;
}

const COLORS = [
  '#6366f1', // Indigo
  '#f43f5e', // Rose
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#94a3b8', // Slate
  '#ffffff', // White
];

const WIDTHS = [2, 4, 8, 16];

export function BoardToolbar({
  activeTool,
  onToolChange,
  strokeColor,
  onColorChange,
  strokeWidth,
  onWidthChange,
  onClear
}: BoardToolbarProps) {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 lg:static lg:translate-x-0 lg:py-4 transition-all duration-300">
      <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-2 shadow-2xl ring-1 ring-white/[0.04] max-w-[95vw] sm:max-w-none">
        
        {/* Drawing tools */}
        <div className="flex items-center gap-1">
          <ToolButton
            icon={<PenIcon className="w-full h-full" />}
            label="Pen"
            isActive={activeTool === 'pen'}
            onClick={() => onToolChange('pen')}
          />
          <ToolButton
            icon={<LineIcon className="w-full h-full" />}
            label="Line"
            isActive={activeTool === 'line'}
            onClick={() => onToolChange('line')}
          />
          <ToolButton
            icon={<EraserIcon className="w-full h-full" />}
            label="Eraser"
            isActive={activeTool === 'eraser'}
            onClick={() => onToolChange('eraser')}
          />
        </div>

        <div className="w-px h-6 bg-white/[0.1] mx-1" />

        {/* Color Palette */}
        <div className="flex items-center gap-1.5 px-1">
          {COLORS.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`
                w-6 h-6 rounded-full border-2 transition-all duration-200 hover:scale-110
                ${strokeColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100'}
              `}
              style={{ backgroundColor: color }}
              title={`Color: ${color}`}
            />
          ))}
        </div>

        <div className="w-px h-6 bg-white/[0.1] mx-1" />

        {/* Width Selector */}
        <div className="flex items-center gap-1 px-1">
          {WIDTHS.map((width) => (
            <button
              key={width}
              onClick={() => onWidthChange(width)}
              className={`
                relative flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-200
                ${strokeWidth === width ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}
              `}
              title={`${width}px Width`}
            >
              <div 
                className="bg-current rounded-full" 
                style={{ width: Math.max(2, width / 2), height: Math.max(2, width / 2) }} 
              />
            </button>
          ))}
        </div>

        <div className="w-px h-6 bg-white/[0.1] mx-1" />

        {/* Danger zone */}
        <ToolButton
          icon={<ClearIcon className="w-full h-full" />}
          label="Clear Board"
          isDanger
          onClick={onClear}
        />
      </div>
    </div>
  );
}
