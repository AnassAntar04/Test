import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MessageSquare, BarChart3, Settings, Bell, Users, Bot, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionGate } from "@/components/PermissionGate";
import { ROLE_LABELS } from "@/constants/roles";

interface NavigationProps {
  activeTab: "dashboard" | "chat" | "analytics";
  onTabChange: (tab: "dashboard" | "chat" | "analytics") => void;
  isSettingsOpen: boolean;
  onSettingsToggle: (open: boolean) => void;
}

// export const Navigation = ({ activeTab, onTabChange, isSettingsOpen, onSettingsToggle }: NavigationProps) => {
//   const { user, userRole, signOut } = useAuth();
//   const { hasPermission } = usePermissions();

//   const handleSignOut = async () => {
//     await signOut();
//   };

//   return (
//     <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center space-x-3 fade-in">
//             <div className="bg-gradient-primary p-2 rounded-lg glow-pulse">
//               <Bot className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h1 className="font-bold text-lg">SynergyAI Connect</h1>
//               <p className="text-xs text-muted-foreground">Samy Conciergerie</p>
//             </div>
//           </div>

//           {/* Navigation Tabs */}
//           <div className="hidden md:flex items-center space-x-1">
//             <PermissionGate permission="dashboard.view">
//               <Button
//                 variant={activeTab === "dashboard" ? "default" : "ghost"}
//                 onClick={() => onTabChange("dashboard")}
//                 className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 ${
//                   activeTab === "dashboard" ? "shadow-md scale-105" : ""
//                 }`}
//               >
//                 <BarChart3 className="h-4 w-4" />
//                 <span>Dashboard</span>
//               </Button>
//             </PermissionGate>

//             <PermissionGate permission="conversation:view">
//               <Button
//                 variant={activeTab === "chat" ? "default" : "ghost"}
//                 onClick={() => onTabChange("chat")}
//                 className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 relative ${
//                   activeTab === "chat" ? "shadow-md scale-105" : ""
//                 }`}
//               >
//                 <MessageSquare className="h-4 w-4" />
//                 <span>Chat Central</span>
//                 <Badge variant="secondary" className="ml-1 hover:scale-110 transition-transform">12</Badge>
//                 <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full pulse-gentle"></div>
//               </Button>
//             </PermissionGate>

//             <PermissionGate permission="analytics.view">
//               <Button
//                 variant={activeTab === "analytics" ? "default" : "ghost"}
//                 onClick={() => onTabChange("analytics")}
//                 className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 ${
//                   activeTab === "analytics" ? "shadow-md scale-105" : ""
//                 }`}
//               >
//                 <BarChart3 className="h-4 w-4" />
//                 <span>Analytics</span>
//               </Button>
//             </PermissionGate>
//           </div>

//           {/* Right Actions */}
//           <div className="flex items-center space-x-2 fade-in-delayed">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <Button variant="ghost" size="sm" className="relative hover:scale-110 transition-transform">
//                   <Bell className="h-4 w-4" />
//                   <Badge variant="destructive" className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center animate-pulse">
//                     3
//                   </Badge>
//                 </Button>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent align="end" className="w-80">
//                 <div className="p-3 border-b">
//                   <h3 className="font-semibold">Notifications</h3>
//                   <p className="text-xs text-muted-foreground">3 nouvelles notifications</p>
//                 </div>
//                 <div className="max-h-64 overflow-y-auto">
//                   <DropdownMenuItem className="flex flex-col items-start p-3 space-y-1">
//                     <div className="flex items-center justify-between w-full">
//                       <span className="font-medium text-sm">Nouveau message</span>
//                       <span className="text-xs text-muted-foreground">il y a 2min</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground">Client urgent attend une réponse</p>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="flex flex-col items-start p-3 space-y-1">
//                     <div className="flex items-center justify-between w-full">
//                       <span className="font-medium text-sm">Escalade requise</span>
//                       <span className="text-xs text-muted-foreground">il y a 5min</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground">Conversation complexe nécessite un expert</p>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem className="flex flex-col items-start p-3 space-y-1">
//                     <div className="flex items-center justify-between w-full">
//                       <span className="font-medium text-sm">Système connecté</span>
//                       <span className="text-xs text-muted-foreground">il y a 10min</span>
//                     </div>
//                     <p className="text-xs text-muted-foreground">N8N workflow activé avec succès</p>
//                   </DropdownMenuItem>
//                 </div>
//                 <div className="p-2 border-t">
//                   <Button variant="ghost" size="sm" className="w-full text-xs">
//                     Voir toutes les notifications
//                   </Button>
//                 </div>
//               </DropdownMenuContent>
//             </DropdownMenu>

//             <PermissionGate permission="settings.view">
//               <Button
//                 variant="ghost"
//                 size="sm"
//                 className="hover:scale-110 transition-transform"
//                 onClick={() => onSettingsToggle(true)}
//               >
//                 <Settings className="h-4 w-4" />
//               </Button>
//             </PermissionGate>

//             {/* User Menu */}
//             <div className="hidden sm:flex items-center space-x-2 pl-4 border-l">
//               <div className="w-2 h-2 bg-accent rounded-full pulse-gentle"></div>
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" size="sm" className="flex items-center space-x-2">
//                     <User className="h-4 w-4" />
//                     <span className="text-sm font-medium">
//                       {user?.user_metadata?.first_name || user?.email?.split('@')[0]}
//                     </span>
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuItem disabled>
//                     <span className="text-xs text-muted-foreground">
//                       {userRole ? ROLE_LABELS[userRole] : 'Utilisateur'}
//                     </span>
//                   </DropdownMenuItem>
//                   <DropdownMenuItem onClick={handleSignOut}>
//                     <LogOut className="h-4 w-4 mr-2" />
//                     Se déconnecter
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         <div className="md:hidden flex items-center justify-around py-2 border-t">
//           <PermissionGate permission="dashboard.view">
//             <Button
//               variant={activeTab === "dashboard" ? "default" : "ghost"}
//               size="sm"
//               onClick={() => onTabChange("dashboard")}
//               className="flex-1 transition-all hover:scale-105"
//             >
//               <BarChart3 className="h-4 w-4" />
//             </Button>
//           </PermissionGate>

//           <PermissionGate permission="chat.view">
//             <Button
//               variant={activeTab === "chat" ? "default" : "ghost"}
//               size="sm"
//               onClick={() => onTabChange("chat")}
//               className="flex-1 relative transition-all hover:scale-105"
//             >
//               <MessageSquare className="h-4 w-4" />
//               <Badge variant="secondary" className="absolute -top-1 -right-1 w-4 h-4 text-xs p-0">12</Badge>
//             </Button>
//           </PermissionGate>

//           <PermissionGate permission="analytics.view">
//             <Button
//               variant={activeTab === "analytics" ? "default" : "ghost"}
//               size="sm"
//               onClick={() => onTabChange("analytics")}
//               className="flex-1 transition-all hover:scale-105"
//             >
//               <BarChart3 className="h-4 w-4" />
//             </Button>
//           </PermissionGate>
//         </div>
//       </div>
//     </nav>
//   );
// };

// … imports inchangés …

export const Navigation = ({
  activeTab,
  onTabChange,
  isSettingsOpen,
  onSettingsToggle
}: NavigationProps) => {
  const { user, userRole, signOut } = useAuth();
  const { hasPermission } = usePermissions();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 fade-in">
            <div className="bg-gradient-primary p-2 rounded-lg glow-pulse">
              <Bot className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg">SynergyAI Connect</h1>
              <p className="text-xs text-muted-foreground">Samy Conciergerie</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="hidden md:flex items-center space-x-1">
            <PermissionGate permission="organisation:view">
              <Button
                variant={activeTab === "dashboard" ? "default" : "ghost"}
                onClick={() => onTabChange("dashboard")}
                className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 ${
                  activeTab === "dashboard" ? "shadow-md scale-105" : ""
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Button>
            </PermissionGate>

            <PermissionGate permission="conversation:view">
              <Button
                variant={activeTab === "chat" ? "default" : "ghost"}
                onClick={() => onTabChange("chat")}
                className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 relative ${
                  activeTab === "chat" ? "shadow-md scale-105" : ""
                }`}
              >
                <MessageSquare className="h-4 w-4" />
                <span>Chat Central</span>
                <Badge
                  variant="secondary"
                  className="ml-1 hover:scale-110 transition-transform"
                >
                  12
                </Badge>
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full pulse-gentle"></div>
              </Button>
            </PermissionGate>

            <PermissionGate permission="integration_configs:view">
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                onClick={() => onTabChange("analytics")}
                className={`flex items-center space-x-2 transition-all duration-300 hover:scale-105 ${
                  activeTab === "analytics" ? "shadow-md scale-105" : ""
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </Button>
            </PermissionGate>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 fade-in-delayed">
            {/* Notification menu (unchanged) */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative hover:scale-110 transition-transform"
                >
                  <Bell className="h-4 w-4" />
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center animate-pulse"
                  >
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                {/* ... Notification items ... */}
              </DropdownMenuContent>
            </DropdownMenu>

            <PermissionGate permission="chatbot_configs:view">
              <Button
                variant="ghost"
                size="sm"
                className="hover:scale-110 transition-transform"
                onClick={() => onSettingsToggle(true)}
              >
                <Settings className="h-4 w-4" />
              </Button>
            </PermissionGate>

            {/* User Menu */}
            <div className="hidden sm:flex items-center space-x-2 pl-4 border-l">
              <div className="w-2 h-2 bg-accent rounded-full pulse-gentle"></div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {user?.user_metadata?.first_name ||
                        user?.email?.split("@")[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <span className="text-xs text-muted-foreground">
                      {userRole ? ROLE_LABELS[userRole] : "Utilisateur"}
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Se déconnecter
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center justify-around py-2 border-t">
          <PermissionGate permission="organisation:view">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("dashboard")}
              className="flex-1 transition-all hover:scale-105"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </PermissionGate>

          <PermissionGate permission="conversation:view">
            <Button
              variant={activeTab === "chat" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("chat")}
              className="flex-1 relative transition-all hover:scale-105"
            >
              <MessageSquare className="h-4 w-4" />
              <Badge
                variant="secondary"
                className="absolute -top-1 -right-1 w-4 h-4 text-xs p-0"
              >
                12
              </Badge>
            </Button>
          </PermissionGate>

          <PermissionGate permission="integration_configs:view">
            <Button
              variant={activeTab === "analytics" ? "default" : "ghost"}
              size="sm"
              onClick={() => onTabChange("analytics")}
              className="flex-1 transition-all hover:scale-105"
            >
              <BarChart3 className="h-4 w-4" />
            </Button>
          </PermissionGate>
        </div>
      </div>
    </nav>
  );
};
