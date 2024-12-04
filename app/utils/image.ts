export const compressImage = async (
  image: File,
  quality = 0.8,
  maxSize?: number,
): Promise<File> => {
  if (!import.meta.client) {
    // eslint-disable-next-line no-console
    console.warn("compressImage() is only available on the client side");
    return image;
  }
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Failed to create canvas context");
  }

  const imageElement = document.createElement("img");
  imageElement.src = URL.createObjectURL(image);

  await new Promise((resolve, reject) => {
    imageElement.onload = resolve;
    imageElement.onerror = reject;
  });

  let { width, height } = imageElement;

  if (maxSize) {
    if (width > height) {
      if (width > maxSize) {
        height = (height * maxSize) / width;
        width = maxSize;
      }
    } else {
      if (height > maxSize) {
        width = (width * maxSize) / height;
        height = maxSize;
      }
    }
  }

  canvas.width = width;
  canvas.height = height;
  context.drawImage(imageElement, 0, 0, width, height);

  const dataUrl = canvas.toDataURL(image.type, quality);
  const blob = await fetch(dataUrl).then((res) => res.blob());

  return new File([blob], image.name, { type: image.type });
};
