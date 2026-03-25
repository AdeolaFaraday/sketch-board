import React, { useRef, useEffect, useState } from 'react';
import { DrawingStroke, Point } from '@sketch-battle/types';

interface CanvasProps {
  strokes?: DrawingStroke[];
  onStrokeEnd?: (stroke: DrawingStroke) => void;
  isReadOnly?: boolean;
  color?: string;
  width?: number;
}

export const Canvas: React.FC<CanvasProps> = ({
  strokes = [],
  onStrokeEnd,
  isReadOnly = false,
  color = '#000000',
  width = 3,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStroke, setCurrentStroke] = useState<Point[]>([]);

  // Re-draw all strokes whenever they change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing strokes
    const allStrokes = [...strokes];
    if (isDrawing && currentStroke.length > 1) {
      allStrokes.push({
        points: currentStroke,
        color,
        width,
        memberId: 'local'
      });
    }

    allStrokes.forEach((stroke) => {

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }

      ctx.strokeStyle = stroke.color || '#000000';
      ctx.lineWidth = stroke.width || 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    });
  }, [strokes, currentStroke, color, width]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Handle initial sizing
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        // Only resize if dimensions actually changed to avoid flickers
        if (canvas.width !== parent.clientWidth || canvas.height !== parent.clientHeight) {
          canvas.width = parent.clientWidth;
          canvas.height = parent.clientHeight;
        }
      }
    };

    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvas.parentElement) resizeObserver.observe(canvas.parentElement);

    return () => resizeObserver.disconnect();
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isReadOnly) return;
    setIsDrawing(true);
    const point = getPointFromEvent(e);
    setCurrentStroke([point]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isReadOnly) return;
    const point = getPointFromEvent(e);
    setCurrentStroke((prev) => [...prev, point]);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    if (onStrokeEnd && currentStroke.length > 0) {
      onStrokeEnd({
        points: currentStroke,
        color,
        width,
        memberId: ''
      });
    }
    setCurrentStroke([]);
  };

  const getPointFromEvent = (e: React.MouseEvent | React.TouchEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
      className={`w-full h-full bg-white cursor-crosshair rounded-lg shadow-inner ${isReadOnly ? 'pointer-events-none' : ''
        }`}
    />
  );
};
