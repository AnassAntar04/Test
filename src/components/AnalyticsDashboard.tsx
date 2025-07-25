import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MessageSquare, 
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from "lucide-react";

export const AnalyticsDashboard = () => {
  const phaseMetrics = [
    { phase: "Pré-réservation", count: 23, percentage: 28, trend: 12, color: "primary" },
    { phase: "Post-réservation", count: 18, percentage: 22, trend: -5, color: "accent" },
    { phase: "Séjour en cours", count: 15, percentage: 18, trend: 8, color: "warning" },
    { phase: "Pré-check-out", count: 12, percentage: 15, trend: 3, color: "secondary" },
    { phase: "Post-check-out", count: 14, percentage: 17, trend: 15, color: "success" }
  ];

  const escalationStats = [
    { type: "Technique", count: 8, resolved: 6, pending: 2, avgTime: "45min" },
    { type: "Ménage", count: 12, resolved: 10, pending: 2, avgTime: "2h30" },
    { type: "Financier", count: 4, resolved: 3, pending: 1, avgTime: "1h15" },
    { type: "Urgent", count: 2, resolved: 2, pending: 0, avgTime: "15min" }
  ];

  const channelPerformance = [
    { channel: "WhatsApp", volume: 45, satisfaction: 4.8, responseTime: "2min", automated: 78 },
    { channel: "Email", volume: 32, satisfaction: 4.6, responseTime: "15min", automated: 65 },
    { channel: "Beds24", volume: 18, satisfaction: 4.9, responseTime: "1min", automated: 85 },
    { channel: "Direct", volume: 5, satisfaction: 4.7, responseTime: "5min", automated: 45 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Avancé</h2>
          <p className="text-muted-foreground">Métriques détaillées par phase et processus</p>
        </div>
        <Badge variant="secondary" className="bg-accent-light text-accent">
          <BarChart3 className="h-3 w-3 mr-1" />
          Temps réel
        </Badge>
      </div>

      {/* Métriques par phase */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span>Répartition par Phase du Parcours</span>
          </CardTitle>
          <CardDescription>Volume et tendances des conversations par phase</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phaseMetrics.map((metric) => (
              <div key={metric.phase} className={`p-4 rounded-lg bg-${metric.color}-light border border-${metric.color}/20`}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-sm">{metric.phase}</h4>
                  <div className="flex items-center space-x-1">
                    {metric.trend > 0 ? (
                      <ArrowUp className="h-3 w-3 text-success" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={`text-xs font-medium ${metric.trend > 0 ? 'text-success' : 'text-destructive'}`}>
                      {Math.abs(metric.trend)}%
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{metric.count}</span>
                    <span className="text-sm text-muted-foreground">{metric.percentage}%</span>
                  </div>
                  <Progress value={metric.percentage} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance des canaux */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-accent" />
            <span>Performance par Canal</span>
          </CardTitle>
          <CardDescription>Métriques de satisfaction et efficacité</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Canal</th>
                  <th className="text-center p-3">Volume</th>
                  <th className="text-center p-3">Satisfaction</th>
                  <th className="text-center p-3">Temps réponse</th>
                  <th className="text-center p-3">Automatisation</th>
                </tr>
              </thead>
              <tbody>
                {channelPerformance.map((channel) => (
                  <tr key={channel.channel} className="border-b hover:bg-card-accent">
                    <td className="p-3">
                      <div className="font-medium">{channel.channel}</div>
                    </td>
                    <td className="text-center p-3">
                      <Badge variant="outline">{channel.volume}</Badge>
                    </td>
                    <td className="text-center p-3">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="font-medium">{channel.satisfaction}</span>
                        <span className="text-warning">★</span>
                      </div>
                    </td>
                    <td className="text-center p-3">
                      <span className="text-sm font-mono">{channel.responseTime}</span>
                    </td>
                    <td className="text-center p-3">
                      <div className="flex items-center justify-center space-x-2">
                        <Progress value={channel.automated} className="w-16 h-2" />
                        <span className="text-xs">{channel.automated}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques d'escalade */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            <span>Escalades par Type</span>
          </CardTitle>
          <CardDescription>Suivi des transferts et temps de résolution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {escalationStats.map((stat) => (
              <div key={stat.type} className="p-4 rounded-lg bg-card-accent border">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">{stat.type}</h4>
                  <Badge variant="outline">{stat.count} total</Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span className="text-sm font-medium">Résolues</span>
                    </div>
                    <div className="text-2xl font-bold text-success">{stat.resolved}</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Clock className="h-4 w-4 text-warning" />
                      <span className="text-sm font-medium">En cours</span>
                    </div>
                    <div className="text-2xl font-bold text-warning">{stat.pending}</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-1">Temps moyen de résolution</div>
                  <div className="text-lg font-semibold text-primary">{stat.avgTime}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Métriques temps réel */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-muted-foreground">Agents en ligne</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-accent" />
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-xs text-muted-foreground">Conv. actives</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-warning" />
              <div>
                <p className="text-2xl font-bold">1.8s</p>
                <p className="text-xs text-muted-foreground">Temps réponse IA</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-8 w-8 text-success" />
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-xs text-muted-foreground">Taux résolution</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};