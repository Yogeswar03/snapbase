import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function CreateStartupDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [companyEmail, setCompanyEmail] = useState("");
  const [founderName, setFounderName] = useState("");
  const [coFounder, setCoFounder] = useState("");
  const [stage, setStage] = useState("");
  const [phone, setPhone] = useState("");
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
    alert("Startup created! (Demo only)");
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="default" className="mx-auto block">Add Your Startup</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-lg mx-auto">
            <CardHeader className="text-center">
              <CardTitle>Add Your Startup</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startup-name">Startup Name</Label>
                    <Input id="startup-name" value={name} onChange={e => setName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="company-email">Company Email</Label>
                    <Input id="company-email" type="email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="founder-name">Founder Name</Label>
                    <Input id="founder-name" value={founderName} onChange={e => setFounderName(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="co-founder">Co-Founder (Optional)</Label>
                    <Input id="co-founder" value={coFounder} onChange={e => setCoFounder(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="stage">Stage</Label>
                    <Input id="stage" value={stage} onChange={e => setStage(e.target.value)} required placeholder="e.g. Idea, MVP, Growth, etc." />
                  </div>
                  <div>
                    <Label htmlFor="phone">Founder Phone Number</Label>
                    <Input id="phone" type="tel" value={phone} onChange={e => setPhone(e.target.value)} required />
                  </div>
                  <div>
                    <Label htmlFor="sector">Sector</Label>
                    <Input id="sector" value={sector} onChange={e => setSector(e.target.value)} required placeholder="e.g. SaaS, Fintech, Healthtech, etc." />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of your startup" />
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
    </>
  );
}
