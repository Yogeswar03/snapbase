import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Prediction {
  id: string;
  startup_id: string;
  input_data: any;
  output_data: any;
  profit_loss: number;
  growth_rate: number;
  failure_probability: number;
  cashflow: number;
  runway_months: number;
  created_at: string;
}

export function usePredictions(startupId?: string) {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPredictions = async () => {
    if (!startupId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("predictions")
        .select("*")
        .eq("startup_id", startupId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch predictions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPredictions();
  }, [startupId]);

  const latestPrediction = predictions[0] || null;

  return {
    predictions,
    latestPrediction,
    loading,
    refetchPredictions: fetchPredictions,
  };
}