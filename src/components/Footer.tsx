import { QrCode, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-8" style={{ background: 'hsl(240 15% 5%)' }}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, hsl(270,80%,60%), hsl(195,90%,55%))' }}>
              <QrCode className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold gradient-text">QR Studio</span>
          </div>

          {/* Center */}
          <p className="text-xs text-muted-foreground text-center">
            © 2025 QR Studio · Built with 💜 · Free forever
          </p>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-white transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}