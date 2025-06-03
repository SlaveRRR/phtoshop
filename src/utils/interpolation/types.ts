export type InterpolationMethod = 'nearest' | 'bilinear';

export interface PixelArray {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}
