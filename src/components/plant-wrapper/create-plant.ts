import type { GrassBlade, GrassPoint } from './types';

export function createGrassBlades(width: number, height: number): GrassBlade[] {
  const blades: GrassBlade[] = [];

  const clusterCount = 3;

  for (let clusterIndex = 0; clusterIndex < clusterCount; clusterIndex++) {
    const clusterBaseX = width * ((clusterIndex + 1) / (clusterCount + 1));
    const clusterBaseY = height;

    const bladeCount = 6 + Math.floor(Math.random() * 10);

    for (let bladeIndex = 0; bladeIndex < bladeCount; bladeIndex++) {
      const blade = createBlade({
        clusterBase: {
          x: clusterBaseX,
          y: clusterBaseY,
        },
        bladeConfig: {
          index: bladeIndex,
          count: bladeCount,
        },
      });
      blades.push(blade);
    }
  }

  return blades;
}

function createBlade({
  clusterBase,
  bladeConfig,
}: {
  clusterBase: {
    x: number;
    y: number;
  };
  bladeConfig: {
    index: number;
    count: number;
  };
}) {
  const baseSpread = 12;

  const baseX = clusterBase.x + (Math.random() - 0.5) * baseSpread * 2;
  const baseY = clusterBase.y + Math.random() * baseSpread * 0.3;

  const spread =
    bladeConfig.count > 1
      ? -0.95 + (bladeConfig.index / (bladeConfig.count - 1)) * 1.9
      : 0;

  const lean = spread + (Math.random() - 0.5) * 0.2;

  const leanRatio = Math.abs(lean) / 0.95;
  const totalLength = 24 + Math.random() * 64;

  const bladeLength =
    totalLength * (1 - leanRatio * 0.45 + Math.random() * 0.15);

  const curveDirection = Math.sign(lean || Math.random() - 0.5) || 1;
  const curveStrength = 0.35 + Math.random() * 0.55;

  const wobbleFrequency = 2 + Math.random() * 3;
  const wobblePhase = Math.random() * Math.PI * 2;
  const wobbleStrength = 0.03 + Math.random() * 0.1;

  const pointCount = Math.floor(Math.random() * 12) + 6;
  const segmentLength = bladeLength / pointCount;
  const points: GrassPoint[] = [];

  for (let pointIndex = 0; pointIndex <= pointCount; pointIndex++) {
    const progressAlongBlade = pointIndex / pointCount;

    const angle =
      -Math.PI / 2 +
      lean +
      curveDirection * curveStrength * progressAlongBlade * progressAlongBlade +
      Math.sin(progressAlongBlade * wobbleFrequency + wobblePhase) *
        wobbleStrength;

    const width = 3.8 * (1 - progressAlongBlade) + 0.35;

    points.push({
      angle,
      length: pointIndex === 0 ? 0 : segmentLength,
      width,
      progressAlongBlade,
    });
  }

  return {
    baseX,
    baseY,
    points,
    color: 'rgba(112, 153, 88, 0.5)',
    growthDelay: Math.random() * 0.38,
    growthSpan: 0.45 + Math.random() * 0.4,
  };
}
