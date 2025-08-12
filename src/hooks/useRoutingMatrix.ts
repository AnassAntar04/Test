import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { RequestType, RoutingMatrix, EscalationRule } from "@/types/routing";
import { requestTypesService } from "@/services/requestTypesService";
import { routingMatrixService } from "@/services/routingMatrixService";
import { escalationRulesService } from "@/services/escalationRulesService";
import { getPermissionIcon, getPermissionForRole } from "@/utils/routingUtils";
import { supabase } from "@/integrations/supabase/client";

// Re-export types for compatibility
export type { RequestType, RoutingMatrix, EscalationRule };

export const useRoutingMatrix = () => {
  const [requestTypes, setRequestTypes] = useState([]);
  const [routingMatrix, setRoutingMatrix] = useState([]);
  const [escalationRules, setEscalationRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);

      const [requestTypesData, routingMatrixData, escalationRulesData] =
        await Promise.all([
          requestTypesService.fetchAll(),
          routingMatrixService.fetchAll(),
          escalationRulesService.fetchAll()
        ]);

      setRequestTypes(requestTypesData);
      setRoutingMatrix(routingMatrixData);
      setEscalationRules(escalationRulesData);
    } catch (error) {
      console.error("Error fetching routing data:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de routage",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscriptions
    const requestTypesChannel = supabase
      .channel("realtime-category")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "category" },
        () => fetchData()
      )
      .subscribe();

    const routingMatrixChannel = supabase
      .channel("realtime-escalation-categories")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "escalation_categories" },
        () => fetchData()
      )
      .subscribe();

    const escalationRulesChannel = supabase
      .channel("realtime-escalation-rules")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "escalation_rules" },
        () => fetchData()
      )
      .subscribe();

    return () => {
      // Cleanup
      supabase.removeChannel(requestTypesChannel);
      supabase.removeChannel(routingMatrixChannel);
      supabase.removeChannel(escalationRulesChannel);
    };
  }, []);

  const updateRoutingMatrix = async (
    requestTypeId: string,
    role: string,
    permissionType: RoutingMatrix["permission_type"]
  ) => {
    try {
      await routingMatrixService.update(requestTypeId, role, permissionType);

      // Update local state
      setRoutingMatrix((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.request_type_id === requestTypeId && item.role === role
        );

        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = {
            ...updated[existingIndex],
            permission_type: permissionType
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              id: crypto.randomUUID(),
              request_type_id: requestTypeId,
              role,
              permission_type: permissionType,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
        }
      });

      toast({
        title: "Succès",
        description: "Matrice de routage mise à jour"
      });
    } catch (error) {
      console.error("Error updating routing matrix:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la matrice de routage",
        variant: "destructive"
      });
    }
  };

  const addRequestType = async (requestType) => {
    try {
      const data = await requestTypesService.add(requestType);

      toast({
        title: "Succès",
        description: "Type de demande ajouté"
      });

      return true;
    } catch (error) {
      console.error("Error adding request type:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le type de demande",
        variant: "destructive"
      });
    }
  };

  const updateRequestType = async ( category_id : string , requestType) => {
    try {
      const data = await requestTypesService.update( category_id , requestType);

      toast({
        title: "Succès",
        description: "Type de demande mis à jour"
      });

      return true;
    } catch (error) {
      console.error("Error updating request type:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le type de demande",
        variant: "destructive"
      });
    }
  };

  const deleteRequestType = async (id: string) => {
    try {
      await requestTypesService.delete(id);

      toast({
        title: "Succès",
        description: "Type de demande supprimé"
      });
    } catch (error) {
      console.error("Error deleting request type:", error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le type de demande",
        variant: "destructive"
      });
    }
  };
  

  const updateEscalationRule = async (updates) => {
    try {
      await escalationRulesService.update(updates);

      // setEscalationRules(prev =>
      //   prev.map(rule =>
      //     rule.id === id ? { ...rule, ...updates } : rule
      //   )
      // );

      toast({
        title: "Succès",
        description: "Règle d'escalade mise à jour"
      });
    } catch (error) {
      console.error("Error updating escalation rule:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la règle d'escalade",
        variant: "destructive"
      });
    }
  };

  return {
    requestTypes,
    routingMatrix,
    escalationRules,
    loading,
    updateRoutingMatrix,
    addRequestType,
    updateRequestType,
    deleteRequestType,
    updateEscalationRule,
    getPermissionIcon,
    getPermissionForRole: (requestTypeId: string, role: string) =>
      getPermissionForRole(routingMatrix, requestTypeId, role),
    refetch: fetchData
  };
};
