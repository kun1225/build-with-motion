import type { CreateStemOptions, Stem, StemPoint } from './types';
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
  PLANT_TIP_CURL_MIN,
  PLANT_TIP_CURL_VARIANCE,
  PLANT_TIP_WIDTH,
  PLANT_WOBBLE_FREQUENCY_MIN,
  PLANT_WOBBLE_FREQUENCY_VARIANCE,
  PLANT_WOBBLE_STRENGTH_MIN,
  PLANT_WOBBLE_STRENGTH_VARIANCE,
} from './constants';

export function createStem(options: CreateStemOptions): Stem {
  const {
    baseX,
    baseY,
    totalLength,
    baseWidth,
    tipWidth,
    pointCount,
    lean,
    signedDroop,
    wobbleFrequency,
    wobblePhase,
    wobbleStrength,
    tipCurl,
    color,
    growthDelay,
    growthSpan,
  } = options;

  const segmentLength = totalLength / pointCount;
  const pointList: StemPoint[] = [
    {
      segmentAngle: -Math.PI / 2 + lean,
      segmentLength: 0,
      width: baseWidth,
      t: 0,
    },
  ];

  let angle = -Math.PI / 2 + lean;

  for (let pointIndex = 1; pointIndex <= pointCount; pointIndex++) {
    const t = pointIndex / pointCount;

    angle += signedDroop * t * (2 / pointCount);
    angle += Math.sin(t * wobbleFrequency + wobblePhase) * wobbleStrength;

    const width = baseWidth * (1 - t) + tipWidth;

    pointList.push({
      segmentAngle: angle,
      segmentLength,
      width,
      t,
    });
  }

  return {
    pointList,
    totalLength,
    baseX,
    baseY,
    tipCurl,
    color,
    growthDelay,
    growthSpan,
  };
}

export function createGrassBlades(width: number, height: number): Stem[] {
  const stems: Stem[] = [];

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
      stems.push(
        createGrassStem({
          clusterBaseX,
          clusterBaseY,
        }),
      );
    }
  }

  return stems;
}

function createGrassStem({
  clusterBaseX,
  clusterBaseY,
}: {
  clusterBaseX: number;
  clusterBaseY: number;
}) {
  const baseX = clusterBaseX + (Math.random() - 0.5) * PLANT_BASE_SPREAD * 2;
  const baseY = clusterBaseY + Math.random() * PLANT_BASE_SPREAD * 0.3;

  const positionOffset = baseX - clusterBaseX;

  const positionRatio = positionOffset / PLANT_BASE_SPREAD;
  const clampedPositionRatio = Math.max(-1, Math.min(1, positionRatio));

  const lean =
    clampedPositionRatio * PLANT_SPREAD_RANGE +
    (Math.random() - 0.5) * PLANT_LEAN_RANDOMNESS;
  const leanRatio = Math.abs(lean) / PLANT_SPREAD_RANGE;

  const totalLength = PLANT_LENGTH_MIN + Math.random() * PLANT_LENGTH_VARIANCE;
  const adjustedLength =
    totalLength *
    (1 -
      leanRatio * PLANT_LEAN_LENGTH_PENALTY +
      Math.random() * PLANT_LENGTH_RANDOMNESS);

  const curveDirection = Math.sign(lean || Math.random() - 0.5) || 1;
  const curveStrength =
    PLANT_CURVE_STRENGTH_MIN + Math.random() * PLANT_CURVE_STRENGTH_VARIANCE;

  const wobbleFrequency =
    PLANT_WOBBLE_FREQUENCY_MIN +
    Math.random() * PLANT_WOBBLE_FREQUENCY_VARIANCE;
  const wobblePhase = Math.random() * Math.PI * 2;
  const wobbleStrength =
    PLANT_WOBBLE_STRENGTH_MIN + Math.random() * PLANT_WOBBLE_STRENGTH_VARIANCE;
  const pointCount =
    Math.floor(Math.random() * PLANT_POINT_COUNT_VARIANCE) +
    PLANT_POINT_COUNT_MIN;

  return createStem({
    baseX,
    baseY,
    totalLength: adjustedLength,
    baseWidth: PLANT_BASE_WIDTH,
    tipWidth: PLANT_TIP_WIDTH,
    pointCount,
    lean,
    signedDroop: curveDirection * curveStrength,
    wobbleFrequency,
    wobblePhase,
    wobbleStrength,
    tipCurl:
      (Math.random() < 0.5 ? -1 : 1) *
      (PLANT_TIP_CURL_MIN + Math.random() * PLANT_TIP_CURL_VARIANCE),
    color: PLANT_COLOR,
    growthDelay: Math.random() * PLANT_GROWTH_DELAY_MAX,
    growthSpan:
      PLANT_GROWTH_SPAN_MIN + Math.random() * PLANT_GROWTH_SPAN_VARIANCE,
  });
}
