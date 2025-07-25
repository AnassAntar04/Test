-- Créer un bucket pour les fichiers de chat
INSERT INTO storage.buckets (id, name, public) 
VALUES ('chat-files', 'chat-files', true);

-- Créer les politiques pour le bucket chat-files
CREATE POLICY "Chat files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'chat-files');

CREATE POLICY "Users can upload their own chat files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'chat-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own chat files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'chat-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own chat files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'chat-files' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Ajouter une table pour gérer les métadonnées des fichiers de chat
CREATE TABLE public.chat_attachments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message_id UUID,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    storage_path TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Activer RLS
ALTER TABLE public.chat_attachments ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour chat_attachments
CREATE POLICY "Users can view attachments for their conversations" 
ON public.chat_attachments 
FOR SELECT 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can upload their own attachments" 
ON public.chat_attachments 
FOR INSERT 
WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own attachments" 
ON public.chat_attachments 
FOR UPDATE 
USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own attachments" 
ON public.chat_attachments 
FOR DELETE 
USING (auth.uid() = uploaded_by);

-- Trigger pour updated_at
CREATE TRIGGER update_chat_attachments_updated_at
    BEFORE UPDATE ON public.chat_attachments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();