import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export const IntegrationStatus = () => {
  const integrations = [
    { name: "Beds24", status: "Connecté", bgClass: "bg-accent-light", dotClass: "bg-accent" },
    { name: "WhatsApp", status: "Actif", bgClass: "bg-accent-light", dotClass: "bg-accent" },
    { name: "Email", status: "Synchronisé", bgClass: "bg-accent-light", dotClass: "bg-accent" },
    { name: "SAMY 360", status: "Intégré", bgClass: "bg-primary-light", dotClass: "bg-primary" }
  ];

  return (
    <Card className="dashboard-card">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-accent" />
          <span>État des Intégrations</span>
        </CardTitle>
        <CardDescription>
          Connexions temps réel avec vos plateformes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {integrations.map((integration) => (
            <div key={integration.name} className={`flex items-center space-x-3 p-3 rounded-lg ${integration.bgClass}`}>
              <div className={`w-3 h-3 ${integration.dotClass} rounded-full`}></div>
              <div>
                <div className="font-medium">{integration.name}</div>
                <div className="text-sm text-muted-foreground">{integration.status}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};