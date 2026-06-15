import { useLayoutEffect, useRef } from 'react';
import type { GrassBlade } from './types';
import { initCanvas } from '#/lib/canvas';
import { createGrassBlades } from './create-plant';
import { drawGrass } from './render-plant';

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

export function plantWrapper({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const bladesRef = useRef<GrassBlade[]>([]);
  const sizeRef = useRef({ width: 0, height: 0 });
  const progressRef = useRef(0);
  const frameRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const drawFrame = (progress: number) => {
      const context = contextRef.current;
      const { width, height } = sizeRef.current;
      if (!context || width === 0 || height === 0) return;

      drawGrass(context, bladesRef.current, width, height, progress);
    };

    const setupCanvas = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      const roundedWidth = Math.round(width);
      const roundedHeight = Math.round(height);
      if (roundedWidth === 0 || roundedHeight === 0) return;

      const context = initCanvas(canvas, roundedWidth, roundedHeight);
      contextRef.current = context;
      sizeRef.current = { width: roundedWidth, height: roundedHeight };
      bladesRef.current = createGrassBlades(roundedWidth, roundedHeight);

      drawFrame(progressRef.current);
    };

    const cancelFrame = () => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const startGrowth = () => {
      cancelFrame();
      const duration = 2400;
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const rawProgress = Math.min(1, elapsed / duration);
        const easedProgress = easeOutCubic(rawProgress);
        progressRef.current = easedProgress;
        drawFrame(easedProgress);

        if (rawProgress < 1) {
          frameRef.current = requestAnimationFrame(tick);
        } else {
          frameRef.current = null;
        }
      };

      frameRef.current = requestAnimationFrame(tick);
    };

    setupCanvas();
    startGrowth();

    const observer = new ResizeObserver(() => {
      setupCanvas();
    });
    observer.observe(wrapper);

    return () => {
      cancelFrame();
      observer.unobserve(wrapper);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      {children}

      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 size-full"
      />
    </div>
  );
}
