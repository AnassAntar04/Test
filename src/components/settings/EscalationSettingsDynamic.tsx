import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Edit, Plus, Trash2, Save, X, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  useRoutingMatrix,
  RequestType,
  EscalationRule
} from "@/hooks/useRoutingMatrix";
import { toast } from "@/hooks/use-toast";

const CONDITION_OPTIONS = [
  { value: "immediate", label: "Immédiat", icon: "⚡" },
  { value: "priority_high", label: "Priorité élevée", icon: "🔴" },
  { value: "timeout", label: "Délai dépassé", icon: "⏰" },
  { value: "keyword_match", label: "Correspondance de mots-clés", icon: "🔍" }
];

export const EscalationSettingsDynamic = () => {
  const {
    requestTypes,
    escalationRules,
    routingMatrix,
    loading,
    updateRoutingMatrix,
    addRequestType,
    updateRequestType,
    deleteRequestType,
    updateEscalationRule,
    getPermissionIcon,
    getPermissionForRole
  } = useRoutingMatrix();

  const [roles, setRoles] = useState([]);

  // Dialog states
  const [showRuleDialog, setShowRuleDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Form states
  const [newRule, setNewRule] = useState({
    name: "",
    condition: "immediate",
    priority: 1,
    is_active: true
  });
  const [newCategory, setNewCategory] = useState({
    name: "",
    keywords: "",
    is_active: true
  });
  const [selectedCategories, setSelectedCategories] = useState([]);

  const FetchRoles = async () => {
    const { data, error } = await supabase.from("roles").select("*");
    setRoles(data || []);
  };
  // Create/Update escalation rule
  const handleSaveRule = async () => {
    console.log(" esclation Rules  ", escalationRules);
    try {
      const { data: org_data, error: org_error } = await supabase
        .from("organisation")
        .select("*")
        .single();

      const ruleData = {
        ...newRule,
        org_id: org_data?.org_id
      };

      let result;
      if (editingRule) {
        // Update existing rule
        const { data, error } = await supabase
          .from("escalation_rules")
          .update(ruleData)
          .eq("esc_id", editingRule.esc_id)
          .select();

        if (error) throw error;
        result = data[0];
      } else {
        // Create new rule
        const { data, error } = await supabase
          .from("escalation_rules")
          .insert([ruleData])
          .select();

        if (error) throw error;
        result = data[0];
      }

      // Update category associations
      if (result && selectedCategories.length > 0) {
        // Remove existing associations
        await supabase
          .from("escalation_categories")
          .delete()
          .eq("esc_id", result.esc_id);

        // Add new associations
        const categoryAssociations = selectedCategories.map((catId) => ({
          esc_id: result.esc_id,
          cat_id: catId
        }));

        await supabase
          .from("escalation_categories")
          .insert(categoryAssociations);
      }

      // Reset form and close dialog
      setNewRule({
        name: "",
        condition: "immediate",
        priority: 1,
        is_active: true
      });
      setSelectedCategories([]);
      setEditingRule(null);
      setShowRuleDialog(false);
    } catch (error) {
      console.error("Error saving rule:", error);
    }
  };

  // Delete escalation rule
  const handleDeleteRule = async (ruleId: string) => {
    try {
      // Delete category associations first
      await supabase
        .from("escalation_categories")
        .delete()
        .eq("esc_id", ruleId);

      // Delete the rule
      await supabase.from("escalation_rules").delete().eq("esc_id", ruleId);

      // Refresh data
    } catch (error) {
      console.error("Error deleting rule:", error);
    }
  };

  // Open edit rule dialog
  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setNewRule({
      name: rule.name,
      from_role: rule.from_role,
      to_role: rule.to_role,
      condition: rule.condition,
      priority: rule.priority,
      is_active: rule.is_active
    });
    setSelectedCategories(rule.categories?.map((c) => c.cat_id) || []);
    setShowRuleDialog(true);
  };

  const handleSaveCategory = async () => {
    if (newCategory.name && newCategory.keywords) {
      !editingCategory
        ? await addRequestType(newCategory)
        : await updateRequestType(editingCategory.cat_id, newCategory);
    } else {
      toast({
        title: "Erreur",
        description: "Veuillez renseigner les champs obligatoires",
        variant: "destructive"
      });
    }
    setNewCategory({ name: "", keywords: "", is_active: true });
    setEditingCategory(null);
    setShowCategoryDialog(false);
  };

  // Open edit category dialog
  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      keywords: category.keywords,
      is_active: category.is_active
    });
    setShowCategoryDialog(true);
  };

  // Delete category
  const handleDeleteCategory = async (categoryId: string) => {
    try {
      // Delete category associations first
      await deleteRequestType(categoryId);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  useEffect(() => {
    FetchRoles();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">
          Règles d'Escalade et Catégories
        </h3>
        <p className="text-muted-foreground">
          Gestion des règles d'escalade automatique et des catégories associées
        </p>
      </div>

      {/* Categories Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Catégories</CardTitle>
              <CardDescription>
                Gestion des catégories avec mots-clés pour la classification
              </CardDescription>
            </div>
            <Button onClick={() => setShowCategoryDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Catégorie
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {requestTypes.map((category) => (
              <div
                key={category.cat_id}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium">{category.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Mots-clés: {category.keywords}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={category.is_active ? "default" : "secondary"}>
                    {category.is_active ? "Actif" : "Inactif"}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditCategory(category)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Supprimer la catégorie
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer cette catégorie ?
                          Cette action ne peut pas être annulée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category.cat_id)}
                          className="bg-destructive text-destructive-foreground"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Escalation Rules Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Règles d'Escalade</CardTitle>
              <CardDescription>
                Configuration des déclencheurs automatiques d'escalade
              </CardDescription>
            </div>
            <Button onClick={() => setShowRuleDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Règle
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {escalationRules.map((rule) => (
            <div
              key={rule.esc_id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="flex-1">
                <div className="font-medium">{rule.name}</div>
                <div className="text-sm text-muted-foreground">
                  {rule.from_role_data?.name} → {rule.to_role_data?.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Condition:{" "}
                  {CONDITION_OPTIONS.find((c) => c.value === rule.condition)
                    ?.label || rule.condition}
                </div>
                <div className="text-sm text-muted-foreground">
                  Priorité: {rule.priority}
                </div>
                {rule.categories && rule.categories.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {rule.categories.map((category) => (
                      <Badge
                        key={category.cat_id}
                        variant="outline"
                        className="text-xs"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={rule.is_active ? "default" : "secondary"}>
                  {rule.is_active ? "Actif" : "Inactif"}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEditRule(rule)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer la règle</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer cette règle
                        d'escalade ? Cette action ne peut pas être annulée.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteRule(rule.esc_id)}
                        className="bg-destructive text-destructive-foreground"
                      >
                        Supprimer
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Category Dialog */}
      <Dialog
        open={showCategoryDialog}
        onOpenChange={(e) => {
          setShowCategoryDialog(e);
          setNewCategory({ name: "", keywords: "", is_active: true });
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? "Modifier" : "Créer"} une Catégorie
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom de la catégorie</Label>
              <Input
                value={newCategory.name || ""}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, name: e.target.value })
                }
                placeholder="ex: Technique, Facturation..."
              />
            </div>
            <div>
              <Label>Mots-clés (séparés par des virgules)</Label>
              <Input
                value={newCategory.keywords || ""}
                onChange={(e) =>
                  setNewCategory({ ...newCategory, keywords: e.target.value })
                }
                placeholder="ex: panne, bug, erreur, facture, paiement"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="category-active"
                checked={newCategory.is_active || false}
                onChange={(e) =>
                  setNewCategory({
                    ...newCategory,
                    is_active: e.target.checked
                  })
                }
              />
              <Label htmlFor="category-active">Catégorie active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingCategory(null);
                  setNewCategory({ name: "", keywords: "", is_active: true });
                  setShowCategoryDialog(false);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleSaveCategory}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Rule Dialog */}
      <Dialog open={showRuleDialog} onOpenChange={setShowRuleDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingRule ? "Modifier" : "Créer"} une Règle d'Escalade
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Nom de la règle</Label>
              <Input
                value={newRule.name || ""}
                onChange={(e) =>
                  setNewRule({ ...newRule, name: e.target.value })
                }
                placeholder="ex: Escalade technique urgente"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>De (rôle)</Label>
                <Select
                  value={newRule.from_role || ""}
                  onValueChange={(value) =>
                    setNewRule({ ...newRule, from_role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.role_id} value={role.role_id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Vers (rôle)</Label>
                <Select
                  value={newRule.to_role || ""}
                  onValueChange={(value) =>
                    setNewRule({ ...newRule, to_role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.role_id} value={role.role_id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Condition de déclenchement</Label>
                <Select
                  value={newRule.condition || "immediate"}
                  onValueChange={(value) =>
                    setNewRule({ ...newRule, condition: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CONDITION_OPTIONS.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.icon} {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Priorité</Label>
                <Input
                  type="number"
                  value={newRule.priority || 1}
                  onChange={(e) =>
                    setNewRule({
                      ...newRule,
                      priority: parseInt(e.target.value)
                    })
                  }
                  min={1}
                  max={10}
                />
              </div>
            </div>
            <div>
              <Label>Catégories associées</Label>
              <div className="grid grid-cols-2 gap-2 mt-2 max-h-32 overflow-y-auto">
                {requestTypes.map((category) => (
                  <div
                    key={category.cat_id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id={`category-${category.cat_id}`}
                      checked={selectedCategories.includes(category.cat_id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategories([
                            ...selectedCategories,
                            category.cat_id
                          ]);
                        } else {
                          setSelectedCategories(
                            selectedCategories.filter(
                              (id) => id !== category.cat_id
                            )
                          );
                        }
                      }}
                    />
                    <Label
                      htmlFor={`category-${category.cat_id}`}
                      className="text-sm"
                    >
                      {category.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="rule-active"
                checked={newRule.is_active || false}
                onChange={(e) =>
                  setNewRule({ ...newRule, is_active: e.target.checked })
                }
              />
              <Label htmlFor="rule-active">Règle active</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingRule(null);
                  setNewRule({
                    name: "",
                    condition: "immediate",
                    priority: 1,
                    is_active: true
                  });
                  setSelectedCategories([]);
                  setShowRuleDialog(false);
                }}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              <Button onClick={handleSaveRule}>
                <Save className="h-4 w-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};