export type GrassPoint = {
  angle: number;
  length: number;
  width: number;
  progressAlongBlade: number;
};

export type GrassBlade = {
  points: GrassPoint[];
  baseX: number;
  baseY: number;
  color: string;
  growthDelay: number;
  growthSpan: number;
};

export type RenderGrassPoint = {
  x: number;
  y: number;
  width: number;
};

export type GrassEdgePoint = {
  x: number;
  y: number;
};
