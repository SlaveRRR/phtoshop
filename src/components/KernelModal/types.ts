import { Layer } from '@hooks/useApp/types';

export interface KernelModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (imageData: ImageData) => void;
  activeLayer?: Layer;
}
