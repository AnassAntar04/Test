import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { PROFILE_TYPES } from "@/constants/user-management";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface UserFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  selectedProfile: string;
  setSelectedProfile: (profile: string) => void;
}

export const UserFilters = ({
  searchTerm,
  setSearchTerm,
  selectedProfile,
  setSelectedProfile
}: UserFiltersProps) => {
  const [Roles, setRoles] = useState([]);
  const FetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from("roles")
        .select("role_id , name ");

      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error("Error fetching roles:", error);
    }
  };

  useEffect(() => {
    FetchRoles();
  }, []);
  
  return (
    <div className="flex space-x-4">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Rechercher par nom ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedProfile} onValueChange={setSelectedProfile}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Tous les profils" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les profils</SelectItem>
          {Roles.map(role => (
            <SelectItem key={role.role_id} value={role.role_id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
