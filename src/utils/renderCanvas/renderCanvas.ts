export const computeRenderParams = (
  imgWidth: number,
  imgHeight: number,
  containerWidth: number,
  containerHeight: number,
  scalePercent: number | null = null,
) => {
  const scaleF =
    scalePercent === null
      ? Math.min(containerWidth / (imgWidth + 100), containerHeight / (imgHeight + 100), 3)
      : scalePercent / 100;

  return {
    scaleF,
    dstWidth: Math.round(imgWidth * scaleF),
    dstHeight: Math.round(imgHeight * scaleF),
    offsetX: (containerWidth - Math.round(imgWidth * scaleF)) / 2,
    offsetY: (containerHeight - Math.round(imgHeight * scaleF)) / 2,
  };
};

export const drawImage = (
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  offsetX: number,
  offsetY: number,
  opacity: number = 1,
  //   blendMode: string = 'normal',
  scaleF: number = 1,
) => {
  ctx.save();
  ctx.globalAlpha = opacity;
  //   ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;

  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = imageData.width;
  tempCanvas.height = imageData.height;
  const tempCtx = tempCanvas.getContext('2d');

  if (tempCtx) {
    tempCtx.putImageData(imageData, 0, 0);

    ctx.imageSmoothingEnabled = false;

    ctx.drawImage(
      tempCanvas,
      0,
      0,
      imageData.width,
      imageData.height,
      offsetX,
      offsetY,
      imageData.width * scaleF,
      imageData.height * scaleF,
    );
  }

  ctx.restore();
};
