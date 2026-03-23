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

export type FaceBoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
    confidence?: number;
};

export type Detections = {
  objects: DetectedObject[];
  faces: FaceBoundingBox[];
  texts: string[];
};
