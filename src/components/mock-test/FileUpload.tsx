import { useState, useRef } from "react";
import { Upload, X, RefreshCw, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  icon: React.ReactNode;
  accept: string;
  maxSize?: number;
  disabled?: boolean;
  file: File | null;
  onFileSelect: (file: File | null) => void;
  preview?: string | null;
}

const FileUpload = ({
  label,
  icon,
  accept,
  maxSize = 10,
  disabled = false,
  file,
  onFileSelect,
  preview,
}: FileUploadProps) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (selectedFile: File): boolean => {
    const sizeMB = selectedFile.size / (1024 * 1024);
    if (sizeMB > maxSize) {
      setError(`File size exceeds ${maxSize}MB limit`);
      return false;
    }

    const validTypes = accept.split(",").map((t) => t.trim());
    const fileExt = `.${selectedFile.name.split(".").pop()?.toLowerCase()}`;
    const mimeType = selectedFile.type;

    const isValid = validTypes.some(
      (type) =>
        type === fileExt ||
        type === mimeType ||
        (type.endsWith("/*") && mimeType.startsWith(type.replace("/*", "/")))
    );

    if (!isValid) {
      setError("Please upload JPG, PNG, or PDF only");
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      onFileSelect(selectedFile);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      onFileSelect(droppedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  if (file && preview) {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <div className="border-2 border-secondary/30 rounded-xl p-4 bg-secondary/5">
          <div className="relative aspect-video w-full max-h-48 overflow-hidden rounded-lg bg-muted mb-3">
            {file.type === "application/pdf" ? (
              <div className="flex items-center justify-center h-full gap-2">
                <FileText className="w-12 h-12 text-primary" />
                <span className="text-muted-foreground">PDF Document</span>
              </div>
            ) : (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm">
              {file.type.startsWith("image/") ? (
                <Image className="w-4 h-4 text-muted-foreground" />
              ) : (
                <FileText className="w-4 h-4 text-muted-foreground" />
              )}
              <span className="text-foreground font-medium truncate max-w-[150px]">
                {file.name}
              </span>
              <span className="text-muted-foreground">
                ({formatFileSize(file.size)})
              </span>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onFileSelect(null)}
                className="text-destructive hover:text-destructive"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Replace
              </Button>
            </div>
          </div>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div
        className={cn(
          "border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/50",
          disabled && "opacity-50 cursor-not-allowed pointer-events-none"
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !disabled && inputRef.current?.click()}
      >
        <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-foreground font-medium mb-1">{label}</p>
        <p className="text-sm text-muted-foreground mb-2">
          Drag & drop or click to browse
        </p>
        <p className="text-xs text-muted-foreground">
          Accepts: JPG, PNG, PDF (max {maxSize}MB)
        </p>
      </div>
      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
      <p className="text-xs text-muted-foreground flex items-center gap-1">
        💡 Tips: Clear photo, good lighting, all questions visible
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
