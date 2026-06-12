import { useEffect, useRef, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { X, Camera } from "lucide-react";

interface QRScannerProps {
  onScanResult: (result: string) => void;
  onCancel: () => void;
}

export function QRScanner({ onScanResult, onCancel }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const elementRef = useRef<HTMLDivElement>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (!elementRef.current) return;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
      showTorchButtonIfSupported: true,
      showZoomSliderIfSupported: true,
      defaultZoomValueIfSupported: 1,
    };

    const scanner = new Html5QrcodeScanner("qr-scanner", config, false);
    scannerRef.current = scanner;

    const onScanSuccess = (decodedText: string) => {
      scanner.clear();
      onScanResult(decodedText);
    };

    const onScanFailure = (error: string) => {
      // Handle scan failure silently
      console.warn("QR Scan failed:", error);
    };

    scanner.render(onScanSuccess, onScanFailure);
    setIsScanning(true);

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(console.error);
      }
    };
  }, [onScanResult]);

  const handleCancel = () => {
    if (scannerRef.current) {
      scannerRef.current.clear().catch(console.error);
    }
    onCancel();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center space-x-2">
          <Camera className="h-4 w-4" />
          <span>Scanning for QR/Barcode</span>
        </h3>
        <Button variant="outline" size="sm" onClick={handleCancel}>
          <X className="h-4 w-4 mr-1" />
          Cancel
        </Button>
      </div>
      
      <div 
        id="qr-scanner" 
        ref={elementRef}
        className="w-full rounded-lg overflow-hidden"
      />
      
      {!isScanning && (
        <div className="text-center text-sm text-muted-foreground">
          <p>Position the QR code or barcode within the camera frame</p>
          <p>Make sure there's good lighting and the code is clearly visible</p>
        </div>
      )}
    </div>
  );
}