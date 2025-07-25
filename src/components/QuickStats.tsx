
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Clock, Users, TrendingUp } from "lucide-react";
import { mockDashboardStats } from "@/mocks/dashboard";

export const QuickStats = () => {
  // Utiliser les données mock au lieu de valeurs codées en dur
  const todayMessages = mockDashboardStats.find(stat => stat.title.includes('Conversations'))?.value || "147";
  const avgTime = mockDashboardStats.find(stat => stat.title.includes('Temps'))?.value || "2.3m";
  const satisfaction = mockDashboardStats.find(stat => stat.title.includes('Satisfaction'))?.value || "4.6/5";
  
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="bg-primary text-primary-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Messages Aujourd'hui</CardTitle>
          <MessageSquare className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todayMessages}</div>
          <p className="text-xs opacity-80">+12% vs hier</p>
        </CardContent>
      </Card>

      <Card className="bg-accent text-accent-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Temps Moyen</CardTitle>
          <Clock className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{avgTime}</div>
          <p className="text-xs opacity-80">-15% plus rapide</p>
        </CardContent>
      </Card>

      <Card className="bg-warning text-warning-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Agents Actifs</CardTitle>
          <Users className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">4/4</div>
          <p className="text-xs opacity-80">100% disponibilité</p>
        </CardContent>
      </Card>

      <Card className="bg-secondary text-secondary-foreground">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
          <TrendingUp className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{satisfaction}</div>
          <p className="text-xs opacity-80">+0.2 ce mois</p>
        </CardContent>
      </Card>
    </div>
  );
};
