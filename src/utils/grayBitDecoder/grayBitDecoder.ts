import { ImageMetadata } from '@types';

export const grayBitDecoder = (buffer: ArrayBuffer): ImageMetadata => {
  const dataView = new DataView(buffer);

  // Check signature (GB7 + control character)
  const signatureG = dataView.getUint8(0);
  const signatureB = dataView.getUint8(1);
  const signature7 = dataView.getUint8(2);
  const signatureControl = dataView.getUint8(3);

  if (
    signatureG !== 0x47 || // G
    signatureB !== 0x42 || // B
    signature7 !== 0x37 || // 7
    signatureControl !== 0x1d // Control character
  ) {
    throw new Error('Invalid GrayBit-7 signature');
  }

  //   const version = dataView.getUint8(4);
  const flag = dataView.getUint8(5);
  const width = dataView.getUint16(6, false);
  const height = dataView.getUint16(8, false);

  // Check if mask flag is set (bit 0 of flag byte)
  const hasMask = (flag & 0x01) === 1;

  return {
    width,
    height,
    colorDepth: 7,
    format: 'GrayBit-7',
    hasMask,
  };
};
