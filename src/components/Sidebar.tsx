import {
  Settings,
  Download,
  Trash2,
  Link,
  Unlink,
  Crop,
  RotateCcw,
} from 'lucide-react';
import { ProcessingSettings } from '@/types/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SidebarProps {
  settings: ProcessingSettings;
  updateSetting: <K extends keyof ProcessingSettings>(
    key: K,
    value: ProcessingSettings[K]
  ) => void;
  resetSettings: () => void;
  onProcessAll: () => void;
  onDownloadAll: () => void;
  onClearWorkspace: () => void;
  imageCount: number;
  processedCount: number;
  isProcessing: boolean;
}

export function Sidebar({
  settings,
  updateSetting,
  resetSettings,
  onProcessAll,
  onDownloadAll,
  onClearWorkspace,
  imageCount,
  processedCount,
  isProcessing,
}: SidebarProps) {
  const handleWidthChange = (value: string) => {
    const num = parseInt(value) || 0;
    updateSetting('width', num);
    if (settings.maintainAspectRatio && !settings.enableCrop) {
      // Don't auto-update height when aspect ratio is locked
    }
  };

  const handleHeightChange = (value: string) => {
    const num = parseInt(value) || 0;
    updateSetting('height', num);
  };

  return (
    <aside className="w-full lg:w-80 shrink-0">
      <div className="glass-card rounded-2xl p-6 space-y-6 sticky top-24">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-primary" />
            <h2 className="font-semibold">Settings</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={resetSettings}
            className="text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </Button>
        </div>

        {/* Dimensions */}
        <div className="control-group">
          <Label className="text-sm font-medium">Dimensions (px)</Label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Width</Label>
              <Input
                type="number"
                value={settings.width}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="mt-1"
                min={1}
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="mt-5"
              onClick={() => updateSetting('maintainAspectRatio', !settings.maintainAspectRatio)}
            >
              {settings.maintainAspectRatio ? (
                <Link className="w-4 h-4 text-primary" />
              ) : (
                <Unlink className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
            <div className="flex-1">
              <Label className="text-xs text-muted-foreground">Height</Label>
              <Input
                type="number"
                value={settings.height}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="mt-1"
                min={1}
              />
            </div>
          </div>
        </div>

        {/* Crop */}
        <div className="control-group">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crop className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Smart Crop</Label>
            </div>
            <Switch
              checked={settings.enableCrop}
              onCheckedChange={(checked) => updateSetting('enableCrop', checked)}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            {settings.enableCrop
              ? 'Images will be cropped to fit exact dimensions'
              : 'Images will be scaled to fit within dimensions'}
          </p>
        </div>

        {/* Output Format */}
        <div className="control-group">
          <Label className="text-sm font-medium">Output Format</Label>
          <Select
            value={settings.outputFormat}
            onValueChange={(value: 'jpeg' | 'png' | 'webp') =>
              updateSetting('outputFormat', value)
            }
          >
            <SelectTrigger className="mt-2">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="jpeg">JPEG (.jpg)</SelectItem>
              <SelectItem value="png">PNG (.png)</SelectItem>
              <SelectItem value="webp">WebP (.webp)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quality */}
        {settings.outputFormat !== 'png' && (
          <div className="control-group">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Quality</Label>
              <span className="text-sm font-mono text-primary">
                {settings.quality}%
              </span>
            </div>
            <Slider
              value={[settings.quality]}
              onValueChange={([value]) => updateSetting('quality', value)}
              min={10}
              max={100}
              step={5}
              className="mt-2"
            />
          </div>
        )}

        {/* Filename Pattern */}
        <div className="control-group">
          <Label className="text-sm font-medium">Filename Pattern</Label>
          <Input
            value={settings.filenamePattern}
            onChange={(e) => updateSetting('filenamePattern', e.target.value)}
            placeholder="image-{index}"
            className="mt-2 font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Use {'{index}'}, {'{name}'}, or {'{i}'} as placeholders
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Button
            className="w-full btn-primary-gradient"
            onClick={onProcessAll}
            disabled={imageCount === 0 || isProcessing}
          >
            {isProcessing ? (
              <>Processing...</>
            ) : (
              <>Process {imageCount} Images</>
            )}
          </Button>

          <Button
            variant="secondary"
            className="w-full"
            onClick={onDownloadAll}
            disabled={processedCount === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Download All ({processedCount})
          </Button>

          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive"
            onClick={onClearWorkspace}
            disabled={imageCount === 0}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear Workspace
          </Button>
        </div>
      </div>
    </aside>
  );
}
