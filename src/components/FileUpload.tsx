import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { fileToBase64, getFileInfo } from "@/lib/fileUpload";

interface FileUploadProps {
  label: string;
  accept: string;
  onFileSelect: (fileData: { base64: string; mimeType: string; extension: string } | null) => void;
  validateFile: (file: File) => { valid: boolean; error?: string };
  preview?: boolean;
}

export function FileUpload({ label, accept, onFileSelect, validateFile, preview = true }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 유효성 검증
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error || "파일이 유효하지 않습니다.");
      return;
    }

    setError("");
    setSelectedFile(file);

    // 미리보기 생성 (이미지만)
    if (preview && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }

    // Base64 인코딩 및 파일 정보 추출
    try {
      const base64 = await fileToBase64(file);
      const { mimeType, extension } = getFileInfo(file);
      onFileSelect({ base64, mimeType, extension });
    } catch (err) {
      setError("파일 처리 중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl("");
    setError("");
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      
      {!selectedFile ? (
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
             onClick={() => fileInputRef.current?.click()}>
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
          <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground mb-1">클릭하여 파일 선택</p>
          <p className="text-xs text-muted-foreground">{accept.split(',').join(', ')}</p>
        </div>
      ) : (
        <div className="border border-border rounded-lg p-4">
          {preview && previewUrl && (
            <div className="mb-3">
              <img 
                src={previewUrl} 
                alt="미리보기" 
                className="max-h-40 mx-auto rounded object-contain"
              />
            </div>
          )}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-primary" />
              <span className="text-sm font-medium">{selectedFile.name}</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}

      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
