import { ProcessingSettings, CropArea } from '@/types/image';

export interface ProcessResult {
  blob: Blob;
  width: number;
  height: number;
}

export async function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function calculateSmartCrop(
  srcWidth: number,
  srcHeight: number,
  targetWidth: number,
  targetHeight: number
): CropArea {
  const srcAspect = srcWidth / srcHeight;
  const targetAspect = targetWidth / targetHeight;

  let cropWidth: number;
  let cropHeight: number;
  let cropX: number;
  let cropY: number;

  if (srcAspect > targetAspect) {
    // Source is wider - crop horizontally
    cropHeight = srcHeight;
    cropWidth = srcHeight * targetAspect;
    cropX = (srcWidth - cropWidth) / 2;
    cropY = 0;
  } else {
    // Source is taller - crop vertically
    cropWidth = srcWidth;
    cropHeight = srcWidth / targetAspect;
    cropX = 0;
    cropY = (srcHeight - cropHeight) / 2;
  }

  return {
    x: Math.round(cropX),
    y: Math.round(cropY),
    width: Math.round(cropWidth),
    height: Math.round(cropHeight),
  };
}

export function calculateFitDimensions(
  srcWidth: number,
  srcHeight: number,
  targetWidth: number,
  targetHeight: number,
  maintainAspectRatio: boolean
): { width: number; height: number } {
  if (!maintainAspectRatio) {
    return { width: targetWidth, height: targetHeight };
  }

  const srcAspect = srcWidth / srcHeight;
  const targetAspect = targetWidth / targetHeight;

  if (srcAspect > targetAspect) {
    // Image is wider than target - fit to width
    return {
      width: targetWidth,
      height: Math.round(targetWidth / srcAspect),
    };
  } else {
    // Image is taller than target - fit to height
    return {
      width: Math.round(targetHeight * srcAspect),
      height: targetHeight,
    };
  }
}

export async function processImage(
  file: File,
  settings: ProcessingSettings,
  customCrop?: CropArea
): Promise<ProcessResult> {
  const img = await loadImage(file);
  const { width: targetWidth, height: targetHeight } = settings;

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  let srcX = 0;
  let srcY = 0;
  let srcWidth = img.width;
  let srcHeight = img.height;
  let destWidth = targetWidth;
  let destHeight = targetHeight;

  if (customCrop) {
    // Use custom crop area
    srcX = customCrop.x;
    srcY = customCrop.y;
    srcWidth = customCrop.width;
    srcHeight = customCrop.height;
  } else if (settings.enableCrop) {
    // Smart crop - center crop to fit exact dimensions
    const crop = calculateSmartCrop(img.width, img.height, targetWidth, targetHeight);
    srcX = crop.x;
    srcY = crop.y;
    srcWidth = crop.width;
    srcHeight = crop.height;
  } else if (settings.maintainAspectRatio) {
    // Fit within dimensions, maintaining aspect ratio
    const fit = calculateFitDimensions(img.width, img.height, targetWidth, targetHeight, true);
    destWidth = fit.width;
    destHeight = fit.height;
  }

  canvas.width = destWidth;
  canvas.height = destHeight;

  // Enable high-quality scaling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // Fill with white background for JPEG
  if (settings.outputFormat === 'jpeg') {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, destWidth, destHeight);
  }

  ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, destWidth, destHeight);

  // Convert to blob
  const mimeType = `image/${settings.outputFormat}`;
  const quality = settings.quality / 100;

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve({ blob, width: destWidth, height: destHeight });
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      mimeType,
      quality
    );
  });
}

export function generateFilename(
  pattern: string,
  index: number,
  originalName: string,
  format: string
): string {
  const baseName = originalName.replace(/\.[^/.]+$/, '');
  const extension = format === 'jpeg' ? 'jpg' : format;
  
  return pattern
    .replace('{index}', String(index + 1).padStart(3, '0'))
    .replace('{name}', baseName)
    .replace('{i}', String(index + 1))
    + '.' + extension;
}
