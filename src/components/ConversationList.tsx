import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { 
  MessageSquare, 
  Clock, 
  User, 
  Calendar,
  Filter,
  Search,
  ArrowRight,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { Conversation, ConversationState, JourneyPhase, CONVERSATION_STATES, JOURNEY_PHASES } from "@/types/conversation";

interface ConversationListProps {
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  selectedConversationId?: string;
}

export const ConversationList = ({ conversations, onSelectConversation, selectedConversationId }: ConversationListProps) => {
  const [filterState, setFilterState] = useState<ConversationState | "all">("all");
  const [filterPhase, setFilterPhase] = useState<JourneyPhase | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredConversations = conversations.filter(conv => {
    const matchesState = filterState === "all" || conv.state === filterState;
    const matchesPhase = filterPhase === "all" || conv.phase === filterPhase;
    const matchesSearch = searchTerm === "" || 
      conv.travelerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesState && matchesPhase && matchesSearch;
  });

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent": return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "high": return <AlertCircle className="h-4 w-4 text-warning" />;
      default: return null;
    }
  };

  const getStateColor = (state: ConversationState) => {
    return CONVERSATION_STATES[state]?.color || "secondary";
  };

  const getPhaseColor = (phase: JourneyPhase) => {
    return JOURNEY_PHASES[phase]?.color || "secondary";
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "À l'instant";
    if (diffInMinutes < 60) return `${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}j`;
  };

  return (
    <div className="space-y-4">
      {/* Filtres */}
      <Card className="dashboard-card">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center space-x-2 text-base">
            <Filter className="h-4 w-4" />
            <span>Filtres</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <Select value={filterState} onValueChange={(value) => setFilterState(value as ConversationState | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="État" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les états</SelectItem>
                  {Object.entries(CONVERSATION_STATES).map(([state, config]) => (
                    <SelectItem key={state} value={state}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Select value={filterPhase} onValueChange={(value) => setFilterPhase(value as JourneyPhase | "all")}>
                <SelectTrigger>
                  <SelectValue placeholder="Phase" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les phases</SelectItem>
                  {Object.entries(JOURNEY_PHASES).map(([phase, config]) => (
                    <SelectItem key={phase} value={phase}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Rechercher..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>{filteredConversations.length} conversations affichées</span>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                <span>Urgent</span>
              </span>
              <span className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-warning rounded-full"></div>
                <span>Priorité haute</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des conversations */}
      <div className="space-y-3">
        {filteredConversations.map((conversation) => (
          <Card 
            key={conversation.id}
            className={`dashboard-card cursor-pointer transition-all hover:shadow-md ${
              selectedConversationId === conversation.id ? 'border-2 border-primary bg-primary-light' : ''
            }`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between space-x-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center space-x-1">
                      {getPriorityIcon(conversation.priority)}
                      <h4 className="font-semibold truncate">{conversation.travelerName}</h4>
                    </div>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{conversation.propertyName}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {conversation.lastMessage}
                  </p>
                  
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    <Badge variant="outline" className={`bg-${getStateColor(conversation.state)}-light text-${getStateColor(conversation.state)}`}>
                      {CONVERSATION_STATES[conversation.state]?.label}
                    </Badge>
                    <Badge variant="outline" className={`bg-${getPhaseColor(conversation.phase)}-light text-${getPhaseColor(conversation.phase)}`}>
                      {JOURNEY_PHASES[conversation.phase]?.label}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {conversation.channel}
                    </Badge>
                    {conversation.hasChildren && (
                      <Badge variant="outline" className="text-xs bg-accent-light text-accent">
                        Avec enfants
                      </Badge>
                    )}
                    {conversation.isRecurrent && (
                      <Badge variant="outline" className="text-xs bg-success-light text-success">
                        Client fidèle
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2 text-right">
                  <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(conversation.lastActivity)}</span>
                  </div>
                  
                  <div className="text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1 mb-1">
                      <Calendar className="h-3 w-3" />
                      <span>{conversation.arrivalDate.toLocaleDateString('fr-FR')}</span>
                    </div>
                    {conversation.assignedAgent && (
                      <div className="flex items-center space-x-1">
                        <User className="h-3 w-3" />
                        <span>{conversation.assignedAgent}</span>
                      </div>
                    )}
                  </div>
                  
                  {conversation.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 justify-end">
                      {conversation.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {conversation.tags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{conversation.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {filteredConversations.length === 0 && (
          <Card className="dashboard-card">
            <CardContent className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune conversation trouvée</h3>
              <p className="text-muted-foreground">
                Aucune conversation ne correspond aux critères de recherche sélectionnés.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};