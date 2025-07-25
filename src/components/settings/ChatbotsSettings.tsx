import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Bot, Clock, Target, Edit, Plus, Trash2, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ChatbotsSettings = () => {
  const { toast } = useToast();
  const [isNewChatbotDialogOpen, setIsNewChatbotDialogOpen] = useState(false);
  const [newChatbotName, setNewChatbotName] = useState("");
  const [newChatbotDescription, setNewChatbotDescription] = useState("");
  const [newChatbotType, setNewChatbotType] = useState("tertiaire");

  // États pour les configurations
  const [primaryConfig, setPrimaryConfig] = useState({
    authorizedUsers: "all",
    messageRetention: "unlimited"
  });

  const [secondaryConfig, setSecondaryConfig] = useState({
    autoHideResolved: true,
    autoCloseMessage: "Avez-vous encore besoin d'aide ?"
  });

  const [tertiaireChatbots, setTertiaireChatbots] = useState([
    { id: 1, name: "Check-ins du jour", description: "Séjours débutant aujourd'hui", conversations: 5 },
    { id: 2, name: "Secteur Centre-ville", description: "Appartements zone A", conversations: 12 },
    { id: 3, name: "Clients Airbnb", description: "Origine réservation Airbnb", conversations: 8 }
  ]);

  const handleSavePrimaryConfig = () => {
    toast({
      title: "Configuration sauvegardée",
      description: "Les paramètres du chatbot principal ont été mis à jour.",
    });
  };

  const handleSaveSecondaryConfig = () => {
    toast({
      title: "Configuration sauvegardée", 
      description: "Les paramètres du chatbot secondaire ont été mis à jour.",
    });
  };

  const handleCreateNewChatbot = () => {
    if (!newChatbotName.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un nom pour le chatbot.",
        variant: "destructive"
      });
      return;
    }

    const newChatbot = {
      id: Date.now(),
      name: newChatbotName,
      description: newChatbotDescription,
      conversations: 0
    };

    setTertiaireChatbots([...tertiaireChatbots, newChatbot]);
    setNewChatbotName("");
    setNewChatbotDescription("");
    setIsNewChatbotDialogOpen(false);

    toast({
      title: "Chatbot créé",
      description: `Le chatbot "${newChatbotName}" a été créé avec succès.`,
    });
  };

  const handleDeleteTertiaireChatbot = (id: number) => {
    setTertiaireChatbots(tertiaireChatbots.filter(bot => bot.id !== id));
    toast({
      title: "Chatbot supprimé",
      description: "Le chatbot tertiaire a été supprimé avec succès.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold">Configuration des Chatbots</h3>
          <p className="text-muted-foreground">Gestion des chatbots Principal, Secondaire et Tertiaires</p>
        </div>
        
        <Dialog open={isNewChatbotDialogOpen} onOpenChange={setIsNewChatbotDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nouveau Chatbot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Créer un nouveau chatbot</DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau chatbot tertiaire pour gérer des conversations spécialisées.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="chatbot-name">Nom du chatbot</Label>
                <Input
                  id="chatbot-name"
                  placeholder="ex: Support VIP"
                  value={newChatbotName}
                  onChange={(e) => setNewChatbotName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="chatbot-description">Description</Label>
                <Input
                  id="chatbot-description"
                  placeholder="ex: Clients premium et VIP"
                  value={newChatbotDescription}
                  onChange={(e) => setNewChatbotDescription(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNewChatbotDialogOpen(false)}>
                Annuler
              </Button>
              <Button onClick={handleCreateNewChatbot}>
                Créer le chatbot
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Chatbot Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-5 w-5 text-primary" />
              <span>Chatbot Principal 🏠</span>
              <Badge variant="secondary">Actif</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleSavePrimaryConfig}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </CardTitle>
          <CardDescription>
            Toutes les conversations - Vue chronologique complète
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Utilisateurs autorisés</Label>
              <Select 
                value={primaryConfig.authorizedUsers} 
                onValueChange={(value) => setPrimaryConfig({...primaryConfig, authorizedUsers: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les agents</SelectItem>
                  <SelectItem value="supervisors">Superviseurs uniquement</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Rétention messages</Label>
              <Select 
                value={primaryConfig.messageRetention}
                onValueChange={(value) => setPrimaryConfig({...primaryConfig, messageRetention: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unlimited">Illimitée</SelectItem>
                  <SelectItem value="1year">1 an</SelectItem>
                  <SelectItem value="6months">6 mois</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chatbot Secondaire */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-accent" />
              <span>Chatbot Secondaire ⏳</span>
              <Badge variant="secondary">Actif</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={handleSaveSecondaryConfig}>
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
          </CardTitle>
          <CardDescription>
            Conversations non clôturées - File de traitement active
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch 
              checked={secondaryConfig.autoHideResolved}
              onCheckedChange={(checked) => setSecondaryConfig({...secondaryConfig, autoHideResolved: checked})}
            />
            <Label>Masquer automatiquement les conversations résolues</Label>
          </div>
          <div className="space-y-2">
            <Label>Message de clôture automatique</Label>
            <Textarea 
              value={secondaryConfig.autoCloseMessage}
              onChange={(e) => setSecondaryConfig({...secondaryConfig, autoCloseMessage: e.target.value})}
              className="min-h-[60px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Chatbots Tertiaires */}
      <Card>
        <CardHeader>
          <CardTitle>Chatbots Tertiaires - Attribution Automatique</CardTitle>
          <CardDescription>
            Chatbots spécialisés avec critères d'attribution automatique
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {tertiaireChatbots.map((chatbot) => (
            <div key={chatbot.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center space-x-3">
                <Target className="h-4 w-4 text-accent" />
                <div>
                  <div className="font-medium">{chatbot.name}</div>
                  <div className="text-sm text-muted-foreground">{chatbot.description}</div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {chatbot.conversations} conv.
                </Badge>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Supprimer le chatbot</AlertDialogTitle>
                      <AlertDialogDescription>
                        Êtes-vous sûr de vouloir supprimer le chatbot "{chatbot.name}" ? 
                        Cette action est irréversible.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteTertiaireChatbot(chatbot.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
    </div>
  );
};