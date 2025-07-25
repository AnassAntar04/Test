import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Bot, 
  MessageSquare, 
  Users, 
  Settings, 
  Bell, 
  Shield, 
  AlertTriangle,
  UserCog
} from "lucide-react";
import { UserManagement } from "@/components/UserManagement";
import { ChatbotsSettings } from "@/components/settings/ChatbotsSettings";
import { AutoMessagesSettings } from "@/components/settings/AutoMessagesSettings";
import { EscalationSettings } from "@/components/settings/EscalationSettings";
import { IntegrationsSettings } from "@/components/settings/IntegrationsSettings";
import { NotificationsSettings } from "@/components/settings/NotificationsSettings";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { RolePrivilegesManagement } from "@/components/role-management/RolePrivilegesManagement";
import { RoleManagement } from "@/components/role-management/RoleManagement";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const [activeTab, setActiveTab] = useState("chatbots");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b shrink-0 bg-background">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-2xl font-bold">Paramètres Système</h2>
              <p className="text-muted-foreground">Configuration complète SynergyAI Connect</p>
            </div>
          </div>
          <Button variant="outline" onClick={onClose} className="shrink-0">
            Fermer
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden bg-background">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex">
            <TabsList className="flex flex-col h-full w-64 justify-start p-2 bg-muted/50 shrink-0 rounded-none border-r">
              <TabsTrigger value="chatbots" className="w-full justify-start mb-1">
                <Bot className="mr-2 h-4 w-4" />
                Chatbots
              </TabsTrigger>
              <TabsTrigger value="messages" className="w-full justify-start mb-1">
                <MessageSquare className="mr-2 h-4 w-4" />
                Messages Auto
              </TabsTrigger>
              <TabsTrigger value="escalation" className="w-full justify-start mb-1">
                <AlertTriangle className="mr-2 h-4 w-4" />
                Escalade & Routage
              </TabsTrigger>
              <TabsTrigger value="users" className="w-full justify-start mb-1">
                <Users className="mr-2 h-4 w-4" />
                Utilisateurs
              </TabsTrigger>
              <TabsTrigger value="roles" className="w-full justify-start mb-1">
                <UserCog className="mr-2 h-4 w-4" />
                Gestion Rôles
              </TabsTrigger>
              <TabsTrigger value="privileges" className="w-full justify-start mb-1">
                <Shield className="mr-2 h-4 w-4" />
                Privilèges
              </TabsTrigger>
              <TabsTrigger value="integrations" className="w-full justify-start mb-1">
                <Shield className="mr-2 h-4 w-4" />
                Intégrations
              </TabsTrigger>
              <TabsTrigger value="notifications" className="w-full justify-start mb-1">
                <Bell className="mr-2 h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="general" className="w-full justify-start mb-1">
                <Settings className="mr-2 h-4 w-4" />
                Général
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-w-0 overflow-y-auto bg-background">
              <div className="p-6">
                <TabsContent value="chatbots" className="space-y-6 m-0">
                  <ChatbotsSettings />
                </TabsContent>
                <TabsContent value="messages" className="space-y-6 m-0">
                  <AutoMessagesSettings />
                </TabsContent>
                <TabsContent value="escalation" className="space-y-6 m-0">
                  <EscalationSettings />
                </TabsContent>
                <TabsContent value="users" className="space-y-6 m-0">
                  <UserManagement />
                </TabsContent>
                <TabsContent value="roles" className="space-y-6 m-0">
                  <RoleManagement />
                </TabsContent>
                <TabsContent value="privileges" className="space-y-6 m-0">
                  <RolePrivilegesManagement />
                </TabsContent>
                <TabsContent value="integrations" className="space-y-6 m-0">
                  <IntegrationsSettings />
                </TabsContent>
                <TabsContent value="notifications" className="space-y-6 m-0">
                  <NotificationsSettings />
                </TabsContent>
                <TabsContent value="general" className="space-y-6 m-0">
                  <GeneralSettings />
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

// All settings components are now in separate files