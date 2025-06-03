import { ImageMetadata } from '@types';
import { InterpolationMethod } from '@utils';
import { UploadProps } from 'antd';
import { Dispatch, RefObject, SetStateAction } from 'react';

export interface AppContext {
  onFileSelect: UploadProps['customRequest'];
  onScaleChange: (value: number) => void;
  metadata: ImageMetadata;
  setMetadata: Dispatch<SetStateAction<ImageMetadata>>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
  autoScaled: boolean;
  setAutoScaled: Dispatch<SetStateAction<boolean>>;
  handleResize: (params: ResizeParams) => void;
  isOpenModal: boolean;
  closeModal: () => void;
  openModal: () => void;
}

export interface ResizeParams {
  width: number;
  height: number;
  method: InterpolationMethod;
}
