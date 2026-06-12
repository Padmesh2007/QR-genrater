import { useState } from "react";
import { Search, QrCode, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QRScanner } from "./QRScanner";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface VerificationResult {
  isValid: boolean;
  message: string;
  documentId: string;
  timestamp: Date;
}

export function DocumentVerification() {
  const { t } = useLanguage();
  const [uniqueId, setUniqueId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleVerify = async (id: string) => {
    if (!id.trim()) return;

    setIsVerifying(true);
    setVerificationResult(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const isValid = id.toUpperCase().startsWith("VALID");
    
    setVerificationResult({
      isValid,
      message: isValid ? t('documentVerified') : t('documentFake'),
      documentId: id,
      timestamp: new Date()
    });
    
    setIsVerifying(false);
  };

  const handleScanResult = (scannedId: string) => {
    setUniqueId(scannedId);
    setIsScanning(false);
    handleVerify(scannedId);
  };

  return (
    <section id="verify" className="py-16 bg-muted/30">
      <div className="container px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">{t('verifyDocument')}</h2>
            <p className="text-lg text-muted-foreground">
              Enter the unique ID or scan the QR/Barcode to verify authenticity
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Manual ID Entry */}
            <Card className="verification-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Search className="h-5 w-5" />
                  <span>{t('enterUniqueId')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    placeholder={t('uniqueIdPlaceholder')}
                    value={uniqueId}
                    onChange={(e) => setUniqueId(e.target.value)}
                    className="text-center font-mono"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    Try "VALID123" for authentic or "FAKE456" for fake demo
                  </p>
                </div>
                <Button
                  onClick={() => handleVerify(uniqueId)}
                  disabled={!uniqueId.trim() || isVerifying}
                  className="w-full"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      {t('verify')}
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* QR/Barcode Scanner */}
            <Card className="verification-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <QrCode className="h-5 w-5" />
                  <span>{t('scanQrCode')}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isScanning ? (
                  <div className="text-center space-y-4">
                    <div className="w-32 h-32 mx-auto bg-muted rounded-lg flex items-center justify-center">
                      <QrCode className="h-16 w-16 text-muted-foreground" />
                    </div>
                    <Button
                      onClick={() => setIsScanning(true)}
                      variant="outline"
                      className="w-full"
                    >
                      <QrCode className="mr-2 h-4 w-4" />
                      {t('startScanning')}
                    </Button>
                  </div>
                ) : (
                  <QRScanner
                    onScanResult={handleScanResult}
                    onCancel={() => setIsScanning(false)}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Verification Result */}
          {verificationResult && (
            <Card className={cn(
              "mt-8 fade-in-up",
              verificationResult.isValid ? "verification-success" : "verification-danger"
            )}>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  {verificationResult.isValid ? (
                    <CheckCircle className="h-12 w-12 text-success flex-shrink-0" />
                  ) : (
                    <XCircle className="h-12 w-12 text-danger flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      {verificationResult.isValid ? t('verified') : t('fake')}
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      {verificationResult.message}
                    </p>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Document ID: <span className="font-mono">{verificationResult.documentId}</span></p>
                      <p>Verified at: {verificationResult.timestamp.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}