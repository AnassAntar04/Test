# ⚡ Workflows et Infrastructure

## Classification des Workflows n8n

### Workflows Synchrones (6 workflows)
Nécessitent une réponse immédiate avec timeout configuré :

| Workflow | Temps Réponse | Timeout | Déclencheur |
|----------|---------------|---------|-------------|
| **Agent_IA_Assistant** | 2-8s | 30s | Message client |
| **Template_Escalade_Technique** | 1-3s | 15s | Mots-clés urgents |
| **Webhook_Handler** | 200-800ms | 10s | Réception webhook |
| **Notifications_Multi_Canal** | 1-4s | 20s | Alerte prioritaire |
| **Alertes_Incidents** | 500ms-2s | 15s | Détection incident |
| **Templates_Reponses** | 300ms-1.5s | 10s | Demande template agent |

### Workflows Asynchrones (9 workflows)
Fonctionnent en arrière-plan avec fréquence programmée :

| Workflow | Fréquence | Déclencheur |
|----------|-----------|-------------|
| **Template_Checkin_Automatise** | 15 min | Cron/Webhook Beds24 |
| **Template_Sync_Beds24** | 5 min | Cron |
| **Analytics_Aggregation** | 1h | Cron |
| **Rapports_Automatiques** | Quotidien/Hebdo | Cron programmé |
| **Monitoring_Performance** | 2 min | Cron |
| **Backup_Securite** | Quotidien 3h | Cron |
| **Gestion_Utilisateurs** | 30 min | Cron/Webhook |
| **Preprocessing_Documents** | À la demande | Upload document |
| **Metrics_Collector** | 5 min | Cron |

## Spécifications Infrastructure

### Configuration VM Recommandée

#### Production - Haute Performance
```yaml
CPU: 8 vCPUs (3.2GHz+) - Intel Xeon/AMD EPYC
RAM: 16-32 GB DDR4
Stockage: 500GB SSD NVMe + 2TB HDD backup
Réseau: 10 Gbps, latence < 5ms
OS: Ubuntu 22.04 LTS ou CentOS Stream 9
```

#### Staging/Test
```yaml
CPU: 4 vCPUs (2.8GHz+)
RAM: 8-16 GB
Stockage: 200GB SSD
Réseau: 1 Gbps
```

#### Développement
```yaml
CPU: 2-4 vCPUs
RAM: 4-8 GB
Stockage: 100GB SSD
```

### Composants Séparés

#### Base de Données PostgreSQL
```yaml
VM dédiée: 4 vCPUs, 16GB RAM, SSD RAID 1
Connection Pool: 50-100 connexions
Backup: Quotidien automatique
```

#### Cache Redis
```yaml
Specs: 2 vCPUs, 8GB RAM
Persistence: AOF + RDB snapshots
Cluster: 3 nodes en production
```

#### Load Balancer
```yaml
HAProxy/NGINX: 2 vCPUs, 4GB RAM
SSL Termination: Let's Encrypt
Health Checks: 30s interval
```

### Optimisations Système

#### Kernel Tuning
```bash
# Optimisation réseau
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 87380 16777216

# File descriptors
fs.file-max = 1048576
ulimit -n 65536
```

#### Node.js/n8n Configuration
```bash
# Variables environnement
NODE_OPTIONS="--max-old-space-size=8192"
N8N_WORKERS=4
N8N_CONCURRENCY=10
```

### Métriques de Performance

#### Surveillance Continue
- **CPU**: < 70% en moyenne
- **RAM**: < 80% utilisée  
- **Disk I/O**: < 80% IOPS
- **Network**: < 60% bandwidth

#### Auto-scaling
- **Scale-up**: CPU > 75% pendant 5 min
- **Scale-down**: CPU < 30% pendant 15 min
- **Max instances**: 5 workers n8n

### Estimation Coûts AWS/Azure

#### Production
- **Instances**: t3.2xlarge ou Standard_D8s_v3
- **Coût mensuel**: 500-800€/mois
- **Avec réservation**: 300-500€/mois

#### Développement
- **Instances**: t3.medium ou Standard_B2s
- **Coût mensuel**: 50-100€/mois