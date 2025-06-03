
const getFileType = (buffer: ArrayBuffer): 'gb7' | 'png' | 'jpg' | null => {
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
    }

const  hasAlphaChannel = (imageData: ImageData): boolean => {
        const data = imageData.data;
        for (let i = 3; i < data.length; i += 4) {
            if (data[i] < 255) return true;
        }
        return false;
    }



export const imageUploader = ({ variant = 'contained' }) {
  

   

  

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            if (!reader.result) return;
            const buffer = reader.result as ArrayBuffer;
            const fileType = detectFileType(buffer);

            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            if (!ctx) return;

            if (fileType === 'gb7') {
                try {
                    const decoded = decodeGB7(buffer);
                    canvas.width = decoded.width;
                    canvas.height = decoded.height;

                    const imageData = new ImageData(
                        decoded.pixels,
                        decoded.width,
                        decoded.height
                    );
                    ctx.putImageData(imageData, 0, 0);

                    const colorDepth = 7 + (decoded.hasMask ? 1 : 0);
                    const hasAlpha = decoded.hasMask;

                    addLayer({
                        name: `Слой ${existingLayers.length + 1}`,
                        imageUrl: canvas.toDataURL(),
                        width: decoded.width,
                        height: decoded.height,
                        colorDepth,
                        fileName: file.name,
                        fileType,
                        interpolation: 'bilinear',
                        hasAlphaChannel: hasAlpha,
                        alphaChannelVisible: hasAlpha,
                    });
                } catch (err) {
                    console.error('Failed to decode GB7:', err);
                }
            } else if (fileType === 'png' || fileType === 'jpg') {
                const imgUrl = URL.createObjectURL(file);
                const img = new Image();

                img.onload = () => {
                    canvas.width = img.naturalWidth;
                    canvas.height = img.naturalHeight;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 0, 0);

                    let imageData: ImageData;
                    try {
                        imageData = ctx.getImageData(
                            0,
                            0,
                            canvas.width,
                            canvas.height
                        );
                    } catch (e) {
                        console.error('Не удалось получить ImageData:', e);
                        URL.revokeObjectURL(imgUrl);
                        return;
                    }

                    const hasAlpha =
                        fileType === 'png' && hasAlphaChannel(imageData);
                    const colorDepth =
                        fileType === 'png' ? (hasAlpha ? 32 : 24) : 24;

                    if (existingLayers.length === 0) {
                        clearAllLayers();
                    }

                    addLayer({
                        name: `Слой ${existingLayers.length + 1}`,
                        imageUrl: canvas.toDataURL(),
                        width: canvas.width,
                        height: canvas.height,
                        colorDepth,
                        fileName: file.name,
                        fileType,
                        interpolation: 'bilinear',
                        hasAlphaChannel: hasAlpha,
                        alphaChannelVisible: hasAlpha,
                    });

                    URL.revokeObjectURL(imgUrl);
                };

                img.onerror = (err) => {
                    console.error('Ошибка при загрузке изображения:', err);
                    URL.revokeObjectURL(imgUrl);
                };

                img.src = imgUrl;
            } else {
                console.error('Неподдерживаемый тип файла:', fileType);
            }
        };

        reader.readAsArrayBuffer(file);
    };

}