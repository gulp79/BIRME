import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { ImageFile, ProcessingSettings } from '@/types/image';
import { generateFilename } from './imageProcessor';

export async function generateZip(
  images: ImageFile[],
  settings: ProcessingSettings
): Promise<void> {
  const zip = new JSZip();
  const processedImages = images.filter(img => img.status === 'done' && img.processedBlob);

  if (processedImages.length === 0) {
    throw new Error('No processed images to download');
  }

  processedImages.forEach((image, index) => {
    const filename = generateFilename(
      settings.filenamePattern,
      index,
      image.name,
      settings.outputFormat
    );
    zip.file(filename, image.processedBlob!);
  });

  const content = await zip.generateAsync({ 
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 }
  });

  const timestamp = new Date().toISOString().slice(0, 10);
  saveAs(content, `birme-images-${timestamp}.zip`);
}

export async function downloadSingleImage(
  image: ImageFile,
  index: number,
  settings: ProcessingSettings
): Promise<void> {
  if (!image.processedBlob) {
    throw new Error('Image not processed');
  }

  const filename = generateFilename(
    settings.filenamePattern,
    index,
    image.name,
    settings.outputFormat
  );

  saveAs(image.processedBlob, filename);
}
