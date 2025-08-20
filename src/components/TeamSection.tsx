import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useTeamMembers } from "@/hooks/useTeamMembers";

export function TeamSection({ startupId }: { startupId: string }) {
  const { team, loading, addTeamMember, refetchTeam } = useTeamMembers(startupId);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAdd = async () => {
    setSaving(true);
    await addTeamMember({ startup_id: startupId, name, email, role });
    setName("");
    setEmail("");
    setRole("");
    setOpen(false);
    setSaving(false);
    refetchTeam();
  };

  return (
    <Card className="col-span-1 md:col-span-2 lg:col-span-3">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Team Members</CardTitle>
        </div>
        <Button size="sm" onClick={() => setOpen(true)}>
          + Add Teammate
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <ul className="space-y-2">
            {team.length === 0 && <li className="text-muted-foreground">No teammates yet.</li>}
            {team.map((member) => (
              <li
                key={member.id}
                className="border rounded p-2 flex flex-col md:flex-row md:items-center md:gap-4"
              >
                <span className="font-semibold">{member.name}</span>
                {member.role && (
                  <span className="text-xs text-muted-foreground">{member.role}</span>
                )}
                {member.email && (
                  <span className="text-xs text-muted-foreground">{member.email}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          {/* ✅ single root element instead of <> fragment */}
          <div className="space-y-4">
            <DialogHeader>
              <DialogTitle>Add Teammate</DialogTitle>
            </DialogHeader>

            <div className="space-y-3">
              <div>
                <Label>Name</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Engineer, Marketer"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={handleAdd} disabled={saving || !name}>
                Add
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
