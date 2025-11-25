"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Search, Filter, MoreHorizontal, Clock, Plus, ArrowDownToLine, GripVertical, Trash2, UserPlus, Edit, User } from "lucide-react";
import { assignRequest, deleteRequest, updateRequestStatus, createRequest, updateRequest } from "@/app/actions/requests";
import { Textarea } from "@/components/ui/textarea";
import { CustomFieldRenderer } from "@/components/guest/CustomFieldRenderer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

type Request = {
  id: string;
  room: string;
  service: string;
  serviceId?: string;
  roomId?: string;
  status: "NEW" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  time: string;
  assignee: string;
  priority: "Normal" | "High" | "Low";
  quantity?: number;
  customFieldsData?: any;
  customFields?: any[];
  guestName?: string | null;
  guestPhone?: string | null;
  guestEmail?: string | null;
  notes?: string | null;
};

function RequestCard({ request, staff, onAssign, onDelete, onEdit }: { 
  request: Request; 
  staff: { id: string; name: string | null }[];
  onAssign: (requestId: string, staffId: string | null) => void;
  onDelete: (requestId: string) => void;
  onEdit: (request: Request) => void;
}) {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`app.dashboard.requests.${key}`);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: request.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusMap: Record<string, { bg: string; text: string; label: string }> = {
    "NEW": { bg: "bg-indigo-100", text: "text-indigo-800", label: t("new") },
    "IN_PROGRESS": { bg: "bg-yellow-100", text: "text-yellow-800", label: t("in_progress") },
    "COMPLETED": { bg: "bg-green-100", text: "text-green-800", label: t("completed") },
    "CANCELLED": { bg: "bg-gray-100", text: "text-gray-800", label: t("cancelled") },
  };

  const statusBadge = statusMap[request.status] || statusMap["NEW"];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border border-transparent hover:border-indigo-100"
      {...attributes}
      {...listeners}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="bg-gray-50 text-gray-700 text-xs font-bold px-2 py-1 rounded-lg">
          Room {request.room}
        </div>
        {request.priority === "High" && (
          <div className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide">
            High Priority
          </div>
        )}
      </div>
      
      <h4 className="font-bold text-gray-900 mb-1">
        {request.service}
        {request.quantity && request.quantity > 1 && (
          <span className="ml-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
            ×{request.quantity}
          </span>
        )}
      </h4>
      
      {request.guestName && (
        <p className="text-xs text-gray-600 mb-1">👤 {request.guestName}</p>
      )}
      
      {request.customFieldsData && Object.keys(request.customFieldsData).length > 0 && (
        <div className="mb-2 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs font-semibold text-blue-900 mb-1">Customizations:</p>
          {Object.entries(request.customFieldsData).map(([fieldId, value]: [string, any]) => {
            const field = request.customFields?.find((f: any) => f.id === fieldId);
            const label = field?.label || fieldId;
            const displayValue = Array.isArray(value) ? value.join(', ') : value;
            return (
              <p key={fieldId} className="text-xs text-blue-800">
                <span className="font-medium">{label}:</span> {displayValue}
              </p>
            );
          })}
        </div>
      )}
      
      {request.notes && (
        <p className="text-xs text-gray-500 italic mb-2">💬 {request.notes}</p>
      )}
      
      <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
        <Clock className="h-3 w-3" />
        <span>{request.time}</span>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2">
          {request.assignee === "Unassigned" ? (
             <div className="h-6 w-6 rounded-full bg-gray-100 border border-white flex items-center justify-center text-gray-400">
               <span className="sr-only">Unassigned</span>
               <Plus className="h-3 w-3" />
             </div>
          ) : (
            <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 border border-white flex items-center justify-center text-[10px] font-bold">
              {request.assignee.charAt(0)}
            </div>
          )}
          <span className="text-xs text-gray-500 font-medium">{request.assignee}</span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-gray-50 rounded-lg transition-colors">
              <MoreHorizontal className="h-4 w-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem className="text-sm" disabled>
              <UserPlus className="h-4 w-4 mr-2" />
              <span>Assign to</span>
            </DropdownMenuItem>
            {staff.map((member) => (
              <DropdownMenuItem 
                key={member.id} 
                className="text-sm pl-8"
                onClick={() => onAssign(request.id, member.id)}
              >
                {member.name || translate("app.dashboard.common.staff_member")}
              </DropdownMenuItem>
            ))}
            {request.assignee !== "Unassigned" && (
              <DropdownMenuItem 
                className="text-sm pl-8"
                onClick={() => onAssign(request.id, null)}
              >
                Unassign
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="text-sm"
              onClick={() => onEdit(request)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-sm text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => onDelete(request.id)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function Column({
  column,
  requests,
  onCreateClick,
  staff,
  onAssign,
  onDelete,
  onEdit,
}: {
  column: { title: string; status: "NEW" | "IN_PROGRESS" | "COMPLETED"; color: string };
  requests: Request[];
  onCreateClick: () => void;
  staff: { id: string; name: string | null }[];
  onAssign: (requestId: string, staffId: string | null) => void;
  onDelete: (requestId: string) => void;
  onEdit: (request: Request) => void;
}) {
  const columnRequests = requests.filter((r) => r.status === column.status);
  const requestIds = columnRequests.map((r) => r.id);
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.status,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <div className={`h-2.5 w-2.5 rounded-full ${column.color}`}></div>
          <h3 className="font-bold text-gray-700">{column.title}</h3>
          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
            {columnRequests.length}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>

      <SortableContext id={column.status} items={requestIds} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={`space-y-3 min-h-[200px] transition-colors rounded-xl p-2 ${
            isOver ? "bg-indigo-50/50 border-2 border-dashed border-indigo-200" : ""
          }`}
        >
          {columnRequests.map((req) => (
            <RequestCard 
              key={req.id} 
              request={req}
              staff={staff}
              onAssign={onAssign}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
          
          <button
            onClick={onCreateClick}
            className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 text-sm font-medium hover:border-indigo-200 hover:text-indigo-500 hover:bg-indigo-50/50 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Card
          </button>
        </div>
      </SortableContext>
    </div>
  );
}

interface RequestsClientProps {
  initialRequests: Request[];
  staff: { id: string; name: string | null }[];
  rooms: { id: string; number: string }[];
  services: { id: string; name: string; category: { name: string } }[];
  hotelId: string;
}

export function RequestsClient({ initialRequests, staff, rooms, services, hotelId }: RequestsClientProps) {
  const { translate } = useLanguage();
  const { showTranslatedSuccess, showTranslatedError } = useToast();
  const t = (key: string) => translate(`app.dashboard.requests.${key}`);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [editCustomFieldValues, setEditCustomFieldValues] = useState<Record<string, any>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [requests, setRequests] = useState<Request[]>(initialRequests);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"board" | "list">("board");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const statusMap: Record<string, { bg: string; text: string; label: string }> = {
    "NEW": { bg: "bg-indigo-100", text: "text-indigo-800", label: t("new") },
    "IN_PROGRESS": { bg: "bg-yellow-100", text: "text-yellow-800", label: t("in_progress") },
    "COMPLETED": { bg: "bg-green-100", text: "text-green-800", label: t("completed") },
    "CANCELLED": { bg: "bg-gray-100", text: "text-gray-800", label: t("cancelled") },
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeRequest = requests.find((r) => r.id === activeId);
    if (!activeRequest) return;

    // אם גררנו כרטיס לעמודה אחרת (drop zone)
    if (overId === "NEW" || overId === "IN_PROGRESS" || overId === "COMPLETED") {
      if (activeRequest.status !== overId) {
        setRequests((prevRequests) =>
          prevRequests.map((req) =>
            req.id === activeId ? { ...req, status: overId as Request["status"] } : req
          )
        );
        // Update status in database
        await updateRequestStatus(activeId, overId);
      }
      return;
    }

    // אם גררנו כרטיס מעל כרטיס אחר
    const overRequest = requests.find((r) => r.id === overId);
    if (!overRequest) return;

    // אם גררנו כרטיס בתוך אותה עמודה (לשנות סדר)
    if (activeRequest.status === overRequest.status) {
      const status = activeRequest.status;
      const statusRequests = requests.filter((r) => r.status === status);
      const oldIndex = statusRequests.findIndex((r) => r.id === activeId);
      const newIndex = statusRequests.findIndex((r) => r.id === overId);

      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        const otherRequests = requests.filter((r) => r.status !== status);
        const reorderedStatusRequests = arrayMove(statusRequests, oldIndex, newIndex);
        setRequests([...otherRequests, ...reorderedStatusRequests]);
      }
    } else {
      // אם גררנו כרטיס מעמודה אחת לאחרת (מעל כרטיס אחר)
      setRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === activeId ? { ...req, status: overRequest.status } : req
        )
      );
      // Update status in database
      await updateRequestStatus(activeId, overRequest.status);
    }
  };

  const handleAssign = async (requestId: string, staffId: string | null) => {
    const staffMember = staff.find(s => s.id === staffId);
    const assigneeName = staffMember?.name || "Unassigned";
    
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, assignee: assigneeName } : req
      )
    );
    
    await assignRequest(requestId, staffId);
  };

  const handleDelete = (requestId: string) => {
    setRequestToDelete(requestId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (requestToDelete) {
      setRequests(prevRequests => prevRequests.filter(req => req.id !== requestToDelete));
      await deleteRequest(requestToDelete);
      showTranslatedSuccess("app.toast.success.deleted");
      setDeleteConfirmOpen(false);
      setRequestToDelete(null);
    }
  };

  const handleEdit = (request: Request) => {
    setEditingRequest(request);
    // Load existing custom field values
    setEditCustomFieldValues(request.customFieldsData || {});
    setIsEditOpen(true);
  };

  const handleCreate = async (formData: FormData) => {
    formData.append("hotelId", hotelId);
    const result = await createRequest(formData);
    if (result.success) {
      setIsCreateOpen(false);
      showTranslatedSuccess("app.toast.success.request_created");
      window.location.reload(); // Refresh to get new request
    } else {
      showTranslatedError("app.toast.error.request_create_failed");
    }
  };

  const handleEditSubmit = async (formData: FormData) => {
    if (!editingRequest) return;
    formData.append("requestId", editingRequest.id);
    const result = await updateRequest(formData);
    if (result.success) {
      setIsEditOpen(false);
      setEditingRequest(null);
      showTranslatedSuccess("app.toast.success.request_updated");
      window.location.reload();
    } else {
      showTranslatedError("app.toast.error.request_update_failed");
    }
  };

  const handleExport = () => {
    const csv = [
      [translate("app.dashboard.requests.room"), translate("app.dashboard.requests.service"), translate("app.dashboard.requests.status"), translate("app.dashboard.requests.assignee"), translate("app.dashboard.common.quantity"), translate("app.dashboard.requests.guest_name"), translate("app.dashboard.requests.notes"), translate("app.dashboard.common.created_at")],
      ...requests.map(req => [
        req.room,
        req.service,
        req.status,
        req.assignee,
        req.quantity?.toString() || "1",
        req.guestName || "",
        req.notes || "",
        req.time
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `requests-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filter requests based on search and filters
  const filteredRequests = requests.filter(req => {
    const matchesSearch = !searchQuery || 
      req.room.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.guestName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(req.status);
    
    return matchesSearch && matchesStatus;
  });

  const columns = [
    { title: t("new"), status: "NEW" as const, color: "bg-indigo-500" },
    { title: t("in_progress"), status: "IN_PROGRESS" as const, color: "bg-orange-500" },
    { title: t("completed"), status: "COMPLETED" as const, color: "bg-green-500" },
  ];

  const activeRequest = activeId ? requests.find((r) => r.id === activeId) : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="bg-white border-none shadow-sm text-gray-600 hover:bg-gray-50 gap-2 rounded-xl"
            onClick={handleExport}
          >
            <ArrowDownToLine className="h-4 w-4" />
            {t("export")}
          </Button>
          <Button 
            onClick={() => setIsCreateOpen(true)}
            className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-200"
          >
            <Plus className="h-4 w-4" />
            {t("create_request")}
          </Button>
        </div>
      </div>

      {/* Create Request Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t("create_new_request")}</DialogTitle>
            <DialogDescription>{t("subtitle")}</DialogDescription>
          </DialogHeader>
          <form action={handleCreate} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="roomNumber">{t("room_number")} *</Label>
              <select
                id="roomNumber"
                name="roomNumber"
                required
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">{translate("app.dashboard.rooms.add_room")}...</option>
                {rooms.map(room => (
                  <option key={room.id} value={room.number}>{room.number}</option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="serviceId">{t("service")} *</Label>
              <select
                id="serviceId"
                name="serviceId"
                required
                className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
              >
                <option value="">{t("select_service")}...</option>
                {services.map(service => (
                  <option key={service.id} value={service.id}>
                    {service.name} ({service.category.name})
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">{translate("app.guest.quantity")}</Label>
              <Input 
                id="quantity" 
                name="quantity" 
                type="number" 
                min="1" 
                defaultValue="1"
                className="h-11"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="guestName">{t("guest_name")}</Label>
              <Input id="guestName" name="guestName" className="h-11" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">{t("notes")}</Label>
              <Textarea id="notes" name="notes" rows={3} />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>{t("cancel")}</Button>
              <Button type="submit">{t("create_request")}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit Request Dialog */}
      <Dialog open={isEditOpen} onOpenChange={(open) => {
        setIsEditOpen(open);
        if (!open) setEditingRequest(null);
      }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Request</DialogTitle>
            <DialogDescription>Update request details.</DialogDescription>
          </DialogHeader>
          {editingRequest && (
            <form action={handleEditSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-roomNumber">Room Number *</Label>
                <select
                  id="edit-roomNumber"
                  name="roomNumber"
                  required
                  defaultValue={editingRequest.room}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                >
                  {rooms.map(room => (
                    <option key={room.id} value={room.number}>{room.number}</option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-serviceId">Service *</Label>
                <select
                  id="edit-serviceId"
                  name="serviceId"
                  required
                  defaultValue={editingRequest.serviceId}
                  className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100"
                >
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} ({service.category.name})
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-quantity">{translate("app.dashboard.common.quantity")}</Label>
                <Input 
                  id="edit-quantity" 
                  name="quantity" 
                  type="number" 
                  min="1" 
                  defaultValue={editingRequest.quantity || 1}
                  className="h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-guestName">Guest Name</Label>
                <Input 
                  id="edit-guestName" 
                  name="guestName" 
                  defaultValue={editingRequest.guestName || ""}
                  className="h-11"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea 
                  id="edit-notes" 
                  name="notes" 
                  rows={3}
                  defaultValue={editingRequest.notes || ""}
                />
              </div>
              
              {/* Custom Fields */}
              {editingRequest.customFields && editingRequest.customFields.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-sm mb-3 text-gray-700">Customizations</h4>
                  <CustomFieldRenderer
                    fields={editingRequest.customFields}
                    values={editCustomFieldValues}
                    onChange={(fieldId, value) => {
                      setEditCustomFieldValues(prev => ({ ...prev, [fieldId]: value }));
                    }}
                  />
                  <input 
                    type="hidden" 
                    name="customFieldsData" 
                    value={JSON.stringify(editCustomFieldValues)} 
                  />
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => {
                  setIsEditOpen(false);
                  setEditingRequest(null);
                  setEditCustomFieldValues({});
                }}>Cancel</Button>
                <Button type="submit">Save Changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Filter Dialog */}
      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Requests</DialogTitle>
            <DialogDescription>Filter requests by status.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <div className="space-y-2">
                {["NEW", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map(status => (
                  <label key={status} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={statusFilter.includes(status)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setStatusFilter([...statusFilter, status]);
                        } else {
                          setStatusFilter(statusFilter.filter(s => s !== status));
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{status.replace("_", " ")}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusFilter([])}>Clear</Button>
            <Button onClick={() => setIsFilterOpen(false)}>Apply</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-2 shadow-sm flex flex-col md:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder={t("search_placeholder")} 
            className="pl-10 border-transparent bg-transparent focus:bg-gray-50 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 px-2">
          <Button 
            variant="ghost" 
            className={`gap-2 rounded-xl ${statusFilter.length > 0 ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-4 w-4" />
            {t("filter")}
            {statusFilter.length > 0 && (
              <span className="ml-1 bg-indigo-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                {statusFilter.length}
              </span>
            )}
          </Button>
          <div className="h-6 w-px bg-gray-200 mx-2"></div>
          <div className="flex items-center gap-2">
             <span className="text-sm text-gray-500">{translate("app.dashboard.requests.view")}:</span>
             <Button 
               variant="ghost" 
               size="sm" 
               className={viewMode === "board" ? "text-indigo-600 bg-indigo-50 font-medium rounded-lg" : "text-gray-500 hover:bg-gray-50 rounded-lg"}
               onClick={() => setViewMode("board")}
             >
               {t("view_board")}
             </Button>
             <Button 
               variant="ghost" 
               size="sm" 
               className={viewMode === "list" ? "text-indigo-600 bg-indigo-50 font-medium rounded-lg" : "text-gray-500 hover:bg-gray-50 rounded-lg"}
               onClick={() => setViewMode("list")}
             >
               {t("view_list")}
             </Button>
          </div>
        </div>
      </div>

      {/* Kanban Board or List View */}
      {viewMode === "board" ? (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid md:grid-cols-3 gap-6 h-full items-start">
            {columns.map((col) => (
              <Column
                key={col.title}
                column={col}
                requests={filteredRequests}
                onCreateClick={() => setIsCreateOpen(true)}
                staff={staff}
                onAssign={handleAssign}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
          <DragOverlay>
            {activeRequest ? (
              <div className="group bg-white rounded-2xl p-5 shadow-lg border-2 border-indigo-200 rotate-2">
                <div className="flex justify-between items-start mb-3">
                  <div className="bg-gray-50 text-gray-700 text-xs font-bold px-2 py-1 rounded-lg">
                    Room {activeRequest.room}
                  </div>
                  {activeRequest.priority === "High" && (
                    <div className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide">
                      High Priority
                    </div>
                  )}
                </div>
                <h4 className="font-bold text-gray-900 mb-1">{activeRequest.service}</h4>
                <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                  <Clock className="h-3 w-3" />
                  <span>{activeRequest.time}</span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-2">
                    {activeRequest.assignee === "Unassigned" ? (
                      <div className="h-6 w-6 rounded-full bg-gray-100 border border-white flex items-center justify-center text-gray-400">
                        <span className="sr-only">Unassigned</span>
                        <Plus className="h-3 w-3" />
                      </div>
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-indigo-100 text-indigo-600 border border-white flex items-center justify-center text-[10px] font-bold">
                        {activeRequest.assignee.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs text-gray-500 font-medium">{activeRequest.assignee}</span>
                  </div>
                </div>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      ) : (
        <div className="space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm">
              No requests found
            </div>
          ) : (
            filteredRequests.map((req) => {
              const statusBadge = statusMap[req.status] || statusMap["NEW"];
              return (
                <div key={req.id} className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-indigo-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-gray-50 text-gray-700 text-xs font-bold px-3 py-1.5 rounded-lg">
                          Room {req.room}
                        </span>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusBadge.bg} ${statusBadge.text}`}>
                          {statusBadge.label}
                        </span>
                        {req.priority === "High" && (
                          <span className="bg-red-50 text-red-600 text-xs font-bold px-2 py-1 rounded-lg">
                            HIGH PRIORITY
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-gray-900 mb-2 text-base">
                        {req.service}
                        {req.quantity && req.quantity > 1 && (
                          <span className="ml-2 text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            ×{req.quantity}
                          </span>
                        )}
                      </h4>
                      {req.guestName && (
                        <p className="text-sm text-gray-600 mb-2">👤 {req.guestName}</p>
                      )}
                      {req.customFieldsData && Object.keys(req.customFieldsData).length > 0 && (
                        <div className="mb-2 p-2 bg-blue-50 rounded-lg inline-block">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Customizations:</p>
                          {Object.entries(req.customFieldsData).map(([fieldId, value]: [string, any]) => {
                            const field = req.customFields?.find((f: any) => f.id === fieldId);
                            const label = field?.label || fieldId;
                            const displayValue = Array.isArray(value) ? value.join(', ') : value;
                            return (
                              <p key={fieldId} className="text-xs text-blue-800">
                                <span className="font-medium">{label}:</span> {displayValue}
                              </p>
                            );
                          })}
                        </div>
                      )}
                      {req.notes && (
                        <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2 mb-2 italic">
                          "{req.notes}"
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {req.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {req.assignee}
                        </span>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                          <MoreHorizontal className="h-4 w-4 text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem className="text-sm" disabled>
                          <UserPlus className="h-4 w-4 mr-2" />
                          <span>Assign to</span>
                        </DropdownMenuItem>
                        {staff.map((member) => (
                          <DropdownMenuItem 
                            key={member.id} 
                            className="text-sm pl-8"
                            onClick={() => handleAssign(req.id, member.id)}
                          >
                            {member.name || translate("app.dashboard.common.staff_member")}
                          </DropdownMenuItem>
                        ))}
                        {req.assignee !== "Unassigned" && (
                          <DropdownMenuItem 
                            className="text-sm pl-8"
                            onClick={() => handleAssign(req.id, null)}
                          >
                            Unassign
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-sm"
                          onClick={() => handleEdit(req)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-sm text-red-600 focus:text-red-600 focus:bg-red-50"
                          onClick={() => handleDelete(req.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{translate("app.dashboard.requests.delete")}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              {translate("app.dashboard.requests.cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {translate("app.dashboard.requests.delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

