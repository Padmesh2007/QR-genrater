import { QrCode } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 backdrop-blur-xl"
      style={{ background: 'hsl(240 15% 6% / 0.85)' }}>
      <div className="max-w-6xl mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, hsl(270,80%,60%), hsl(195,90%,55%))' }}>
            <QrCode className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-black gradient-text tracking-tight">QR Studio</span>
        </div>

        {/* Center badge */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs font-semibold text-muted-foreground">Free · No sign-up · No watermark</span>
        </div>

      </div>
    </header>
  );
}