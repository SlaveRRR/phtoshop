import { InterpolationMethod } from '@utils/interpolation';

export interface ResizeParams {
  width: number;
  height: number;
  method: InterpolationMethod;
}

export type Unit = 'pixels' | 'percent';

export interface ImageSize {
  width: number;
  height: number;
  megapixels: string;
} 