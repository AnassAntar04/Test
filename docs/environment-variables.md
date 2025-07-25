# 🔧 Variables d'Environnement et Configuration API

## Variables d'Environnement Requises (Samy)

```bash
# n8n Core
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=motdepasse_ultra_securise
N8N_HOST=n8n.samy360.com
N8N_PROTOCOL=https
N8N_PUBLIC_API_DISABLED=false

# Base de Données
DB_TYPE=postgresdb
DB_POSTGRESDB_HOST=localhost
DB_POSTGRESDB_DATABASE=n8n_samy
DB_POSTGRESDB_USER=n8n_user
DB_POSTGRESDB_PASSWORD=password_bdd_securise

# APIs Externes
BEDS24_API_KEY=votre_cle_beds24
ZIWO_TOKEN=votre_token_ziwo
OPENAI_API_KEY=votre_cle_openai
GMAIL_APP_PASSWORD=votre_mot_de_passe_application_gmail

# SynergyAI Integration
SYNERGYAI_WEBHOOK_URL=https://votre-projet.lovable.app/api/webhooks/n8n
SYNERGYAI_API_TOKEN=token_genere_par_lovable
```

## Structure API SynergyAI (Lovable)

```typescript
// Routes API à créer
GET    /api/n8n/workflows          // Liste workflows
POST   /api/n8n/workflows          // Créer workflow
PUT    /api/n8n/workflows/:id      // Modifier workflow  
DELETE /api/n8n/workflows/:id      // Supprimer workflow
POST   /api/n8n/workflows/:id/test // Tester workflow
GET    /api/n8n/executions        // Historique exécutions
POST   /api/webhooks/n8n           // Réception webhooks n8n
```