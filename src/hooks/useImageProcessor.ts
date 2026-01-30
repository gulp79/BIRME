import { useState, useCallback } from 'react';
import { ImageFile, ProcessingSettings } from '@/types/image';
import { processImage, loadImage } from '@/lib/imageProcessor';

export function useImageProcessor() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const addImages = useCallback(async (files: File[]) => {
    const newImages: ImageFile[] = [];

    for (const file of files) {
      try {
        const img = await loadImage(file);
        const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        newImages.push({
          id,
          file,
          name: file.name,
          originalWidth: img.width,
          originalHeight: img.height,
          preview: URL.createObjectURL(file),
          status: 'pending',
        });
      } catch (error) {
        console.error('Failed to load image:', file.name, error);
      }
    }

    setImages(prev => [...prev, ...newImages]);
  }, []);

  const removeImage = useCallback((id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id);
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      return prev.filter(img => img.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
  }, [images]);

  const processAll = useCallback(async (settings: ProcessingSettings) => {
    if (isProcessing) return;
    
    setIsProcessing(true);

    // Reset all statuses to pending
    setImages(prev => prev.map(img => ({ ...img, status: 'pending' as const })));

    // Process images in batches for better performance
    const batchSize = 3;
    const imagesCopy = [...images];

    for (let i = 0; i < imagesCopy.length; i += batchSize) {
      const batch = imagesCopy.slice(i, i + batchSize);
      
      // Mark batch as processing
      setImages(prev => prev.map(img => 
        batch.find(b => b.id === img.id) 
          ? { ...img, status: 'processing' as const }
          : img
      ));

      // Process batch in parallel
      const results = await Promise.allSettled(
        batch.map(async (image) => {
          const result = await processImage(image.file, settings);
          return { id: image.id, result };
        })
      );

      // Update statuses based on results
      setImages(prev => prev.map(img => {
        const resultIndex = batch.findIndex(b => b.id === img.id);
        if (resultIndex === -1) return img;

        const result = results[resultIndex];
        if (result.status === 'fulfilled') {
          return {
            ...img,
            status: 'done' as const,
            processedBlob: result.value.result.blob,
          };
        } else {
          return {
            ...img,
            status: 'error' as const,
            error: 'Processing failed',
          };
        }
      }));
    }

    setIsProcessing(false);
  }, [images, isProcessing]);

  const processedCount = images.filter(img => img.status === 'done').length;

  return {
    images,
    isProcessing,
    addImages,
    removeImage,
    clearAll,
    processAll,
    processedCount,
  };
}
