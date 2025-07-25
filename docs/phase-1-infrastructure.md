# 🏗️ Phase 1: Infrastructure Samy
*À réaliser en dehors de Lovable*

## 1.1 Installation et Configuration n8n

### Pré-requis d'entrée
- [ ] Serveur Linux (Ubuntu 20.04+ recommandé)
- [ ] Docker et Docker Compose installés
- [ ] Nom de domaine configuré (ex: n8n.samy360.com)
- [ ] SSL/TLS certificat (Let's Encrypt)
- [ ] Base de données PostgreSQL disponible

### Actions à réaliser

```bash
# 1. Créer le répertoire projet
mkdir /opt/n8n-samy
cd /opt/n8n-samy

# 2. Créer docker-compose.yml
```

**docker-compose.yml requis:**
```yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=VotreMotDePasseSecurise
      - N8N_HOST=n8n.samy360.com
      - N8N_PORT=5678
      - N8N_PROTOCOL=https
      - NODE_ENV=production
      - WEBHOOK_URL=https://n8n.samy360.com/
      - GENERIC_TIMEZONE=Europe/Paris
      - N8N_METRICS=true
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=n8n
      - DB_POSTGRESDB_USER=n8n_user
      - DB_POSTGRESDB_PASSWORD=VotreMotDePasseBDD
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - postgres

  postgres:
    image: postgres:13
    restart: always
    environment:
      - POSTGRES_USER=n8n_user
      - POSTGRES_PASSWORD=VotreMotDePasseBDD
      - POSTGRES_DB=n8n
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  n8n_data:
  postgres_data:
```

### Résultats attendus en sortie
- [ ] n8n accessible via https://n8n.samy360.com
- [ ] Interface d'administration fonctionnelle
- [ ] Base de données PostgreSQL connectée
- [ ] Logs système sans erreur
- [ ] Test de création d'un workflow simple réussi

---

## 1.2 Configuration API n8n

### Pré-requis d'entrée
- [ ] n8n installé et fonctionnel
- [ ] Accès administrateur n8n

### Actions à réaliser

**1. Activer l'API REST n8n:**
```bash
# Dans les variables d'environnement n8n
N8N_PUBLIC_API_DISABLED=false
N8N_PUBLIC_API_SWAGGERUI_DISABLED=false
```

**2. Créer un utilisateur API dédié:**
- Se connecter à l'interface n8n
- Aller dans Settings > Users
- Créer utilisateur: `synergyai-connect`
- Email: `api@samy360.com`
- Rôle: `Owner` (pour accès complet API)

**3. Générer token API:**
```bash
# Via interface n8n
Settings > API Keys > Create API Key
Name: "SynergyAI Connect Integration"
```

### Résultats attendus en sortie
- [ ] API n8n accessible via `https://n8n.samy360.com/api/v1/`
- [ ] Token API généré et documenté
- [ ] Documentation Swagger accessible
- [ ] Test API curl réussi:

```bash
curl -X GET "https://n8n.samy360.com/api/v1/workflows" \
  -H "Authorization: Bearer VOTRE_TOKEN_API"
```

---

## 1.3 Création des Workflows Templates Critiques

### Pré-requis d'entrée
- [ ] n8n configuré avec API
- [ ] Accès aux APIs externes:
  - Beds24 API (Property ID, API Key)
  - WhatsApp Business API (via Ziwo)
  - SMTP Gmail configuré
  - OpenAI API Key

### Template 1: Check-in Automatisé

**Nom du Workflow**: `Template_Checkin_Automatise`

**Étapes à créer dans n8n:**

1. **Webhook Trigger** (GET/POST)
   - URL: `https://n8n.samy360.com/webhook/checkin-auto`
   - Méthode: `POST`
   - Authentification: None (sécurisé par token)

2. **Node Beds24 - Récupération Réservation**
   ```json
   {
     "method": "GET",
     "url": "https://api.beds24.com/json/getBooking",
     "headers": {
       "token": "{{process.env.BEDS24_API_KEY}}"
     },
     "qs": {
       "bookId": "{{$json.bookingId}}"
     }
   }
   ```

3. **Node Condition - Vérification Date**
   ```javascript
   // Code JavaScript dans n8n
   const today = new Date();
   const arrivalDate = new Date($json.arrival);
   const diffTime = arrivalDate.getTime() - today.getTime();
   const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
   
   return diffDays <= 1; // Check-in dans les 24h
   ```

4. **Node WhatsApp - Envoi Message**
   ```json
   {
     "method": "POST",
     "url": "https://api.ziwo.io/whatsapp/send",
     "headers": {
       "Authorization": "Bearer {{process.env.ZIWO_TOKEN}}"
     },
     "body": {
       "to": "{{$json.guest_phone}}",
       "message": "🏨 Bonjour {{$json.guest_name}}, votre check-in à {{$json.property_name}} est demain. Code d'accès: {{$json.access_code}}"
     }
   }
   ```

5. **Node Email - Envoi Confirmation**
   ```json
   {
     "service": "gmail",
     "user": "noreply@samy360.com",
     "pass": "{{process.env.GMAIL_APP_PASSWORD}}",
     "to": "{{$json.guest_email}}",
     "subject": "Informations Check-in - {{$json.property_name}}",
     "html": "Template HTML complet avec codes d'accès"
   }
   ```

### Template 2: Escalade Technique

**Nom du Workflow**: `Template_Escalade_Technique`

**Trigger**: Webhook POST avec mots-clés détectés

**Étapes:**
1. **Webhook Reception**
2. **Analyse NLP** (Node OpenAI)
3. **Classification Urgence** (Node Code)
4. **Attribution Technicien** (Node HTTP vers SynergyAI)
5. **Notification Multi-canal** (WhatsApp + Email)

### Template 3: Synchronisation Beds24

**Nom du Workflow**: `Template_Sync_Beds24`

**Trigger**: Cron (toutes les 15 minutes)

**Étapes:**
1. **Cron Trigger** (*/15 * * * *)
2. **Récupération Nouvelles Réservations**
3. **Comparaison avec Base SynergyAI**
4. **Mise à Jour Différentielle**
5. **Log Synchronisation**

### Architecture des Workflows Critiques

<lov-mermaid>
graph TD
    subgraph "Déclencheurs"
        CRON[Tâches Programmées]
        WEBHOOK_IN[Webhooks Entrants]
        MANUAL[Déclenchement Manuel]
    end
    
    subgraph "Workflows n8n"
        CHECKIN[Check-in Automatisé]
        ESCALATION[Escalade Technique]
        SYNC[Synchronisation Beds24]
        REPORT[Rapports Automatiques]
    end
    
    subgraph "Actions de Sortie"
        WHATSAPP[Envoi WhatsApp]
        EMAIL_OUT[Envoi Email]
        DB_UPDATE[Mise à jour BDD]
        NOTIFICATION[Notifications]
    end
    
    CRON --> SYNC
    CRON --> REPORT
    WEBHOOK_IN --> CHECKIN
    WEBHOOK_IN --> ESCALATION
    MANUAL --> CHECKIN
    MANUAL --> ESCALATION
    
    CHECKIN --> WHATSAPP
    CHECKIN --> EMAIL_OUT
    CHECKIN --> DB_UPDATE
    
    ESCALATION --> WHATSAPP
    ESCALATION --> EMAIL_OUT
    ESCALATION --> NOTIFICATION
    
    SYNC --> DB_UPDATE
    SYNC --> NOTIFICATION
    
    REPORT --> EMAIL_OUT
    REPORT --> DB_UPDATE
</lov-mermaid>

### Résultats attendus en sortie
- [ ] 3 workflows templates créés et testés
- [ ] Webhooks fonctionnels avec URLs documentées
- [ ] Variables d'environnement configurées
- [ ] Tests d'intégration réussis avec APIs externes
- [ ] Documentation technique complète

**URLs de test à fournir:**
```
Webhook Check-in: https://n8n.samy360.com/webhook/checkin-auto
Webhook Escalade: https://n8n.samy360.com/webhook/escalade-tech
Webhook Sync: https://n8n.samy360.com/webhook/sync-beds24
```