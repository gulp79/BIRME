import { Shield, Moon, Sun, Github } from 'lucide-react';
import { useDarkMode } from '@/hooks/useDarkMode';
import { Button } from '@/components/ui/button';

export function Header() {
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <header className="sticky top-0 z-50 glass-card border-b">
      <div className="container flex items-center justify-between h-16 px-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <span className="text-2xl font-bold gradient-text">B</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              BIRME <span className="text-primary">Personal Edition</span>
            </h1>
            <p className="text-xs text-muted-foreground hidden sm:block">
              Bulk Image Resizing Made Easy
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="privacy-badge hidden sm:flex">
            <Shield className="w-3.5 h-3.5" />
            <span>100% Local Processing</span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-xl"
          >
            {isDark ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-xl"
            asChild
          >
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-5 h-5" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
