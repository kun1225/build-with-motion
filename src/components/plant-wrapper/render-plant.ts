import type { GrassBlade, RenderGrassPoint, GrassEdgePoint } from './types';

export function drawGrass(
  ctx: CanvasRenderingContext2D,
  blades: GrassBlade[],
  width: number,
  height: number,
  progress = 1,
) {
  ctx.clearRect(0, 0, width, height);

  for (const blade of blades) {
    const bladeProgress = Math.max(
      0,
      Math.min(1, (progress - blade.growthDelay) / blade.growthSpan),
    );

    drawBlade(ctx, blade, bladeProgress);
  }
}

function drawBlade(
  ctx: CanvasRenderingContext2D,
  blade: GrassBlade,
  progress: number,
) {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  if (clampedProgress <= 0) return;

  const totalLength = blade.points.reduce(
    (sum, point) => sum + point.length,
    0,
  );
  const drawnLength = totalLength * clampedProgress;
  const centerPoints: RenderGrassPoint[] = [
    {
      x: blade.baseX,
      y: blade.baseY,
      width: blade.points[0]?.width ?? 0,
    },
  ];

  let x = blade.baseX;
  let y = blade.baseY;
  let accumulatedLength = 0;

  for (let i = 1; i < blade.points.length; i++) {
    const point = blade.points[i];
    if (accumulatedLength >= drawnLength) break;

    const remainingLength = drawnLength - accumulatedLength;
    const segmentRatio = Math.min(1, remainingLength / point.length);
    const segmentLength = point.length * segmentRatio;
    const width = segmentRatio < 1 ? point.width * 0.55 : point.width;

    x += Math.cos(point.angle) * segmentLength;
    y += Math.sin(point.angle) * segmentLength;
    centerPoints.push({
      x,
      y,
      width,
    });

    accumulatedLength += segmentLength;

    if (segmentRatio < 1) break;
  }

  if (centerPoints.length < 2) return;

  const leftEdgePoints: GrassEdgePoint[] = [];
  const rightEdgePoints: GrassEdgePoint[] = [];

  for (let i = 0; i < centerPoints.length; i++) {
    const currentPoint = centerPoints[i];
    const previousPoint = centerPoints[Math.max(0, i - 1)];
    const nextPoint = centerPoints[Math.min(centerPoints.length - 1, i + 1)];
    const dx = nextPoint.x - previousPoint.x;
    const dy = nextPoint.y - previousPoint.y;
    const length = Math.hypot(dx, dy) || 1;
    const normalX = -dy / length;
    const normalY = dx / length;
    const halfWidth = currentPoint.width / 2;

    leftEdgePoints.push({
      x: currentPoint.x + normalX * halfWidth,
      y: currentPoint.y + normalY * halfWidth,
    });
    rightEdgePoints.push({
      x: currentPoint.x - normalX * halfWidth,
      y: currentPoint.y - normalY * halfWidth,
    });
  }

  ctx.beginPath();
  ctx.moveTo(leftEdgePoints[0].x, leftEdgePoints[0].y);

  for (let i = 1; i < leftEdgePoints.length; i++) {
    ctx.lineTo(leftEdgePoints[i].x, leftEdgePoints[i].y);
  }

  for (let i = rightEdgePoints.length - 1; i >= 0; i--) {
    ctx.lineTo(rightEdgePoints[i].x, rightEdgePoints[i].y);
  }

  ctx.closePath();
  ctx.fillStyle = blade.color;
  ctx.fill();
}
