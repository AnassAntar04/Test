// import { useState } from "react";
// import { ChatInterface } from "@/components/ChatInterface";
// import { Navigation } from "@/components/Navigation";
// import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
// import { HeroSection } from "@/components/HeroSection";
// import { DashboardView } from "@/components/DashboardView";
// import { SettingsPanel } from "@/components/SettingsPanel";
// import { PermissionGate } from "@/components/PermissionGate";
// import { UnauthorizedAccess } from "@/components/UnauthorizedAccess";
// import { usePermissions } from "@/hooks/usePermissions";
// import { PermissionsDebugPanel } from "@/components/debug/PermissionsDebugPanel";

// const Index = () => {
//   const [activeTab, setActiveTab] = useState<"dashboard" | "chat" | "analytics">("dashboard");
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [showDebugPanel, setShowDebugPanel] = useState(false);
//   const { hasPermission, permissions } = usePermissions();

//   // Check if user has permission to view the current tab
//   const getTabPermission = (tab: string) => {
//     switch (tab) {
//       case "dashboard": return "dashboard.view";
//       case "chat": return "conversation:view";
//       case "analytics": return "analytics.view";
//       default: return "dashboard.view";
//     }
//   };

//   // Redirect to a tab the user has permission for
//   const getDefaultTab = (): "dashboard" | "chat" | "analytics" => {
//     if (hasPermission("dashboard.view")) return "dashboard";
//     if (hasPermission("conversation:view")) return "chat";
//     if (hasPermission("analytics.view")) return "analytics";
//     return "dashboard"; // fallback
//   };

//   // If user doesn't have permission for current tab, switch to allowed tab
//   const currentTabPermission = getTabPermission(activeTab);
//   if (!hasPermission(currentTabPermission)) {
//     const defaultTab = getDefaultTab();
//     if (activeTab !== defaultTab) {
//       setActiveTab(defaultTab);
//     }
//   }

//   console.log('Current permissions:', permissions);
//   console.log('Active tab:', activeTab);
//   console.log('Current tab permission:', currentTabPermission);

//   return (

//     <div className="min-h-screen bg-gradient-dashboard">
//       <Navigation
//         activeTab={activeTab}
//         onTabChange={setActiveTab}
//         isSettingsOpen={isSettingsOpen}
//         onSettingsToggle={setIsSettingsOpen}
//       />

//       {isSettingsOpen ? (
//         <PermissionGate
//           permission="settings.view"
//           fallback={
//             <UnauthorizedAccess
//               title="Paramètres non autorisés"
//               message="Vous n'avez pas les privilèges pour accéder aux paramètres."
//               requiredPermission="settings.view"
//               onGoBack={() => setIsSettingsOpen(false)}
//             />
//           }
//         >
//           <SettingsPanel
//             isOpen={isSettingsOpen}
//             onClose={() => setIsSettingsOpen(false)}
//           />
//         </PermissionGate>
//       ) : (
//         <>
//           <HeroSection onTabChange={setActiveTab} />
//           <div className="container mx-auto px-4 py-12">
//             {/* Debug Panel - Visible only for admins */}
//             <PermissionGate permission="settings.manage" fallback={null}>
//               <div className="mb-6">
//                 <button
//                   onClick={() => setShowDebugPanel(!showDebugPanel)}
//                   className="text-xs text-muted-foreground hover:text-foreground underline"
//                 >
//                   {showDebugPanel ? 'Masquer' : 'Afficher'} le debug des permissions
//                 </button>
//                 {showDebugPanel && (
//                   <div className="mt-4">
//                     <PermissionsDebugPanel />
//                   </div>
//                 )}
//               </div>
//             </PermissionGate>
//             <PermissionGate
//               permission="dashboard.view"
//               fallback={
//                 <UnauthorizedAccess
//                   title="Dashboard non autorisé"
//                   message="Vous n'avez pas les privilèges pour accéder au tableau de bord."
//                   requiredPermission="dashboard.view"
//                 />
//               }
//             >
//               {activeTab === "dashboard" && <DashboardView />}
//             </PermissionGate>

//             <PermissionGate
//               permission="conversation:view"
//               fallback={
//                 <UnauthorizedAccess
//                   title="Chat non autorisé"
//                   message="Vous n'avez pas les privilèges pour accéder au chat."
//                   requiredPermission="conversation:view"
//                 />
//               }
//             >
//               {activeTab === "chat" && <ChatInterface />}
//             </PermissionGate>

//             <PermissionGate
//               permission="analytics.view"
//               fallback={
//                 <UnauthorizedAccess
//                   title="Analytics non autorisé"
//                   message="Vous n'avez pas les privilèges pour accéder aux analyses."
//                   requiredPermission="analytics.view"
//                 />
//               }
//             >
//               {activeTab === "analytics" && <AnalyticsDashboard />}
//             </PermissionGate>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Index;

import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { Navigation } from "@/components/Navigation";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";
import { HeroSection } from "@/components/HeroSection";
import { DashboardView } from "@/components/DashboardView";
import { SettingsPanel } from "@/components/SettingsPanel";
import { PermissionGate } from "@/components/PermissionGate";
import { UnauthorizedAccess } from "@/components/UnauthorizedAccess";
import { usePermissions } from "@/hooks/usePermissions";
import { PermissionsDebugPanel } from "@/components/debug/PermissionsDebugPanel";

const Index = () => {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "chat" | "analytics"
  >("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const { hasPermission, permissions } = usePermissions();

  const getTabPermission = (tab: string) => {
    switch (tab) {
      case "dashboard":
        return "organisation:view";
      case "chat":
        return "conversation:view";
      case "analytics":
        return "integration_configs:view";
      default:
        return "organisation:view";
    }
  };

  const getDefaultTab = (): "dashboard" | "chat" | "analytics" => {
    if (hasPermission("organisation:view")) return "dashboard";
    if (hasPermission("conversation:view")) return "chat";
    if (hasPermission("integration_configs:view")) return "analytics";
    return "dashboard";
  };

  const currentTabPermission = getTabPermission(activeTab);
  if (!hasPermission(currentTabPermission)) {
    const defaultTab = getDefaultTab();
    if (activeTab !== defaultTab) {
      setActiveTab(defaultTab);
    }
  }

  // console.log("Current permissions:", permissions);
  // console.log("Active tab:", activeTab);
  // console.log("Current tab permission:", currentTabPermission);

  return (
    <div className="min-h-screen bg-gradient-dashboard">
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isSettingsOpen={isSettingsOpen}
        onSettingsToggle={setIsSettingsOpen}
      />

      {isSettingsOpen ? (
        <PermissionGate
          permission="chatbot_configs:view"
          fallback={
            <UnauthorizedAccess
              title="Paramètres non autorisés"
              message="Vous n'avez pas les privilèges pour accéder aux paramètres."
              requiredPermission="chatbot_configs:view"
              onGoBack={() => setIsSettingsOpen(false)}
            />
          }
        >
          <SettingsPanel
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
          />
        </PermissionGate>
      ) : (
        <>
          <HeroSection onTabChange={setActiveTab} />
          <div className="container mx-auto px-4 py-12">
            {/* Debug Panel - Visible only for admins */}
            <PermissionGate permission="chatbot_configs:update" fallback={null}>
              <div className="mb-6">
                <button
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                  className="text-xs text-muted-foreground hover:text-foreground underline"
                >
                  {showDebugPanel ? "Masquer" : "Afficher"} le debug des
                  permissions
                </button>
                {showDebugPanel && (
                  <div className="mt-4">
                    <PermissionsDebugPanel />
                  </div>
                )}
              </div>
            </PermissionGate>

            <PermissionGate
              permission="organisation:view"
              fallback={
                <UnauthorizedAccess
                  title="Dashboard non autorisé"
                  message="Vous n'avez pas les privilèges pour accéder au tableau de bord."
                  requiredPermission="organisation:view"
                />
              }
            >
              {activeTab === "dashboard" && <DashboardView />}
            </PermissionGate>

            <PermissionGate
              permission="conversation:view"
              fallback={
                <UnauthorizedAccess
                  title="Chat non autorisé"
                  message="Vous n'avez pas les privilèges pour accéder au chat."
                  requiredPermission="conversation:view"
                />
              }
            >
              {activeTab === "chat" && <ChatInterface />}
            </PermissionGate>

            <PermissionGate
              permission="integration_configs:view"
              fallback={
                <UnauthorizedAccess
                  title="Analytics non autorisé"
                  message="Vous n'avez pas les privilèges pour accéder aux analyses."
                  requiredPermission="integration_configs:view"
                />
              }
            >
              {activeTab === "analytics" && <AnalyticsDashboard />}
            </PermissionGate>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
