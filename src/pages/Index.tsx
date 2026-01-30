import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { DropZone } from '@/components/DropZone';
import { ImageGrid } from '@/components/ImageGrid';
import { Sidebar } from '@/components/Sidebar';
import { Footer } from '@/components/Footer';
import { useSettings } from '@/hooks/useSettings';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { generateZip } from '@/lib/zipGenerator';
import { toast } from 'sonner';

const Index = () => {
  const [isDragging, setIsDragging] = useState(false);
  const { settings, updateSetting, resetSettings } = useSettings();
  const {
    images,
    isProcessing,
    addImages,
    removeImage,
    clearAll,
    processAll,
    processedCount,
  } = useImageProcessor();

  // Initialize dark mode on mount
  useEffect(() => {
    const saved = localStorage.getItem('birme-dark-mode');
    if (saved === null) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('birme-dark-mode', 'true');
    } else if (saved === 'true') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleProcessAll = async () => {
    if (images.length === 0) {
      toast.error('No images to process');
      return;
    }
    
    toast.info(`Processing ${images.length} images...`);
    await processAll(settings);
    toast.success('Processing complete!');
  };

  const handleDownloadAll = async () => {
    if (processedCount === 0) {
      toast.error('No processed images to download');
      return;
    }

    try {
      toast.info('Generating ZIP file...');
      await generateZip(images, settings);
      toast.success('Download started!');
    } catch (error) {
      toast.error('Failed to generate ZIP file');
    }
  };

  const handleClearWorkspace = () => {
    clearAll();
    toast.success('Workspace cleared');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main content area */}
          <div className="flex-1 space-y-6">
            <DropZone
              onFilesAdded={addImages}
              isDragging={isDragging}
              setIsDragging={setIsDragging}
            />

            <ImageGrid
              images={images}
              settings={settings}
              onRemoveImage={removeImage}
            />
          </div>

          {/* Sidebar */}
          <Sidebar
            settings={settings}
            updateSetting={updateSetting}
            resetSettings={resetSettings}
            onProcessAll={handleProcessAll}
            onDownloadAll={handleDownloadAll}
            onClearWorkspace={handleClearWorkspace}
            imageCount={images.length}
            processedCount={processedCount}
            isProcessing={isProcessing}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
