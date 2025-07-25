import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Shield, Settings, CheckCircle, XCircle, Loader2 } from "lucide-react";

export const IntegrationsSettings = () => {
  const { toast } = useToast();
  const [isTestingConnection, setIsTestingConnection] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, 'success' | 'error' | null>>({});
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [configValues, setConfigValues] = useState<Record<string, Record<string, string>>>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const integrations = [
    { 
      name: "Beds24", 
      status: "Connecté", 
      description: "Synchronisation réservations et webhooks",
      config: ["API Key", "Webhook URL", "Propriétés synchronisées"],
      testEndpoint: "https://api.beds24.com/json/getProperties"
    },
    { 
      name: "WhatsApp Business", 
      status: "Actif", 
      description: "Messages via Ziwo (temporaire)",
      config: ["Numéro Business", "Token API", "Webhook"],
      testEndpoint: "https://graph.facebook.com/v17.0/me"
    },
    { 
      name: "Chat Samy 360", 
      status: "Disponible", 
      description: "Chat intégré sur le site web Samy 360",
      config: ["URL Widget", "Clé d'API", "Configuration Style"],
      testEndpoint: "https://samy360.com/api/status"
    },
    { 
      name: "n8n", 
      status: "Disponible", 
      description: "Plateforme d'orchestration et agents IA - Workflows automatisés",
      config: ["URL Instance", "Webhook URL", "Token API", "Configuration Workflows"],
      testEndpoint: "https://n8n.io/api/v1/workflows"
    },
    { 
      name: "SAMY 360", 
      status: "Intégré", 
      description: "ERP principal - Bidirectionnel",
      config: ["Base de données", "API Laravel", "Synchronisation"],
      testEndpoint: "https://samy360.com/api/health"
    },
    { 
      name: "Email", 
      status: "Synchronisé", 
      description: "Hébergement Genious → Gmail",
      config: ["SMTP", "IMAP", "Authentification"],
      testEndpoint: "smtp://mail.genious.fr"
    }
  ];

  const handleTestConnection = async (integration: any) => {
    setIsTestingConnection(integration.name);
    setTestResults(prev => ({ ...prev, [integration.name]: null }));

    try {
      // Simuler un test de connexion
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simuler un résultat aléatoire pour la démo
      const isSuccess = Math.random() > 0.3;
      
      if (isSuccess) {
        setTestResults(prev => ({ ...prev, [integration.name]: 'success' }));
        toast({
          title: "Test réussi",
          description: `Connexion à ${integration.name} établie avec succès.`,
          duration: 3000,
        });
      } else {
        setTestResults(prev => ({ ...prev, [integration.name]: 'error' }));
        toast({
          title: "Test échoué",
          description: `Impossible de se connecter à ${integration.name}. Vérifiez la configuration.`,
          variant: "destructive",
          duration: 3000,
        });
      }
    } catch (error) {
      setTestResults(prev => ({ ...prev, [integration.name]: 'error' }));
      toast({
        title: "Erreur de test",
        description: `Erreur lors du test de ${integration.name}.`,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsTestingConnection(null);
    }
  };

  const handleConfigurationSave = (integration: any) => {
    const values = configValues[integration.name] || {};
    
    // Simuler la sauvegarde
    toast({
      title: "Configuration sauvegardée",
      description: `Les paramètres de ${integration.name} ont été mis à jour.`,
      duration: 3000,
    });
    
    // Fermer la modal
    setIsDialogOpen(false);
    setSelectedIntegration(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedIntegration(null);
  };

  const handleSetupClick = (integration: any) => {
    setSelectedIntegration(integration);
    setIsDialogOpen(true);
  };

  const updateConfigValue = (integrationName: string, configKey: string, value: string) => {
    setConfigValues(prev => ({
      ...prev,
      [integrationName]: {
        ...prev[integrationName],
        [configKey]: value
      }
    }));
  };

  const getTestIcon = (integrationName: string) => {
    const result = testResults[integrationName];
    if (result === 'success') return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (result === 'error') return <XCircle className="h-4 w-4 text-red-500" />;
    return null;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Configuration des Intégrations</h3>
        <p className="text-muted-foreground">Connexions avec les plateformes externes</p>
      </div>

      {/* Intégrations actives */}
      {integrations.map((integration, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-accent" />
                <span>{integration.name}</span>
                <Badge variant={integration.status === "Connecté" ? "default" : "secondary"}>
                  {integration.status}
                </Badge>
                {getTestIcon(integration.name)}
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleTestConnection(integration)}
                  disabled={isTestingConnection === integration.name}
                >
                  {isTestingConnection === integration.name ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      Test...
                    </>
                  ) : (
                    "Tester"
                  )}
                </Button>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleSetupClick(integration)}
                    >
                      <Settings className="h-4 w-4 mr-1" />
                      Setup
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    {selectedIntegration && (
                      <>
                        <DialogHeader>
                          <DialogTitle>Configuration - {selectedIntegration.name}</DialogTitle>
                          <DialogDescription>
                            {selectedIntegration.description}
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 gap-4">
                            {selectedIntegration.config.map((config: string, i: number) => (
                              <div key={i} className="space-y-2">
                                <Label htmlFor={`config-${i}`}>{config}</Label>
                                <Input 
                                  id={`config-${i}`}
                                  type={config.toLowerCase().includes('password') || config.toLowerCase().includes('key') || config.toLowerCase().includes('token') ? "password" : "text"}
                                  placeholder={`Entrer ${config.toLowerCase()}`}
                                  value={configValues[selectedIntegration.name]?.[config] || ""}
                                  onChange={(e) => updateConfigValue(selectedIntegration.name, config, e.target.value)}
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <Label className="text-sm font-medium">Endpoint de test:</Label>
                            <p className="text-sm text-muted-foreground font-mono">{selectedIntegration.testEndpoint}</p>
                          </div>
                        </div>
                        
                        <DialogFooter className="gap-2">
                          <Button variant="outline" onClick={handleDialogClose}>
                            Annuler
                          </Button>
                          <Button onClick={() => handleConfigurationSave(selectedIntegration)}>
                            Sauvegarder
                          </Button>
                        </DialogFooter>
                      </>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardTitle>
            <CardDescription>{integration.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {integration.config.map((config, i) => (
                <div key={i} className="space-y-2">
                  <Label>{config}</Label>
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={configValues[integration.name]?.[config] || ""}
                    onChange={(e) => updateConfigValue(integration.name, config, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};