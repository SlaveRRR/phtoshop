import { FileType } from './types';

export const getFileType = (buffer: ArrayBuffer): FileType | null => {
  const view = new DataView(buffer);
  if (view.byteLength >= 4) {
    if (
      view.getUint8(0) === 0x47 &&
      view.getUint8(1) === 0x42 &&
      view.getUint8(2) === 0x37 &&
      view.getUint8(3) === 0x1d
    ) {
      return 'gb7';
    }
    if (
      view.getUint8(0) === 0x89 &&
      view.getUint8(1) === 0x50 &&
      view.getUint8(2) === 0x4e &&
      view.getUint8(3) === 0x47
    ) {
      return 'png';
    }
    if (view.getUint8(0) === 0xff && view.getUint8(1) === 0xd8) {
      return 'jpg';
    }
  }
  return null;
};
