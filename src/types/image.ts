import { Dispatch, SetStateAction } from 'react';

export interface ImageMetadata {
  width: number;
  height: number;
  colorDepth: number;
  format: string;
  hasMask?: boolean;
  imageData?: number[];
  setMetadata?: Dispatch<SetStateAction<ImageMetadata>>;
}
