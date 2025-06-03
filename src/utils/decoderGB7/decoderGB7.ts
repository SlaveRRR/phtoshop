import { DecodedGB7 } from './types';

export const decoderGB7 = (buffer: ArrayBuffer): DecodedGB7 => {
  const view = new DataView(buffer);

  if (
    view.getUint8(0) !== 0x47 ||
    view.getUint8(1) !== 0x42 ||
    view.getUint8(2) !== 0x37 ||
    view.getUint8(3) !== 0x1d
  ) {
    throw new Error('Invalid GB7 signature');
  }

  const flags = view.getUint8(5);
  const hasMask = (flags & 0x01) === 1;
  const width = view.getUint16(6, false);
  const height = view.getUint16(8, false);

  const pixelData = new Uint8Array(buffer, 12, width * height);
  const output = new Uint8ClampedArray(width * height * 4);

  for (let i = 0; i < pixelData.length; i++) {
    const byte = pixelData[i];
    const gray = byte & 0b01111111;
    const maskBit = (byte & 0b10000000) !== 0;

    const alpha = hasMask ? (maskBit ? 255 : 0) : 255;

    output[i * 4] = gray * 2;
    output[i * 4 + 1] = gray * 2;
    output[i * 4 + 2] = gray * 2;
    output[i * 4 + 3] = alpha;
  }

  return { width, height, pixels: output, hasMask };
};
