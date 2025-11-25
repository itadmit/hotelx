"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Mail, MoreHorizontal, Search, Filter, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Member {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Away";
  lastActive: string;
  avatar: string;
  color: string;
}

interface TeamClientProps {
  members: Member[];
}

export function TeamClient({ members }: TeamClientProps) {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`app.dashboard.team.${key}`);
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <Button 
          onClick={() => setIsInviteOpen(true)}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200"
        >
          <Plus className="h-4 w-4" />
          {t("invite_member")}
        </Button>
      </div>

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("invite_team_member")}</DialogTitle>
            <DialogDescription>{t("invite_description")}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="grid gap-2">
                <Label>{t("email_address")}</Label>
                <Input placeholder="colleague@hotel.com" type="email" />
             </div>
             <div className="grid gap-2">
                <Label>{t("full_name")}</Label>
                <Input placeholder="John Doe" />
             </div>
             <div className="grid gap-2">
                <Label>{t("role")}</Label>
                <Select>
                   <option>{t("service_staff")}</option>
                   <option>{t("reception")}</option>
                   <option>{t("manager")}</option>
                   <option>{t("admin")}</option>
                </Select>
             </div>
          </div>
          <DialogFooter>
             <Button variant="outline" onClick={() => setIsInviteOpen(false)}>{t("cancel")}</Button>
             <Button onClick={() => setIsInviteOpen(false)}>{t("send_invitation")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="bg-white rounded-3xl shadow-sm border-none overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center">
           <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                 placeholder={t("search_team_members")} 
                 className="pl-10 bg-gray-50 border-transparent focus:bg-white focus:border-indigo-100 focus:ring-2 focus:ring-indigo-50 rounded-xl" 
              />
           </div>
           <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-gray-500 hover:bg-gray-50 rounded-xl gap-2">
                 <Filter className="h-4 w-4" /> {t("role")}
              </Button>
              <Button variant="ghost" className="text-gray-500 hover:bg-gray-50 rounded-xl gap-2">
                 <Shield className="h-4 w-4" /> {t("permissions")}
              </Button>
           </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-gray-500 font-medium text-xs uppercase tracking-wider">
              <tr>
                <th className="px-8 py-4 font-semibold">{translate("app.dashboard.common.staff_member")}</th>
                <th className="px-6 py-4 font-semibold">{t("role")}</th>
                <th className="px-6 py-4 font-semibold">{translate("app.dashboard.common.status")}</th>
                <th className="px-6 py-4 font-semibold">{translate("app.dashboard.common.last_activity")}</th>
                <th className="px-6 py-4 font-semibold text-right">{translate("app.dashboard.common.actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-8 text-center text-gray-500">
                    {t("no_team_members")}
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-xs ${member.color}`}>
                          {member.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{member.name || t("unknown")}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                             <Mail className="h-3 w-3" /> {member.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                       <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {member.role}
                       </span>
                    </td>
                    <td className="px-6 py-4">
                       {member.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                             <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                             {translate("app.dashboard.common.active")}
                          </span>
                       ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                             <span className="h-1.5 w-1.5 rounded-full bg-yellow-500"></span>
                             {translate("app.dashboard.common.away")}
                          </span>
                       )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{member.lastActive}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-600 rounded-lg">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

