"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter, MoreHorizontal, AlertTriangle, Clock, CheckCircle2, XCircle, UserPlus } from "lucide-react";
import { updateComplaintStatus, assignComplaint } from "@/app/actions/complaints";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";

type Complaint = {
  id: string;
  type: string;
  description: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED";
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  roomNumber: string;
  serviceName: string | null;
  createdAt: Date;
  resolvedAt: Date | null;
  assignee: string | null;
  assigneeId: string | null;
};

interface ComplaintsClientProps {
  initialComplaints: Complaint[];
  staff: { id: string; name: string | null }[];
  hotelId: string;
}

export function ComplaintsClient({ initialComplaints, staff, hotelId }: ComplaintsClientProps) {
  const { translate } = useLanguage();
  const { showTranslatedSuccess, showTranslatedError } = useToast();
  const t = (key: string) => translate(`app.dashboard.complaints.${key}`);
  
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);

  const handleStatusChange = async (complaintId: string, newStatus: Complaint["status"]) => {
    const result = await updateComplaintStatus(complaintId, newStatus);
    
    if (result.success) {
      setComplaints(prev =>
        prev.map(c =>
          c.id === complaintId
            ? { ...c, status: newStatus, resolvedAt: newStatus === "RESOLVED" ? new Date() : c.resolvedAt }
            : c
        )
      );
      showTranslatedSuccess("app.toast.success.complaint_updated");
    } else {
      showTranslatedError("app.toast.error.complaint_update_failed");
    }
  };

  const handleAssign = async (complaintId: string, staffId: string | null) => {
    const result = await assignComplaint(complaintId, staffId);
    
    if (result.success) {
      const staffMember = staff.find(s => s.id === staffId);
      setComplaints(prev =>
        prev.map(c =>
          c.id === complaintId
            ? { ...c, assignee: staffMember?.name || null, assigneeId: staffMember?.id || null }
            : c
        )
      );
      showTranslatedSuccess("app.toast.success.complaint_assigned");
    } else {
      showTranslatedError("app.toast.error.complaint_assign_failed");
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesSearch = !searchQuery ||
      c.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.serviceName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(c.status);
    const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(c.priority);
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusBadge = (status: Complaint["status"]) => {
    const statusMap = {
      NEW: { bg: "bg-blue-100", text: "text-blue-800", label: translate("app.dashboard.complaints.new") },
      IN_PROGRESS: { bg: "bg-orange-100", text: "text-orange-800", label: translate("app.dashboard.complaints.in_progress") },
      RESOLVED: { bg: "bg-green-100", text: "text-green-800", label: translate("app.dashboard.complaints.resolved") },
      CANCELLED: { bg: "bg-gray-100", text: "text-gray-800", label: translate("app.dashboard.complaints.cancelled") },
    };
    return statusMap[status] || statusMap.NEW;
  };

  const getPriorityBadge = (priority: Complaint["priority"]) => {
    const priorityMap = {
      LOW: { bg: "bg-gray-100", text: "text-gray-800", label: translate("app.dashboard.complaints.low") },
      MEDIUM: { bg: "bg-yellow-100", text: "text-yellow-800", label: translate("app.dashboard.complaints.medium") },
      HIGH: { bg: "bg-orange-100", text: "text-orange-800", label: translate("app.dashboard.complaints.high") },
      URGENT: { bg: "bg-red-100", text: "text-red-800", label: translate("app.dashboard.complaints.urgent") },
    };
    return priorityMap[priority] || priorityMap.MEDIUM;
  };

  const getTypeLabel = (type: string) => {
    return translate(`app.guest.complaint_${type.toLowerCase()}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("search_placeholder")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Complaints List */}
      <div className="space-y-3">
        {filteredComplaints.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm">
            {t("no_complaints")}
          </div>
        ) : (
          filteredComplaints.map((complaint) => {
            const statusBadge = getStatusBadge(complaint.status);
            const priorityBadge = getPriorityBadge(complaint.priority);
            
            return (
              <div
                key={complaint.id}
                className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-100 rounded-full p-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{t("room")} {complaint.roomNumber}</span>
                        {complaint.serviceName && (
                          <span className="text-sm text-gray-500">• {complaint.serviceName}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{getTypeLabel(complaint.type)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${priorityBadge.bg} ${priorityBadge.text}`}>
                      {priorityBadge.label}
                    </Badge>
                    <Badge className={`${statusBadge.bg} ${statusBadge.text}`}>
                      {statusBadge.label}
                    </Badge>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4">{complaint.description}</p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(complaint.createdAt).toLocaleString()}
                    </span>
                    {complaint.assignee && (
                      <span className="flex items-center gap-1">
                        <UserPlus className="h-3 w-3" />
                        {complaint.assignee}
                      </span>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {complaint.status !== "RESOLVED" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, "RESOLVED")}>
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          {t("mark_resolved")}
                        </DropdownMenuItem>
                      )}
                      {complaint.status !== "IN_PROGRESS" && complaint.status !== "RESOLVED" && (
                        <DropdownMenuItem onClick={() => handleStatusChange(complaint.id, "IN_PROGRESS")}>
                          <Clock className="h-4 w-4 mr-2" />
                          {t("mark_in_progress")}
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem disabled>
                        <UserPlus className="h-4 w-4 mr-2" />
                        {t("assign_to")}
                      </DropdownMenuItem>
                      {staff.map((member) => (
                        <DropdownMenuItem
                          key={member.id}
                          className="pl-8"
                          onClick={() => handleAssign(complaint.id, member.id)}
                        >
                          {member.name || translate("app.dashboard.common.staff_member")}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}



