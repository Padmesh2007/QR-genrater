import { useState, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Upload, FileText, Type, QrCode, FolderArchive, FileArchive, Loader2, Image as ImageIcon, FileType, ScanText, Palette, ArrowRight, Check } from 'lucide-react';
import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import Tesseract from 'tesseract.js';



// ── Color presets ────────────────────────────────────────────────────────────
const QR_COLORS = [
  { fg: '#ffffff', bg: '#000000', label: 'Classic' },
  { fg: '#a855f7', bg: '#0d0d1a', label: 'Purple' },
  { fg: '#06b6d4', bg: '#020b14', label: 'Cyan'   },
  { fg: '#f43f8e', bg: '#110009', label: 'Pink'   },
  { fg: '#22d3a0', bg: '#010f09', label: 'Matrix' },
  { fg: '#facc15', bg: '#0f0a00', label: 'Gold'   },
  { fg: '#ff6b35', bg: '#110500', label: 'Fire'   },
  { fg: '#e2e8f0', bg: '#1e293b', label: 'Slate'  },
];

const GenerateMode = { EMBED: 'embed', UPLOAD: 'upload' } as const;
type GenerateModeType = typeof GenerateMode[keyof typeof GenerateMode];

// ── 3D Rotating Cube (pure CSS, no external lib) ─────────────────────────────
function QRCube() {
  return (
    <div className="cube-scene mx-auto">
      <div className="cube">
        {['front','back','right','left','top','bottom'].map(face => (
          <div key={face} className={`cube-face cube-face--${face}`}>
            <QrCode className="w-10 h-10" style={{ color: 'hsl(270,80%,70%)', opacity: 0.6 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Particle dots floating in bg ─────────────────────────────────────────────
function FloatingDots() {
  const dots = Array.from({ length: 18 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${4 + Math.random() * 6}px`,
      height: `${4 + Math.random() * 6}px`,
      animationDelay: `${Math.random() * 6}s`,
      animationDuration: `${5 + Math.random() * 5}s`,
      opacity: 0.15 + Math.random() * 0.25,
      background: ['hsl(270,80%,60%)','hsl(195,90%,55%)','hsl(330,90%,60%)'][i % 3],
    } as React.CSSProperties,
  }));
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {dots.map(d => (
        <div key={d.id} className="absolute rounded-full float-animation" style={d.style} />
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
const QRGenerator = () => {
  const [qrValue, setQrValue] = useState('');
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  const [generateMode, setGenerateMode] = useState<GenerateModeType>(GenerateMode.EMBED);

  const [files, setFiles] = useState<File[]>([]);
  const [isZipping, setIsZipping] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedColor, setSelectedColor] = useState(QR_COLORS[0]);
  const [customFg, setCustomFg] = useState('#ffffff');
  const [customBg, setCustomBg] = useState('#000000');
  const [useCustomColor, setUseCustomColor] = useState(false);

  const qrRef = useRef<SVGSVGElement>(null);

  const fgColor = useCustomColor ? customFg : selectedColor.fg;
  const bgColor = useCustomColor ? customBg : selectedColor.bg;

  // ── Text handler ────────────────────────────────────────────────────────────
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQrValue(e.target.value);
  };

  // ── Dropzone ────────────────────────────────────────────────────────────────
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    const totalSize = acceptedFiles.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 2500 || acceptedFiles.length > 1) {
      setGenerateMode(GenerateMode.UPLOAD);
    } else {
      setGenerateMode(GenerateMode.EMBED);
    }
    setQrValue('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  // ── OCR extract ─────────────────────────────────────────────────────────────
  const handleExtractText = async () => {
    if (files.length !== 1 || !files[0].type.startsWith('image/')) return;
    setIsExtracting(true);
    toast.info('Scanning image for text…', { duration: 2000 });
    try {
      const result = await Tesseract.recognize(files[0], 'eng', {
        logger: m => { if (m.status === 'recognizing text') { /* progress optional */ } }
      });
      const text = result.data.text;
      if (!text || text.trim().length === 0) {
        toast.warning('No text found in the image.');
      } else {
        setQrValue(text.trim());
        setActiveTab('text');
        setGenerateMode(GenerateMode.EMBED);
        toast.success('Text extracted! QR ready.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to extract text from image.');
    } finally {
      setIsExtracting(false);
    }
  };

  // ── File processing ─────────────────────────────────────────────────────────
  const processFiles = async () => {
    if (files.length === 0) return;

    const file = files[0];
    const isBinary = files.some(f =>
      f.type.startsWith('image/') || f.name.endsWith('.zip') || f.type === 'application/pdf'
    );
    const totalSize = files.reduce((a, b) => a + b.size, 0);
    const effectiveMode = (isBinary || totalSize > 2500 || files.length > 1)
      ? GenerateMode.UPLOAD
      : generateMode;

    if (effectiveMode === GenerateMode.EMBED) {
      // ── Small text file: embed content directly ──────────────────────────
      if (file.size > 2500) {
        toast.error('File too large to embed (max ~2.5 KB). Use Upload & Link mode.');
        return;
      }
      const reader = new FileReader();
      reader.onload = ev => {
        const content = ev.target?.result as string;
        setQrValue(content);
        toast.success('QR Code generated from file content!');
      };
      reader.onerror = () => toast.error('Failed to read file.');
      if (
        file.type.startsWith('text/') ||
        file.name.endsWith('.txt') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.csv')
      ) {
        reader.readAsText(file);
      } else {
        reader.readAsDataURL(file);
      }
    } else {
      // ── Large file / multi-file: ZIP then generate a demo link ───────────
      try {
        let fileToProcess = file;

        if (files.length > 1) {
          setIsZipping(true);
          const zip = new JSZip();
          files.forEach(f => zip.file(f.webkitRelativePath || f.name, f));
          const blob = await zip.generateAsync({ type: 'blob' });
          fileToProcess = new File([blob], 'archive.zip', { type: 'application/zip' });
          setIsZipping(false);
          toast.success('Files zipped!');
        }

        // Simulate progress bar for UX feedback
        setIsUploading(true);
        setUploadProgress(0);
        const interval = setInterval(() => {
          setUploadProgress(prev => {
            if (prev >= 95) { clearInterval(interval); return 95; }
            return prev + 10;
          });
        }, 150);

        await new Promise(resolve => setTimeout(resolve, 1500));
        clearInterval(interval);
        setUploadProgress(100);

        // Generate demo link — in production replace with real upload API
        const demoId = Math.random().toString(36).substring(2, 9);
        const demoUrl = `https://qrstudio.app/files/${fileToProcess.name.replace(/\s/g, '-')}-${demoId}`;
        setQrValue(demoUrl);
        setIsUploading(false);
        toast.success('QR generated with download link!');
        toast.info('Demo mode: connect a backend for real file hosting.', { duration: 5000 });
      } catch (err) {
        console.error(err);
        setIsZipping(false);
        setIsUploading(false);
        toast.error('Error processing files.');
      }
    }
  };

  // ── Download QR ─────────────────────────────────────────────────────────────
  const downloadQR = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, size, size);
        ctx.drawImage(img, 0, 0, size, size);
        const link = document.createElement('a');
        link.download = `qrstudio-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        toast.success('QR Code downloaded at 512×512!');
      }
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="relative min-h-screen w-full overflow-x-hidden">
      <FloatingDots />

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative pt-16 pb-10 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* 3D Cube */}
          <div className="mb-6 fade-in-up">
            <QRCube />
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tight gradient-text fade-in-up mb-3">
            QR Studio
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto fade-in-up animation-delay-100">
            Generate stunning QR codes with neon colors, OCR scanning, and file support.
          </p>
        </div>
      </section>

      {/* ── Main Grid ────────────────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 pb-16 grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

        {/* ── Left Panel: Input ─────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Tab Switcher */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex rounded-xl overflow-hidden border border-white/10">
              {[
                { id: 'text', label: 'Text / URL', icon: <Type className="w-4 h-4" /> },
                { id: 'file', label: 'File / Folder', icon: <FolderArchive className="w-4 h-4" /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id as 'text' | 'file'); setQrValue(''); }}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-purple-600/80 text-white shadow-lg'
                      : 'bg-transparent text-muted-foreground hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </div>

            {/* Text Tab */}
            {activeTab === 'text' && (
              <div className="space-y-3 fade-in-up">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Content
                </label>
                <textarea
                  className="w-full min-h-[180px] rounded-xl p-4 text-sm resize-none bg-black/30 border border-white/10 text-white placeholder:text-muted-foreground focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  placeholder="https://yourlink.com, plain text, wifi details…"
                  value={activeTab === 'text' ? qrValue : ''}
                  onChange={handleTextChange}
                />
              </div>
            )}

            {/* File Tab */}
            {activeTab === 'file' && (
              <div className="space-y-4 fade-in-up">
                {/* Dropzone */}
                <div
                  {...getRootProps()}
                  className={`upload-zone rounded-xl p-10 text-center cursor-pointer ${isDragActive ? 'active' : ''}`}
                >
                  <input {...getInputProps()} />
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{background: 'hsl(270 80% 60% / 0.15)', border: '1px solid hsl(270 80% 60% / 0.3)'}}>
                      <Upload className="w-7 h-7 text-purple-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Drag & drop files or folders</p>
                      <p className="text-xs text-muted-foreground mt-1">Photos, PDFs, ZIPs, text files…</p>
                    </div>
                  </div>
                </div>

                {/* File info */}
                {files.length > 0 && (
                  <div className="rounded-xl p-4 space-y-4 border border-white/10 bg-black/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {files.length > 1 ? <FolderArchive className="w-5 h-5 text-purple-400" /> :
                         files[0].type.startsWith('image/') ? <ImageIcon className="w-5 h-5 text-pink-400" /> :
                         files[0].type === 'application/pdf' ? <FileType className="w-5 h-5 text-red-400" /> :
                         files[0].name.endsWith('.zip') ? <FileArchive className="w-5 h-5 text-yellow-400" /> :
                         <FileText className="w-5 h-5 text-cyan-400" />}
                        <span className="font-medium text-sm text-white truncate max-w-[180px]">
                          {files.length > 1 ? `${files.length} files` : files[0].name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({(files.reduce((a, b) => a + b.size, 0) / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => { setFiles([]); setQrValue(''); }}
                        className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1 rounded"
                      >
                        Remove
                      </button>
                    </div>

                    {/* Mode Selector */}
                    <div className="space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mode</p>
                      <div className="flex gap-2">
                        {[
                          { mode: GenerateMode.EMBED, label: 'Embed', tip: 'Content stored in QR (<2.5KB)' },
                          { mode: GenerateMode.UPLOAD, label: 'Link', tip: 'QR links to hosted file' },
                        ].map(({ mode, label, tip }) => (
                          <button
                            key={mode}
                            onClick={() => setGenerateMode(mode)}
                            disabled={mode === GenerateMode.EMBED && (files.length > 1 || files.reduce((a, b) => a + b.size, 0) > 2500)}
                            title={tip}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                              generateMode === mode
                                ? 'bg-purple-600 text-white'
                                : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
                            } disabled:opacity-40 disabled:cursor-not-allowed`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <button
                        onClick={processFiles}
                        disabled={isZipping || isUploading || isExtracting}
                        className="w-full btn-neon flex items-center justify-center gap-2"
                      >
                        {isZipping ? <><Loader2 className="w-4 h-4 animate-spin" /> Zipping…</> :
                         isUploading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> :
                         <><QrCode className="w-4 h-4" /> Generate QR</>}
                      </button>

                      {files.length === 1 && files[0].type.startsWith('image/') && (
                        <button
                          onClick={handleExtractText}
                          disabled={isExtracting}
                          className="w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all bg-white/5 border border-white/10 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/30"
                        >
                          {isExtracting
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Scanning…</>
                            : <><ScanText className="w-4 h-4" /> Extract Text (OCR)</>}
                        </button>
                      )}
                    </div>

                    {/* Progress */}
                    {isUploading && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Processing…</span><span>{uploadProgress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-200"
                            style={{ width: `${uploadProgress}%`, background: 'var(--grad-primary)' }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Color Palette ─────────────────────────────────────── */}
          <div className="glass-card rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-pink-400" />
              <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Color Theme</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {QR_COLORS.map((col, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedColor(col); setUseCustomColor(false); }}
                  title={col.label}
                  className={`color-swatch ${!useCustomColor && selectedColor.fg === col.fg ? 'selected' : ''}`}
                  style={{ background: `linear-gradient(135deg, ${col.fg} 40%, ${col.bg} 100%)`, border: '2px solid rgba(255,255,255,0.15)' }}
                />
              ))}
            </div>
            <div className="flex gap-3 items-center pt-1 border-t border-white/10">
              <span className="text-xs text-muted-foreground font-semibold">Custom:</span>
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                FG
                <input type="color" value={customFg} onChange={e => { setCustomFg(e.target.value); setUseCustomColor(true); }}
                  className="w-7 h-7 rounded-lg border-none cursor-pointer bg-transparent" />
              </label>
              <label className="flex items-center gap-1 text-xs text-muted-foreground">
                BG
                <input type="color" value={customBg} onChange={e => { setCustomBg(e.target.value); setUseCustomColor(true); }}
                  className="w-7 h-7 rounded-lg border-none cursor-pointer bg-transparent" />
              </label>
              {useCustomColor && (
                <span className="text-xs text-purple-400 ml-auto font-semibold flex items-center gap-1"><Check className="w-3 h-3" /> Custom</span>
              )}
            </div>
          </div>
        </div>

        {/* ── Right Panel: QR Preview ───────────────────────────────── */}
        <div className="space-y-5 xl:sticky xl:top-24">
          <div className="glass-card rounded-2xl p-6 flex flex-col items-center">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-6 self-start">
              QR Preview
            </h2>

            {qrValue ? (
              <div className="zoom-in flex flex-col items-center gap-6 w-full">
                {/* QR Code */}
                <div className="relative">
                  <div
                    className="qr-glow overflow-hidden rounded-2xl"
                    style={{ display: 'inline-block', padding: '12px', background: bgColor }}
                  >
                    <QRCodeSVG
                      value={qrValue}
                      size={260}
                      level="M"
                      includeMargin={true}
                      fgColor={fgColor}
                      bgColor={bgColor}
                      ref={qrRef}
                    />
                  </div>
                </div>

                {/* Content preview */}
                <div className="w-full rounded-xl p-3 border border-white/10 bg-black/30">
                  <p className="text-xs text-muted-foreground font-mono break-all line-clamp-2">
                    {qrValue}
                  </p>
                </div>

                {/* Download button */}
                <button
                  onClick={downloadQR}
                  className="w-full btn-neon flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download QR Code (PNG 512×512)
                </button>

                {/* Color info badge */}
                <div className="flex gap-2 flex-wrap justify-center">
                  <span className="text-xs px-3 py-1 rounded-full border border-white/10 text-muted-foreground flex items-center gap-1.5"
                    style={{ color: fgColor }}>
                    <span className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: fgColor }} />
                    {useCustomColor ? 'Custom' : selectedColor.label}
                  </span>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center text-center py-20 space-y-4 opacity-50">
                <div className="float-animation">
                  <QrCode className="w-24 h-24 stroke-1 text-purple-400" />
                </div>
                <p className="text-muted-foreground text-sm">
                  Type something or drop a file to generate your QR code
                </p>
              </div>
            )}
          </div>

          {/* Tips card */}
          <div className="glass-card rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Palette className="w-4 h-4 text-yellow-400" /> Tips
            </h3>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" /> Use <strong className="text-white">high contrast</strong> colors for best scan results</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-cyan-400 mt-0.5 flex-shrink-0" /> Text files under 2.5KB can be <strong className="text-white">fully embedded</strong></li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-pink-400 mt-0.5 flex-shrink-0" /> Try <strong className="text-white">OCR mode</strong> to extract text from any image</li>
              <li className="flex items-start gap-2"><ArrowRight className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" /> URLs work best — keep content <strong className="text-white">short &amp; clean</strong></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRGenerator;
