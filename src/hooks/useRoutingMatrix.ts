import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { RequestType, RoutingMatrix, EscalationRule } from "@/types/routing";
import { requestTypesService } from "@/services/requestTypesService";
import { routingMatrixService } from "@/services/routingMatrixService";
import { escalationRulesService } from "@/services/escalationRulesService";
import { getPermissionIcon, getPermissionForRole } from "@/utils/routingUtils";

// Re-export types for compatibility
export type { RequestType, RoutingMatrix, EscalationRule };

export const useRoutingMatrix = () => {
  const [requestTypes, setRequestTypes] = useState<RequestType[]>([]);
  const [routingMatrix, setRoutingMatrix] = useState<RoutingMatrix[]>([]);
  const [escalationRules, setEscalationRules] = useState<EscalationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [requestTypesData, routingMatrixData, escalationRulesData] = await Promise.all([
        requestTypesService.fetchAll(),
        routingMatrixService.fetchAll(),
        escalationRulesService.fetchAll()
      ]);

      setRequestTypes(requestTypesData);
      setRoutingMatrix(routingMatrixData);
      setEscalationRules(escalationRulesData);
    } catch (error) {
      console.error('Error fetching routing data:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les données de routage",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateRoutingMatrix = async (requestTypeId: string, role: string, permissionType: RoutingMatrix['permission_type']) => {
    try {
      await routingMatrixService.update(requestTypeId, role, permissionType);

      // Update local state
      setRoutingMatrix(prev => {
        const existingIndex = prev.findIndex(
          item => item.request_type_id === requestTypeId && item.role === role
        );
        
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], permission_type: permissionType };
          return updated;
        } else {
          return [...prev, {
            id: crypto.randomUUID(),
            request_type_id: requestTypeId,
            role,
            permission_type: permissionType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }];
        }
      });

      toast({
        title: "Succès",
        description: "Matrice de routage mise à jour",
      });
    } catch (error) {
      console.error('Error updating routing matrix:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la matrice de routage",
        variant: "destructive",
      });
    }
  };

  const addRequestType = async (requestType: Omit<RequestType, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await requestTypesService.add(requestType);
      setRequestTypes(prev => [...prev, data]);
      
      toast({
        title: "Succès",
        description: "Type de demande ajouté",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding request type:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le type de demande",
        variant: "destructive",
      });
    }
  };

  const deleteRequestType = async (id: string) => {
    try {
      await requestTypesService.delete(id);
      setRequestTypes(prev => prev.filter(type => type.id !== id));
      
      toast({
        title: "Succès",
        description: "Type de demande supprimé",
      });
    } catch (error) {
      console.error('Error deleting request type:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le type de demande",
        variant: "destructive",
      });
    }
  };

  const updateEscalationRule = async (id: string, updates: Partial<EscalationRule>) => {
    try {
      await escalationRulesService.update(id, updates);

      setEscalationRules(prev => 
        prev.map(rule => 
          rule.id === id ? { ...rule, ...updates } : rule
        )
      );

      toast({
        title: "Succès",
        description: "Règle d'escalade mise à jour",
      });
    } catch (error) {
      console.error('Error updating escalation rule:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la règle d'escalade",
        variant: "destructive",
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
    deleteRequestType,
    updateEscalationRule,
    getPermissionIcon,
    getPermissionForRole: (requestTypeId: string, role: string) => 
      getPermissionForRole(routingMatrix, requestTypeId, role),
    refetch: fetchData
  };
};