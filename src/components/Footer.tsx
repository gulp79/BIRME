import { Shield, Heart, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="container px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-emerald-500" />
            <span>All processing occurs locally in your browser</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              Made with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> for privacy
            </span>
            <a
              href="https://github.com/gulp79/BIRME"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
