import { X, Check, Loader2, AlertCircle, Download } from 'lucide-react';
import { ImageFile, ProcessingSettings } from '@/types/image';
import { Button } from '@/components/ui/button';
import { downloadSingleImage } from '@/lib/zipGenerator';
import { toast } from 'sonner';

interface ImageCardProps {
  image: ImageFile;
  index: number;
  settings: ProcessingSettings;
  onRemove: (id: string) => void;
}

export function ImageCard({ image, index, settings, onRemove }: ImageCardProps) {
  const handleDownload = async () => {
    try {
      await downloadSingleImage(image, index, settings);
    } catch (error) {
      toast.error('Failed to download image');
    }
  };

  const statusIcon = {
    pending: null,
    processing: <Loader2 className="w-4 h-4 animate-spin" />,
    done: <Check className="w-4 h-4" />,
    error: <AlertCircle className="w-4 h-4" />,
  };

  const statusClass = {
    pending: 'bg-muted text-muted-foreground',
    processing: 'status-processing',
    done: 'status-done',
    error: 'status-error',
  };

  return (
    <div className="image-card animate-fade-in group">
      <div className="aspect-square relative overflow-hidden bg-muted">
        <img
          src={image.preview}
          alt={image.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Status overlay */}
        {image.status !== 'pending' && (
          <div className={`absolute top-2 left-2 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${statusClass[image.status]}`}>
            {statusIcon[image.status]}
            <span className="capitalize">{image.status}</span>
          </div>
        )}

        {/* Actions overlay */}
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {image.status === 'done' && (
            <Button
              size="icon"
              variant="secondary"
              className="w-7 h-7 rounded-full"
              onClick={handleDownload}
            >
              <Download className="w-3.5 h-3.5" />
            </Button>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="w-7 h-7 rounded-full"
            onClick={() => onRemove(image.id)}
          >
            <X className="w-3.5 h-3.5" />
          </Button>
        </div>

        {/* Processing overlay */}
        {image.status === 'processing' && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
      </div>

      {/* Image info */}
      <div className="p-3 border-t border-border">
        <p className="text-sm font-medium truncate" title={image.name}>
          {image.name}
        </p>
        <p className="text-xs text-muted-foreground">
          {image.originalWidth} × {image.originalHeight}
        </p>
        {image.error && (
          <p className="text-xs text-destructive mt-1">{image.error}</p>
        )}
      </div>
    </div>
  );
}
