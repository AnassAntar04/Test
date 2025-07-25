import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userRole: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (
    email: string,
    password: string,
    userData: any
  ) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updatePassword: (password: string) => Promise<{ error: any }>;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchUserRole = async (userId: string) => {
    try {
      console.log("AuthContext: Fetching role for user:", userId);

      // const { data, error } = await supabase
      //   .from("user_roles")
      //   .select("role")
      //   .eq("user_id", userId)
      //   .eq("is_active", true)
      //   .order("created_at", { ascending: false })
      //   .limit(1)
      //   .single();


      const { data, error } = await supabase
        .from("profiles")
        .select("role_id, roles(name)")
        .eq("auth_user_id", userId)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();


      // const {data : UserData, error: userError} = await supabase
      // .from("roles")
      // .select("name")
      // .eq("id", data.roles_id)

        
      // console.log("AuthContext: Role fetch result:", data);
      if (error && error.code !== "PGRST116") {
        console.error("Error fetching user role:", error);
        throw error;
      }

      console.log("AuthContext: User role fetched:", data);
      // const role = data?.role || null ;
      const role = data?.roles?.name == 'Owner' ? 'super_admin' : data?.roles?.name;
      console.log("AuthContext: User role fetched:", role);
      setUserRole(role);
    } catch (error) {
      console.error("Error fetching user role:", error);
      setUserRole(null);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      console.log("AuthContext: Auth state changed:", event, session);
      if (session?.user) {
        setTimeout(() => {
          fetchUserRole(session.user.id);
        }, 0);
      } else {
        setUserRole(null);
      }

      setLoading(false);
    });

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // console.log('AuthContext: Initial user state:', user);
  // console.log("AuthContext: Initial session state:", session);
  // console.log("AuthContext: Initial userRole state:", userRole);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Messages d'erreur personnalisés en français
        let errorMessage = error.message;

        if (error.message.includes("Invalid login credentials")) {
          errorMessage =
            "Email ou mot de passe incorrect. Vérifiez vos identifiants.";
        } else if (error.message.includes("Email not confirmed")) {
          errorMessage =
            "Votre email n'est pas confirmé. Vérifiez votre boîte de réception.";
        } else if (error.message.includes("Too many requests")) {
          errorMessage =
            "Trop de tentatives de connexion. Veuillez patienter quelques minutes.";
        }

        toast({
          title: "Login Error!!!",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Successfull Login",
          description: "Welcome!"
        });
      }

      return { error };
    } catch (error) {
      console.error("Erreur de connexion:", error);
      toast({
        title: "Erreur technique",
        description:
          "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;

      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });

      if (error) {
        // Messages d'erreur personnalisés en français
        let errorMessage = error.message;

        if (error.message.includes("User already registered")) {
          errorMessage =
            "Un compte existe déjà avec cet email. Essayez de vous connecter.";
        } else if (error.message.includes("Password should be at least")) {
          errorMessage = "Le mot de passe doit contenir au moins 6 caractères.";
        } else if (error.message.includes("Invalid email")) {
          errorMessage = "Format d'email invalide.";
        }

        toast({
          title: "Erreur d'inscription",
          description: errorMessage,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Inscription réussie",
          description:
            "Compte créé avec succès ! Vous pouvez maintenant vous connecter."
        });
      }

      return { error };
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      toast({
        title: "Erreur technique",
        description:
          "Une erreur inattendue s'est produite. Veuillez réessayer.",
        variant: "destructive"
      });
      return { error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?mode=reset`
      });

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible d'envoyer l'email de réinitialisation.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Email envoyé",
          description:
            "Vérifiez votre boîte de réception pour réinitialiser votre mot de passe."
        });
      }

      return { error };
    } catch (error) {
      console.error("Erreur de réinitialisation:", error);
      return { error };
    }
  };

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        toast({
          title: "Erreur",
          description: "Impossible de mettre à jour le mot de passe.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Mot de passe mis à jour",
          description: "Votre mot de passe a été modifié avec succès."
        });
      }

      return { error };
    } catch (error) {
      console.error("Erreur de mise à jour du mot de passe:", error);
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    // Force redirect to auth page after signout
    window.location.href = "/auth";
  };

  const hasPermission = (permission: string): boolean => {
    // This is a basic implementation. For detailed permission checks,
    // use the usePermissions hook which loads actual database permissions
    if (userRole === "super_admin") return true;
    if (userRole === "administrateur") {
      // Admins have most permissions except super admin specific ones
      return !permission.includes("super_admin");
    }
    // For other roles, they should use usePermissions hook for detailed checks
    return false;
  };

  const value = {
    user,
    session,
    userRole,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    hasPermission
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
