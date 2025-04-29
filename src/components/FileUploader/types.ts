import { ImageMetadata } from '@types';
import { Dispatch, RefObject, SetStateAction } from 'react';

export interface FileUploaderProps {
  setMetadata: Dispatch<SetStateAction<ImageMetadata>>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}
