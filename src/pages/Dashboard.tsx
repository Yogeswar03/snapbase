import { useState, useEffect } from "react";
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
  TrendingDown,
  Settings as SettingsIcon
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useStartups, type Startup } from "@/hooks/useStartups";
import { MetricsUpload } from "@/components/MetricsUpload";
import { CreateStartupDialog } from "../components/CreateStartupDialog";
import { usePredictions } from "@/hooks/usePredictions";
import { useMetrics } from "@/hooks/useMetrics";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [forceOpenStartupDialog, setForceOpenStartupDialog] = useState(false);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const { user, signOut } = useAuth();
  const { startups: rawStartups, loading: startupsLoading, createStartup } = useStartups();
  const startups = Array.isArray(rawStartups) ? rawStartups : [];
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [generatingPlaybook, setGeneratingPlaybook] = useState(false);
  const [playbook, setPlaybook] = useState<string>("");
  const { toast } = useToast();
  const { metrics, latestMetric, loading: metricsLoading } = useMetrics(selectedStartup?.id);
  const { predictions, latestPrediction, loading: predictionsLoading, refetchPredictions } = usePredictions(selectedStartup?.id);

  // Auto-select first startup when startups load
  useEffect(() => {
    if (startups.length > 0 && !selectedStartup) {
      setSelectedStartup(startups[0]);
    }
    if (startups.length === 0) {
      setForceOpenStartupDialog(true);
    } else {
      setForceOpenStartupDialog(false);
    }
  }, [startups, selectedStartup]);

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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <div className="border-b border-gray-200/40 bg-background/95 backdrop-blur">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <User className="mr-2 h-4 w-4" />
                    {user?.email}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Building2 className="mr-2 h-4 w-4" />
                    My Startups
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Help
                  </DropdownMenuItem>
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
        {/* Show Add Startup dialog if no startups exist */}
        {forceOpenStartupDialog && (
          <CreateStartupDialog
            forceOpen
            onClose={() => setForceOpenStartupDialog(false)}
            onCreated={async (startupData) => {
              const created = await createStartup({
                name: startupData.name,
                sector: startupData.sector,
                stage: startupData.stage,
                team_experience: Number(startupData.experience) || 0,
                description: startupData.description,
              });
              setForceOpenStartupDialog(false);
              if (created) setSelectedStartup(created);
            }}
          />
        )}
        {!selectedStartup ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">Select a startup to view its dashboard</p>
          </div>
        ) : (
          <>
            {/* Dashboard Main Grid - CLEANED */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Startup Projects */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Startup Ideas & Projects</CardTitle>
                  <CardDescription>Projects you’ve created or are working on</CardDescription>
                </CardHeader>
                <CardContent>
                  {startups.map((startup) => (
                    <div key={startup.id} className="mb-4 p-3 rounded border border-gray-200 bg-background">
                      <div className="font-semibold text-lg">{startup.name}</div>
                      <div className="text-sm text-muted-foreground">Sector: {startup.sector} | Stage: {startup.stage}</div>
                      <div className="text-xs mt-1">Team: {startup.team_experience || 'N/A'}</div>
                    </div>
                  ))}
                  {startups.length === 0 && <div className="text-muted-foreground">No projects yet.</div>}
                </CardContent>
              </Card>

              {/* Growth Stats */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Growth & Insights</CardTitle>
                  <CardDescription>Latest growth stats and predictions</CardDescription>
                </CardHeader>
                <CardContent>
                  {latestPrediction ? (
                    <div className="space-y-2">
                      <div>Growth Rate: <span className="font-semibold">{(latestPrediction.growth_rate * 100).toFixed(2)}%</span></div>
                      <div>Profit/Loss: <span className="font-semibold">${latestPrediction.profit_loss}</span></div>
                      <div>Cashflow: <span className="font-semibold">${latestPrediction.cashflow}</span></div>
                      <div>Runway: <span className="font-semibold">{latestPrediction.runway_months} months</span></div>
                      <div>Failure Probability: <span className="font-semibold text-destructive">{(latestPrediction.failure_probability * 100).toFixed(2)}%</span></div>
                    </div>
                  ) : <div className="text-muted-foreground">No growth data yet.</div>}
                </CardContent>
              </Card>

              {/* Tools Used */}
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Tools Used</CardTitle>
                  <CardDescription>Technologies powering your insights</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-1 text-sm">
                    <li>Machine Learning for profit/loss prediction</li>
                    <li>Growth prediction</li>
                    <li>Cashflow and runway analysis</li>
                    <li>Deathzone/failure probability</li>
                  </ul>
                </CardContent>
              </Card>

              {/* AI Predictions & Playbook (clean, single block) */}
              <Card className="col-span-1 md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Predictions
                    <Button
                      size="sm"
                      onClick={async () => {
                        if (!selectedStartup || !latestMetric) return;
                        setPredictionLoading(true);
                        await refetchPredictions();
                        setPredictionLoading(false);
                      }}
                      disabled={!selectedStartup || !latestMetric || predictionLoading}
                    >
                      {predictionLoading ? "Generating..." : "Generate New"}
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
                  {/* AI Growth Playbook Section */}
                  <div className="mt-8">
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
                    {playbook ? (
                      <div className="prose prose-sm max-w-none mt-2">
                        <div className="whitespace-pre-wrap text-sm">
                          {playbook.substring(0, 300)}...
                        </div>
                        <Button variant="ghost" className="mt-2" size="sm">
                          View Full Playbook
                        </Button>
                      </div>
                    ) : (
                      <p className="text-muted-foreground mt-2">
                        Generate your personalized AI Growth Playbook
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Founders Section */}
              <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Founders</CardTitle>
                  <CardDescription>Meet the team behind this startup</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-6">
                    <div className="flex flex-col items-center">
                      <User className="h-8 w-8 text-primary mb-1" />
                      <div className="font-semibold">Founder</div>
                      <div className="text-sm text-muted-foreground">Your Name</div>
                    </div>
                    <div className="flex flex-col items-center">
                      <User className="h-8 w-8 text-primary mb-1" />
                      <div className="font-semibold">Co-Founder</div>
                      <div className="text-sm text-muted-foreground">Co-Founder Name</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}