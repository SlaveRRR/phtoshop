export const isGrayBitFormat = (view: DataView): boolean => {
  const signatureG = view.getUint8(0);
  const signatureB = view.getUint8(1);
  const signature7 = view.getUint8(2);
  const signatureControl = view.getUint8(3);
  return (
    signatureG === 0x47 && // G
    signatureB === 0x42 && // B
    signature7 === 0x37 && // 7
    signatureControl === 0x1d // Control character
  );
};
