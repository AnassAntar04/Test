# 🗄️ Configuration Base de Données et IA

## Architecture Supabase

### 📊 Tables Principales

#### Conversations et Communication
```sql
-- Table conversations avec statuts et métadonnées
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id UUID REFERENCES guest(guest_id),
  reservation_id UUID REFERENCES reservation(res_id),
  assigned_agent_id UUID,
  assigned_chatbot_id UUID,
  state TEXT NOT NULL DEFAULT 'NOUVELLE',
  journey_phase TEXT NOT NULL DEFAULT 'PRE_RESERVATION',
  channel_type TEXT NOT NULL,
  priority TEXT DEFAULT 'medium',
  subject TEXT,
  tags TEXT[] DEFAULT '{}',
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table des messages de conversation
CREATE TABLE conversation_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id),
  sender_id UUID,
  sender_type TEXT NOT NULL,
  sender_name TEXT,
  message_content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text',
  attachment_ids UUID[],
  is_internal BOOLEAN DEFAULT false,
  is_automated BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Système d'Intégrations et Webhooks
```sql
-- Configuration des webhooks vers n8n
CREATE TABLE webhook_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  endpoint_url TEXT NOT NULL,
  secret_token TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  retry_count INTEGER NOT NULL DEFAULT 3,
  timeout_seconds INTEGER NOT NULL DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Logs des webhooks
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  webhook_config_id UUID REFERENCES webhook_configs(id),
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  response_status INTEGER,
  response_body TEXT,
  error_message TEXT,
  attempt_number INTEGER NOT NULL DEFAULT 1,
  processing_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Métriques des workflows n8n
CREATE TABLE workflow_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_name TEXT NOT NULL,
  execution_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_ms INTEGER,
  input_data JSONB DEFAULT '{}',
  output_data JSONB DEFAULT '{}',
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

#### Gestion des Utilisateurs et Permissions
```sql
-- Profils utilisateurs avec zones géographiques
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  profile_type user_profile NOT NULL DEFAULT 'agent',
  geographical_zones geographical_zone[] DEFAULT ARRAY['casablanca_centre'],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Système de rôles dynamique
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  role app_role NOT NULL,
  assigned_by UUID,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);
```

#### Propriétés et Réservations (Maroc)
```sql
-- Propriétés au Maroc avec localisation
CREATE TABLE property (
  property_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  status TEXT NOT NULL DEFAULT 'active',
  amenities JSONB NOT NULL DEFAULT '{}',
  ext_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Invités internationaux
CREATE TABLE guest (
  guest_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  country TEXT,
  ext_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);
```

## Configuration des Triggers et Fonctions

### Triggers de Notification Webhooks
```sql
-- Fonction générique de notification webhook
CREATE OR REPLACE FUNCTION public.trigger_webhook_notification(
  webhook_name text,
  event_type text,
  payload jsonb
) RETURNS void AS $$
DECLARE
  webhook_url text;
BEGIN
  -- Appel de l'Edge Function webhook-dispatcher
  webhook_url := 'https://jwulacyvagxztjopbflh.supabase.co/functions/v1/webhook-dispatcher';
  
  PERFORM net.http_post(
    url := webhook_url,
    headers := '{"Content-Type": "application/json"}'::jsonb,
    body := jsonb_build_object(
      'webhook_name', webhook_name,
      'event_type', event_type,
      'payload', payload
    )
  );
  
  -- Log local de l'événement
  INSERT INTO public.webhook_logs (
    webhook_config_id, event_type, payload, attempt_number
  ) 
  SELECT wc.id, event_type, payload, 1
  FROM public.webhook_configs wc
  WHERE wc.name = webhook_name AND wc.is_active = true;
  
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Failed to trigger webhook: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger sur nouveaux messages
CREATE OR REPLACE FUNCTION notify_conversation_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM public.trigger_webhook_notification(
    'conversation-update',
    'message_created',
    jsonb_build_object(
      'message_id', NEW.id,
      'conversation_id', NEW.conversation_id,
      'sender_type', NEW.sender_type,
      'message_content', NEW.message_content,
      'created_at', NEW.created_at
    )
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER conversation_message_webhook
  AFTER INSERT ON conversation_messages
  FOR EACH ROW EXECUTE FUNCTION notify_conversation_update();
```

### Fonctions de Sécurité
```sql
-- Vérification des rôles utilisateur
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now())
  )
$$;

-- Attribution de rôles
CREATE OR REPLACE FUNCTION public.assign_user_role(
  _user_id uuid, 
  _role app_role, 
  _assigned_by uuid, 
  _expires_at timestamp with time zone DEFAULT NULL
) RETURNS void AS $$
BEGIN
  -- Désactiver les rôles existants
  UPDATE public.user_roles
  SET is_active = false
  WHERE user_id = _user_id AND is_active = true;
  
  -- Insérer ou réactiver le nouveau rôle
  INSERT INTO public.user_roles (user_id, role, assigned_by, expires_at, is_active)
  VALUES (_user_id, _role, _assigned_by, _expires_at, true)
  ON CONFLICT (user_id, role) 
  DO UPDATE SET 
    is_active = true,
    assigned_by = _assigned_by,
    assigned_at = now(),
    expires_at = _expires_at;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## Configuration OpenAI et IA

### Modèles Recommandés
```typescript
// Configuration OpenAI pour Edge Functions
const openaiConfig = {
  apiKey: Deno.env.get('OPENAI_API_KEY'),
  model: "gpt-4o-mini", // Modèle rapide et efficace
  embeddingModel: "text-embedding-3-small", // Embeddings optimisés
  maxTokens: 2000,
  temperature: 0.7,
  timeout: 30000
};
```

### Table Embeddings (si nécessaire)
```sql
-- Extension Vector pour recherche sémantique
CREATE EXTENSION IF NOT EXISTS vector;

-- Table pour embeddings documents
CREATE TABLE document_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_type TEXT NOT NULL,
  document_id TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  embedding VECTOR(1536),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche vectorielle
CREATE INDEX ON document_embeddings 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);
```

## Row Level Security (RLS)

### Politiques Principales
```sql
-- Conversations - Accès agents et superviseurs
CREATE POLICY "Agents can view conversations" 
ON conversations FOR SELECT
USING (
  has_role(auth.uid(), 'agent') OR 
  has_role(auth.uid(), 'superviseur') OR 
  has_role(auth.uid(), 'administrateur')
);

-- Webhooks - Admin seulement
CREATE POLICY "Only admins can manage webhook configs" 
ON webhook_configs FOR ALL
USING (
  has_role(auth.uid(), 'administrateur') OR 
  has_role(auth.uid(), 'super_admin')
);

-- Métriques - Superviseurs et plus
CREATE POLICY "Supervisors can view metrics" 
ON workflow_metrics FOR SELECT
USING (
  has_role(auth.uid(), 'superviseur') OR 
  has_role(auth.uid(), 'administrateur') OR 
  has_role(auth.uid(), 'super_admin')
);
```

## Monitoring et Performance

### Index Recommandés
```sql
-- Index pour conversations
CREATE INDEX idx_conversations_assigned_agent ON conversations(assigned_agent_id);
CREATE INDEX idx_conversations_state ON conversations(state);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);

-- Index pour métriques
CREATE INDEX idx_workflow_metrics_workflow_name ON workflow_metrics(workflow_name);
CREATE INDEX idx_workflow_metrics_status ON workflow_metrics(status);
CREATE INDEX idx_workflow_metrics_created_at ON workflow_metrics(created_at);

-- Index pour webhooks
CREATE INDEX idx_webhook_logs_webhook_config_id ON webhook_logs(webhook_config_id);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at);
```

### Nettoyage Automatique
```sql
-- Fonction de nettoyage des logs
CREATE OR REPLACE FUNCTION cleanup_old_logs()
RETURNS void AS $$
BEGIN
  -- Supprimer les logs de webhooks > 30 jours
  DELETE FROM webhook_logs 
  WHERE created_at < now() - interval '30 days';
  
  -- Supprimer les métriques > 90 jours
  DELETE FROM workflow_metrics 
  WHERE created_at < now() - interval '90 days';
  
  RAISE NOTICE 'Cleanup completed at %', now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

*Configuration mise à jour pour l'architecture Lovable → Supabase → n8n*