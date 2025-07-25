import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Zap,
  Edit,
  Plus,
  Trash2,
  Save,
  Clock,
  Mail,
  MessageCircle,
  Calendar
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const AutoMessagesSettings = () => {
  const { toast } = useToast();
  const [isNewTemplateDialogOpen, setIsNewTemplateDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<number | null>(null);

  const [templates, setTemplates] = useState([]); // Placeholder for Supabase templates

  // Form states
  const [newTemplate, setNewTemplate] = useState({
    trigger: "",
    customTrigger: "",
    time: "immediate",
    customTime: "09:00",
    message: "",
    channels: [] as string[],
    isActive: true
  });

  // const [templates, setTemplates] = useState([
  //   {
  //     id: 1,
  //     trigger: "Confirmation réservation",
  //     time: "Immédiat",
  //     message:
  //       "Bonjour [Traveller Name], Bienvenue ! Votre réservation à [Property Name] est confirmée pour le [Check-in Date]. Vous recevrez les instructions d'accès 24h avant votre arrivée. Code de réservation: [Booking Code]",
  //     channels: ["Email", "WhatsApp"],
  //     isActive: true
  //   },
  //   {
  //     id: 2,
  //     trigger: "J-1 avant arrivée",
  //     time: "13h00",
  //     message:
  //       "Bonjour [Traveller Name], Votre séjour arrive à grands pas ! Voici vos codes d'accès pour demain: Code porte: [Door Code], WiFi: [WiFi Password]. Adresse exacte: [Property Address]. Bonne arrivée !",
  //     channels: ["WhatsApp", "Email"],
  //     isActive: true
  //   },
  //   {
  //     id: 3,
  //     trigger: "J-1 avant départ",
  //     time: "14h00",
  //     message:
  //       "Bonjour [Traveller Name], Votre séjour se termine demain à [Check-out Time]. Merci de laisser les clés dans la boîte et de fermer toutes les fenêtres. Comment s'est passé votre séjour ?",
  //     channels: ["WhatsApp", "Email"],
  //     isActive: true
  //   },
  //   {
  //     id: 4,
  //     trigger: "Post check-out",
  //     time: "13h00",
  //     message:
  //       "Nous vous remercions pour votre séjour à [Property Name] ! Votre avis nous intéresse : [Review Link]. À très bientôt pour un nouveau séjour !",
  //     channels: ["Email", "WhatsApp"],
  //     isActive: true
  //   }
  // ]);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("auto_message_templates")
        .select("*")
        .order("created_at", { ascending: true }); // or false for descending

      console.log("Fetched templates:", error);
      setTemplates(data || []);
      console.log("Templates fetched from Supabase:", data);
    } catch (error) {
      console.error("Error fetching templates:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les templates depuis Supabase.",
        variant: "destructive"
      });
    }
  };

  const HandleEditTemplate = async (id: string, textarea: string) => {
    // const template = templates.find((t) => t.id === id);
    // if (!template) return;
    const { data, error } = await supabase
      .from("auto_message_templates")
      .update({
        message_template: textarea
      })
      .eq("auto_id", id);

    setEditingTemplate(null);
    fetchTemplates();

    // console.log("Editing template:", editingTemplate);
    // console.log("Editing template:", textarea);
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  // console.log("Editing template:", editingTemplate);

  const availableTriggers = [
    "Confirmation réservation",
    "J-7 avant arrivée",
    "J-1 avant arrivée",
    "Le jour d'arrivée",
    "Pendant le séjour",
    "J-1 avant départ",
    "Post check-out",
    "Feedback demande",
    "Personnalisé"
  ];

  const availableChannels = [
    { id: "email", label: "Email", icon: Mail },
    { id: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { id: "sms", label: "SMS", icon: MessageCircle }
  ];

  const availableVariables = [
    "[Traveller Name]",
    "[Property Name]",
    "[Check-in Date]",
    "[Check-out Date]",
    "[Check-in Time]",
    "[Check-out Time]",
    "[Door Code]",
    "[WiFi Password]",
    "[Property Address]",
    "[Booking Code]",
    "[Phone Number]",
    "[Review Link]",
    "[Host Name]",
    "[Emergency Contact]",
    "[Total Amount]",
    "[PIN Code]"
  ];

  const resetNewTemplate = () => {
    setNewTemplate({
      trigger: "",
      customTrigger: "",
      time: "immediate",
      customTime: "09:00",
      message: "",
      channels: [],
      isActive: true
    });
  };

  const handleCreateTemplate = () => {
    if (
      !newTemplate.trigger ||
      !newTemplate.message ||
      newTemplate.channels.length === 0
    ) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive"
      });
      return;
    }

    const finalTrigger =
      newTemplate.trigger === "Personnalisé"
        ? newTemplate.customTrigger
        : newTemplate.trigger;
    const finalTime =
      newTemplate.time === "custom"
        ? newTemplate.customTime
        : newTemplate.time === "immediate"
        ? "Immédiat"
        : newTemplate.time;

    const template = {
      id: Date.now(),
      trigger: finalTrigger,
      time: finalTime,
      message: newTemplate.message,
      channels: newTemplate.channels,
      isActive: newTemplate.isActive
    };

    setTemplates([...templates, template]);
    resetNewTemplate();
    setIsNewTemplateDialogOpen(false);

    toast({
      title: "Template créé",
      description: `Le template "${finalTrigger}" a été créé avec succès.`
    });
  };

  const handleToggleTemplate = async (id: string) => {
    // setTemplates(
    //   templates.map((t) => (t.id === id ? { ...t, isActive: !t.isActive } : t))
    // );

    // const template = templates.find((t) => t.id === id);

      const { data, error } = await supabase
      .from("auto_message_templates")
      .update({
        is_active: templates.find((t) => t.auto_id === id)?.is_active ? false : true 
      })
      .eq("auto_id", id);

      fetchTemplates();
      // .select("*")

      // console.log("Toggling template:", data, error);
    // toast({
    //   title: "Template mis à jour",
    //   description: `Le template "${template?.trigger}" a été ${
    //     template?.isActive ? "désactivé" : "activé"
    //   }.`
    // });
  };

  const handleDeleteTemplate = async (id: string) => {

    const { error } = await supabase
      .from("auto_message_templates")
      .delete()
      .eq("auto_id", id);

      fetchTemplates();

    // const template = templates.find((t) => t.id === id);
    // setTemplates(templates.filter((t) => t.id !== id));

    // toast({
    //   title: "Template supprimé",
    //   description: `Le template "${template?.trigger}" a été supprimé.`
    // });
  };

  const handleSaveTemplate = (id: number, updatedMessage: string) => {
    setTemplates(
      templates.map((t) =>
        t.id === id ? { ...t, message: updatedMessage } : t
      )
    );

    setEditingTemplate(null);
    toast({
      title: "Template sauvegardé",
      description: "Les modifications ont été enregistrées."
    });
  };

  const insertVariable = (variable: string) => {
    setNewTemplate({
      ...newTemplate,
      message: newTemplate.message + variable
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Messages Automatiques</h3>
          <p className="text-muted-foreground">
            Configuration des workflows de messages par étape du parcours
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
              <DialogTitle>Créer un nouveau template</DialogTitle>
              <DialogDescription>
                Configurez un nouveau message automatique avec ses déclencheurs
                et canaux d'envoi.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              {/* Déclencheur */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="trigger">Déclencheur *</Label>
                  <Select
                    value={newTemplate.trigger}
                    onValueChange={(value) =>
                      setNewTemplate({ ...newTemplate, trigger: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un déclencheur" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableTriggers.map((trigger) => (
                        <SelectItem key={trigger} value={trigger}>
                          {trigger}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {newTemplate.trigger === "Personnalisé" && (
                  <div className="space-y-2">
                    <Label htmlFor="customTrigger">
                      Déclencheur personnalisé *
                    </Label>
                    <Input
                      id="customTrigger"
                      placeholder="ex: J-3 avant arrivée"
                      value={newTemplate.customTrigger}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          customTrigger: e.target.value
                        })
                      }
                    />
                  </div>
                )}
              </div>

              {/* Horaire */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">Horaire d'envoi</Label>
                  <Select
                    value={newTemplate.time}
                    onValueChange={(value) =>
                      setNewTemplate({ ...newTemplate, time: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immédiat</SelectItem>
                      <SelectItem value="09:00">09h00</SelectItem>
                      <SelectItem value="13:00">13h00</SelectItem>
                      <SelectItem value="18:00">18h00</SelectItem>
                      <SelectItem value="custom">Personnalisé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newTemplate.time === "custom" && (
                  <div className="space-y-2">
                    <Label htmlFor="customTime">Heure personnalisée</Label>
                    <Input
                      id="customTime"
                      type="time"
                      value={newTemplate.customTime}
                      onChange={(e) =>
                        setNewTemplate({
                          ...newTemplate,
                          customTime: e.target.value
                        })
                      }
                    />
                  </div>
                )}
              </div>

              {/* Canaux */}
              <div className="space-y-2">
                <Label>Canaux d'envoi *</Label>
                <div className="grid grid-cols-3 gap-4">
                  {availableChannels.map((channel) => (
                    <div
                      key={channel.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={channel.id}
                        checked={newTemplate.channels.includes(channel.label)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewTemplate({
                              ...newTemplate,
                              channels: [...newTemplate.channels, channel.label]
                            });
                          } else {
                            setNewTemplate({
                              ...newTemplate,
                              channels: newTemplate.channels.filter(
                                (c) => c !== channel.label
                              )
                            });
                          }
                        }}
                      />
                      <Label
                        htmlFor={channel.id}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <channel.icon className="h-4 w-4" />
                        <span>{channel.label}</span>
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Template de message *</Label>
                <Textarea
                  id="message"
                  placeholder="Tapez votre message ici..."
                  value={newTemplate.message}
                  onChange={(e) =>
                    setNewTemplate({ ...newTemplate, message: e.target.value })
                  }
                  className="min-h-[120px]"
                />
              </div>

              {/* Variables */}
              <div className="space-y-2">
                <Label>Variables disponibles</Label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded">
                  {availableVariables.map((variable) => (
                    <Button
                      key={variable}
                      variant="outline"
                      size="sm"
                      className="text-xs h-6"
                      onClick={() => insertVariable(variable)}
                    >
                      {variable}
                    </Button>
                  ))}
                </div>
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
          <Card key={template.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Zap className="h-5 w-5 text-warning" />
                  <span>{template.name}</span>
                  <Badge
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Clock className="h-3 w-3" />
                    {template.custom_time}
                  </Badge>
                  {!template.is_active && (
                    <Badge variant="destructive">Inactif</Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={template.is_active}
                    onCheckedChange={() =>
                      handleToggleTemplate(template.auto_id)
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setEditingTemplate(
                        editingTemplate === template.id ? null : template.id
                      )
                    }
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
                          onClick={() => handleDeleteTemplate(template.auto_id)}
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
              <div className="space-y-2">
                <Label>Template de message</Label>
                {editingTemplate === template.id ? (
                  <div className="space-y-2">
                    <Textarea
                      defaultValue={template.message_template}
                      className="min-h-[100px]"
                      id={`message-${template.id}`}
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTemplate(null)}
                      >
                        Annuler
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => {
                          const textarea = document.getElementById(
                            `message-${template.id}`
                          ) as HTMLTextAreaElement;
                          HandleEditTemplate(template.auto_id, textarea.value);
                        }}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Sauvegarder
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-muted rounded text-sm">
                    {template.message_template}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Label>Canaux d'envoi</Label>
                  <div className="flex space-x-2">
                    {template.channels.map((channel) => (
                      <Badge
                        key={channel}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {channel === "Email" && <Mail className="h-3 w-3" />}
                        {channel === "WhatsApp" && (
                          <MessageCircle className="h-3 w-3" />
                        )}
                        {channel === "SMS" && (
                          <MessageCircle className="h-3 w-3" />
                        )}
                        {channel}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Variables détectées</Label>
                  <div className="flex flex-wrap gap-1 text-xs max-w-md">
                    {template.variables.map((variable) => (
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Statistiques des envois
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div className="space-y-1">
              <div className="text-2xl font-bold text-primary">1,247</div>
              <div className="text-sm text-muted-foreground">
                Messages envoyés ce mois
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-green-600">94.2%</div>
              <div className="text-sm text-muted-foreground">
                Taux de délivrance
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-blue-600">67.8%</div>
              <div className="text-sm text-muted-foreground">
                Taux d'ouverture
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-2xl font-bold text-orange-600">12.4%</div>
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
