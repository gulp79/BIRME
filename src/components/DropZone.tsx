import { useCallback } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DropZoneProps {
  onFilesAdded: (files: File[]) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
}

export function DropZone({ onFilesAdded, isDragging, setIsDragging }: DropZoneProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, [setIsDragging]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, [setIsDragging]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      onFilesAdded(files);
    }
  }, [onFilesAdded, setIsDragging]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(file =>
      file.type.startsWith('image/')
    );
    if (files.length > 0) {
      onFilesAdded(files);
    }
    e.target.value = '';
  }, [onFilesAdded]);

  return (
    <div
      className={`dropzone-area rounded-2xl p-8 sm:p-12 text-center transition-all ${
        isDragging ? 'active scale-[1.02]' : ''
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center gap-4">
        <div className={`p-4 rounded-2xl transition-all ${
          isDragging ? 'bg-primary/20 scale-110' : 'bg-muted'
        }`}>
          {isDragging ? (
            <Upload className="w-10 h-10 text-primary animate-pulse-soft" />
          ) : (
            <ImageIcon className="w-10 h-10 text-muted-foreground" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">
            {isDragging ? 'Drop images here' : 'Drag & drop images here'}
          </h3>
          <p className="text-sm text-muted-foreground">
            Supports JPG, PNG, WEBP, GIF, BMP, and more
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="h-px w-12 bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="h-px w-12 bg-border" />
        </div>

        <label>
          <Button className="btn-primary-gradient cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Load Images
          </Button>
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileInput}
          />
        </label>
      </div>
    </div>
  );
}
