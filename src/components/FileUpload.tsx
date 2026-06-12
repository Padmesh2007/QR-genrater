import { useState, useRef } from "react";
import { Upload, File, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUpload: (file: File) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const { t } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a valid PDF, JPG, or PNG file");
      return;
    }

    setIsUploading(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setUploadedFile(file);
    setIsUploading(false);
    onFileUpload(file);
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <section id="upload" className="py-16">
      <div className="container px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">{t('uploadCertificate')}</h2>
            <p className="text-muted-foreground">
              {t('dragDrop')}
            </p>
          </div>

          <div
            className={cn(
              "upload-area",
              "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer",
              isDragOver && "dragover",
              uploadedFile && "border-success bg-verified-bg"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !uploadedFile && fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
            />

            {isUploading ? (
              <div className="space-y-4">
                <div className="animate-pulse-glow">
                  <Upload className="h-12 w-12 mx-auto text-primary" />
                </div>
                <p className="text-lg font-medium">Uploading...</p>
              </div>
            ) : uploadedFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <CheckCircle className="h-8 w-8 text-success" />
                  <div className="text-left">
                    <p className="font-medium text-success">Upload Successful</p>
                    <p className="text-sm text-muted-foreground flex items-center space-x-2">
                      <File className="h-4 w-4" />
                      <span>{uploadedFile.name}</span>
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="ml-4"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-lg font-medium mb-2">{t('dragDrop')}</p>
                  <p className="text-sm text-muted-foreground">{t('supportedFormats')}</p>
                </div>
                <Button variant="outline" className="mt-4">
                  Browse Files
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}