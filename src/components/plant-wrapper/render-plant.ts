import type { Stem, RenderPoint, EdgePoint } from './types';
import { PLANT_PARTIAL_SEGMENT_WIDTH_RATIO } from './constants';

function drawStem(ctx: CanvasRenderingContext2D, stem: Stem, progress: number) {
  const clampedProgress = Math.max(0, Math.min(1, progress));
  if (clampedProgress <= 0) return;

  const totalLength = stem.totalLength;
  const drawnLength = totalLength * clampedProgress;
  const centerPoints: RenderPoint[] = [
    {
      x: stem.baseX,
      y: stem.baseY,
      width: stem.pointList[0]?.width ?? 0,
    },
  ];

  let x = stem.baseX;
  let y = stem.baseY;
  let accumulatedLength = 0;
  const currentTipT = Math.max(0.001, drawnLength / totalLength);
  const curlRemaining = stem.tipCurl * (1 - clampedProgress);

  for (let i = 1; i < stem.pointList.length; i++) {
    const point = stem.pointList[i];
    if (accumulatedLength >= drawnLength) break;

    const remainingLength = drawnLength - accumulatedLength;
    const segmentRatio = Math.min(1, remainingLength / point.segmentLength);
    const segmentLength = point.segmentLength * segmentRatio;
    
    const width =
      segmentRatio < 1
        ? point.width * PLANT_PARTIAL_SEGMENT_WIDTH_RATIO
        : point.width;
        
    const relativeT = Math.min(1, point.t / currentTipT);
    const curlT = Math.max(0, (relativeT - 0.5) / 0.5);
    const angle = point.segmentAngle + curlRemaining * curlT * curlT * 3;

    x += Math.cos(angle) * segmentLength;
    y += Math.sin(angle) * segmentLength;
    centerPoints.push({
      x,
      y,
      width,
    });

    accumulatedLength += segmentLength;

    if (segmentRatio < 1) break;
  }

  if (centerPoints.length < 2) return;

  const leftEdgePoints: EdgePoint[] = [];
  const rightEdgePoints: EdgePoint[] = [];

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
  ctx.fillStyle = stem.color;
  ctx.fill();
}

export function drawGrass(
  ctx: CanvasRenderingContext2D,
  blades: Stem[],
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

    drawStem(ctx, blade, bladeProgress);
  }
}
