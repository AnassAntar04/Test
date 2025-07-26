
## Vue d'ensemble du projet

SynergyAI Connect est une plateforme de communication intelligente développée pour la conciergerie Samy, basée au Maroc. Elle intègre l'intelligence artificielle pour optimiser la gestion des conversations clients multicanaux avec une clientèle internationale diversifiée.

## Architecture Technique

### 🏗️ Stack Technologique
- **Frontend**: React + TypeScript + Vite + Tailwind CSS + shadcn-ui
- **Backend**: Supabase (PostgreSQL + Auth + Storage + Edge Functions)
- **Orchestration**: n8n (Automatisation des workflows)
- **IA**: OpenAI GPT-4 + Embeddings vectoriels
- **Monitoring**: Système de métriques et webhooks intégrés

## Configuration du Projet

### Prérequis
- Node.js 18+ et npm
- Compte Supabase configuré
- Accès aux services n8n
- Clés API OpenAI et autres intégrations

### Installation

```sh
# Cloner le repository
git clone <YOUR_GIT_URL>

# Naviguer vers le projet
cd <YOUR_PROJECT_NAME>

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

### Variables d'Environnement
Consultez la [documentation technique](./docs/technical-configuration.md) pour la configuration complète.

## Base de Données Supabase

### 📊 Tables Principales

**Conversations et Messages**
- `conversations` - Discussions client avec statuts et métadonnées
- `conversation_messages` - Messages individuels avec pièces jointes
- `conversation_metrics` - Métriques de performance et satisfaction

**Gestion Utilisateurs** 
- `profiles` - Profils utilisateurs avec zones géographiques
- `user_roles` - Système de rôles dynamique
- `permissions` - Contrôle d'accès granulaire

**Intégrations et Workflows**
- `webhook_configs` - Configuration des webhooks vers n8n
- `webhook_logs` - Logs des appels de webhooks
- `workflow_metrics` - Métriques d'exécution des workflows n8n
- `integration_configs` - Configuration des intégrations externes

**Contenu et IA**
- `document_processing_queue` - Queue de traitement des documents
- `chat_attachments` - Gestion des fichiers uploadés
- `auto_message_templates` - Messages automatisés

**Propriétés et Réservations**
- `property` - Propriétés immobilières au Maroc
- `reservation` - Réservations avec clientèle internationale
- `guest` - Profils des invités multilingues

### 🔒 Sécurité
- Row Level Security (RLS) activée sur toutes les tables
- Fonctions de sécurité avec `SECURITY DEFINER`
- Audit trail complet dans `mcp_audit_trail`
- Gestion des incidents dans `system_incidents`

## Edge Functions Supabase

### Fonctions Déployées
1. **`webhook-dispatcher`** - Dispatch des webhooks vers n8n
2. **`n8n-api-caller`** - Appels API vers les workflows n8n
3. **`document-processor`** - Traitement des documents uploadés
4. **`incident-monitor`** - Monitoring des incidents système
5. **`metrics-aggregator`** - Agrégation des métriques

### Configuration des Webhooks
Les webhooks sont configurés automatiquement via des triggers PostgreSQL qui appellent les Edge Functions pour notifier n8n des événements.

## Système de Roles et Permissions

### Rôles Disponibles
- `super_admin` - Accès complet au système
- `administrateur` - Gestion complète de l'organisation
- `superviseur` - Supervision d'équipe et métriques
- `responsable_*` - Rôles spécialisés par département
- `agent` - Gestion des conversations clients
- `technicien` - Support technique

### Profils Utilisateurs
- Système multi-zones géographiques (Casablanca, Rabat, Marrakech, etc.)
- Support de clientèle internationale
- Interface multilingue (Français, Arabe, Anglais)

## Intégration n8n

### Workflows Configurés
- **6 workflows synchrones** - Traitement en temps réel
- **9 workflows asynchrones** - Tâches de fond
- Webhooks bidirectionnels Supabase ↔ n8n
- Monitoring automatique des exécutions

### APIs Externes Intégrées
- OpenAI pour l'intelligence artificielle
- Plateformes de réservation (Beds24, etc.)
- Services de communication
- Outils de monitoring

## Données Mock et Internationalisation

Le système inclut des données de simulation réalistes :
- **Invités internationaux** : Noms et nationalités diverses
- **Propriétés marocaines** : Locations authentiques
- **Messages multilingues** : Contextes culturels adaptés
- **Équipe locale** : Profils marocains réalistes

## Déploiement

### Développement
```sh
npm run dev
```

## Documentation Technique

Consultez le dossier `docs/` pour la documentation complète :
- [Configuration Technique](./docs/technical-configuration.md)
- [Base de Données](./docs/database-configuration.md)
- [Webhooks et Monitoring](./docs/webhooks-monitoring.md)
- [Sécurité](./docs/security-backup.md)
- [Checklist de Déploiement](./docs/deployment-checklist.md)
