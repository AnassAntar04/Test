import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, Zap } from "lucide-react";

export const FeaturesGrid = () => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card className="dashboard-card hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-light rounded-lg">
              <MessageSquare className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Chat Centralisé</CardTitle>
              <CardDescription>Toutes les conversations en un seul endroit</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Beds24, WhatsApp, Email - interface unifiée pour vos 4 téléconseillères
          </p>
          <Badge variant="secondary">Intégration complète</Badge>
        </CardContent>
      </Card>

      <Card className="dashboard-card hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-accent-light rounded-lg">
              <Bot className="h-6 w-6 text-accent" />
            </div>
            <div>
              <CardTitle className="text-lg">IA Multi-Niveaux</CardTitle>
              <CardDescription>Chatbots spécialisés par fonction</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm">Chatbot Principal</span>
              <Badge variant="outline" className="text-xs">Actif</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Attribution Auto</span>
              <Badge variant="outline" className="text-xs">78% résolution</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="dashboard-card hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-warning-light rounded-lg">
              <Zap className="h-6 w-6 text-warning" />
            </div>
            <div>
              <CardTitle className="text-lg">Messages Auto</CardTitle>
              <CardDescription>Parcours client automatisé</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Confirmation réservation</span>
              <span className="text-accent">✓ Instantané</span>
            </div>
            <div className="flex justify-between">
              <span>Rappel J-1 arrivée</span>
              <span className="text-accent">✓ 13h00</span>
            </div>
            <div className="flex justify-between">
              <span>Feedback post-séjour</span>
              <span className="text-accent">✓ Check-out</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};