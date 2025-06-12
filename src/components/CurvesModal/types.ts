export interface CurvesModalProps {
  visible: boolean;
  onClose: () => void;
  imageData: ImageData | null;
  isAlphaChannel: boolean;
  onApply: (correctedData: ImageData) => void;
}
