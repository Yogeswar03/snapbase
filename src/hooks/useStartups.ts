import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

type StartupSector = "saas" | "fintech" | "healthtech" | "edtech" | "ecommerce" | "marketplace" | "ai_ml" | "biotech" | "other";
type StartupStage = "idea" | "prototype" | "mvp" | "early_stage" | "growth" | "mature";

export interface Startup {
  id: string;
  name: string;
  sector: StartupSector;
  stage: StartupStage;
  team_experience: number;
  description?: string;
  created_at: string;
  updated_at: string;
}

export function useStartups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchStartups = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("startups")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setStartups(data || []);
    } catch (error) {
      console.error("Error fetching startups:", error);
      toast({
        title: "Error",
        description: "Failed to fetch startups",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStartups();
  }, [user]);

  const createStartup = async (startup: Omit<Startup, "id" | "created_at" | "updated_at">) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from("startups")
        .insert({
          ...startup,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setStartups(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Startup created successfully!",
      });

      return data;
    } catch (error) {
      console.error("Error creating startup:", error);
      toast({
        title: "Error",
        description: "Failed to create startup",
        variant: "destructive",
      });
      return null;
    }
  };

  return {
    startups,
    loading,
    createStartup,
    refetchStartups: fetchStartups,
  };
}