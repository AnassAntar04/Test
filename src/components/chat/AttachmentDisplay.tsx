import { Button } from "@/components/ui/button";
import { File, Image, Video, FileText, Download, ExternalLink } from "lucide-react";

interface AttachmentDisplayProps {
  fileName: string;
  fileType: string;
  fileSize: number;
  storageUrl: string;
  className?: string;
}

export const AttachmentDisplay = ({ 
  fileName, 
  fileType, 
  fileSize, 
  storageUrl, 
  className = "" 
}: AttachmentDisplayProps) => {
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    if (fileType.startsWith('video/')) return Video;
    if (fileType.includes('pdf') || fileType.includes('document')) return FileText;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const isImage = fileType.startsWith('image/');
  const isVideo = fileType.startsWith('video/');

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = storageUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openInNewTab = () => {
    window.open(storageUrl, '_blank');
  };

  return (
    <div className={`border rounded-lg p-3 max-w-xs ${className}`}>
      {isImage ? (
        <div className="space-y-2">
          <img
            src={storageUrl}
            alt={fileName}
            className="w-full h-32 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
            onClick={openInNewTab}
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <Image className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="p-1 h-8 w-8 flex-shrink-0"
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : isVideo ? (
        <div className="space-y-2">
          <video
            controls
            className="w-full h-32 rounded cursor-pointer"
            preload="metadata"
          >
            <source src={storageUrl} type={fileType} />
            Votre navigateur ne supporte pas la lecture de vidéos.
          </video>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 min-w-0">
              <Video className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="p-1 h-8 w-8 flex-shrink-0"
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            {(() => {
              const IconComponent = getFileIcon(fileType);
              return <IconComponent className="h-4 w-4 text-muted-foreground flex-shrink-0" />;
            })()}
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <p className="text-xs text-muted-foreground">{formatFileSize(fileSize)}</p>
            </div>
          </div>
          <div className="flex space-x-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={openInNewTab}
              className="p-1 h-8 w-8"
              title="Ouvrir"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              className="p-1 h-8 w-8"
              title="Télécharger"
            >
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};