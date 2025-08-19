import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Metric {
  id: string;
  startup_id: string;
  revenue: number;
  expenses: number;
  burn_rate: number;
  runway: number;
  period_start: string;
  period_end: string;
  created_at: string;
}

export function useMetrics(startupId?: string) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMetrics = async () => {
    if (!startupId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("metrics")
        .select("*")
        .eq("startup_id", startupId)
        .order("period_start", { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error("Error fetching metrics:", error);
      toast({
        title: "Error",
        description: "Failed to fetch metrics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [startupId]);

  const addMetric = async (metric: Omit<Metric, "id" | "created_at">) => {
    try {
      const { data, error } = await supabase
        .from("metrics")
        .insert(metric)
        .select()
        .single();

      if (error) throw error;

      setMetrics(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Metric added successfully!",
      });

      return data;
    } catch (error) {
      console.error("Error adding metric:", error);
      toast({
        title: "Error",
        description: "Failed to add metric",
        variant: "destructive",
      });
      return null;
    }
  };

  const latestMetric = metrics[0] || null;

  return {
    metrics,
    latestMetric,
    loading,
    addMetric,
    refetchMetrics: fetchMetrics,
  };
}