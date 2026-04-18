"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { Plus, Mail, MoreHorizontal, Search, Filter, Shield } from "lucide-react";

export default function TeamPage() {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<
    Array<{
      id: string;
      name: string | null;
      email: string;
      role: "ADMIN" | "MANAGER" | "STAFF";
      createdAt: string;
    }>
  >([]);
  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
    role: "STAFF",
  });

  async function loadMembers() {
    const response = await fetch("/api/team", { cache: "no-store" });
    const data = await response.json();
    setMembers(data.members ?? []);
  }

  useEffect(() => {
    loadMembers();
  }, []);

  async function inviteMember() {
    if (!inviteForm.name || !inviteForm.email) return;
    await fetch("/api/team", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(inviteForm),
    });
    setInviteForm({ name: "", email: "", role: "STAFF" });
    setIsInviteOpen(false);
    await loadMembers();
  }

  const filteredMembers = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return members;
    return members.filter(
      (member) =>
        member.email.toLowerCase().includes(term) ||
        (member.name ?? "").toLowerCase().includes(term)
    );
  }, [members, search]);

  return (
    <div className="space-y-8">
      <DashboardPageHeader
        eyebrow="Workspace · people"
        title="Team"
        description="Staff accounts tied to your hotel — roles control dashboard access."
      >
        <Button
          onClick={() => setIsInviteOpen(true)}
          className="gap-2 h-9 text-xs bg-primary hover:bg-primary/90 rounded-md"
        >
          <Plus className="h-3.5 w-3.5" />
          Invite
        </Button>
      </DashboardPageHeader>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite teammate</DialogTitle>
            <DialogDescription>Add a staff member to this hotel workspace.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                placeholder="colleague@hotel.com"
                type="email"
                value={inviteForm.email}
                onChange={(event) =>
                  setInviteForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Full name</Label>
              <Input
                placeholder="Name"
                value={inviteForm.name}
                onChange={(event) =>
                  setInviteForm((prev) => ({ ...prev, name: event.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select
                value={inviteForm.role}
                onChange={(event) =>
                  setInviteForm((prev) => ({ ...prev, role: event.target.value }))
                }
              >
                <option value="STAFF">Staff</option>
                <option value="MANAGER">Manager</option>
                <option value="ADMIN">Admin</option>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={inviteMember}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="card-surface overflow-hidden">
        <div className="p-5 border-b border-[color:var(--border)] flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
            <Input
              placeholder="Search by name or email…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10 bg-surface border border-[color:var(--border)] rounded-md focus-visible:ring-2 focus-visible:ring-primary/15"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-foreground/55 rounded-md gap-2">
              <Filter className="h-4 w-4" /> Role
            </Button>
            <Button variant="ghost" size="sm" className="text-foreground/55 rounded-md gap-2">
              <Shield className="h-4 w-4" /> Access
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left">
            <thead className="bg-surface/80 text-foreground/50 font-mono text-[10px] uppercase tracking-[0.14em]">
              <tr>
                <th className="px-6 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[color:var(--border)]">
              {filteredMembers.map((member) => {
                const initials = (member.name ?? member.email)
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();
                return (
                  <tr key={member.id} className="hover:bg-background/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-md flex items-center justify-center text-[11px] font-semibold bg-primary/10 text-primary border border-[color:var(--border)]">
                          {initials}
                        </div>
                        <div>
                          <div className="font-medium text-ink">{member.name ?? "—"}</div>
                          <div className="text-xs text-foreground/50 flex items-center gap-1">
                            <Mail className="h-3 w-3" /> {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-mono uppercase tracking-wider bg-surface border border-[color:var(--border)] text-foreground/80">
                        {member.role.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        Active
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-foreground/55 font-mono">
                      {new Date(member.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button variant="ghost" size="icon" className="text-foreground/40 rounded-md">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
