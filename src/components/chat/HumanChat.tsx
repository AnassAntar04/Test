import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Phone, 
  Video,
  MessageSquare,
  User,
  Check,
  CheckCheck
} from "lucide-react";
import { FileUpload } from "./FileUpload";
import { AttachmentDisplay } from "./AttachmentDisplay";

interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageUrl: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent' | 'bot';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  senderName: string;
  attachments?: Attachment[];
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

interface HumanChatProps {
  conversation?: Conversation;
  messages: Message[];
  onMessagesUpdate: (updater: (prev: Message[]) => Message[]) => void;
}

export const HumanChat = ({ conversation, messages, onMessagesUpdate }: HumanChatProps) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: newMessage,
      sender: 'agent',
      timestamp: new Date(),
      status: 'sent',
      senderName: 'Marie Dubois'
    };

    onMessagesUpdate(prev => [...prev, userMessage]);
    setNewMessage('');
  };

  const handleFileUploaded = (attachment: Attachment) => {
    const fileMessage: Message = {
      id: Date.now().toString(),
      content: `📎 ${attachment.fileName}`,
      sender: 'agent',
      timestamp: new Date(),
      status: 'sent',
      senderName: 'Marie Dubois',
      attachments: [attachment]
    };

    onMessagesUpdate(prev => [...prev, fileMessage]);
  };

  const getChannelBadge = (channel: string) => {
    const configs = {
      whatsapp: { color: 'bg-accent text-accent-foreground', label: 'WhatsApp' },
      email: { color: 'bg-warning text-warning-foreground', label: 'Email' },
      beds24: { color: 'bg-primary text-primary-foreground', label: 'Beds24' }
    };
    const config = configs[channel as keyof typeof configs];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent': return <Check className="h-3 w-3 text-muted-foreground" />;
      case 'delivered': return <CheckCheck className="h-3 w-3 text-muted-foreground" />;
      case 'read': return <CheckCheck className="h-3 w-3 text-accent" />;
      default: return null;
    }
  };

  const getSenderIcon = (sender: string) => {
    switch (sender) {
      case 'user': return <User className="h-4 w-4" />;
      case 'agent': return <MessageSquare className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      {conversation && (
        <div className="p-4 border-b bg-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {conversation.guestName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{conversation.guestName}</div>
                <div className="text-sm text-muted-foreground flex items-center space-x-2">
                  <span>{conversation.property}</span>
                  <Separator orientation="vertical" className="h-3" />
                  {getChannelBadge(conversation.channel)}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 fade-in-stagger ${
                message.sender === 'agent' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
              style={{ '--delay': `${index * 0.1}s` } as React.CSSProperties}
            >
              <Avatar className="w-8 h-8 hover:scale-110 transition-transform">
                <AvatarFallback className={`text-xs ${
                  message.sender === 'user' ? 'bg-secondary text-secondary-foreground' :
                  'bg-primary text-primary-foreground'
                }`}>
                  {getSenderIcon(message.sender)}
                </AvatarFallback>
              </Avatar>
              
              <div className={`flex flex-col max-w-xs lg:max-w-md ${
                message.sender === 'agent' ? 'items-end' : 'items-start'
              }`}>
                <div className="text-xs text-muted-foreground mb-1">
                  {message.senderName}
                </div>
                
                {message.content && (
                  <div className={`chat-bubble transition-all hover:scale-[1.02] ${
                    message.sender === 'user' ? 'chat-bubble-agent slide-in-right' :
                    'chat-bubble-user bounce-in' 
                  }`}>
                    {message.content}
                  </div>
                )}
                
                {/* Attachments */}
                {message.attachments && message.attachments.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {message.attachments.map((attachment) => (
                      <AttachmentDisplay
                        key={attachment.id}
                        fileName={attachment.fileName}
                        fileType={attachment.fileType}
                        fileSize={attachment.fileSize}
                        storageUrl={attachment.storageUrl}
                        className={message.sender === 'agent' ? 'ml-auto' : ''}
                      />
                    ))}
                  </div>
                )}
                
                <div className="flex items-center space-x-1 mt-1 text-xs text-muted-foreground">
                  <span>{message.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  {message.sender === 'agent' && (
                    <div className="hover:scale-125 transition-transform">
                      {getStatusIcon(message.status)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="p-4 border-t bg-card">
        <div className="flex items-center space-x-2">
          <FileUpload onFileUploaded={handleFileUploaded} />
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="flex-1 transition-all focus:scale-[1.02]"
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim()}
            className="hover:scale-110 transition-all glow-pulse"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};