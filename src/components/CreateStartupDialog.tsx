import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";

export function CreateStartupDialog({ forceOpen, onClose }: { forceOpen?: boolean, onClose?: () => void }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = typeof forceOpen === 'boolean' ? forceOpen : internalOpen;
  const setOpen = (val: boolean) => {
    if (typeof forceOpen === 'boolean' && onClose) {
      if (!val) onClose();
    } else {
      setInternalOpen(val);
    }
  };
  const [name, setName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [founderName, setFounderName] = useState("");
  const [coFounder, setCoFounder] = useState("");
  const [stage, setStage] = useState("");
  const [phone, setPhone] = useState("");
  const [cashflow, setCashflow] = useState("");
  const [experience, setExperience] = useState("");
  const [sector, setSector] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add logic to create startup (API call)
    setOpen(false);
    setName("");
    setCompanyEmail("");
    setFounderName("");
    setCoFounder("");
    setStage("");
    setPhone("");
  setSector("");
  setDescription("");
  setFounderName("");
  setCoFounder("");
  setCashflow("");
  setExperience("");
    alert("Startup created! (Demo only)");
  };

  return (
    <TooltipProvider>
      <Button onClick={() => setOpen(true)} variant="default" className="mx-auto block">Add Your Startup</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 overflow-auto">
          <Card className="w-full max-w-lg mx-auto max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200 bg-white">
            <CardHeader>
              <CardTitle>Add Your Startup</CardTitle>
              <p className="text-muted-foreground text-sm mt-2">
                Fill in as much detail as possible.
                <span className="inline-flex items-center">
                  <Info className="h-4 w-4 ml-1" />
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Startup Name */}
                  <div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="startup-name">Startup Name</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>Enter your official startup or project name.</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="startup-name" value={name} onChange={e => setName(e.target.value)} required placeholder="e.g. ScaleLens" />
                  </div>
                  {/* Company Email */}
                  <div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="company-email">Company Email</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>Use a business or founder email (not personal if possible).</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="company-email" type="email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} required placeholder="e.g. hello@scalelens.com" />
                  </div>
                  {/* Founder Name */}
                  <div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="founder-name">Founder Name</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>Who is the main founder? (Full name)</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="founder-name" value={founderName} onChange={e => setFounderName(e.target.value)} required placeholder="e.g. Jane Doe" />
                  </div>
                  {/* Co-Founder (Optional) */}
                  <div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="co-founder">Co-Founder (Optional)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>List a co-founder if you have one (optional).</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="co-founder" value={coFounder} onChange={e => setCoFounder(e.target.value)} placeholder="e.g. John Smith" />
                  </div>
                  {/* Stage */}
                  <div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="stage">Stage</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>What stage is your startup? (e.g. Idea, Prototype, MVP, Growth, Revenue, Scaling)</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="stage" value={stage} onChange={e => setStage(e.target.value)} required placeholder="e.g. MVP, Growth, Revenue" />
                  </div>
                  {/* Cashflow */}
                  <div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="cashflow">Cashflow</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>Current monthly cashflow (USD).</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="cashflow" type="number" value={cashflow} onChange={e => setCashflow(e.target.value)} required placeholder="e.g. 10000" />
                  </div>
                  {/* Experience */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="experience">Experience</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>Briefly describe your or your team's experience.</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="experience" value={experience} onChange={e => setExperience(e.target.value)} required placeholder="e.g. 5 years in SaaS, ex-Google engineer" />
                  </div>
                  {/* Sector */}
                  <div>
                    <div className="flex items-center gap-1">
                      <Label htmlFor="sector">Sector</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>What industry are you in? (e.g. SaaS, Fintech, Healthtech, Edtech, Marketplace, etc.)</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="sector" value={sector} onChange={e => setSector(e.target.value)} required placeholder="e.g. SaaS, Fintech, Healthtech" />
                  </div>
                  {/* Description */}
                  <div className="md:col-span-2">
                    <div className="flex items-center gap-1">
                      <Label htmlFor="description">Description (Optional)</Label>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                        </TooltipTrigger>
                        <TooltipContent>Briefly describe your startup, product, or vision (1-2 sentences).</TooltipContent>
                      </Tooltip>
                    </div>
                    <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="e.g. AI-powered platform to predict startup success" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                  <Button type="submit">Save</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </TooltipProvider>
  );
}
