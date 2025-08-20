import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface TeamMember {
  id: string;
  startup_id: string;
  name: string;
  email: string | null;
  role: string | null;
  created_at: string;
}

export function useTeamMembers(startupId?: string) {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeam = async () => {
    if (!startupId) {
      setTeam([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data, error } = await (supabase
      .from("startup_team_members" as any)
      .select("*")
      .eq("startup_id", startupId)
      .order("created_at", { ascending: true }) as any);
    setTeam(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchTeam(); }, [startupId]);

  const addTeamMember = async (
    member: Omit<TeamMember, "id" | "created_at">
  ) => {
    const { data, error } = await (supabase
      .from("startup_team_members" as any)
      .insert([member])
      .select()
      .single() as any);
    if (data) setTeam((prev) => [...prev, data]);
    return { data, error };
  };

  return { team, loading, addTeamMember, refetchTeam: fetchTeam };
}
