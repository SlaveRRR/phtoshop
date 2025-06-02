import { InterpolationMethod } from '@utils';
import { ResizeParams, Unit } from '../types';

export interface ResizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalWidth: number;
  originalHeight: number;
  onResize: (params: ResizeParams) => void;
}

export interface FormValues {
  width: number;
  height: number;
  unit: Unit;
  maintainAspectRatio: boolean;
  method: InterpolationMethod;
}
