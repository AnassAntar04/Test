import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Save, Calendar, Clock, Settings, RotateCcw } from "lucide-react";

export const GeneralSettings = () => {
  const { toast } = useToast();
  const [backupTime, setBackupTime] = useState("02:00");
  const [backupFrequency, setBackupFrequency] = useState("daily");
  const [maintenanceDay, setMaintenanceDay] = useState("sunday");
  const [maintenanceStartTime, setMaintenanceStartTime] = useState("03:00");
  const [maintenanceEndTime, setMaintenanceEndTime] = useState("04:00");
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false);
  const [isMaintenanceDialogOpen, setIsMaintenanceDialogOpen] = useState(false);

  const handleBackupSave = () => {
    toast({
      title: "Configuration sauvegardée",
      description: `Sauvegarde automatique programmée ${backupFrequency === 'daily' ? 'quotidiennement' : 'hebdomadairement'} à ${backupTime}`,
      duration: 3000,
    });
    setIsBackupDialogOpen(false);
  };

  const handleMaintenanceSave = () => {
    toast({
      title: "Maintenance programmée",
      description: `Maintenance planifiée le ${maintenanceDay} de ${maintenanceStartTime} à ${maintenanceEndTime}`,
      duration: 3000,
    });
    setIsMaintenanceDialogOpen(false);
  };

  const handleResetDefaults = () => {
    setBackupTime("02:00");
    setBackupFrequency("daily");
    setMaintenanceDay("sunday");
    setMaintenanceStartTime("03:00");
    setMaintenanceEndTime("04:00");
    toast({
      title: "Paramètres restaurés",
      description: "Tous les paramètres ont été restaurés par défaut",
      duration: 3000,
    });
  };

  const handleSaveChanges = () => {
    toast({
      title: "Modifications sauvegardées",
      description: "Tous les paramètres ont été mis à jour avec succès",
      duration: 3000,
    });
  };

  const getDayLabel = (day: string) => {
    const days: Record<string, string> = {
      monday: "Lundi",
      tuesday: "Mardi", 
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche"
    };
    return days[day] || day;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold">Paramètres Généraux</h3>
        <p className="text-muted-foreground">Configuration système et préférences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paramètres Système</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Fuseau horaire</Label>
              <Select defaultValue="casablanca">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="casablanca">Casablanca (GMT+1)</SelectItem>
                  <SelectItem value="paris">Paris (CET)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Langue par défaut</Label>
              <Select defaultValue="fr">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ar">العربية</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Mode sombre</div>
                <div className="text-sm text-muted-foreground">Interface en thème sombre</div>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Traduction automatique</div>
                <div className="text-sm text-muted-foreground">Traduction des messages pour les agents</div>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance & Backup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Sauvegarde automatique</div>
              <div className="text-sm text-muted-foreground">
                Sauvegarde {backupFrequency === 'daily' ? 'quotidienne' : 'hebdomadaire'} à {backupTime}
              </div>
            </div>
            <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Configurer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configuration de la sauvegarde automatique</DialogTitle>
                  <DialogDescription>
                    Configurez la fréquence et l'heure de sauvegarde automatique
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Fréquence</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Quotidienne</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Heure de sauvegarde</Label>
                    <Input
                      type="time"
                      value={backupTime}
                      onChange={(e) => setBackupTime(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleBackupSave}>
                    Sauvegarder
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Maintenance programmée</div>
              <div className="text-sm text-muted-foreground">
                {getDayLabel(maintenanceDay)} {maintenanceStartTime}-{maintenanceEndTime}
              </div>
            </div>
            <Dialog open={isMaintenanceDialogOpen} onOpenChange={setIsMaintenanceDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Planifier
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Planification de la maintenance</DialogTitle>
                  <DialogDescription>
                    Configurez le jour et les heures de maintenance programmée
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Jour de la semaine</Label>
                    <Select value={maintenanceDay} onValueChange={setMaintenanceDay}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monday">Lundi</SelectItem>
                        <SelectItem value="tuesday">Mardi</SelectItem>
                        <SelectItem value="wednesday">Mercredi</SelectItem>
                        <SelectItem value="thursday">Jeudi</SelectItem>
                        <SelectItem value="friday">Vendredi</SelectItem>
                        <SelectItem value="saturday">Samedi</SelectItem>
                        <SelectItem value="sunday">Dimanche</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Heure de début</Label>
                      <Input
                        type="time"
                        value={maintenanceStartTime}
                        onChange={(e) => setMaintenanceStartTime(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Heure de fin</Label>
                      <Input
                        type="time"
                        value={maintenanceEndTime}
                        onChange={(e) => setMaintenanceEndTime(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsMaintenanceDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleMaintenanceSave}>
                    Planifier
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-2 pt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Restaurer par défaut
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restaurer les paramètres par défaut</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action va restaurer tous les paramètres à leurs valeurs par défaut. Cette action est irréversible.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetDefaults}>
                Restaurer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <Button onClick={handleSaveChanges}>
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder les modifications
        </Button>
      </div>
    </div>
  );
};