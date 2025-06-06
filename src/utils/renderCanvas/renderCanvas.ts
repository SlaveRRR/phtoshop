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

  const dstWidth = Math.round(imgWidth * scaleF);
  const dstHeight = Math.round(imgHeight * scaleF);

  const offsetX = (containerWidth - dstWidth) / 2;
  const offsetY = (containerHeight - dstHeight) / 2;

  return {
    scaleF,
    dstWidth,
    dstHeight,
    offsetX,
    offsetY,
  };
};
export const drawImage = (
  ctx: CanvasRenderingContext2D,
  imageData: ImageData,
  offsetX: number,
  offsetY: number,
  opacity: number = 1,
  scaleF: number = 1,
) => {
  ctx.save();
  ctx.globalAlpha = opacity;

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
