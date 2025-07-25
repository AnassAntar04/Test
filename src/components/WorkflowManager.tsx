import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Settings2, 
  Bot, 
  MessageSquare, 
  ArrowRight,
  Clock,
  Users,
  Filter,
  Zap,
  CheckCircle,
  AlertTriangle,
  Plus
} from "lucide-react";
import { ConversationState, JourneyPhase, ChatbotConfig, EscalationRule, AutoMessage, CONVERSATION_STATES, JOURNEY_PHASES } from "@/types/conversation";

export const WorkflowManager = () => {
  const [selectedTab, setSelectedTab] = useState("workflows");
  
  // Configuration des 15 workflows
  const workflows = [
    // Synchrones
    { name: "Conversation_Update", type: "synchrone", status: "actif", description: "Mise à jour temps réel des conversations" },
    { name: "Escalation_Trigger", type: "synchrone", status: "actif", description: "Déclenchement automatique des escalades" },
    { name: "Settings_Sync", type: "synchrone", status: "actif", description: "Synchronisation des paramètres système" },
    { name: "Document_Processing", type: "synchrone", status: "actif", description: "Traitement des documents uploadés" },
    { name: "Alertes_Incidents", type: "synchrone", status: "actif", description: "Alertes en temps réel des incidents" },
    { name: "Templates_Reponses", type: "synchrone", status: "actif", description: "Application des templates de réponses" },
    
    // Asynchrones
    { name: "Gestion_Utilisateurs", type: "asynchrone", status: "actif", description: "Gestion automatisée des utilisateurs", schedule: "Toutes les heures" },
    { name: "Knowledge_Base", type: "asynchrone", status: "actif", description: "Mise à jour de la base de connaissances", schedule: "Quotidien 02:00" },
    { name: "Analytics_Reporting", type: "asynchrone", status: "actif", description: "Génération des rapports analytiques", schedule: "Quotidien 06:00" },
    { name: "Metrics_Collector", type: "asynchrone", status: "actif", description: "Collecte et agrégation des métriques", schedule: "Toutes les 15 min" },
    { name: "Backup_Sync", type: "asynchrone", status: "actif", description: "Synchronisation des sauvegardes", schedule: "Quotidien 01:00" },
    { name: "Maintenance_Scheduler", type: "asynchrone", status: "actif", description: "Planification des maintenances", schedule: "Hebdomadaire" },
    { name: "Quality_Monitor", type: "asynchrone", status: "actif", description: "Monitoring de la qualité de service", schedule: "Continu" },
    { name: "Resource_Optimizer", type: "asynchrone", status: "actif", description: "Optimisation des ressources", schedule: "Quotidien 04:00" },
    { name: "Integration_Health", type: "asynchrone", status: "actif", description: "Vérification santé des intégrations", schedule: "Toutes les 30 min" }
  ];

  const [chatbots, setChatbots] = useState<ChatbotConfig[]>([
    {
      id: "principal",
      name: "Chatbot Principal",
      type: "principal",
      description: "Toutes conversations - Lecture seule historique",
      allowedRoles: ["agent", "superviseur"],
      isActive: true
    },
    {
      id: "secondaire",
      name: "Chatbot Secondaire", 
      type: "secondaire",
      description: "Conversations non clôturées - Traitement actif",
      allowedRoles: ["agent"],
      isActive: true
    }
  ]);

  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>([
    {
      id: "tech-1",
      name: "Problème technique",
      keywords: ["panne", "climatisation", "wifi", "code"],
      fromRole: "agent",
      toRole: "technicien",
      condition: "immediate",
      priority: 1
    },
    {
      id: "menage-1", 
      name: "Problème ménage",
      keywords: ["sale", "ménage", "serviette", "draps"],
      fromRole: "agent",
      toRole: "femme_menage",
      condition: "immediate",
      priority: 2
    }
  ]);

  const [autoMessages, setAutoMessages] = useState<AutoMessage[]>([
    {
      id: "confirm-booking",
      name: "Confirmation réservation",
      trigger: "booking_confirmed",
      template: "Bonjour {travelerName}, votre réservation à {propertyName} est confirmée...",
      channels: ["email", "whatsapp"],
      variables: { travelerName: "", propertyName: "", arrivalDate: "", departureDate: "" },
      isActive: true
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gestionnaire de Workflows</h2>
          <p className="text-muted-foreground">Configuration avancée des processus conversationnels</p>
        </div>
        <Badge variant="secondary" className="bg-accent-light text-accent">
          <Settings2 className="h-3 w-3 mr-1" />
          Configuration Active
        </Badge>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="workflows">Workflows</TabsTrigger>
          <TabsTrigger value="states">États & Phases</TabsTrigger>
          <TabsTrigger value="chatbots">Chatbots</TabsTrigger>
          <TabsTrigger value="escalation">Escalade</TabsTrigger>
          <TabsTrigger value="messages">Messages Auto</TabsTrigger>
          <TabsTrigger value="routing">Routage</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Gestion des 15 Workflows</h2>
            <div className="flex gap-2">
              <Badge variant="secondary">{workflows.filter(w => w.type === 'synchrone').length} Synchrones</Badge>
              <Badge variant="outline">{workflows.filter(w => w.type === 'asynchrone').length} Asynchrones</Badge>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {workflows.map((workflow, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">
                      {workflow.name.replace(/_/g, ' ')}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={workflow.type === 'synchrone' ? 'default' : 'secondary'}>
                        {workflow.type}
                      </Badge>
                      <Badge variant={workflow.status === 'actif' ? 'default' : 'destructive'}>
                        {workflow.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">
                    {workflow.description}
                  </p>
                  {workflow.schedule && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{workflow.schedule}</span>
                    </div>
                  )}
                  <div className="flex justify-end mt-3">
                    <Button variant="outline" size="sm">
                      Configurer
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="states" className="space-y-6">
          {/* États et Phases */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>États de Conversation</span>
                </CardTitle>
                <CardDescription>7 états du cycle de vie complet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(CONVERSATION_STATES).map(([state, config]) => (
                  <div key={state} className="flex items-center justify-between p-3 rounded-lg bg-card-accent">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${config.color}`}></div>
                      <div>
                        <div className="font-medium">{config.label}</div>
                        <div className="text-sm text-muted-foreground">{config.description}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-accent" />
                  <span>Phases du Parcours</span>
                </CardTitle>
                <CardDescription>5 phases du voyage client</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(JOURNEY_PHASES).map(([phase, config]) => (
                  <div key={phase} className="flex items-center justify-between p-3 rounded-lg bg-card-accent">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-${config.color}`}></div>
                      <div>
                        <div className="font-medium">{config.label}</div>
                        <div className="text-sm text-muted-foreground">{config.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="chatbots" className="space-y-6">
          {/* Configuration Chatbots */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Configuration des Chatbots</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Chatbot
            </Button>
          </div>

          <div className="grid gap-6">
            {chatbots.map((chatbot) => (
              <Card key={chatbot.id} className="dashboard-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Bot className="h-5 w-5 text-primary" />
                      <div>
                        <CardTitle>{chatbot.name}</CardTitle>
                        <CardDescription>{chatbot.description}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch checked={chatbot.isActive} />
                      <Badge variant={chatbot.type === "principal" ? "default" : "secondary"}>
                        {chatbot.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label>Rôles autorisés</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {chatbot.allowedRoles.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Label>Type d'attribution</Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {chatbot.type === "attribution_auto" ? "Automatique" : 
                         chatbot.type === "attribution_manuel" ? "Manuelle" : "Standard"}
                      </p>
                    </div>
                    <div className="flex items-end">
                      <Button variant="outline" size="sm">
                        <Settings2 className="h-3 w-3 mr-1" />
                        Configurer
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="escalation" className="space-y-6">
          {/* Règles d'escalade */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Règles d'Escalade Automatique</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Règle
            </Button>
          </div>

          <div className="grid gap-4">
            {escalationRules.map((rule) => (
              <Card key={rule.id} className="dashboard-card">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <AlertTriangle className="h-5 w-5 text-warning" />
                      <div>
                        <div className="font-medium">{rule.name}</div>
                        <div className="text-sm text-muted-foreground">
                          De: {rule.fromRole} → Vers: {rule.toRole}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">Mots-clés</div>
                        <div className="text-xs text-muted-foreground">
                          {rule.keywords.join(", ")}
                        </div>
                      </div>
                      <Badge variant={rule.condition === "immediate" ? "destructive" : "secondary"}>
                        {rule.condition}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="messages" className="space-y-6">
          {/* Messages automatiques */}
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Messages Automatiques</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nouveau Message
            </Button>
          </div>

          <div className="grid gap-6">
            {autoMessages.map((message) => (
              <Card key={message.id} className="dashboard-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Zap className="h-5 w-5 text-warning" />
                      <div>
                        <CardTitle>{message.name}</CardTitle>
                        <CardDescription>Déclencheur: {message.trigger}</CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Switch checked={message.isActive} />
                      <Badge variant="secondary">
                        {message.channels.length} canaux
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Template du message</Label>
                    <Textarea 
                      value={message.template} 
                      className="mt-1 text-sm" 
                      rows={3}
                      readOnly
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div>
                      <Label>Canaux</Label>
                      <div className="flex gap-1 mt-1">
                        {message.channels.map((channel) => (
                          <Badge key={channel} variant="outline" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    {message.scheduledTime && (
                      <div>
                        <Label>Heure programmée</Label>
                        <p className="text-sm font-mono mt-1">{message.scheduledTime}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="routing" className="space-y-6">
          {/* Matrice de routage */}
          <Card className="dashboard-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-primary" />
                <span>Matrice de Routage Automatique</span>
              </CardTitle>
              <CardDescription>Configuration des règles d'attribution par type de demande - Voir les paramètres pour la configuration complète</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  La matrice de routage est maintenant entièrement configurable dans les paramètres.
                </p>
                <Button variant="outline" onClick={() => setSelectedTab("escalation")}>
                  Aller aux paramètres d'escalade
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};