export interface ImageFile {
  id: string;
  file: File;
  name: string;
  originalWidth: number;
  originalHeight: number;
  preview: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  processedBlob?: Blob;
  error?: string;
}

export interface ProcessingSettings {
  width: number;
  height: number;
  maintainAspectRatio: boolean;
  enableCrop: boolean;
  outputFormat: 'jpeg' | 'png' | 'webp';
  quality: number;
  filenamePattern: string;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const DEFAULT_SETTINGS: ProcessingSettings = {
  width: 800,
  height: 600,
  maintainAspectRatio: true,
  enableCrop: true,
  outputFormat: 'jpeg',
  quality: 90,
  filenamePattern: 'image-{index}',
};
