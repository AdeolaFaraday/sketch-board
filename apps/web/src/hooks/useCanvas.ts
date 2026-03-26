import { useRef, useEffect, useState, useCallback } from 'react';
import { DrawingStroke, Point } from '@sketch-battle/types';

interface UseCanvasOptions {
  strokes: DrawingStroke[];
  color: string;
  width: number;
  activeTool: 'pen' | 'eraser' | 'line';
  isReadOnly?: boolean;
  onStrokeEnd?: (stroke: DrawingStroke) => void;
  onDrawSegment?: (segment: DrawingStroke) => void;
  onStrokeDelete?: (strokeId: string) => void;
}

export function useCanvas({
  strokes,
  color,
  width: fixedWidth, // Renaming internally to avoid confusion
  activeTool,
  isReadOnly = false,
  onStrokeEnd,
  onDrawSegment,
  onStrokeDelete,
}: UseCanvasOptions) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStrokeId = useRef<string | null>(null);

  // Use a slightly larger radius for the eraser to feel better
  const eraserRadius = activeTool === 'eraser' ? 16 : fixedWidth / 2;

  // Keep track of points in the current active stroke locally
  const currentStrokePoints = useRef<Point[]>([]);
  const lastPoint = useRef<Point | null>(null);

  // Helper to calculate coordinates relative to the canvas element
  const getCoordinates = useCallback((e: React.MouseEvent | React.TouchEvent): Point | null => {
    if (!canvasRef.current) return null;

    const rect = canvasRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? (e as React.TouchEvent).touches[0].clientX : (e as React.MouseEvent).clientX;
    const clientY = 'touches' in e ? (e as React.TouchEvent).touches[0].clientY : (e as React.MouseEvent).clientY;

    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    };
  }, []);

  // Helper to find a stroke that contains a point within a certain radius
  const findIntersectingStroke = useCallback((point: Point, radius: number): DrawingStroke | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    // Search backwards to delete the top-most stroke first
    for (let i = strokes.length - 1; i >= 0; i--) {
      const stroke = strokes[i];
      for (const p of stroke.points) {
        // Scale both points to absolute pixels for accurate distance check
        const absP = { x: p.x * canvas.width, y: p.y * canvas.height };
        const absPoint = { x: point.x * canvas.width, y: point.y * canvas.height };
        const dist = Math.sqrt(Math.pow(absP.x - absPoint.x, 2) + Math.pow(absP.y - absPoint.y, 2));
        if (dist <= radius + 4) return stroke; // +4 padding for better UX
      }
    }
    return null;
  }, [strokes]);

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
    if (currentStrokePoints.current.length > 1 && currentStrokeId.current) {
      allStrokes.push({
        id: currentStrokeId.current,
        points: currentStrokePoints.current,
        color,
        width: fixedWidth,
        memberId: 'local'
      });
    }

    allStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      
      const p0 = stroke.points[0];
      ctx.moveTo(p0.x * canvas.width, p0.y * canvas.height);

      for (let i = 1; i < stroke.points.length; i++) {
        const p = stroke.points[i];
        ctx.lineTo(p.x * canvas.width, p.y * canvas.height);
      }
      ctx.stroke();
    });
  }, [strokes, color, fixedWidth]);

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

    if (activeTool === 'eraser') {
      const target = findIntersectingStroke(point, eraserRadius);
      if (target && target.id && onStrokeDelete) {
        onStrokeDelete(target.id);
      }
      return;
    }
    // Robust UUID fallback
    currentStrokeId.current = typeof crypto.randomUUID === 'function' 
      ? crypto.randomUUID() 
      : Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      
    lastPoint.current = point;
    currentStrokePoints.current = [point];
  }, [isReadOnly, activeTool, getCoordinates, findIntersectingStroke, eraserRadius, onStrokeDelete]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || isReadOnly) return;

    const point = getCoordinates(e);
    if (!point) return;

    if (activeTool === 'eraser') {
      // Check for intersections as we move
      const target = findIntersectingStroke(point, eraserRadius);
      if (target && target.id && onStrokeDelete) {
        onStrokeDelete(target.id);
      }
      return;
    }

    if (!lastPoint.current || !currentStrokeId.current) return;

    if (activeTool === 'line') {
      // For line tool, we only keep the start and current point
      currentStrokePoints.current = [currentStrokePoints.current[0], point];
    } else {
      // Create a segment for real-time sync (only for freehand)
      const segment: DrawingStroke = {
        id: currentStrokeId.current,
        points: [lastPoint.current, point],
        color,
        width: fixedWidth,
        memberId: '' // Will be filled by the sender
      };
      onDrawSegment?.(segment);
      currentStrokePoints.current.push(point);
    }

    lastPoint.current = point;
    redraw();
  }, [isDrawing, isReadOnly, activeTool, color, fixedWidth, getCoordinates, findIntersectingStroke, eraserRadius, onStrokeDelete, onDrawSegment, redraw]);

  const stopDrawing = useCallback(() => {
    if (!isDrawing) return;

    if (currentStrokeId.current && onStrokeEnd && currentStrokePoints.current.length > 1) {
      onStrokeEnd({
        id: currentStrokeId.current,
        points: currentStrokePoints.current,
        color,
        width: fixedWidth,
        memberId: ''
      });
    }

    setIsDrawing(false);
    currentStrokeId.current = null;
    lastPoint.current = null;
    currentStrokePoints.current = [];
    redraw();
  }, [isDrawing, color, fixedWidth, onStrokeEnd, redraw]);

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
