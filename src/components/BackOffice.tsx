import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Settings, 
  Users, 
  MessageSquare, 
  BarChart3, 
  Zap,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
  UserCheck
} from "lucide-react";
import { WorkflowManager } from "@/components/WorkflowManager";

const BackOffice = () => {
  const [selectedChatbot, setSelectedChatbot] = useState("principal");

  const chatbots = [
    {
      id: "principal",
      name: "Chatbot Principal",
      description: "Toutes conversations - Lecture seule historique",
      status: "active",
      conversations: 147,
      resolution: 85,
      color: "primary"
    },
    {
      id: "secondaire", 
      name: "Chatbot Secondaire",
      description: "Conversations non clôturées - Traitement actif",
      status: "active",
      conversations: 23,
      resolution: 78,
      color: "accent"
    },
    {
      id: "attribution",
      name: "Attribution Automatique",
      description: "Critères modulables - Routage intelligent", 
      status: "active",
      conversations: 34,
      resolution: 92,
      color: "warning"
    },
    {
      id: "manuel",
      name: "Attribution Manuelle/IA", 
      description: "Décisions complexes - Supervision agent",
      status: "standby",
      conversations: 12,
      resolution: 95,
      color: "secondary"
    },
    {
      id: "interne",
      name: "Communications Internes",
      description: "Messages équipe - Coordination agents",
      status: "active", 
      conversations: 8,
      resolution: 100,
      color: "danger"
    }
  ];

  const agents = [
    { name: "Marie Dubois", role: "Téléconseillère", status: "online", conversations: 12, satisfaction: 4.8 },
    { name: "Sophie Martin", role: "Superviseure", status: "busy", conversations: 8, satisfaction: 4.9 },
    { name: "Julie Moreau", role: "Téléconseillère", status: "online", conversations: 15, satisfaction: 4.7 },
    { name: "Camille Blanc", role: "Téléconseillère", status: "away", conversations: 6, satisfaction: 4.6 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-accent text-accent-foreground";
      case "standby": return "bg-warning text-warning-foreground"; 
      case "offline": return "bg-secondary text-secondary-foreground";
      default: return "bg-secondary text-secondary-foreground";
    }
  };

  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary": return "border-primary bg-primary-light";
      case "accent": return "border-accent bg-accent-light";
      case "warning": return "border-warning bg-warning-light";
      case "secondary": return "border-secondary bg-secondary-light";
      case "danger": return "border-danger bg-danger-light";
      default: return "border-primary bg-primary-light";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Back Office - SynergyAI Connect</h1>
          <p className="text-muted-foreground">Gestion des chatbots et supervision des agents</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-accent-light text-accent">
            <Shield className="h-3 w-3 mr-1" />
            Système opérationnel
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="chatbots" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chatbots">Chatbots IA</TabsTrigger>
          <TabsTrigger value="agents">Équipe Agents</TabsTrigger>
          <TabsTrigger value="workflows">Workflows Auto</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="chatbots" className="space-y-6">
          {/* Chatbots Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chatbots.map((chatbot) => (
              <Card 
                key={chatbot.id}
                className={`dashboard-card cursor-pointer transition-all hover:shadow-lg ${
                  selectedChatbot === chatbot.id ? `border-2 ${getColorClasses(chatbot.color)}` : ''
                }`}
                onClick={() => setSelectedChatbot(chatbot.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Bot className={`h-5 w-5 text-${chatbot.color}`} />
                      <CardTitle className="text-lg">{chatbot.name}</CardTitle>
                    </div>
                    <Badge className={getStatusColor(chatbot.status)}>
                      {chatbot.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {chatbot.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Conversations actives</span>
                    <span className="text-lg font-bold">{chatbot.conversations}</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Taux de résolution</span>
                      <span className="font-medium">{chatbot.resolution}%</span>
                    </div>
                    <Progress value={chatbot.resolution} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Chatbot Details */}
          {selectedChatbot && (
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configuration - {chatbots.find(c => c.id === selectedChatbot)?.name}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Paramètres de fonctionnement</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Seuil de confiance IA</span>
                      <Badge variant="outline">85%</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Temps de réponse moyen</span>
                      <Badge variant="outline">1.8s</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Escalade vers agent</span>
                      <Badge variant="outline">15%</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold">Dernières performances</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span>127 conversations résolues aujourd'hui</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="h-4 w-4 text-warning" />
                      <span>3 escalades vers superviseur</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span>Actif depuis 168h consécutives</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="agents" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {agents.map((agent, index) => (
              <Card key={index} className="dashboard-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary-light rounded-full flex items-center justify-center">
                        <UserCheck className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{agent.name}</CardTitle>
                        <CardDescription>{agent.role}</CardDescription>
                      </div>
                    </div>
                    <Badge className={`${
                      agent.status === 'online' ? 'bg-accent text-accent-foreground' :
                      agent.status === 'busy' ? 'bg-warning text-warning-foreground' :
                      'bg-secondary text-secondary-foreground'
                    }`}>
                      {agent.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{agent.conversations}</div>
                      <div className="text-xs text-muted-foreground">Conversations</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">{agent.satisfaction}</div>
                      <div className="text-xs text-muted-foreground">Satisfaction</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="workflows" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-warning" />
                  <span>Messages Automatiques</span>
                </CardTitle>
                <CardDescription>Parcours client automatisé</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Confirmation réservation</span>
                    <Badge variant="outline" className="bg-accent-light text-accent">Instantané</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rappel J-1 arrivée</span>
                    <Badge variant="outline" className="bg-accent-light text-accent">13h00</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rappel J-1 départ</span>
                    <Badge variant="outline" className="bg-accent-light text-accent">14h00</Badge>  
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Feedback post-séjour</span>
                    <Badge variant="outline" className="bg-accent-light text-accent">Check-out</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="dashboard-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  <span>Templates Agents</span>
                </CardTitle>
                <CardDescription>Réponses standards pré-rédigées</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-left">
                    "Bienvenue chez Samy Conciergerie..."
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    "Informations d'accès appartement"
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    "Demande de documents requis"
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-left">
                    "Instructions check-out"
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <WorkflowManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackOffice;