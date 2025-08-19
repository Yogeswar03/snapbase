import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Target,
  Calendar,
  BarChart3,
  Zap,
  ArrowUpRight,
  Plus,
  LogOut,
  User,
  Building2,
  Brain,
  Lightbulb,
  TrendingDown
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStartups, type Startup } from "@/hooks/useStartups";
import { CreateStartupDialog } from "@/components/CreateStartupDialog";
import { MetricsUpload } from "@/components/MetricsUpload";
import { usePredictions } from "@/hooks/usePredictions";
import { useMetrics } from "@/hooks/useMetrics";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { startups, loading: startupsLoading } = useStartups();
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [generatingPrediction, setGeneratingPrediction] = useState(false);
  const [generatingPlaybook, setGeneratingPlaybook] = useState(false);
  const [playbook, setPlaybook] = useState<string>("");
  const { toast } = useToast();

  // Auto-select first startup when startups load
  useState(() => {
    if (startups.length > 0 && !selectedStartup) {
      setSelectedStartup(startups[0]);
    }
  });

  const { metrics, latestMetric, loading: metricsLoading } = useMetrics(selectedStartup?.id);
  const { predictions, latestPrediction, loading: predictionsLoading, refetchPredictions } = usePredictions(selectedStartup?.id);

  const generatePrediction = async () => {
    if (!selectedStartup || !latestMetric) {
      toast({
        title: "Missing data",
        description: "Add some metrics first to generate predictions",
        variant: "destructive",
      });
      return;
    }

    setGeneratingPrediction(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-predictions', {
        body: {
          startup_id: selectedStartup.id,
          current_metrics: {
            revenue: latestMetric.revenue,
            expenses: latestMetric.expenses,
            burn_rate: latestMetric.burn_rate,
            runway: latestMetric.runway,
          },
          startup_data: {
            sector: selectedStartup.sector,
            stage: selectedStartup.stage,
            team_experience: selectedStartup.team_experience,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Prediction generated",
        description: "AI has analyzed your startup and generated new predictions",
      });

      await refetchPredictions();
    } catch (error) {
      console.error('Error generating prediction:', error);
      toast({
        title: "Prediction failed",
        description: "Failed to generate prediction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPrediction(false);
    }
  };

  const generatePlaybook = async () => {
    if (!selectedStartup) return;

    setGeneratingPlaybook(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-growth-playbook', {
        body: {
          startup_id: selectedStartup.id,
          current_stage: selectedStartup.stage,
          sector: selectedStartup.sector,
          current_metrics: latestMetric ? {
            revenue: latestMetric.revenue,
            expenses: latestMetric.expenses,
            burn_rate: latestMetric.burn_rate,
            runway: latestMetric.runway,
          } : undefined,
          prediction_data: latestPrediction ? {
            failure_probability: latestPrediction.failure_probability,
            growth_rate: latestPrediction.growth_rate,
          } : undefined,
        }
      });

      if (error) throw error;

      setPlaybook(data.playbook);
      toast({
        title: "Playbook generated",
        description: "Your personalized AI Growth Playbook is ready",
      });
    } catch (error) {
      console.error('Error generating playbook:', error);
      toast({
        title: "Playbook failed",
        description: "Failed to generate playbook. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingPlaybook(false);
    }
  };

  if (startupsLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="text-center space-y-4">
          <BarChart3 className="h-8 w-8 animate-pulse mx-auto text-primary" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (startups.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <div className="border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                ScaleLens Dashboard
              </h1>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto space-y-6">
            <Building2 className="h-16 w-16 mx-auto text-muted-foreground" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to ScaleLens</h2>
              <p className="text-muted-foreground">
                Create your first startup to begin tracking performance and receiving AI-powered insights.
              </p>
            </div>
            <CreateStartupDialog />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="border-b border-border/40 bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                Dashboard
              </h1>
              <Select 
                value={selectedStartup?.id || ""} 
                onValueChange={(value) => {
                  const startup = startups.find(s => s.id === value);
                  setSelectedStartup(startup || null);
                }}
              >
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select startup" />
                </SelectTrigger>
                <SelectContent>
                  {startups.map((startup) => (
                    <SelectItem key={startup.id} value={startup.id}>
                      {startup.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <CreateStartupDialog />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {selectedStartup && (
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary">{selectedStartup.sector}</Badge>
              <Badge variant="outline">{selectedStartup.stage}</Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created: {new Date(selectedStartup.created_at).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {!selectedStartup ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Select a startup to view its dashboard</p>
          </div>
        ) : (
          <>
          {/* Key Metrics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${latestMetric?.revenue?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Current period
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Burn Rate</CardTitle>
                <TrendingDown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${latestMetric?.burn_rate?.toLocaleString() || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  Monthly burn
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Runway</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {latestMetric?.runway || "0"} months
                </div>
                <p className="text-xs text-muted-foreground">
                  At current burn
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Metrics Upload Section */}
          {selectedStartup && (
            <MetricsUpload startupId={selectedStartup.id} />
          )}

          {/* AI Predictions */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Predictions
                  <Button 
                    size="sm" 
                    onClick={generatePrediction}
                    disabled={generatingPrediction || !latestMetric}
                  >
                    {generatingPrediction ? "Generating..." : "Generate New"}
                  </Button>
                </CardTitle>
                <CardDescription>
                  AI-powered insights based on your current metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                {predictionsLoading ? (
                  <p className="text-muted-foreground">Loading predictions...</p>
                ) : latestPrediction ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Growth Rate</p>
                        <p className="text-lg font-semibold text-success">
                          {(latestPrediction.growth_rate * 100).toFixed(1)}%/mo
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Failure Risk</p>
                        <p className="text-lg font-semibold text-destructive">
                          {(latestPrediction.failure_probability * 100).toFixed(1)}%
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Predicted Runway</p>
                        <p className="text-lg font-semibold">
                          {latestPrediction.runway_months} months
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">12M Cashflow</p>
                        <p className="text-lg font-semibold">
                          ${latestPrediction.cashflow?.toLocaleString() || "0"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Add metrics data to generate AI predictions
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  AI Growth Playbook
                  <Button 
                    size="sm" 
                    onClick={generatePlaybook}
                    disabled={generatingPlaybook}
                  >
                    {generatingPlaybook ? "Generating..." : "Generate"}
                  </Button>
                </CardTitle>
                <CardDescription>
                  Personalized growth strategy and recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {playbook ? (
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-sm">
                      {playbook.substring(0, 300)}...
                    </div>
                    <Button variant="ghost" className="mt-2" size="sm">
                      View Full Playbook
                    </Button>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    Generate your personalized AI Growth Playbook
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          </>
        )}
      </div>
    </div>
  );
}