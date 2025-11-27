"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import { createComplaint } from "@/app/actions/complaints";

interface ComplaintFormProps {
  hotelSlug: string;
  roomCode: string;
  requestId?: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ComplaintForm({
  hotelSlug,
  roomCode,
  requestId,
  isOpen,
  onClose,
}: ComplaintFormProps) {
  const { translate } = useLanguage();
  const { showTranslatedSuccess, showTranslatedError } = useToast();
  const t = (key: string) => translate(`app.guest.${key}`);
  
  const [type, setType] = useState<"ORDER_ISSUE" | "ROOM_ISSUE" | "NOISE" | "CLEANLINESS" | "STAFF" | "DELAY" | "OTHER">("ORDER_ISSUE");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim()) {
      showTranslatedError("app.toast.error.description_required");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("hotelSlug", hotelSlug);
    formData.append("roomCode", roomCode);
    formData.append("type", type);
    formData.append("description", description);
    if (requestId) {
      formData.append("requestId", requestId);
    }

    const result = await createComplaint(formData);

    if (result.success) {
      showTranslatedSuccess("app.toast.success.complaint_submitted");
      setDescription("");
      setType("ORDER_ISSUE");
      onClose();
    } else {
      showTranslatedError("app.toast.error.complaint_failed");
    }

    setIsSubmitting(false);
  };

  const complaintTypes = [
    { value: "ORDER_ISSUE", label: t("complaint_order_issue") },
    { value: "DELAY", label: t("complaint_delay") },
    { value: "ROOM_ISSUE", label: t("complaint_room_issue") },
    { value: "CLEANLINESS", label: t("complaint_cleanliness") },
    { value: "NOISE", label: t("complaint_noise") },
    { value: "STAFF", label: t("complaint_staff") },
    { value: "OTHER", label: t("complaint_other") },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            {t("report_issue")}
          </DialogTitle>
          <DialogDescription>
            {t("report_issue_desc")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Issue Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t("issue_type")}</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
            >
              {complaintTypes.map((ct) => (
                <option key={ct.value} value={ct.value}>
                  {ct.label}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t("describe_issue")} *</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("describe_issue_placeholder")}
              rows={5}
              className="resize-none"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-orange-600 hover:bg-orange-700"
              disabled={isSubmitting || !description.trim()}
            >
              {isSubmitting ? t("submitting") : t("submit_complaint")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}



