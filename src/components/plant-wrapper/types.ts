export type StemPoint = {
  segmentAngle: number;
  segmentLength: number;
  width: number;
  t: number;
};

export type Stem = {
  pointList: StemPoint[];
  totalLength: number;
  baseX: number;
  baseY: number;
  tipCurl: number;
  color: string;
  growthDelay: number;
  growthSpan: number;
};

export type CreateStemOptions = {
  baseX: number;
  baseY: number;
  totalLength: number;
  baseWidth: number;
  tipWidth: number;
  pointCount: number;
  lean: number;
  signedDroop: number;
  wobbleFrequency: number;
  wobblePhase: number;
  wobbleStrength: number;
  tipCurl: number;
  color: string;
  growthDelay: number;
  growthSpan: number;
};

export type RenderPoint = {
  x: number;
  y: number;
  width: number;
};

export type EdgePoint = {
  x: number;
  y: number;
};
