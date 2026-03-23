export type BoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type DetectedObject = {
  label: string;
  confidence: number;
  boundingBox?: BoundingBox;
};

export type Detections = {
  objects: DetectedObject[];
  faces: BoundingBox[];
  texts: string[];
};
