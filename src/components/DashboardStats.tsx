
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Bot, Star, Clock, TrendingUp, Users, Zap, Shield } from "lucide-react";
import { mockDashboardStats, mockChannelDistribution, mockTeamMembers } from "@/mocks/dashboard";

export const DashboardStats = () => {
  const getColorClasses = (color: string) => {
    switch (color) {
      case "primary":
        return { bg: "bg-primary-light", text: "text-primary", icon: "text-primary" };
      case "accent":
        return { bg: "bg-accent-light", text: "text-accent", icon: "text-accent" };
      case "warning":
        return { bg: "bg-warning-light", text: "text-warning", icon: "text-warning" };
      case "secondary":
        return { bg: "bg-secondary-light", text: "text-secondary", icon: "text-secondary" };
      default:
        return { bg: "bg-primary-light", text: "text-primary", icon: "text-primary" };
    }
  };

  const getIcon = (title: string) => {
    if (title.includes('Conversations')) return MessageSquare;
    if (title.includes('IA')) return Bot;
    if (title.includes('Satisfaction')) return Star;
    if (title.includes('Temps')) return Clock;
    return MessageSquare;
  };

  return (
    <div className="space-y-6">
      {/* Titre Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Tableau de Bord Temps Réel</h2>
        <p className="text-muted-foreground">
          Supervision des conversations et performances IA
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mockDashboardStats.map((stat, index) => {
          const colors = getColorClasses(stat.color);
          const Icon = getIcon(stat.title);
          
          return (
            <Card 
              key={index} 
              className="dashboard-card relative overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group fade-in-stagger"
              style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 ${colors.bg} rounded-lg group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-4 w-4 ${colors.icon}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-2xl font-bold number-roll">{stat.value}</div>
                  <div className="flex items-center space-x-2">
                    <Badge 
                      variant={stat.trend === "up" ? "default" : "secondary"}
                      className={`text-xs transition-all hover:scale-105 ${stat.trend === "up" ? "bg-accent text-accent-foreground" : ""}`}
                    >
                      {stat.trend === "up" ? "↗" : "↘"} {stat.change}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      vs. hier
                    </span>
                  </div>
                </div>
              </CardContent>
              <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Card>
          );
        })}
      </div>

      {/* Canal Distribution & Équipe */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span>Répartition par Canal</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {mockChannelDistribution.map((channel, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 bg-${channel.color} rounded-full`}></div>
                    <span className="text-sm font-medium">{channel.channel}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-bold">{channel.count}</div>
                    <Badge variant="outline" className="text-xs">{channel.percentage}%</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-accent" />
              <span>Équipe Active</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {mockTeamMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent-light rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-accent">{member.avatar}</span>
                    </div>
                    <div>
                      <div className="text-sm font-medium">{member.name}</div>
                      <div className="text-xs text-muted-foreground">{member.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      member.status === 'online' ? 'bg-accent' :
                      member.status === 'busy' ? 'bg-warning' : 'bg-secondary'
                    }`}></div>
                    <span className={`text-xs ${
                      member.status === 'online' ? 'text-accent' :
                      member.status === 'busy' ? 'text-warning' : 'text-secondary'
                    }`}>
                      {member.status === 'online' ? 'En ligne' :
                       member.status === 'busy' ? 'Occupé' : 'Hors ligne'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
