# 📊 Tableau de Liaison Front Office - Back Office

## Mapping Fonctionnalités Interface ↔ Infrastructure n8n

| **Fonctionnalité Front Office** | **Modules Front Office Nécessaires** | **Réalisation Back Office (n8n + Samy)** |
|----------------------------------|---------------------------------------|-------------------------------------------|
| **Chat Interface avec Agent IA** | `ChatInterface.tsx`, `ConversationList.tsx`, `TypingIndicator.tsx`, `IntelligentAgent.tsx`, `DocumentVectorizer.tsx` | **Workflow n8n**: Réception message → Analyse NLP OpenAI → Recherche base vectorielle → Génération réponse contextuelle → Envoi via webhook |
| **Dashboard Analytics** | `AnalyticsDashboard.tsx`, `DashboardStats.tsx`, `QuickStats.tsx`, Recharts components | **Cron n8n**: Agrégation données toutes les heures → Calcul métriques → Envoi vers Supabase → Mise à jour dashboard temps réel |
| **Gestion Workflows** | `WorkflowManager.tsx`, API routes `/api/n8n/*`, Gestion d'état React | **API n8n**: CRUD workflows via REST API → Validation templates → Déploiement automatique → Monitoring exécution |
| **Escalade Automatique** | `EscalationSettings.tsx`, `AlertDialog.tsx`, Système de notifications | **Workflow n8n**: Détection mots-clés → Classification urgence → Attribution automatique → Multi-canal notifications (WhatsApp + Email) |
| **Check-in Automatisé** | `AutoMessagesSettings.tsx`, Templates de messages, Gestion calendrier | **Workflow n8n**: Trigger Beds24 → Vérification date → Génération codes d'accès → Envoi WhatsApp/Email → Log confirmation |
| **Synchronisation Beds24** | `IntegrationStatus.tsx`, `IntegrationsSettings.tsx`, Indicateurs de statut | **Cron n8n**: Polling API Beds24 (15min) → Comparaison différentielle → Mise à jour Supabase → Notification anomalies |
| **Monitoring Temps Réel** | `WorkflowManager.tsx` (onglet monitoring), `Badge.tsx`, `Chart.tsx` | **n8n Metrics API**: Collecte logs → Agrégation performance → Push via webhook → Affichage métriques temps réel |
| **Configuration Système** | `SettingsPanel.tsx`, `GeneralSettings.tsx`, Formulaires de configuration | **Variables n8n**: Stockage sécurisé tokens → Configuration environnements → Validation paramètres → Tests de connectivité |
| **Notifications Multi-canal** | `NotificationsSettings.tsx`, `Toast.tsx`, Système d'alertes | **Workflow n8n**: Réception événement → Sélection canaux → Formatage message → Envoi simultané WhatsApp/Email/SMS |
| **Base Vectorielle RAG** | `KnowledgeManager.tsx`, `DocumentVectorizer.tsx`, Upload de fichiers | **Preprocessing n8n**: Chunking documents → Génération embeddings OpenAI → Indexation Supabase Vector → Optimisation recherche |
| **Rapports Automatiques** | `AnalyticsDashboard.tsx`, Export PDF, Planification | **Cron n8n**: Génération rapport (hebdo/mensuel) → Formatage PDF → Envoi email automatique → Archivage |
| **Gestion Utilisateurs** | `UserManagement.tsx`, `RoleManagement.tsx`, Système de permissions | **Webhook n8n**: Synchronisation profils → Attribution rôles → Mise à jour permissions → Notification admin |
| **Alertes & Incidents** | `UnauthorizedAccess.tsx`, `PermissionGate.tsx`, Système d'alertes | **Workflow n8n**: Détection anomalie → Classification criticité → Escalade hiérarchique → Suivi résolution |
| **Métriques Performance** | `DashboardStats.tsx`, Graphiques temps réel, KPIs | **Pipeline n8n**: Collecte métriques → Calcul SLA → Identification tendances → Alertes seuils dépassés |
| **Templates Réponses** | `AutoMessagesSettings.tsx`, Éditeur de templates, Variables dynamiques | **Générateur n8n**: Personnalisation templates → Injection variables → Validation syntaxe → Déploiement automatique |
| **Backup & Sécurité** | Interface de monitoring, Logs système, Alertes de sécurité | **Système n8n**: Sauvegarde automatique workflows → Monitoring sécurité → Rotation tokens → Audit trail |

## Points d'Intégration Critiques

1. **APIs Bidirectionnelles** : SynergyAI ↔ n8n via REST API avec authentification token
2. **Webhooks Temps Réel** : n8n → SynergyAI pour notifications instantanées
3. **Base Vectorielle Partagée** : Supabase Vector accessible par les deux systèmes
4. **Synchronisation Données** : Cohérence temps réel entre interface et workflows
5. **Monitoring Unifié** : Métriques consolidées des deux environnements

## Flux de Données Principal

<lov-mermaid>
sequenceDiagram
    participant U as Utilisateur
    participant UI as Interface SynergyAI
    participant API as API SynergyAI
    participant N8N as n8n Server
    participant EXT as APIs Externes
    participant DB as Supabase
    
    U->>UI: Action utilisateur
    UI->>API: Requête REST
    API->>N8N: Déclenchement workflow
    N8N->>EXT: Appel API externe
    EXT->>N8N: Réponse données
    N8N->>N8N: Traitement workflow
    N8N->>API: Webhook résultat
    API->>DB: Mise à jour données
    API->>UI: Notification temps réel
    UI->>U: Interface mise à jour
</lov-mermaid>

## Architecture de Communication

<lov-mermaid>
graph TB
    subgraph "Front Office"
        CHAT[Chat Interface]
        DASH[Dashboard]
        NOTIF[Notifications]
        WS[WebSocket Client]
    end
    
    subgraph "Middleware"
        WEBHOOK[Webhook Handler]
        SSE[Server-Sent Events]
        REALTIME[Supabase Realtime]
    end
    
    subgraph "Back Office n8n"
        WF1[Check-in Workflow]
        WF2[Escalade Workflow]
        WF3[Sync Workflow]
        METRICS[Collecteur Métriques]
    end
    
    WF1 -->|Webhook| WEBHOOK
    WF2 -->|Webhook| WEBHOOK
    WF3 -->|Webhook| WEBHOOK
    METRICS -->|Metrics| WEBHOOK
    
    WEBHOOK --> SSE
    WEBHOOK --> REALTIME
    
    SSE --> WS
    REALTIME --> DASH
    REALTIME --> NOTIF
    
    WS --> CHAT
</lov-mermaid>

### 🔄 Flux Temps Réel
- **SynergyAI → n8n** : Déclenchement workflows via API REST
- **n8n → SynergyAI** : Callbacks via webhooks pour mise à jour interface
- **Bidirectionnel** : Synchronisation état et métriques

### 📊 Données Partagées
- **Base Vectorielle** : Accessible par agent IA et workflows n8n
- **Métriques** : Consolidation des données de performance
- **Configuration** : Paramètres synchronisés entre systèmes

### 🔐 Sécurité
- **Authentification Token** : Validation des appels API
- **RLS Policies** : Protection des données Supabase
- **Audit Trail** : Traçabilité des actions système