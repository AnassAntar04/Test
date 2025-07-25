import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Plus, Trash2, Save, X } from "lucide-react";
import { useRoutingMatrix, RequestType, EscalationRule } from "@/hooks/useRoutingMatrix";

const ROLES = ['agent', 'technicien', 'femme_de_menage', 'comptabilite', 'superviseur'];
const PERMISSION_OPTIONS = [
  { value: 'direct_treatment', label: 'Traitement direct', icon: '✅' },
  { value: 'entry_point', label: 'Point d\'entrée', icon: '📨' },
  { value: 'escalation', label: 'Escalade', icon: '🔔' },
  { value: 'read_only', label: 'Lecture seule', icon: '📊' },
  { value: 'no_access', label: 'Pas d\'accès', icon: '❌' }
];

export const EscalationSettingsDynamic = () => {
  const {
    requestTypes,
    escalationRules,
    loading,
    updateRoutingMatrix,
    addRequestType,
    deleteRequestType,
    updateEscalationRule,
    getPermissionIcon,
    getPermissionForRole
  } = useRoutingMatrix();

  const [editingCell, setEditingCell] = useState<{ requestTypeId: string; role: string } | null>(null);
  const [newRequestType, setNewRequestType] = useState<Partial<RequestType>>({});
  const [editingRule, setEditingRule] = useState<EscalationRule | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showRuleDialog, setShowRuleDialog] = useState(false);

  const handleCellClick = (requestTypeId: string, role: string) => {
    setEditingCell({ requestTypeId, role });
  };

  const handlePermissionChange = async (permissionType: string) => {
    if (editingCell) {
      await updateRoutingMatrix(editingCell.requestTypeId, editingCell.role, permissionType as any);
      setEditingCell(null);
    }
  };

  const handleAddRequestType = async () => {
    if (newRequestType.name) {
      await addRequestType({
        name: newRequestType.name,
        description: newRequestType.description || null,
        color: newRequestType.color || '#3b82f6',
        is_active: true,
        display_order: requestTypes.length + 1
      });
      setNewRequestType({});
      setShowAddDialog(false);
    }
  };

  const handleUpdateRule = async () => {
    if (editingRule) {
      await updateEscalationRule(editingRule.id, editingRule);
      setEditingRule(null);
      setShowRuleDialog(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Chargement...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Règles d'Escalade et Routage</h3>
        <p className="text-muted-foreground">Matrice de routage automatique et règles d'escalade configurables</p>
      </div>

      {/* Matrice de routage dynamique */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Matrice de Routage Automatique</CardTitle>
              <CardDescription>Cliquez sur les cellules pour modifier les permissions</CardDescription>
            </div>
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouveau Type
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Ajouter un Type de Demande</DialogTitle>
                  <DialogDescription>Créer un nouveau type de demande pour la matrice de routage</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Nom</Label>
                    <Input
                      id="name"
                      value={newRequestType.name || ''}
                      onChange={(e) => setNewRequestType(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Support technique"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={newRequestType.description || ''}
                      onChange={(e) => setNewRequestType(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Description du type de demande"
                    />
                  </div>
                  <div>
                    <Label htmlFor="color">Couleur</Label>
                    <Input
                      id="color"
                      type="color"
                      value={newRequestType.color || '#3b82f6'}
                      onChange={(e) => setNewRequestType(prev => ({ ...prev, color: e.target.value }))}
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                      <X className="h-4 w-4 mr-2" />
                      Annuler
                    </Button>
                    <Button onClick={handleAddRequestType}>
                      <Save className="h-4 w-4 mr-2" />
                      Créer
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[200px]">Type de demande</TableHead>
                  {ROLES.map(role => (
                    <TableHead key={role} className="text-center min-w-[120px]">
                      {role.replace('_', ' ')}
                    </TableHead>
                  ))}
                  <TableHead className="text-center min-w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requestTypes.map((requestType) => (
                  <TableRow key={requestType.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: requestType.color }}
                        />
                        <span>{requestType.name}</span>
                      </div>
                    </TableCell>
                    {ROLES.map(role => {
                      const permission = getPermissionForRole(requestType.id, role);
                      const isEditing = editingCell?.requestTypeId === requestType.id && editingCell?.role === role;
                      
                      return (
                        <TableCell key={role} className="text-center">
                          {isEditing ? (
                            <Select value={permission} onValueChange={handlePermissionChange}>
                              <SelectTrigger className="w-full">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {PERMISSION_OPTIONS.map(option => (
                                  <SelectItem key={option.value} value={option.value}>
                                    <div className="flex items-center space-x-2">
                                      <span>{option.icon}</span>
                                      <span>{option.label}</span>
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <button
                              onClick={() => handleCellClick(requestType.id, role)}
                              className="flex items-center justify-center w-full p-2 rounded hover:bg-muted transition-colors"
                              title={PERMISSION_OPTIONS.find(p => p.value === permission)?.label}
                            >
                              <span className="text-lg">{getPermissionIcon(permission)}</span>
                            </button>
                          )}
                        </TableCell>
                      );
                     })}
                     <TableCell className="text-center">
                       <AlertDialog>
                         <AlertDialogTrigger asChild>
                           <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </AlertDialogTrigger>
                         <AlertDialogContent>
                           <AlertDialogHeader>
                             <AlertDialogTitle>Supprimer le type de demande</AlertDialogTitle>
                             <AlertDialogDescription>
                               Êtes-vous sûr de vouloir supprimer le type "{requestType.name}" ? 
                               Cette action est irréversible et supprimera également toutes les règles de routage associées.
                             </AlertDialogDescription>
                           </AlertDialogHeader>
                           <AlertDialogFooter>
                             <AlertDialogCancel>Annuler</AlertDialogCancel>
                             <AlertDialogAction 
                               onClick={() => deleteRequestType(requestType.id)}
                               className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                             >
                               Supprimer
                             </AlertDialogAction>
                           </AlertDialogFooter>
                         </AlertDialogContent>
                       </AlertDialog>
                     </TableCell>
                   </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-muted-foreground">
            <p><strong>Légende :</strong> ✅ Traitement direct • 📨 Point d'entrée • 🔔 Escalade • 📊 Lecture seule • ❌ Pas d'accès</p>
          </div>
        </CardContent>
      </Card>

      {/* Règles d'escalade */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Règles d'Escalade Dynamiques</CardTitle>
              <CardDescription>Configuration des déclencheurs automatiques</CardDescription>
            </div>
            <Button onClick={() => setShowRuleDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Règle
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {escalationRules.map((rule) => (
            <div key={rule.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <div className="font-medium">{rule.name}</div>
                <div className="text-sm text-muted-foreground">
                  Mots-clés : {rule.keywords.join(", ")}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {rule.from_role} → {rule.to_role}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={rule.is_active ? "default" : "secondary"}>
                  {rule.is_active ? "Actif" : "Inactif"}
                </Badge>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    setEditingRule(rule);
                    setShowRuleDialog(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dialog pour éditer les règles */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingRule ? 'Modifier' : 'Créer'} une Règle d'Escalade</DialogTitle>
          </DialogHeader>
          {editingRule && (
            <div className="space-y-4">
              <div>
                <Label>Nom de la règle</Label>
                <Input
                  value={editingRule.name}
                  onChange={(e) => setEditingRule(prev => prev ? { ...prev, name: e.target.value } : null)}
                />
              </div>
              <div>
                <Label>Mots-clés (séparés par des virgules)</Label>
                <Input
                  value={editingRule.keywords.join(', ')}
                  onChange={(e) => setEditingRule(prev => prev ? { 
                    ...prev, 
                    keywords: e.target.value.split(',').map(k => k.trim()) 
                  } : null)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>De (rôle)</Label>
                  <Select
                    value={editingRule.from_role}
                    onValueChange={(value) => setEditingRule(prev => prev ? { ...prev, from_role: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Vers (rôle)</Label>
                  <Select
                    value={editingRule.to_role}
                    onValueChange={(value) => setEditingRule(prev => prev ? { ...prev, to_role: value } : null)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLES.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => {
                  setEditingRule(null);
                  setShowRuleDialog(false);
                }}>
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button onClick={handleUpdateRule}>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};