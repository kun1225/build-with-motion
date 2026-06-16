import type { GrassBlade, GrassPoint } from './types';
import {
  PLANT_BASE_SPREAD,
  PLANT_BASE_WIDTH,
  PLANT_BLADE_COUNT_MIN,
  PLANT_BLADE_COUNT_VARIANCE,
  PLANT_CLUSTER_COUNT,
  PLANT_COLOR,
  PLANT_CURVE_STRENGTH_MIN,
  PLANT_CURVE_STRENGTH_VARIANCE,
  PLANT_GROWTH_DELAY_MAX,
  PLANT_GROWTH_SPAN_MIN,
  PLANT_GROWTH_SPAN_VARIANCE,
  PLANT_LEAN_LENGTH_PENALTY,
  PLANT_LEAN_RANDOMNESS,
  PLANT_LENGTH_MIN,
  PLANT_LENGTH_RANDOMNESS,
  PLANT_LENGTH_VARIANCE,
  PLANT_POINT_COUNT_MIN,
  PLANT_POINT_COUNT_VARIANCE,
  PLANT_SPREAD_RANGE,
  PLANT_TIP_WIDTH,
  PLANT_WOBBLE_FREQUENCY_MIN,
  PLANT_WOBBLE_FREQUENCY_VARIANCE,
  PLANT_WOBBLE_STRENGTH_MIN,
  PLANT_WOBBLE_STRENGTH_VARIANCE,
} from './constants';

export function createGrassBlades(width: number, height: number): GrassBlade[] {
  const blades: GrassBlade[] = [];

  for (
    let clusterIndex = 0;
    clusterIndex < PLANT_CLUSTER_COUNT;
    clusterIndex++
  ) {
    const clusterBaseX =
      width * ((clusterIndex + 1) / (PLANT_CLUSTER_COUNT + 1));
    const clusterBaseY = height;

    const bladeCount =
      PLANT_BLADE_COUNT_MIN +
      Math.floor(Math.random() * PLANT_BLADE_COUNT_VARIANCE);

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
  const baseX =
    clusterBase.x + (Math.random() - 0.5) * PLANT_BASE_SPREAD * 2;
  const baseY = clusterBase.y + Math.random() * PLANT_BASE_SPREAD * 0.3;

  const spread =
    bladeConfig.count > 1
      ? -PLANT_SPREAD_RANGE +
        (bladeConfig.index / (bladeConfig.count - 1)) *
          (PLANT_SPREAD_RANGE * 2)
      : 0;

  const lean = spread + (Math.random() - 0.5) * PLANT_LEAN_RANDOMNESS;

  const leanRatio = Math.abs(lean) / PLANT_SPREAD_RANGE;
  const totalLength = PLANT_LENGTH_MIN + Math.random() * PLANT_LENGTH_VARIANCE;

  const bladeLength =
    totalLength *
    (1 -
      leanRatio * PLANT_LEAN_LENGTH_PENALTY +
      Math.random() * PLANT_LENGTH_RANDOMNESS);

  const curveDirection = Math.sign(lean || Math.random() - 0.5) || 1;
  const curveStrength =
    PLANT_CURVE_STRENGTH_MIN +
    Math.random() * PLANT_CURVE_STRENGTH_VARIANCE;

  const wobbleFrequency =
    PLANT_WOBBLE_FREQUENCY_MIN +
    Math.random() * PLANT_WOBBLE_FREQUENCY_VARIANCE;
  const wobblePhase = Math.random() * Math.PI * 2;
  const wobbleStrength =
    PLANT_WOBBLE_STRENGTH_MIN +
    Math.random() * PLANT_WOBBLE_STRENGTH_VARIANCE;

  const pointCount =
    Math.floor(Math.random() * PLANT_POINT_COUNT_VARIANCE) +
    PLANT_POINT_COUNT_MIN;
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

    const width =
      PLANT_BASE_WIDTH * (1 - progressAlongBlade) + PLANT_TIP_WIDTH;

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
    color: PLANT_COLOR,
    growthDelay: Math.random() * PLANT_GROWTH_DELAY_MAX,
    growthSpan: PLANT_GROWTH_SPAN_MIN + Math.random() * PLANT_GROWTH_SPAN_VARIANCE,
  };
}
