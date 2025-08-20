import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export function CreateStartupDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [sector, setSector] = useState("");
  const [stage, setStage] = useState("");
  const [team, setTeam] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Add logic to create startup (API call)
    setOpen(false);
    setName("");
    setSector("");
    setStage("");
    setTeam("");
    alert("Startup created! (Demo only)");
  };

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="default">Add Your Startup</Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Add Your Startup</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="startup-name">Startup Name</Label>
                  <Input id="startup-name" value={name} onChange={e => setName(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="startup-sector">Sector</Label>
                  <Input id="startup-sector" value={sector} onChange={e => setSector(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="startup-stage">Stage</Label>
                  <Input id="startup-stage" value={stage} onChange={e => setStage(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="startup-team">Team Size / Experience</Label>
                  <Input id="startup-team" value={team} onChange={e => setTeam(e.target.value)} />
                </div>
                <div className="flex justify-end gap-2">
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
