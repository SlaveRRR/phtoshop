export const applyKernel = (imageData: ImageData, kernel: number[], scale = 1, offset = 0) => {
  const width = imageData.width;
  const height = imageData.height;
  const srcData = imageData.data;
  const dstData = new Uint8ClampedArray(srcData.length);

  // Создаем расширенное изображение с padding
  const paddedWidth = width + 2;
  const paddedHeight = height + 2;
  const paddedData = new Uint8ClampedArray(paddedWidth * paddedHeight * 4);

  // Копируем основное изображение в центр
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const srcPos = (y * width + x) * 4;
      const dstPos = ((y + 1) * paddedWidth + (x + 1)) * 4;
      paddedData[dstPos] = srcData[srcPos];
      paddedData[dstPos + 1] = srcData[srcPos + 1];
      paddedData[dstPos + 2] = srcData[srcPos + 2];
      paddedData[dstPos + 3] = srcData[srcPos + 3];
    }
  }

  // Обрабатываем края - копируем ближайшие пиксели
  // Верхняя и нижняя строки
  for (let x = 0; x < width; x++) {
    // Верхняя строка
    const topSrcPos = (0 * width + x) * 4;
    const topDstPos = (0 * paddedWidth + (x + 1)) * 4;
    paddedData[topDstPos] = srcData[topSrcPos];
    paddedData[topDstPos + 1] = srcData[topSrcPos + 1];
    paddedData[topDstPos + 2] = srcData[topSrcPos + 2];
    paddedData[topDstPos + 3] = srcData[topSrcPos + 3];

    // Нижняя строка
    const bottomSrcPos = ((height - 1) * width + x) * 4;
    const bottomDstPos = ((paddedHeight - 1) * paddedWidth + (x + 1)) * 4;
    paddedData[bottomDstPos] = srcData[bottomSrcPos];
    paddedData[bottomDstPos + 1] = srcData[bottomSrcPos + 1];
    paddedData[bottomDstPos + 2] = srcData[bottomSrcPos + 2];
    paddedData[bottomDstPos + 3] = srcData[bottomSrcPos + 3];
  }

  // Левый и правый столбцы
  for (let y = 0; y < height; y++) {
    // Левый столбец
    const leftSrcPos = (y * width + 0) * 4;
    const leftDstPos = ((y + 1) * paddedWidth + 0) * 4;
    paddedData[leftDstPos] = srcData[leftSrcPos];
    paddedData[leftDstPos + 1] = srcData[leftSrcPos + 1];
    paddedData[leftDstPos + 2] = srcData[leftSrcPos + 2];
    paddedData[leftDstPos + 3] = srcData[leftSrcPos + 3];

    // Правый столбец
    const rightSrcPos = (y * width + (width - 1)) * 4;
    const rightDstPos = ((y + 1) * paddedWidth + (paddedWidth - 1)) * 4;
    paddedData[rightDstPos] = srcData[rightSrcPos];
    paddedData[rightDstPos + 1] = srcData[rightSrcPos + 1];
    paddedData[rightDstPos + 2] = srcData[rightSrcPos + 2];
    paddedData[rightDstPos + 3] = srcData[rightSrcPos + 3];
  }

  // Обрабатываем углы - копируем значения из ближайших угловых пикселей
  // Верхний левый угол
  const topLeftPos = 0 * 4;
  const srcTopLeftPos = 0 * 4;
  paddedData[topLeftPos] = srcData[srcTopLeftPos];
  paddedData[topLeftPos + 1] = srcData[srcTopLeftPos + 1];
  paddedData[topLeftPos + 2] = srcData[srcTopLeftPos + 2];
  paddedData[topLeftPos + 3] = srcData[srcTopLeftPos + 3];

  // Верхний правый угол
  const topRightPos = (paddedWidth - 1) * 4;
  const srcTopRightPos = (width - 1) * 4;
  paddedData[topRightPos] = srcData[srcTopRightPos];
  paddedData[topRightPos + 1] = srcData[srcTopRightPos + 1];
  paddedData[topRightPos + 2] = srcData[srcTopRightPos + 2];
  paddedData[topRightPos + 3] = srcData[srcTopRightPos + 3];

  // Нижний левый угол
  const bottomLeftPos = (paddedHeight - 1) * paddedWidth * 4;
  const srcBottomLeftPos = (height - 1) * width * 4;
  paddedData[bottomLeftPos] = srcData[srcBottomLeftPos];
  paddedData[bottomLeftPos + 1] = srcData[srcBottomLeftPos + 1];
  paddedData[bottomLeftPos + 2] = srcData[srcBottomLeftPos + 2];
  paddedData[bottomLeftPos + 3] = srcData[srcBottomLeftPos + 3];

  // Нижний правый угол
  const bottomRightPos = ((paddedHeight - 1) * paddedWidth + (paddedWidth - 1)) * 4;
  const srcBottomRightPos = ((height - 1) * width + (width - 1)) * 4;
  paddedData[bottomRightPos] = srcData[srcBottomRightPos];
  paddedData[bottomRightPos + 1] = srcData[srcBottomRightPos + 1];
  paddedData[bottomRightPos + 2] = srcData[srcBottomRightPos + 2];
  paddedData[bottomRightPos + 3] = srcData[srcBottomRightPos + 3];

  // Применяем свертку с ядром
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dstPos = (y * width + x) * 4;
      let r = 0,
        g = 0,
        b = 0,
        a = 0;

      // Применяем ядро 3x3
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const kernelValue = kernel[(ky + 1) * 3 + (kx + 1)];
          const srcPos = ((y + ky + 1) * paddedWidth + (x + kx + 1)) * 4;

          r += paddedData[srcPos] * kernelValue;
          g += paddedData[srcPos + 1] * kernelValue;
          b += paddedData[srcPos + 2] * kernelValue;
          a += paddedData[srcPos + 3] * kernelValue;
        }
      }

      // Нормализация и применение offset
      r = r / scale + offset;
      g = g / scale + offset;
      b = b / scale + offset;
      a = a / scale + offset;

      // Ограничиваем значения в диапазоне 0-255
      dstData[dstPos] = Math.max(0, Math.min(255, Math.round(r)));
      dstData[dstPos + 1] = Math.max(0, Math.min(255, Math.round(g)));
      dstData[dstPos + 2] = Math.max(0, Math.min(255, Math.round(b)));
      dstData[dstPos + 3] = Math.max(0, Math.min(255, Math.round(a)));
    }
  }

  return new ImageData(dstData, width, height);
};
