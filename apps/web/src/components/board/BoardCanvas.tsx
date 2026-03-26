import { Canvas } from '../Canvas';
import { DrawingStroke } from '@sketch-battle/types';

type ActiveTool = 'pen' | 'eraser' | 'line';

interface BoardCanvasProps {
  strokes: DrawingStroke[];
  activeTool: ActiveTool;
  onStrokeEnd: (stroke: DrawingStroke) => void;
  onDrawSegment: (segment: DrawingStroke) => void;
}

export function BoardCanvas({ strokes, activeTool, onStrokeEnd, onDrawSegment }: BoardCanvasProps) {
  const isEraser = activeTool === 'eraser';

  return (
    /* Outer container: dot-grid background */
    <div
      className="flex-1 min-h-0 relative rounded-2xl overflow-hidden"
      style={{
        background: '#0d1424',
        backgroundImage:
          'radial-gradient(circle, rgba(99,120,170,0.25) 1.2px, transparent 1.2px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Inner canvas surface */}
      <div className="absolute inset-3 rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/[0.06]">
        <Canvas
          strokes={strokes}
          isReadOnly={false}
          color={isEraser ? '#ffffff' : '#000000'}
          width={isEraser ? 18 : 3}
          onStrokeEnd={onStrokeEnd}
          onDrawSegment={onDrawSegment}
        />
      </div>
    </div>
  );
}
