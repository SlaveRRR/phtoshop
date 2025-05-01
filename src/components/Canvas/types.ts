export interface CanvasComponentStyledProps {
  scale: number;
}

interface ImageMetadata {
  width: number;
  height: number;
  colorDepth: number;
  format: string;
  hasMask?: boolean;
}

export interface CanvasProps {
  metadata: ImageMetadata;
}
