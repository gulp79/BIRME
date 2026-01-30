import { ImageFile, ProcessingSettings } from '@/types/image';
import { ImageCard } from './ImageCard';

interface ImageGridProps {
  images: ImageFile[];
  settings: ProcessingSettings;
  onRemoveImage: (id: string) => void;
}

export function ImageGrid({ images, settings, onRemoveImage }: ImageGridProps) {
  if (images.length === 0) {
    return null;
  }

  const stats = {
    total: images.length,
    pending: images.filter(i => i.status === 'pending').length,
    processing: images.filter(i => i.status === 'processing').length,
    done: images.filter(i => i.status === 'done').length,
    error: images.filter(i => i.status === 'error').length,
  };

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium">{stats.total} images</span>
        {stats.processing > 0 && (
          <span className="status-processing px-2 py-0.5 rounded-full text-xs">
            {stats.processing} processing
          </span>
        )}
        {stats.done > 0 && (
          <span className="status-done px-2 py-0.5 rounded-full text-xs">
            {stats.done} done
          </span>
        )}
        {stats.error > 0 && (
          <span className="status-error px-2 py-0.5 rounded-full text-xs">
            {stats.error} failed
          </span>
        )}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {images.map((image, index) => (
          <ImageCard
            key={image.id}
            image={image}
            index={index}
            settings={settings}
            onRemove={onRemoveImage}
          />
        ))}
      </div>
    </div>
  );
}
