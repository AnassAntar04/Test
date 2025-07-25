import { useState } from "react";
import { ConversationList } from "./ConversationList";
import { HumanChat } from "./HumanChat";
import { AIChat } from "./AIChat";
import { Button } from "@/components/ui/button";
import { Bot, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { mockConversations, getMockMessagesForConversation } from "@/mocks/conversations";

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

export const ChatLayout = () => {
  const [selectedConversation, setSelectedConversation] = useState<string>('conv-0');
  const [messages, setMessages] = useState(() => getMockMessagesForConversation('conv-0'));
  const [showAIPanel, setShowAIPanel] = useState(true);

  const selectedConv = mockConversations.find(c => c.id === selectedConversation);

  const humanMessages = messages.filter(m => m.sender !== 'bot');
  const aiMessages = messages.filter(m => m.sender === 'bot');

  const handleConversationSelect = (id: string) => {
    setSelectedConversation(id);
    setMessages(getMockMessagesForConversation(id));
  };

  return (
    <div className="relative">
      {/* AI Panel Toggle */}
      <div className="absolute top-2 right-2 z-20">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAIPanel(!showAIPanel)}
          className="bg-background/80 backdrop-blur-sm hover:scale-110 transition-all shadow-md"
          title={showAIPanel ? "Masquer le panneau IA" : "Afficher le panneau IA"}
        >
          <Bot className="h-4 w-4 mr-1" />
          {showAIPanel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </Button>
      </div>

      <div className="h-[calc(100vh-200px)] flex bg-card rounded-xl shadow-lg overflow-hidden fade-in">
        {/* Left Panel - Conversations List */}
        <div className={`${showAIPanel ? 'w-[30%]' : 'w-[35%]'} border-r bg-muted/30 transition-all duration-300`}>
          <ConversationList
            conversations={mockConversations}
            selectedConversationId={selectedConversation}
            onSelectConversation={handleConversationSelect}
          />
        </div>

        {/* Center Panel - Human Chat */}
        <div className={`${showAIPanel ? 'flex-1' : 'w-[65%]'} border-r transition-all duration-300`}>
          <HumanChat
            conversation={selectedConv}
            messages={humanMessages}
            onMessagesUpdate={(updater) => setMessages(updater)}
          />
        </div>

        {/* Right Panel - AI Chat */}
        {showAIPanel && (
          <div className="w-[25%] flex flex-col">
            <AIChat
              conversation={selectedConv}
              messages={aiMessages}
            />
          </div>
        )}
      </div>
    </div>
  );
};
