import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const NotificationsSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Paramètres de Notification</h3>
        <p className="text-muted-foreground">Configuration des alertes et notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notifications Push</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "Nouveau message", description: "Notification immédiate pour nouveaux messages" },
            { label: "Escalade urgente", description: "Alerte lors d'escalades critiques" },
            { label: "Timeout conversation", description: "Rappel si conversation sans réponse > 30min" },
            { label: "Erreur intégration", description: "Alerte en cas de problème technique" }
          ].map((notif, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{notif.label}</div>
                <div className="text-sm text-muted-foreground">{notif.description}</div>
              </div>
              <Switch defaultChecked />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seuils d'Alerte</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Temps de réponse max (minutes)</Label>
              <Input type="number" defaultValue="30" />
            </div>
            <div className="space-y-2">
              <Label>Conversations en attente max</Label>
              <Input type="number" defaultValue="15" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};