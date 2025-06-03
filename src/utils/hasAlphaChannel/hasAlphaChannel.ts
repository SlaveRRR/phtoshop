export const hasAlphaChannel = (imageData: ImageData): boolean => {
  const data = imageData.data;
  for (let i = 3; i < data.length; i += 4) {
    if (data[i] < 255) return true;
  }
  return false;
};
