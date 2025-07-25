import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  Settings, 
  MessageSquareText,
  Zap,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  senderName: string;
}

interface Conversation {
  id: string;
  guestName: string;
  property: string;
  channel: 'whatsapp' | 'email' | 'beds24';
  status: 'new' | 'active' | 'waiting' | 'resolved';
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

interface AIChatProps {
  conversation?: Conversation;
  messages: Message[];
}

const suggestedResponses = [
  "Merci pour votre demande. Je traite votre question...",
  "Pouvez-vous préciser votre demande ?",
  "Je vous envoie les informations par email.",
  "Votre demande a été transmise à notre équipe."
];

const aiInsights = [
  {
    type: 'info',
    icon: CheckCircle,
    title: 'Réponse automatique',
    message: 'IA a répondu aux questions basiques'
  },
  {
    type: 'warning',
    icon: AlertTriangle,
    title: 'Escalade recommandée',
    message: 'Demande complexe détectée'
  },
  {
    type: 'success',
    icon: Zap,
    title: 'Réponse rapide',
    message: 'Temps de réponse: 2 secondes'
  }
];

export const AIChat = ({ conversation, messages }: AIChatProps) => {
  const [selectedSuggestion, setSelectedSuggestion] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full">
      {/* AI Header */}
      <div className="p-4 border-b bg-gradient-to-r from-accent/20 to-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-accent text-accent-foreground">
                <Bot className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">Assistant IA</div>
              <div className="text-xs text-muted-foreground">Actif</div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 space-y-4">
        {/* AI Messages */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center space-x-2">
              <MessageSquareText className="h-4 w-4" />
              <span>Messages IA</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className="flex items-start space-x-2 fade-in-stagger"
                style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
              >
                <Avatar className="w-6 h-6">
                  <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                    <Bot className="h-3 w-3" />
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="bg-accent/10 rounded-lg p-2 text-xs">
                    {message.content}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Suggested Responses */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Réponses suggérées</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedResponses.map((response, index) => (
              <Button
                key={index}
                variant={selectedSuggestion === response ? "default" : "outline"}
                size="sm"
                className="w-full text-xs justify-start h-auto p-2 hover:scale-[1.02] transition-all"
                onClick={() => setSelectedSuggestion(response)}
              >
                {response}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Aperçus IA</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {aiInsights.map((insight, index) => (
              <div
                key={index}
                className="flex items-start space-x-2 p-2 rounded-lg bg-muted/30 fade-in-stagger"
                style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
              >
                <insight.icon className={`h-4 w-4 mt-0.5 ${
                  insight.type === 'warning' ? 'text-warning' :
                  insight.type === 'success' ? 'text-success' :
                  'text-info'
                }`} />
                <div className="flex-1">
                  <div className="text-xs font-medium">{insight.title}</div>
                  <div className="text-xs text-muted-foreground">{insight.message}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Conversation Stats */}
        {conversation && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Statistiques</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span>Priorité:</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    conversation.priority === 'urgent' ? 'border-danger text-danger' :
                    conversation.priority === 'high' ? 'border-warning text-warning' :
                    'border-muted-foreground text-muted-foreground'
                  }`}
                >
                  {conversation.priority}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Statut:</span>
                <Badge variant="secondary" className="text-xs">
                  {conversation.status}
                </Badge>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Messages IA:</span>
                <span className="font-medium">{messages.length}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </ScrollArea>
    </div>
  );
};