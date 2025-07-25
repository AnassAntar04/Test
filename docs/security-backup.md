# 🔐 Sécurité et Sauvegarde

## Sécurité

### Dernières Corrections de Sécurité (Janvier 2025)

**✅ Vulnérabilités Corrigées:**
- Fonctions PL/pgSQL sécurisées avec `SET search_path = ''`
- Protection contre les attaques par injection de schéma
- Toutes les fonctions SECURITY DEFINER mises à jour

**Fonctions corrigées:**
- `notify_document_upload()`
- `notify_system_incident()` 
- `notify_workflow_completion()`
- `notify_conversation_update()`
- `notify_escalation_event()`
- `notify_conversation_state_change()`
- `notify_settings_change()`
- `notify_user_profile_change()`
- `trigger_webhook_notification()`
- `update_updated_at_column()`
- `cleanup_mcp_audit_trail()`
- `assign_user_role()`
- `has_role()`
- `get_user_role_level()`
- `get_current_user_profile_type()`
- `handle_new_user()`

### Configuration OTP et Mots de Passe

**À configurer dans le Dashboard Supabase:**
1. **OTP Expiry**: Aller dans Authentication → Settings → Email OTP expiry (recommandé: 3600 secondes)
2. **Protection mots de passe**: Activer la protection contre les mots de passe divulgués dans Authentication → Settings

### Token Rotation
```bash
#!/bin/bash
# Script rotation tokens (à exécuter mensuellement)
# Générer nouveau token n8n
# Mettre à jour configuration SynergyAI
# Tester connectivité
# Révoquer ancien token
```

### Backup Configuration
```yaml
# Sauvegarde automatique n8n
version: '3.8'
services:
  backup:
    image: postgres:13
    environment:
      - PGPASSWORD=VotreMotDePasseBDD
    volumes:
      - ./backups:/backups
    command: >
      bash -c "
        while true; do
          pg_dump -h postgres -U n8n_user -d n8n > /backups/n8n_backup_$$(date +%Y%m%d_%H%M%S).sql
          find /backups -name '*.sql' -mtime +7 -delete
          sleep 86400
        done
      "
```