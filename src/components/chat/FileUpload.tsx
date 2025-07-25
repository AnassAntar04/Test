import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Paperclip, X, File, Image, Video, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUploaded: (attachment: {
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    storageUrl: string;
  }) => void;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp',
  'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-msvideo',
  'application/pdf', 'text/plain', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export const FileUpload = ({ onFileUploaded }: FileUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validation de la taille
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Fichier trop volumineux",
        description: "La taille maximale autorisée est de 10MB.",
        variant: "destructive",
      });
      return;
    }

    // Validation du type
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast({
        title: "Type de fichier non autorisé",
        description: "Seules les images, vidéos et documents sont autorisés.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const uploadFile = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur d'authentification",
          description: "Vous devez être connecté pour télécharger des fichiers.",
          variant: "destructive",
        });
        return;
      }

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('chat-files')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('chat-files')
        .getPublicUrl(fileName);

      // Enregistrer les métadonnées dans la base de données
      const { data: attachmentData, error: dbError } = await supabase
        .from('chat_attachments')
        .insert({
          file_name: selectedFile.name,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          storage_path: fileName,
          uploaded_by: user.id,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      onFileUploaded({
        id: attachmentData.id,
        fileName: selectedFile.name,
        fileType: selectedFile.type,
        fileSize: selectedFile.size,
        storageUrl: publicUrl,
      });

      toast({
        title: "Fichier téléchargé",
        description: `${selectedFile.name} a été téléchargé avec succès.`,
      });

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast({
        title: "Erreur de téléchargement",
        description: "Une erreur est survenue lors du téléchargement du fichier.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        className="hidden"
      />
      
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="p-2"
        title="Ajouter un fichier"
      >
        <Paperclip className="h-4 w-4" />
      </Button>

      {selectedFile && (
        <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
          {(() => {
            const IconComponent = getFileIcon(selectedFile.type);
            return <IconComponent className="h-4 w-4 text-muted-foreground" />;
          })()}
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate max-w-32">
              {selectedFile.name}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </span>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeSelectedFile}
            className="p-1 h-6 w-6"
          >
            <X className="h-3 w-3" />
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={uploadFile}
            disabled={uploading}
            className="text-xs"
          >
            {uploading ? 'Upload...' : 'Envoyer'}
          </Button>
        </div>
      )}
    </div>
  );
};