import React from 'react';
import { DrawingStroke } from '@sketch-battle/types';
import { useCanvas } from '../hooks/useCanvas';

interface CanvasProps {
  strokes?: DrawingStroke[];
  onStrokeEnd?: (stroke: DrawingStroke) => void;
  onDrawSegment?: (segment: DrawingStroke) => void;
  isReadOnly?: boolean;
  color?: string;
  width?: number;
}

export const Canvas: React.FC<CanvasProps> = ({
  strokes = [],
  onStrokeEnd,
  onDrawSegment,
  isReadOnly = false,
  color = '#000000',
  width = 3,
}) => {
  const { canvasRef, events } = useCanvas({
    strokes,
    color,
    width,
    isReadOnly,
    onStrokeEnd,
    onDrawSegment,
  });

  return (
    <canvas
      ref={canvasRef}
      {...events}
      className={`w-full h-full bg-white cursor-crosshair rounded-lg shadow-inner ${
        isReadOnly ? 'pointer-events-none' : ''
      }`}
    />
  );
};
