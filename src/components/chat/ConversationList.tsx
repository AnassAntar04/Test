import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Clock } from "lucide-react";

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

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (id: string) => void;
}

export const ConversationList = ({ 
  conversations, 
  selectedConversationId, 
  onSelectConversation 
}: ConversationListProps) => {
  const getChannelBadge = (channel: string) => {
    const configs = {
      whatsapp: { color: 'bg-accent text-accent-foreground', label: 'WhatsApp' },
      email: { color: 'bg-warning text-warning-foreground', label: 'Email' },
      beds24: { color: 'bg-primary text-primary-foreground', label: 'Beds24' }
    };
    const config = configs[channel as keyof typeof configs];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  return (
    <>
      {/* Search Header */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Rechercher conversations..." 
            className="pl-10 transition-all focus:scale-[1.02]"
          />
        </div>
      </div>
      
      {/* Conversations */}
      <ScrollArea className="h-full">
        <div className="p-2">
          {conversations.map((conv, index) => (
            <div
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-300 mb-2 hover:scale-[1.02] hover:shadow-sm fade-in-stagger ${
                selectedConversationId === conv.id 
                  ? 'bg-primary text-primary-foreground shadow-md scale-105' 
                  : 'hover:bg-muted'
              }`}
              style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="font-medium text-sm">{conv.guestName}</div>
                  {conv.unreadCount > 0 && (
                    <Badge variant="destructive" className="text-xs px-1.5 py-0 bounce-in">
                      {conv.unreadCount}
                    </Badge>
                  )}
                </div>
                <div className="hover:scale-110 transition-transform">
                  {getChannelBadge(conv.channel)}
                </div>
              </div>
              
              <div className="text-xs opacity-80 mb-2">{conv.property}</div>
              
              <div className="text-sm opacity-90 line-clamp-2 mb-2">
                {conv.lastMessage}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs opacity-70">
                  <Clock className="h-3 w-3" />
                  <span>{conv.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs transition-all hover:scale-105 ${
                    conv.priority === 'urgent' ? 'border-danger text-danger pulse-gentle' :
                    conv.priority === 'high' ? 'border-warning text-warning' :
                    'border-muted-foreground text-muted-foreground'
                  }`}
                >
                  {conv.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};