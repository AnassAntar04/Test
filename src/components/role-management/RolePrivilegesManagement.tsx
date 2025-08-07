// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
// import { Shield, Settings } from "lucide-react";
// import { ROLE_LABELS, ROLE_HIERARCHY } from "@/constants/roles";
// import { AppRole } from "@/types/roles";
// import { useRolePrivileges } from "@/hooks/useRolePrivileges";
// import { useEffect, useState } from "react";
// import { supabase } from "@/integrations/supabase/client";

// export const RolePrivilegesManagement = () => {
//   const {
//     permissions,
//     loading,
//     toggleRolePrivilege,
//     hasRolePrivilege,
//     getPermissionsByCategory
//   } = useRolePrivileges();

//   const [sortedRoles, setSortedRoles] = useState([]);

// const fetchRoles = async () => {
//   try {
//     const { data, error } = await supabase
//       .from("roles")
//       .select("role_id, name");

//     const { data : data2, error : error2 } = await supabase.rpc("get_all_tables");
//     console.log('Data 2 : ', data2);

//     setSortedRoles(data || []);
//   } catch (error) {
//     console.error("Error fetching roles:", error);
//   }
// };

// useEffect(() => {
//   fetchRoles();
// }, []);

//   const permissionsByCategory = getPermissionsByCategory();

//   console.log("Permissions by category:", permissionsByCategory);
//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Settings className="h-5 w-5" />
//             Gestion des Privilèges par Rôle
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-center p-8 text-muted-foreground">
//             Chargement des privilèges...
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Settings className="h-5 w-5" />
//           Gestion des Privilèges par Rôle
//         </CardTitle>
//         <p className="text-sm text-muted-foreground">
//           Configurez les privilèges accordés à chaque rôle dans le système
//         </p>
//       </CardHeader>
//       <CardContent className="space-y-6">
//         {Object.entries(permissionsByCategory).map(
//           ([category, categoryPermissions]) => (
//             <div key={category} className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <Shield className="h-4 w-4 text-primary" />
//                 <h3 className="text-lg font-semibold capitalize">{category}</h3>
//               </div>

//               <div className="border rounded-lg overflow-hidden">
//                 <div className="bg-muted/50 p-3">
//                   <div className="grid grid-cols-1 md:grid-cols-10 gap-2">
//                     <div className="font-medium text-sm">Privilège</div>
//                     {sortedRoles.map((role) => (
//                       <div key={role.role_id} className="text-center">
//                         <Badge variant="secondary" className="text-xs">
//                           {role.name}
//                         </Badge>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="divide-y">
//                   {categoryPermissions.map((permission) => (
//                     <div key={permission.perm_id} className="p-3">
//                       <div className="grid grid-cols-1 md:grid-cols-10 gap-2 items-center">
//                         <div className="space-y-1">
//                           <div className="font-medium text-sm">
//                             {permission.name}
//                           </div>
//                           {permission.description && (
//                             <div className="text-xs text-muted-foreground">
//                               {permission.description}
//                             </div>
//                           )}
//                         </div>

//                         {sortedRoles.map((role) => (
//                           <div key={role} className="flex justify-center">
//                             <Switch
//                               checked={hasRolePrivilege(
//                                 role.role_id,
//                                 permission.perm_id
//                               )}
//                               onCheckedChange={(checked) =>
//                                 toggleRolePrivilege(
//                                   role.role_id,
//                                   permission.perm_id,
//                                   !checked
//                                 )
//                               }
//                               disabled={role.name === "Owner"} // Super admin has all privileges
//                             />
//                           </div>
//                         ))}
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               {Object.keys(permissionsByCategory).indexOf(category) <
//                 Object.keys(permissionsByCategory).length - 1 && (
//                 <Separator className="mt-6" />
//               )}
//             </div>
//           )
//         )}

//         {permissions.length === 0 && (
//           <div className="text-center p-8 text-muted-foreground">
//             <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
//             <p className="text-lg font-medium mb-2">
//               Aucun privilège configuré
//             </p>
//             <p className="text-sm">
//               Les privilèges doivent d'abord être créés dans la base de données.
//             </p>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Switch } from "@/components/ui/switch";
// import { Separator } from "@/components/ui/separator";
// import { Shield, Settings, Plus } from "lucide-react";
// import { useEffect, useState } from "react";

// // Mock data for demonstration
// const mockTables = [
//   { id: "organisation", name: "Organisation" },
//   { id: "users", name: "Users" },
//   { id: "projects", name: "Projects" },
//   { id: "reports", name: "Reports" },
//   { id: "settings", name: "Settings" }
// ];

// const mockPrivileges = {
//   organisation: [
//     { id: "org_view", name: "Organisation: View", description: "View organisation details" },
//     { id: "org_create", name: "Organisation: Create", description: "Create new organisations" },
//     { id: "org_edit", name: "Organisation: Edit", description: "Edit organisation details" },
//     { id: "org_delete", name: "Organisation: Delete", description: "Delete organisations" }
//   ],
//   users: [
//     { id: "user_view", name: "Users: View", description: "View user profiles" },
//     { id: "user_create", name: "Users: Create", description: "Create new users" },
//     { id: "user_edit", name: "Users: Edit", description: "Edit user profiles" },
//     { id: "user_delete", name: "Users: Delete", description: "Delete users" }
//   ],
//   projects: [
//     { id: "project_view", name: "Projects: View", description: "View projects" },
//     { id: "project_create", name: "Projects: Create", description: "Create new projects" },
//     { id: "project_edit", name: "Projects: Edit", description: "Edit projects" },
//     { id: "project_delete", name: "Projects: Delete", description: "Delete projects" }
//   ],
//   reports: [
//     { id: "report_view", name: "Reports: View", description: "View reports" },
//     { id: "report_create", name: "Reports: Create", description: "Create new reports" },
//     { id: "report_export", name: "Reports: Export", description: "Export reports" }
//   ],
//   settings: [
//     { id: "settings_view", name: "Settings: View", description: "View system settings" },
//     { id: "settings_edit", name: "Settings: Edit", description: "Edit system settings" }
//   ]
// };

// const mockRoles = [
//   { role_id: "1", name: "Owner" },
//   { role_id: "2", name: "Admin" },
//   { role_id: "3", name: "Support Agent" },
//   { role_id: "4", name: "Manager" },
//   { role_id: "5", name: "User" }
// ];

// const mockRolePrivileges = {
//   "1": ["org_view", "org_create", "org_edit", "org_delete", "user_view", "user_create", "user_edit", "user_delete", "settings_view", "settings_edit"],
//   "2": ["org_view", "org_edit", "user_view", "user_create", "user_edit", "project_view", "project_create", "project_edit"],
//   "3": ["org_view", "user_view", "project_view", "report_view"],
//   "4": ["org_view", "user_view", "project_view", "project_create", "project_edit", "report_view", "report_create"],
//   "5": ["org_view", "user_view", "project_view"]
// };

// export default function RolePrivilegesManagement() {
//   const [selectedTable, setSelectedTable] = useState("");
//   const [selectedPrivilege, setSelectedPrivilege] = useState("");
//   const [selectedRole, setSelectedRole] = useState("");
//   const [rolePrivileges, setRolePrivileges] = useState(mockRolePrivileges);
//   const [loading, setLoading] = useState(false);

//   const availablePrivileges = selectedTable ? mockPrivileges[selectedTable] || [] : [];

//   const handleAssignPrivilege = () => {
//     if (selectedRole && selectedPrivilege) {
//       setRolePrivileges(prev => ({
//         ...prev,
//         [selectedRole]: [...(prev[selectedRole] || []), selectedPrivilege]
//       }));

//       // Reset selections
//       setSelectedTable("");
//       setSelectedPrivilege("");
//       setSelectedRole("");
//     }
//   };

//   const toggleRolePrivilege = (roleId, privilegeId) => {
//     setRolePrivileges(prev => {
//       const currentPrivileges = prev[roleId] || [];
//       const hasPrivilege = currentPrivileges.includes(privilegeId);

//       if (hasPrivilege) {
//         return {
//           ...prev,
//           [roleId]: currentPrivileges.filter(p => p !== privilegeId)
//         };
//       } else {
//         return {
//           ...prev,
//           [roleId]: [...currentPrivileges, privilegeId]
//         };
//       }
//     });
//   };

//   const hasRolePrivilege = (roleId, privilegeId) => {
//     return (rolePrivileges[roleId] || []).includes(privilegeId);
//   };

//   const getPermissionsByCategory = () => {
//     const categories = {};
//     Object.entries(mockPrivileges).forEach(([category, privileges]) => {
//       categories[category] = privileges;
//     });
//     return categories;
//   };

//   const permissionsByCategory = getPermissionsByCategory();

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Settings className="h-5 w-5" />
//             Gestion des Privilèges par Rôle
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="text-center p-8 text-muted-foreground">
//             Chargement des privilèges...
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       {/* Quick Assignment Section */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Plus className="h-5 w-5" />
//             Assignation Rapide de Privilèges
//           </CardTitle>
//           <p className="text-sm text-muted-foreground">
//             Sélectionnez une table, un privilège et un rôle pour une assignation rapide
//           </p>
//         </CardHeader>
//         <CardContent>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             {/* Table Selection */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Table</label>
//               <select
//                 value={selectedTable}
//                 onChange={(e) => {
//                   setSelectedTable(e.target.value);
//                   setSelectedPrivilege(""); // Reset privilege when table changes
//                 }}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">Sélectionner une table</option>
//                 {mockTables.map((table) => (
//                   <option key={table.id} value={table.id}>
//                     {table.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Privilege Selection */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Privilège</label>
//               <select
//                 value={selectedPrivilege}
//                 onChange={(e) => setSelectedPrivilege(e.target.value)}
//                 disabled={!selectedTable}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
//               >
//                 <option value="">Sélectionner un privilège</option>
//                 {availablePrivileges.map((privilege) => (
//                   <option key={privilege.id} value={privilege.id}>
//                     {privilege.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Role Selection */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">Rôle</label>
//               <select
//                 value={selectedRole}
//                 onChange={(e) => setSelectedRole(e.target.value)}
//                 className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               >
//                 <option value="">Sélectionner un rôle</option>
//                 {mockRoles.map((role) => (
//                   <option key={role.role_id} value={role.role_id}>
//                     {role.name}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Assign Button */}
//             <div className="space-y-2">
//               <label className="text-sm font-medium">&nbsp;</label>
//               <button
//                 onClick={handleAssignPrivilege}
//                 disabled={!selectedTable || !selectedPrivilege || !selectedRole}
//                 className="w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//               >
//                 Assigner
//               </button>
//             </div>
//           </div>

//           {/* Display current selection */}
//           {(selectedTable || selectedPrivilege || selectedRole) && (
//             <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
//               <div className="text-sm">
//                 <span className="font-medium">Sélection actuelle: </span>
//                 {selectedTable && (
//                   <Badge variant="outline" className="mr-2">
//                     Table: {mockTables.find(t => t.id === selectedTable)?.name}
//                   </Badge>
//                 )}
//                 {selectedPrivilege && (
//                   <Badge variant="outline" className="mr-2">
//                     Privilège: {availablePrivileges.find(p => p.id === selectedPrivilege)?.name}
//                   </Badge>
//                 )}
//                 {selectedRole && (
//                   <Badge variant="outline" className="mr-2">
//                     Rôle: {mockRoles.find(r => r.role_id === selectedRole)?.name}
//                   </Badge>
//                 )}
//               </div>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Main Privileges Management */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Settings className="h-5 w-5" />
//             Gestion des Privilèges par Rôle
//           </CardTitle>
//           <p className="text-sm text-muted-foreground">
//             Configurez les privilèges accordés à chaque rôle dans le système
//           </p>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           {Object.entries(permissionsByCategory).map(
//             ([category, categoryPermissions]) => (
//               <div key={category} className="space-y-4">
//                 <div className="flex items-center gap-2">
//                   <Shield className="h-4 w-4 text-primary" />
//                   <h3 className="text-lg font-semibold capitalize">{category}</h3>
//                 </div>

//                 <div className="border rounded-lg overflow-hidden">
//                   <div className="bg-muted/50 p-3">
//                     <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
//                       <div className="font-medium text-sm">Privilège</div>
//                       {mockRoles.map((role) => (
//                         <div key={role.role_id} className="text-center">
//                           <Badge variant="secondary" className="text-xs">
//                             {role.name}
//                           </Badge>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div className="divide-y">
//                     {categoryPermissions.map((permission) => (
//                       <div key={permission.id} className="p-3">
//                         <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center">
//                           <div className="space-y-1">
//                             <div className="font-medium text-sm">
//                               {permission.name}
//                             </div>
//                             {permission.description && (
//                               <div className="text-xs text-muted-foreground">
//                                 {permission.description}
//                               </div>
//                             )}
//                           </div>

//                           {mockRoles.map((role) => (
//                             <div key={role.role_id} className="flex justify-center">
//                               <Switch
//                                 checked={hasRolePrivilege(role.role_id, permission.id)}
//                                 onCheckedChange={() =>
//                                   toggleRolePrivilege(role.role_id, permission.id)
//                                 }
//                                 disabled={role.name === "Owner"} // Super admin has all privileges
//                               />
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {Object.keys(permissionsByCategory).indexOf(category) <
//                   Object.keys(permissionsByCategory).length - 1 && (
//                   <Separator className="mt-6" />
//                 )}
//               </div>
//             )
//           )}

//           {Object.keys(permissionsByCategory).length === 0 && (
//             <div className="text-center p-8 text-muted-foreground">
//               <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
//               <p className="text-lg font-medium mb-2">
//                 Aucun privilège configuré
//               </p>
//               <p className="text-sm">
//                 Les privilèges doivent d'abord être créés dans la base de données.
//               </p>
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Shield, Settings, Users, Database, Table } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useRolePrivileges } from "@/hooks/useRolePrivileges";

// Mock data - replace with actual data from your hooks
const mockPermissions = [
  {
    perm_id: 1,
    name: "view_organizations",
    description: "View organizations",
    category: "organisation"
  },
  {
    perm_id: 2,
    name: "create_organizations",
    description: "Create organizations",
    category: "organisation"
  },
  {
    perm_id: 3,
    name: "edit_organizations",
    description: "Edit organizations",
    category: "organisation"
  },
  {
    perm_id: 4,
    name: "delete_organizations",
    description: "Delete organizations",
    category: "organisation"
  },
  {
    perm_id: 5,
    name: "view_users",
    description: "View users",
    category: "users"
  },
  {
    perm_id: 6,
    name: "create_users",
    description: "Create users",
    category: "users"
  },
  {
    perm_id: 7,
    name: "edit_users",
    description: "Edit users",
    category: "users"
  },
  {
    perm_id: 8,
    name: "view_reports",
    description: "View reports",
    category: "reports"
  },
  {
    perm_id: 9,
    name: "create_reports",
    description: "Create reports",
    category: "reports"
  }
];

const mockRoles = [
  { role_id: 1, name: "Owner" },
  { role_id: 2, name: "Admin" },
  { role_id: 3, name: "Manager" },
  { role_id: 4, name: "User" },
  { role_id: 5, name: "Viewer" }
];

// Mock current role privileges
const mockRolePrivileges = {
  1: [1, 2, 3, 4, 5, 6, 7, 8, 9], // Owner has all
  2: [1, 2, 3, 5, 6, 7, 8], // Admin
  3: [1, 2, 5, 8], // Manager
  4: [1, 5, 8], // User
  5: [1, 5, 8] // Viewer
};

export function RolePrivilegesManagement() {
  const {
    permissions,
    loading,
    toggleRolePrivilege,
    hasRolePrivilege,
    getPermissionsByCategory,
    getPermissionsByTable
  } = useRolePrivileges();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedPrivilege, setSelectedPrivilege] = useState("");
  const [rolePrivileges, setRolePrivileges] = useState(mockRolePrivileges);
  const [SortedRoles, setSortedRoles] = useState([]);
  const [Tables, setTables] = useState([]);
  const permissionsByCategory = getPermissionsByTable();

  console.log(selectedCategory);
  // Get unique categories
  const categories = [...new Set(mockPermissions.map((p) => p.category))];

  // Get privileges for selected category
  const categoryPrivileges = selectedCategory
    ? permissionsByCategory[selectedCategory] || []
    : [];

  console.log(permissionsByCategory);

  // Get selected privilege details
  const selectedPrivilegeDetails = selectedPrivilege
    ? categoryPrivileges.find((p) => p.perm_id === selectedPrivilege)
    : null;

  // const toggleRolePrivilege = (roleId, privilegeId) => {
  //   setRolePrivileges((prev) => ({
  //     ...prev,
  //     [roleId]: prev[roleId]?.includes(privilegeId)
  //       ? prev[roleId].filter((id) => id !== privilegeId)
  //       : [...(prev[roleId] || []), privilegeId]
  //   }));
  // };

  // const hasRolePrivilege = (roleId, privilegeId) => {
  //   return rolePrivileges[roleId]?.includes(privilegeId) || false;
  // };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "organisation":
        return <Database className="h-4 w-4" />;
      case "users":
        return <Users className="h-4 w-4" />;
      default:
        return <Database className="h-4 w-4" />;
    }
  };

  const formatCategoryName = (category) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const formatPrivilegeName = (privilege) => {
    const action = privilege.name.split("_")[0];
    const entity = privilege.name.split("_")[1];
    return `${formatCategoryName(entity)}: ${action}`;
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from("roles")
        .select("role_id, name");

      setSortedRoles(data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  console.log(selectedPrivilegeDetails);
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Sélection des Privilèges par Rôle
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Choisissez une table et un privilège spécifique pour configurer les
            permissions des rôles
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Sélectionner une Table
              </label>
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir une table..." />
                </SelectTrigger>
                <SelectContent>
                  {/* {categories.map((categorie) => (
                    <SelectItem key={categorie} value={categorie}>
                      <div className="flex items-center gap-2">
                        {getCategoryIcon(categorie)}
                        {formatCategoryName(categorie)}
                      </div>
                    </SelectItem>
                  ))} */}
                  {Object.entries(permissionsByCategory).map(
                    ([category, categoryPermissions]) => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          {category}
                        </div>
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Privilege Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Sélectionner un Privilège
              </label>
              <Select
                value={selectedPrivilege}
                onValueChange={setSelectedPrivilege}
                disabled={!selectedCategory}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un privilège..." />
                </SelectTrigger>
                <SelectContent>
                  {categoryPrivileges.map((privilege) => (
                    <SelectItem
                      key={privilege.perm_id}
                      value={privilege.perm_id}
                    >
                      {privilege.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Role Assignment Table */}
      {selectedPrivilegeDetails && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Attribution du Privilège : {selectedPrivilegeDetails.name}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedPrivilegeDetails.description}
            </p>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              {/* Table Header */}
              <div className="bg-muted/50 p-4">
                <div className="grid grid-cols-3 gap-4 font-medium text-sm">
                  <div>Rôle</div>
                  <div className="text-center">Statut</div>
                  <div className="text-center">Action</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y">
                {SortedRoles.map((role) => {
                  const hasPrivilege = hasRolePrivilege(
                    role.role_id,
                    selectedPrivilegeDetails.perm_id
                  );

                  return (
                    <div key={role.role_id} className="p-4">
                      <div className="grid grid-cols-3 gap-4 items-center">
                        {/* Role Name */}
                        <div className="flex items-center gap-3">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{role.name}</div>
                            <Badge
                              variant={
                                [
                                  "Owner".toLowerCase(),
                                  "super_admin".toLowerCase(),
                                  "Supervisor".toLowerCase()
                                ].includes(role.name.toLowerCase())
                                  ? "default"
                                  : "secondary"
                              }
                              className="text-xs mt-1"
                            >
                              {[
                                "Owner".toLowerCase(),
                                "super_admin".toLowerCase()
                              ].includes(role.name.toLowerCase())
                                ? "Super Admin"
                                : ["Supervisor".toLowerCase()].includes(
                                    role.name.toLowerCase()
                                  )
                                ? "Superviseur"
                                : "Standard"}
                            </Badge>
                          </div>
                        </div>

                        {/* Status */}
                        <div className="text-center">
                          <Badge
                            variant={hasPrivilege ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {hasPrivilege ? "Accordé" : "Refusé"}
                          </Badge>
                        </div>

                        {/* Toggle Switch */}
                        <div className="flex justify-center">
                          <Switch
                            checked={hasPrivilege}
                            onCheckedChange={() =>
                              toggleRolePrivilege(
                                role.role_id,
                                selectedPrivilegeDetails.perm_id,
                                hasPrivilege
                              )
                            }
                            disabled={["Owner".toLowerCase(), "super_admin".toLowerCase()].includes(role.name.toLowerCase())} // Owner always has all privileges
                            className="data-[state=checked]:bg-green-600"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Summary */}
            <div className="mt-4 p-3 bg-muted/30 rounded-lg">
              <div className="text-sm text-muted-foreground">
                <strong>Résumé:</strong>{" "}
                {
                  SortedRoles.filter((role) =>
                    hasRolePrivilege(
                      role.role_id,
                      selectedPrivilegeDetails.perm_id
                    )
                  ).length
                }{" "}
                sur {SortedRoles.length} rôles ont ce privilège
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {!selectedCategory && (
        <Card>
          <CardContent className="text-center p-8 text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium mb-2">
              Commencez par sélectionner une table
            </p>
            <p className="text-sm">
              Choisissez d'abord une table, puis un privilège spécifique pour
              configurer les permissions des rôles.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
