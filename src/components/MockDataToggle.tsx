
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, TestTube } from "lucide-react";
import { useMockData } from "@/hooks/useMockData";

export const MockDataToggle = () => {
  const { useMockData: isUsingMockData, toggleMockData } = useMockData();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isUsingMockData ? (
            <TestTube className="h-5 w-5 text-accent" />
          ) : (
            <Database className="h-5 w-5 text-primary" />
          )}
          <span>Source des Données</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-2">
          <Switch
            id="mock-data-toggle"
            checked={isUsingMockData}
            onCheckedChange={toggleMockData}
          />
          <Label htmlFor="mock-data-toggle">
            {isUsingMockData ? 'Données Mock' : 'Données Réelles'}
          </Label>
        </div>
        <p className="text-sm text-muted-foreground">
          {isUsingMockData 
            ? 'Utilisation des données simulées pour le développement et les démonstrations.'
            : 'Connexion aux vraies données via Supabase.'
          }
        </p>
      </CardContent>
    </Card>
  );
};
