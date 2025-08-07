import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
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
  Users,
  Edit,
  Plus,
  Trash2,
  Save,
  Mail,
  MessageCircle,
  Send,
  Filter,
  Calendar,
  Target,
  PlayCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const GroupeMessagesSettings = () => {
  const { toast } = useToast();
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [editingMessage, setEditingMessage] = useState("");

  // Form states
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    channel: "mail",
    message: "",
    criteria: {
      propertyType: "",
      bookingStatus: "",
      location: "",
      customFilters: ""
    }
  });

  const availableChannels = [
    { id: "mail", label: "Email", icon: Mail },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "sms", label: "SMS", icon: MessageCircle }
  ];

  const availableVariables = [
    "[first name]",
    "[last name]",
    "[traveller name]",
    "[property name]",
    "[check-in date]",
    "[check-out date]",
    "[booking code]",
    "[phone number]",
    "[host name]",
    "[total amount]",
    "[property address]",
    "[city]",
    "[country]"
  ];

  // Function to detect only valid variables from the available list
  const detectValidVariables = (text) => {
    const foundVariables = [];
    
    availableVariables.forEach(variable => {
      if (text.includes(variable)) {
        foundVariables.push(variable);
      }
    });

    return [...new Set(foundVariables)]; // Remove duplicates
  };

  // Function to parse comma-separated values
  const parseCommaSeparated = (value) => {
    return value
      .split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("group_message")
        .select("*")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching templates:", error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les templates de groupe.",
          variant: "destructive"
        });
        return;
      }

      setTemplates(data || []);
      console.log("Group templates fetched:", data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates de groupe.",
        variant: "destructive"
      });
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.message) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le nom et le message.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { data: Organisation, error: OrganisationError } = await supabase
        .from("organisation")
        .select("org_id")
        .single();

      // Convert string criteria to arrays for storage
      const processedCriteria = {
        ...newTemplate.criteria,
        propertyType: parseCommaSeparated(newTemplate.criteria.propertyType),
        bookingStatus: parseCommaSeparated(newTemplate.criteria.bookingStatus),
        location: parseCommaSeparated(newTemplate.criteria.location),
        customFilters: parseCommaSeparated(newTemplate.criteria.customFilters)
      };

      const templateData = {
        org_id: Organisation.org_id,
        name: newTemplate.name,
        criteria: processedCriteria,
        message: newTemplate.message,
        channel: newTemplate.channel
      };

      const { data: template, error: templateError } = await supabase
        .from("group_message")
        .insert([templateData])
        .select();

      if (templateError) {
        console.error("Error creating template:", templateError);
        toast({
          title: "Erreur",
          description: "Impossible de créer le template de groupe.",
          variant: "destructive"
        });
        return;
      }

      resetNewTemplate();
      setIsNewTemplateDialogOpen(false);
      fetchTemplates();

      toast({
        title: "Template créé",
        description: `Le template "${newTemplate.name}" a été créé avec succès.`
      });
    } catch (error) {
      console.error("Error creating template:", error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le template de groupe.",
        variant: "destructive"
      });
    }
  };

  const handleEditTemplate = async (id, updatedMessage) => {
    try {
      const { error } = await supabase
        .from("group_message")
        .update({
          message: updatedMessage
        })
        .eq("segment_id", id);

      if (error) {
        console.error("Error updating template:", error);
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le template.",
          variant: "destructive"
        });
        return;
      }

      setEditingTemplate(null);
      setEditingMessage("");
      fetchTemplates();

      toast({
        title: "Template sauvegardé",
        description: "Les modifications ont été enregistrées."
      });
    } catch (error) {
      console.error("Error updating template:", error);
    }
  };

  const handleDeleteTemplate = async (id) => {
    try {
      const template = templates.find((t) => t.segment_id === id);

      const { error } = await supabase
        .from("group_message")
        .delete()
        .eq("segment_id", id);

      if (error) {
        console.error("Error deleting template:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer le template.",
          variant: "destructive"
        });
        return;
      }

      fetchTemplates();

      toast({
        title: "Template supprimé",
        description: `Le template "${template?.name}" a été supprimé.`
      });
    } catch (error) {
      console.error("Error deleting template:", error);
    }
  };

  const handleSendToSegment = async (templateId) => {
    try {
      // Update last_run timestamp
      const { error } = await supabase
        .from("group_message")
        .update({
          last_run: new Date().toISOString()
        })
        .eq("segment_id", templateId);

      if (error) {
        console.error("Error updating last run:", error);
      }

      fetchTemplates();

      toast({
        title: "Message envoyé",
        description: "Le message a été envoyé au segment sélectionné."
      });
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message.",
        variant: "destructive"
      });
    }
  };

  const resetNewTemplate = () => {
    setNewTemplate({
      name: "",
      channel: "mail",
      message: "",
      criteria: {
        propertyType: "",
        bookingStatus: "",
        location: "",
        customFilters: ""
      }
    });
  };

  const insertVariable = (variable) => {
    setNewTemplate({
      ...newTemplate,
      message: newTemplate.message + variable
    });
  };

  const insertVariableInEdit = (variable) => {
    setEditingMessage(editingMessage + variable);
  };

  const updateCriteria = (field, value) => {
    setNewTemplate({
      ...newTemplate,
      criteria: {
        ...newTemplate.criteria,
        [field]: value
      }
    });
  };

  const formatCriteriaDisplay = (criteria) => {
    const parts = [];

    // Handle array or string values for backward compatibility
    if (criteria.propertyType && criteria.propertyType.length > 0) {
      const types = Array.isArray(criteria.propertyType) 
        ? criteria.propertyType 
        : parseCommaSeparated(criteria.propertyType);
      if (types.length > 0) {
        parts.push(`Types: ${types.join(", ")}`);
      }
    }

    if (criteria.bookingStatus && criteria.bookingStatus.length > 0) {
      const statuses = Array.isArray(criteria.bookingStatus) 
        ? criteria.bookingStatus 
        : parseCommaSeparated(criteria.bookingStatus);
      if (statuses.length > 0) {
        parts.push(`Status: ${statuses.join(", ")}`);
      }
    }

    if (criteria.location && criteria.location.length > 0) {
      const locations = Array.isArray(criteria.location) 
        ? criteria.location 
        : parseCommaSeparated(criteria.location);
      if (locations.length > 0) {
        parts.push(`Lieux: ${locations.join(", ")}`);
      }
    }

    if (criteria.customFilters && criteria.customFilters.length > 0) {
      const filters = Array.isArray(criteria.customFilters) 
        ? criteria.customFilters 
        : parseCommaSeparated(criteria.customFilters);
      if (filters.length > 0) {
        parts.push(`Filtres: ${filters.join(", ")}`);
      }
    }

    return parts.length > 0 ? parts.join(" | ") : "Aucun critère défini";
  };

  const formatLastRun = (lastRun) => {
    if (!lastRun) return "Jamais envoyé";
    return new Date(lastRun).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Messages de Groupe</h3>
          <p className="text-muted-foreground">
            Créez et envoyez des messages à des segments spécifiques de
            voyageurs
          </p>
        </div>

        <Dialog
          open={isNewTemplateDialogOpen}
          onOpenChange={setIsNewTemplateDialogOpen}
        >
          <DialogTrigger asChild>
            <Button onClick={resetNewTemplate}>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Créer un template de message de groupe</DialogTitle>
              <DialogDescription>
                Configurez un message pour un segment spécifique de voyageurs
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Nom et Canal */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nom du template *</Label>
                  <Input
                    id="name"
                    placeholder="ex: Promotion été 2024"
                    value={newTemplate.name}
                    onChange={(e) =>
                      setNewTemplate({ ...newTemplate, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="channel">Canal d'envoi</Label>
                  <Select
                    value={newTemplate.channel}
                    onValueChange={(value) =>
                      setNewTemplate({ ...newTemplate, channel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {availableChannels.map((channel) => (
                        <SelectItem key={channel.id} value={channel.id}>
                          <div className="flex items-center gap-2">
                            <channel.icon className="h-4 w-4" />
                            {channel.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Critères de segmentation */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">
                  Critères de segmentation
                </Label>
                <p className="text-sm text-muted-foreground">
                  Séparez les valeurs multiples par des virgules (ex: Villa, Appartement, Maison)
                </p>

                {/* Type de propriété */}
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Type de propriété</Label>
                  <Input
                    id="propertyType"
                    placeholder="ex: Appartement, Maison, Villa, Studio"
                    value={newTemplate.criteria.propertyType}
                    onChange={(e) => updateCriteria("propertyType", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Exemples: Appartement, Maison, Villa, Studio, Loft, Château, Chalet
                  </p>
                </div>

                {/* Statut de réservation */}
                <div className="space-y-2">
                  <Label htmlFor="bookingStatus">Statut de réservation</Label>
                  <Input
                    id="bookingStatus"
                    placeholder="ex: Confirmé, En attente, Arrivé"
                    value={newTemplate.criteria.bookingStatus}
                    onChange={(e) => updateCriteria("bookingStatus", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Exemples: Confirmé, En attente, Arrivé, Parti, Annulé
                  </p>
                </div>

                {/* Localisation */}
                <div className="space-y-2">
                  <Label htmlFor="location">Localisation</Label>
                  <Input
                    id="location"
                    placeholder="ex: Paris, Lyon, Marseille"
                    value={newTemplate.criteria.location}
                    onChange={(e) => updateCriteria("location", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Exemples: Paris, Lyon, Marseille, Nice, Bordeaux, Toulouse
                  </p>
                </div>

                {/* Filtres personnalisés */}
                <div className="space-y-2">
                  <Label htmlFor="customFilters">Filtres personnalisés</Label>
                  <Input
                    id="customFilters"
                    placeholder="ex: Premium, Famille, Business"
                    value={newTemplate.criteria.customFilters}
                    onChange={(e) => updateCriteria("customFilters", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Ajoutez vos propres critères de filtrage séparés par des virgules
                  </p>
                </div>
              </div>

              {/* Variables disponibles */}
              <div className="space-y-2">
                <Label>Variables disponibles (cliquez pour insérer)</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-3 border rounded bg-muted/30">
                  {availableVariables.map((variable) => (
                    <Button
                      key={variable}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7 hover:bg-primary hover:text-primary-foreground"
                      onClick={() => insertVariable(variable)}
                    >
                      {variable}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Rédigez votre message ici et utilisez les variables disponibles ci-dessus..."
                  value={newTemplate.message}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, message: e.target.value })
                  }
                  className="min-h-[120px]"
                />
                {newTemplate.message && (
                  <div className="mt-2">
                    <Label className="text-sm text-muted-foreground">
                      Variables détectées:
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {detectValidVariables(newTemplate.message).map((variable) => (
                        <Badge
                          key={variable}
                          variant="secondary"
                          className="text-xs"
                        >
                          {variable}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsNewTemplateDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button onClick={handleCreateTemplate}>Créer le template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates existants */}
      <div className="space-y-4">
        {templates.map((template) => (
          <Card key={template.segment_id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Target className="h-5 w-5 text-primary" />
                  <span>{template.name}</span>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {template.channel === "mail" && (
                      <Mail className="h-3 w-3" />
                    )}
                    {template.channel === "whatsapp" && (
                      <MessageCircle className="h-3 w-3" />
                    )}
                    {template.channel === "sms" && (
                      <MessageCircle className="h-3 w-3" />
                    )}
                    {
                      availableChannels.find((c) => c.id === template.channel)
                        ?.label
                    }
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => handleSendToSegment(template.segment_id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (editingTemplate === template.segment_id) {
                        setEditingTemplate(null);
                        setEditingMessage("");
                      } else {
                        setEditingTemplate(template.segment_id);
                        setEditingMessage(template.message);
                      }
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Supprimer le template
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer le template "
                          {template.name}" ? Cette action est irréversible.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleDeleteTemplate(template.segment_id)
                          }
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Critères de segmentation */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Critères de segmentation
                </Label>
                <div className="p-3 bg-muted rounded text-sm">
                  {formatCriteriaDisplay(template.criteria)}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label>Message</Label>
                {editingTemplate === template.segment_id ? (
                  <div className="space-y-3">
                    {/* Variables disponibles pour l'édition */}
                    <div className="space-y-2">
                      <Label className="text-sm">Variables disponibles (cliquez pour insérer)</Label>
                      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 border rounded bg-muted/30">
                        {availableVariables.map((variable) => (
                          <Button
                            key={variable}
                            variant="outline"
                            size="sm"
                            className="text-xs h-6 hover:bg-primary hover:text-primary-foreground"
                            onClick={() => insertVariableInEdit(variable)}
                          >
                            {variable}
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <Textarea
                      value={editingMessage}
                      onChange={(e) => setEditingMessage(e.target.value)}
                      className="min-h-[100px]"
                    />
                    
                    {editingMessage && (
                      <div className="mt-2">
                        <Label className="text-sm text-muted-foreground">
                          Variables détectées:
                        </Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {detectValidVariables(editingMessage).map((variable) => (
                            <Badge
                              key={variable}
                              variant="secondary"
                              className="text-xs"
                            >
                              {variable}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTemplate(null);
                          setEditingMessage("");
                        }}
                      >
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          handleEditTemplate(template.segment_id, editingMessage);
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-muted rounded text-sm">
                    {template.message}
                  </div>
                )}
              </div>

              {/* Variables détectées et dernier envoi */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Label>Variables détectées</Label>
                  <div className="flex flex-wrap gap-1 text-xs">
                    {detectValidVariables(template.message).map((variable) => (
                      <Badge
                        key={variable}
                        variant="secondary"
                        className="text-xs"
                      >
                        {variable}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="text-right space-y-1">
                  <Label className="text-sm text-muted-foreground">
                    Dernier envoi
                  </Label>
                  <div className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatLastRun(template.last_run)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <div className="text-muted-foreground mb-4">
              Aucun template de groupe créé pour le moment.
            </div>
            <Button onClick={() => setIsNewTemplateDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Créer votre premier template de groupe
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Statistiques d'envoi de groupe
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">8,432</div>
              <div className="text-sm text-muted-foreground">
                Messages envoyés ce mois
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">92.7%</div>
              <div className="text-sm text-muted-foreground">
                Taux de délivrance
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">71.3%</div>
              <div className="text-sm text-muted-foreground">
                Taux d'ouverture
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">15.8%</div>
              <div className="text-sm text-muted-foreground">
                Taux de réponse
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};




// // import { useEffect, useState } from "react";
// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Switch } from "@/components/ui/switch";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Input } from "@/components/ui/input";
// // import { Label } from "@/components/ui/label";
// // import {
// //   Select,
// //   SelectContent,
// //   SelectItem,
// //   SelectTrigger,
// //   SelectValue
// // } from "@/components/ui/select";
// // import {
// //   Dialog,
// //   DialogContent,
// //   DialogDescription,
// //   DialogFooter,
// //   DialogHeader,
// //   DialogTitle,
// //   DialogTrigger
// // } from "@/components/ui/dialog";
// // import {
// //   AlertDialog,
// //   AlertDialogAction,
// //   AlertDialogCancel,
// //   AlertDialogContent,
// //   AlertDialogDescription,
// //   AlertDialogFooter,
// //   AlertDialogHeader,
// //   AlertDialogTitle,
// //   AlertDialogTrigger
// // } from "@/components/ui/alert-dialog";
// // import { Checkbox } from "@/components/ui/checkbox";
// // import {
// //   Zap,
// //   Edit,
// //   Plus,
// //   Trash2,
// //   Save,
// //   Clock,
// //   Mail,
// //   MessageCircle,
// //   Calendar
// // } from "lucide-react";
// // import { useToast } from "@/hooks/use-toast";
// // import { supabase } from "@/integrations/supabase/client";

// // export const AutoMessagesSettings = () => {
// //   const { toast } = useToast();
// //   const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
// //   const [editingTemplate, setEditingTemplate] = useState<number | null>(null);

// //   const [templates, setTemplates] = useState([]); // Placeholder for Supabase templates

// //   // Form states
// //   const [newTemplate, setNewTemplate] = useState({
// //     trigger: "",
// //     customTrigger: "",
// //     time: "immediate",
// //     customTime: "09:00",
// //     message: "",
// //     channels: [] as string[],
// //     isActive: true
// //   });

// //   // const [templates, setTemplates] = useState([
// //   //   {
// //   //     id: 1,
// //   //     trigger: "Confirmation réservation",
// //   //     time: "Immédiat",
// //   //     message:
// //   //       "Bonjour [Traveller Name], Bienvenue ! Votre réservation à [Property Name] est confirmée pour le [Check-in Date]. Vous recevrez les instructions d'accès 24h avant votre arrivée. Code de réservation: [Booking Code]",
// //   //     channels: ["Email", "WhatsApp"],
// //   //     isActive: true
// //   //   },
// //   //   {
// //   //     id: 2,
// //   //     trigger: "J-1 avant arrivée",
// //   //     time: "13h00",
// //   //     message:
// //   //       "Bonjour [Traveller Name], Votre séjour arrive à grands pas ! Voici vos codes d'accès pour demain: Code porte: [Door Code], WiFi: [WiFi Password]. Adresse exacte: [Property Address]. Bonne arrivée !",
// //   //     channels: ["WhatsApp", "Email"],
// //   //     isActive: true
// //   //   },
// //   //   {
// //   //     id: 3,
// //   //     trigger: "J-1 avant départ",
// //   //     time: "14h00",
// //   //     message:
// //   //       "Bonjour [Traveller Name], Votre séjour se termine demain à [Check-out Time]. Merci de laisser les clés dans la boîte et de fermer toutes les fenêtres. Comment s'est passé votre séjour ?",
// //   //     channels: ["WhatsApp", "Email"],
// //   //     isActive: true
// //   //   },
// //   //   {
// //   //     id: 4,
// //   //     trigger: "Post check-out",
// //   //     time: "13h00",
// //   //     message:
// //   //       "Nous vous remercions pour votre séjour à [Property Name] ! Votre avis nous intéresse : [Review Link]. À très bientôt pour un nouveau séjour !",
// //   //     channels: ["Email", "WhatsApp"],
// //   //     isActive: true
// //   //   }
// //   // ]);

// //   const fetchTemplates = async () => {
// //     try {
// //       const { data, error } = await supabase
// //         .from("auto_message_templates")
// //         .select("*")
// //         .order("created_at", { ascending: true }); // or false for descending

// //       console.log("Fetched templates:", error);
// //       setTemplates(data || []);
// //       console.log("Templates fetched from Supabase:", data);
// //     } catch (error) {
// //       console.error("Error fetching templates:", error);
// //       toast({
// //         title: "Erreur",
// //         description: "Impossible de charger les templates depuis Supabase.",
// //         variant: "destructive"
// //       });
// //     }
// //   };

// //   const HandleEditTemplate = async (id: string, textarea: string) => {
// //     // const template = templates.find((t) => t.id === id);
// //     // if (!template) return;
// //     const { data, error } = await supabase
// //       .from("auto_message_templates")
// //       .update({
// //         message_template: textarea
// //       })
// //       .eq("auto_id", id);

// //     setEditingTemplate(null);
// //     fetchTemplates();

// //     // console.log("Editing template:", editingTemplate);
// //     // console.log("Editing template:", textarea);
// //   };

// //   useEffect(() => {
// //     fetchTemplates();
// //   }, []);

// //   // console.log("Editing template:", editingTemplate);

// //   const availableTriggers = [
// //     "Confirmation réservation",
// //     "J-7 avant arrivée",
// //     "J-1 avant arrivée",
// //     "Le jour d'arrivée",
// //     "Pendant le séjour",
// //     "J-1 avant départ",
// //     "Post check-out",
// //     "Feedback demande",
// //     "Personnalisé"
// //   ];

// //   const availableChannels = [
// //     { id: "email", label: "Email", icon: Mail },
// //     { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
// //     { id: "sms", label: "SMS", icon: MessageCircle }
// //   ];

// //   const availableVariables = [
// //     "[Traveller Name]",
// //     "[Property Name]",
// //     "[Check-in Date]",
// //     "[Check-out Date]",
// //     "[Check-in Time]",
// //     "[Check-out Time]",
// //     "[Door Code]",
// //     "[WiFi Password]",
// //     "[Property Address]",
// //     "[Booking Code]",
// //     "[Phone Number]",
// //     "[Review Link]",
// //     "[Host Name]",
// //     "[Emergency Contact]",
// //     "[Total Amount]",
// //     "[PIN Code]"
// //   ];

// //   const resetNewTemplate = () => {
// //     setNewTemplate({
// //       trigger: "",
// //       customTrigger: "",
// //       time: "immediate",
// //       customTime: "09:00",
// //       message: "",
// //       channels: [],
// //       isActive: true
// //     });
// //   };

// //   const handleCreateTemplate = () => {
// //     if (
// //       !newTemplate.trigger ||
// //       !newTemplate.message ||
// //       newTemplate.channels.length === 0
// //     ) {
// //       toast({
// //         title: "Erreur",
// //         description: "Veuillez remplir tous les champs obligatoires.",
// //         variant: "destructive"
// //       });
// //       return;
// //     }

// //     const finalTrigger =
// //       newTemplate.trigger === "Personnalisé"
// //         ? newTemplate.customTrigger
// //         : newTemplate.trigger;
// //     const finalTime =
// //       newTemplate.time === "custom"
// //         ? newTemplate.customTime
// //         : newTemplate.time === "immediate"
// //         ? "Immédiat"
// //         : newTemplate.time;

// //     const template = {
// //       id: Date.now(),
// //       trigger: finalTrigger,
// //       time: finalTime,
// //       message: newTemplate.message,
// //       channels: newTemplate.channels,
// //       isActive: newTemplate.isActive
// //     };

// //     setTemplates([...templates, template]);
// //     resetNewTemplate();
// //     setIsNewTemplateDialogOpen(false);

// //     console.log("Creating template:", template);

// //     toast({
// //       title: "Template créé",
// //       description: `Le template "${finalTrigger}" a été créé avec succès.`
// //     });
// //   };

// //   const handleToggleTemplate = async (id: string) => {
// //     // setTemplates(
// //     //   templates.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
// //     // );

// //     // const template = templates.find((t) => t.id === id);

// //       const { data, error } = await supabase
// //       .from("auto_message_templates")
// //       .update({
// //         is_active: templates.find((t) => t.auto_id === id)?.is_active ? false : true
// //       })
// //       .eq("auto_id", id);

// //       fetchTemplates();
// //       // .select("*")

// //       // console.log("Toggling template:", data, error);
// //     // toast({
// //     //   title: "Template mis à jour",
// //     //   description: `Le template "${template?.trigger}" a été ${
// //     //     template?.isActive ? "désactivé" : "activé"
// //     //   }.`
// //     // });
// //   };

// //   const handleDeleteTemplate = async (id: string) => {

// //     const { error } = await supabase
// //       .from("auto_message_templates")
// //       .delete()
// //       .eq("auto_id", id);

// //       fetchTemplates();

// //     // const template = templates.find((t) => t.id === id);
// //     // setTemplates(templates.filter((t) => t.id !== id));

// //     // toast({
// //     //   title: "Template supprimé",
// //     //   description: `Le template "${template?.trigger}" a été supprimé.`
// //     // });
// //   };

// //   const handleSaveTemplate = (id: number, updatedMessage: string) => {
// //     setTemplates(
// //       templates.map((t) =>
// //         t.id === id ? { ...t, message: updatedMessage } : t
// //       )
// //     );

// //     setEditingTemplate(null);
// //     toast({
// //       title: "Template sauvegardé",
// //       description: "Les modifications ont été enregistrées."
// //     });
// //   };

// //   const insertVariable = (variable: string) => {
// //     setNewTemplate({
// //       ...newTemplate,
// //       message: newTemplate.message + variable
// //     });
// //   };

// //   return (
// //     <div className="space-y-6">
// //       <div className="flex items-center justify-between">
// //         <div>
// //           <h3 className="text-xl font-semibold">Messages Automatiques</h3>
// //           <p className="text-muted-foreground">
// //             Configuration des workflows de messages par étape du parcours
// //           </p>
// //         </div>

// //         <Dialog
// //           open={isNewTemplateDialogOpen}
// //           onOpenChange={setIsNewTemplateDialogOpen}
// //         >
// //           <DialogTrigger asChild>
// //             <Button onClick={resetNewTemplate}>
// //               <Plus className="mr-2 h-4 w-4" />
// //               Nouveau Template
// //             </Button>
// //           </DialogTrigger>
// //           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
// //             <DialogHeader>
// //               <DialogTitle>Créer un nouveau template</DialogTitle>
// //               <DialogDescription>
// //                 Configurez un nouveau message automatique avec ses déclencheurs
// //                 et canaux d'envoi.
// //               </DialogDescription>
// //             </DialogHeader>
// //             <div className="space-y-6">
// //               {/* Déclencheur */}
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="trigger">Déclencheur *</Label>
// //                   <Select
// //                     value={newTemplate.trigger}
// //                     onValueChange={(value) =>
// //                       setNewTemplate({ ...newTemplate, trigger: value })
// //                     }
// //                   >
// //                     <SelectTrigger>
// //                       <SelectValue placeholder="Sélectionner un déclencheur" />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       {availableTriggers.map((trigger) => (
// //                         <SelectItem key={trigger} value={trigger}>
// //                           {trigger}
// //                         </SelectItem>
// //                       ))}
// //                     </SelectContent>
// //                   </Select>
// //                 </div>

// //                 {newTemplate.trigger === "Personnalisé" && (
// //                   <div className="space-y-2">
// //                     <Label htmlFor="customTrigger">
// //                       Déclencheur personnalisé *
// //                     </Label>
// //                     <Input
// //                       id="customTrigger"
// //                       placeholder="ex: J-3 avant arrivée"
// //                       value={newTemplate.customTrigger}
// //                       onChange={(e) =>
// //                         setNewTemplate({
// //                           ...newTemplate,
// //                           customTrigger: e.target.value
// //                         })
// //                       }
// //                     />
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Horaire */}
// //               <div className="grid grid-cols-2 gap-4">
// //                 <div className="space-y-2">
// //                   <Label htmlFor="time">Horaire d'envoi</Label>
// //                   <Select
// //                     value={newTemplate.time}
// //                     onValueChange={(value) =>
// //                       setNewTemplate({ ...newTemplate, time: value })
// //                     }
// //                   >
// //                     <SelectTrigger>
// //                       <SelectValue />
// //                     </SelectTrigger>
// //                     <SelectContent>
// //                       <SelectItem value="immediate">Immédiat</SelectItem>
// //                       <SelectItem value="09:00">09h00</SelectItem>
// //                       <SelectItem value="13:00">13h00</SelectItem>
// //                       <SelectItem value="18:00">18h00</SelectItem>
// //                       <SelectItem value="custom">Personnalisé</SelectItem>
// //                     </SelectContent>
// //                   </Select>
// //                 </div>

// //                 {newTemplate.time === "custom" && (
// //                   <div className="space-y-2">
// //                     <Label htmlFor="customTime">Heure personnalisée</Label>
// //                     <Input
// //                       id="customTime"
// //                       type="time"
// //                       value={newTemplate.customTime}
// //                       onChange={(e) =>
// //                         setNewTemplate({
// //                           ...newTemplate,
// //                           customTime: e.target.value
// //                         })
// //                       }
// //                     />
// //                   </div>
// //                 )}
// //               </div>

// //               {/* Canaux */}
// //               <div className="space-y-2">
// //                 <Label>Canaux d'envoi *</Label>
// //                 <div className="grid grid-cols-3 gap-4">
// //                   {availableChannels.map((channel) => (
// //                     <div
// //                       key={channel.id}
// //                       className="flex items-center space-x-2"
// //                     >
// //                       <Checkbox
// //                         id={channel.id}
// //                         checked={newTemplate.channels.includes(channel.label)}
// //                         onCheckedChange={(checked) => {
// //                           if (checked) {
// //                             setNewTemplate({
// //                               ...newTemplate,
// //                               channels: [...newTemplate.channels, channel.label]
// //                             });
// //                           } else {
// //                             setNewTemplate({
// //                               ...newTemplate,
// //                               channels: newTemplate.channels.filter(
// //                                 (c) => c !== channel.label
// //                               )
// //                             });
// //                           }
// //                         }}
// //                       />
// //                       <Label
// //                         htmlFor={channel.id}
// //                         className="flex items-center space-x-2 cursor-pointer"
// //                       >
// //                         <channel.icon className="h-4 w-4" />
// //                         <span>{channel.label}</span>
// //                       </Label>
// //                     </div>
// //                   ))}
// //                 </div>
// //               </div>

// //               {/* Message */}
// //               <div className="space-y-2">
// //                 <Label htmlFor="message">Template de message *</Label>
// //                 <Textarea
// //                   id="message"
// //                   placeholder="Tapez votre message ici..."
// //                   value={newTemplate.message}
// //                   onChange={(e) =>
// //                     setNewTemplate({ ...newTemplate, message: e.target.value })
// //                   }
// //                   className="min-h-[120px]"
// //                 />
// //               </div>

// //               {/* Variables */}
// //               <div className="space-y-2">
// //                 <Label>Variables disponibles</Label>
// //                 <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded">
// //                   {availableVariables.map((variable) => (
// //                     <Button
// //                       key={variable}
// //                       variant="outline"
// //                       size="sm"
// //                       className="text-xs h-6"
// //                       onClick={() => insertVariable(variable)}
// //                     >
// //                       {variable}
// //                     </Button>
// //                   ))}
// //                 </div>
// //               </div>
// //             </div>
// //             <DialogFooter>
// //               <Button
// //                 variant="outline"
// //                 onClick={() => setIsNewTemplateDialogOpen(false)}
// //               >
// //                 Annuler
// //               </Button>
// //               <Button onClick={handleCreateTemplate}>Créer le template</Button>
// //             </DialogFooter>
// //           </DialogContent>
// //         </Dialog>
// //       </div>

// //       {/* Templates existants */}
// //       <div className="space-y-4">
// //         {templates.map((template) => (
// //           <Card key={template.id}>
// //             <CardHeader>
// //               <CardTitle className="flex items-center justify-between">
// //                 <div className="flex items-center space-x-2">
// //                   <Zap className="h-5 w-5 text-warning" />
// //                   <span>{template.name}</span>
// //                   <Badge
// //                     variant="secondary"
// //                     className="flex items-center gap-1"
// //                   >
// //                     <Clock className="h-3 w-3" />
// //                     {template.custom_time}
// //                   </Badge>
// //                   {!template.is_active && (
// //                     <Badge variant="destructive">Inactif</Badge>
// //                   )}
// //                 </div>
// //                 <div className="flex items-center space-x-2">
// //                   <Switch
// //                     checked={template.is_active}
// //                     onCheckedChange={() =>
// //                       handleToggleTemplate(template.auto_id)
// //                     }
// //                   />
// //                   <Button
// //                     variant="outline"
// //                     size="sm"
// //                     onClick={() =>
// //                       setEditingTemplate(
// //                         editingTemplate === template.id ? null : template.id
// //                       )
// //                     }
// //                   >
// //                     <Edit className="h-4 w-4" />
// //                   </Button>
// //                   <AlertDialog>
// //                     <AlertDialogTrigger asChild>
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         className="text-destructive hover:text-destructive"
// //                       >
// //                         <Trash2 className="h-4 w-4" />
// //                       </Button>
// //                     </AlertDialogTrigger>
// //                     <AlertDialogContent>
// //                       <AlertDialogHeader>
// //                         <AlertDialogTitle>
// //                           Supprimer le template
// //                         </AlertDialogTitle>
// //                         <AlertDialogDescription>
// //                           Êtes-vous sûr de vouloir supprimer le template "
// //                           {template.name}" ? Cette action est irréversible.
// //                         </AlertDialogDescription>
// //                       </AlertDialogHeader>
// //                       <AlertDialogFooter>
// //                         <AlertDialogCancel>Annuler</AlertDialogCancel>
// //                         <AlertDialogAction
// //                           onClick={() => handleDeleteTemplate(template.auto_id)}
// //                           className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
// //                         >
// //                           Supprimer
// //                         </AlertDialogAction>
// //                       </AlertDialogFooter>
// //                     </AlertDialogContent>
// //                   </AlertDialog>
// //                 </div>
// //               </CardTitle>
// //             </CardHeader>
// //             <CardContent className="space-y-4">
// //               <div className="space-y-2">
// //                 <Label>Template de message</Label>
// //                 {editingTemplate === template.id ? (
// //                   <div className="space-y-2">
// //                     <Textarea
// //                       defaultValue={template.message_template}
// //                       className="min-h-[100px]"
// //                       id={`message-${template.id}`}
// //                     />
// //                     <div className="flex justify-end space-x-2">
// //                       <Button
// //                         variant="outline"
// //                         size="sm"
// //                         onClick={() => setEditingTemplate(null)}
// //                       >
// //                         Annuler
// //                       </Button>
// //                       <Button
// //                         size="sm"
// //                         onClick={() => {
// //                           const textarea = document.getElementById(
// //                             `message-${template.id}`
// //                           ) as HTMLTextAreaElement;
// //                           HandleEditTemplate(template.auto_id, textarea.value);
// //                         }}
// //                       >
// //                         <Save className="h-4 w-4 mr-2" />
// //                         Sauvegarder
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 ) : (
// //                   <div className="p-3 bg-muted rounded text-sm">
// //                     {template.message_template}
// //                   </div>
// //                 )}
// //               </div>

// //               <div className="flex items-center justify-between">
// //                 <div className="space-y-2">
// //                   <Label>Canaux d'envoi</Label>
// //                   <div className="flex space-x-2">
// //                     {template.channels.map((channel) => (
// //                       <Badge
// //                         key={channel}
// //                         variant="outline"
// //                         className="flex items-center gap-1"
// //                       >
// //                         {channel === "Email" && <Mail className="h-3 w-3" />}
// //                         {channel === "WhatsApp" && (
// //                           <MessageCircle className="h-3 w-3" />
// //                         )}
// //                         {channel === "SMS" && (
// //                           <MessageCircle className="h-3 w-3" />
// //                         )}
// //                         {channel}
// //                       </Badge>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 <div className="space-y-2">
// //                   <Label>Variables détectées</Label>
// //                   <div className="flex flex-wrap gap-1 text-xs max-w-md">
// //                     {template.variables.map((variable) => (
// //                       <Badge
// //                         key={variable}
// //                         variant="secondary"
// //                         className="text-xs"
// //                       >
// //                         {variable}
// //                       </Badge>
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>
// //             </CardContent>
// //           </Card>
// //         ))}
// //       </div>

// //       {/* Statistiques */}
// //       <Card>
// //         <CardHeader>
// //           <CardTitle className="flex items-center gap-2">
// //             <Calendar className="h-5 w-5" />
// //             Statistiques des envois
// //           </CardTitle>
// //         </CardHeader>
// //         <CardContent>
// //           <div className="grid grid-cols-4 gap-4 text-center">
// //             <div className="space-y-1">
// //               <div className="text-2xl font-bold text-primary">1,247</div>
// //               <div className="text-sm text-muted-foreground">
// //                 Messages envoyés ce mois
// //               </div>
// //             </div>
// //             <div className="space-y-1">
// //               <div className="text-2xl font-bold text-green-600">94.2%</div>
// //               <div className="text-sm text-muted-foreground">
// //                 Taux de délivrance
// //               </div>
// //             </div>
// //             <div className="space-y-1">
// //               <div className="text-2xl font-bold text-blue-600">67.8%</div>
// //               <div className="text-sm text-muted-foreground">
// //                 Taux d'ouverture
// //               </div>
// //             </div>
// //             <div className="space-y-1">
// //               <div className="text-2xl font-bold text-orange-600">12.4%</div>
// //               <div className="text-sm text-muted-foreground">
// //                 Taux de réponse
// //               </div>
// //             </div>
// //           </div>
// //         </CardContent>
// //       </Card>
// //     </div>
// //   );
// // };