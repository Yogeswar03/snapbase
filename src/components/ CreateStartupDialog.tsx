import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useStartups } from "@/hooks/useStartups";

interface CreateStartupDialogProps {
  onStartupCreated?: () => void;
}

const sectors = [
  { value: "saas", label: "SaaS" },
  { value: "fintech", label: "FinTech" },
  { value: "healthtech", label: "HealthTech" },
  { value: "edtech", label: "EdTech" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "marketplace", label: "Marketplace" },
  { value: "ai_ml", label: "AI/ML" },
  { value: "biotech", label: "BioTech" },
  { value: "other", label: "Other" },
];

const stages = [
  { value: "idea", label: "Idea" },
  { value: "prototype", label: "Prototype" },
  { value: "mvp", label: "MVP" },
  { value: "early_stage", label: "Early Stage" },
  { value: "growth", label: "Growth" },
  { value: "mature", label: "Mature" },
];

export function CreateStartupDialog({ onStartupCreated }: CreateStartupDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createStartup } = useStartups();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const startup = {
      name: formData.get("name") as string,
      sector: formData.get("sector") as any,
      stage: formData.get("stage") as any,
      team_experience: parseInt(formData.get("team_experience") as string) || 0,
      description: formData.get("description") as string,
    };

    const result = await createStartup(startup);
    setLoading(false);

    if (result) {
      setOpen(false);
      onStartupCreated?.();
      // Reset form
      (e.target as HTMLFormElement).reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Startup
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Startup</DialogTitle>
          <DialogDescription>
            Add a new startup to track its performance and get AI insights.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Startup Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Enter startup name"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Select name="sector" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select sector" />
                </SelectTrigger>
                <SelectContent>
                  {sectors.map((sector) => (
                    <SelectItem key={sector.value} value={sector.value}>
                      {sector.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="stage">Stage</Label>
              <Select name="stage" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stages.map((stage) => (
                    <SelectItem key={stage.value} value={stage.value}>
                      {stage.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="team_experience">Team Experience (months)</Label>
            <Input
              id="team_experience"
              name="team_experience"
              type="number"
              min="0"
              placeholder="0"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief description of your startup"
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Startup
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}