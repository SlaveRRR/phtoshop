import { ImageMetadata } from '@types';
import { UploadProps } from 'antd';
import { Dispatch, RefObject, SetStateAction } from 'react';

export interface AppContext {
  onFileSelect: UploadProps['customRequest'];
  metadata: ImageMetadata;
  setMetadata: Dispatch<SetStateAction<ImageMetadata>>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}
