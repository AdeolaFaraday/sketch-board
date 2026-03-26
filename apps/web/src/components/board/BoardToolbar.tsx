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
  onClear: () => void;
}

export function BoardToolbar({ activeTool, onToolChange, onClear }: BoardToolbarProps) {
  return (
    <div className="shrink-0 flex items-center justify-center py-2.5">
      <div className="flex items-center gap-1 bg-slate-900/80 backdrop-blur-md border border-white/[0.06] rounded-2xl p-1.5 shadow-xl ring-1 ring-white/[0.04]">
        
        {/* Drawing tools */}
        <ToolButton
          icon={<PenIcon className="w-full h-full" />}
          label="Pen"
          isActive={activeTool === 'pen'}
          onClick={() => onToolChange('pen')}
        />
        <ToolButton
          icon={<EraserIcon className="w-full h-full" />}
          label="Eraser"
          isActive={activeTool === 'eraser'}
          onClick={() => onToolChange('eraser')}
        />
        <ToolButton
          icon={<LineIcon className="w-full h-full" />}
          label="Line"
          isActive={activeTool === 'line'}
          onClick={() => onToolChange('line')}
        />

        {/* Divider */}
        <div className="w-px h-6 bg-white/[0.06] mx-0.5" />

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
