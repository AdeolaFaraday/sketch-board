import { useRef, useEffect, useState, useCallback } from 'react';
import { DrawingStroke, Point } from '@sketch-battle/types';

interface UseCanvasOptions {
  strokes: DrawingStroke[];
  color: string;
  width: number;
  isReadOnly?: boolean;
  onStrokeEnd?: (stroke: DrawingStroke) => void;
  onDrawSegment?: (segment: DrawingStroke) => void;
}

export function useCanvas({
  strokes,
  color,
  width,
  isReadOnly = false,
  onStrokeEnd,
  onDrawSegment,
}: UseCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Keep track of points in the current active stroke locally
  const currentStrokePoints = useRef<Point[]>([]);
  const lastPoint = useRef<Point | null>(null);

  // Helper to calculate coordinates relative to the canvas element
  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
    if (!canvasRef.current) return null;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  }, []);

  // Main drawing function that renders all strokes
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    const allStrokes = [...strokes];
    
    // Also draw the current live points that haven't been "sent" yet if any
    if (currentStrokePoints.current.length > 1) {
      allStrokes.push({
        points: currentStrokePoints.current,
        color,
        width,
        memberId: 'local'
      });
    }

    allStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;
      
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    });
  }, [strokes, color, width]);

  // Handle initialization and resizing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const parent = canvas.parentElement;
      if (parent && (canvas.width !== parent.clientWidth || canvas.height !== parent.clientHeight)) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        redraw();
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    if (canvas.parentElement) observer.observe(canvas.parentElement);
    
    return () => observer.disconnect();
  }, [redraw]);

  // Sync canvas with props (strokes, color, width)
  useEffect(() => {
    redraw();
  }, [redraw]);

  // Event handlers
  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isReadOnly) return;
    const point = getCoordinates(e);
    if (!point) return;

    setIsDrawing(true);
    lastPoint.current = point;
    currentStrokePoints.current = [point];
  }, [isReadOnly, getCoordinates]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isReadOnly || !lastPoint.current) return;
    const point = getCoordinates(e);
    if (!point) return;

    // Create a segment for real-time sync
    const segment: DrawingStroke = {
      points: [lastPoint.current, point],
      color,
      width,
      memberId: '' // Will be filled by the sender
    };

    // Emit the segment to the socket for real-time visibility
    onDrawSegment?.(segment);

    // Update local state
    currentStrokePoints.current.push(point);
    lastPoint.current = point;
    
    // Trigger a redraw to show the line as we move
    redraw();
  }, [isDrawing, isReadOnly, color, width, getCoordinates, onDrawSegment, redraw]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;
    
    if (onStrokeEnd && currentStrokePoints.current.length > 0) {
      onStrokeEnd({
        points: currentStrokePoints.current,
        color,
        width,
        memberId: ''
      });
    }

    setIsDrawing(false);
    lastPoint.current = null;
    currentStrokePoints.current = [];
    redraw();
  }, [isDrawing, color, width, onStrokeEnd, redraw]);

  return {
    canvasRef,
    events: {
      onMouseDown: startDrawing,
      onMouseMove: draw,
      onMouseUp: stopDrawing,
      onMouseLeave: stopDrawing,
      onTouchStart: startDrawing,
      onTouchMove: draw,
      onTouchEnd: stopDrawing,
    }
  };
}
