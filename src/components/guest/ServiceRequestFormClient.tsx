"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createRequest } from "@/app/actions/request";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { CustomField } from "./CustomFieldRenderer";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";
import { useHaptic } from "@/hooks/useHaptic";

interface ServiceRequestFormClientProps {
  hotelSlug: string;
  roomCode: string;
  serviceId: string;
  price: string;
  roomNumber?: string | null;
  primaryColor?: string | null;
  customFields?: CustomField[];
  quantity: number;
  customFieldValues: Record<string, any>;
}

export function ServiceRequestFormClient({ 
  hotelSlug, 
  roomCode, 
  serviceId, 
  price,
  roomNumber,
  primaryColor,
  customFields = [],
  quantity,
  customFieldValues
}: ServiceRequestFormClientProps) {
  const router = useRouter();
  const { translate } = useLanguage();
  const { showTranslatedSuccess, showTranslatedError, showTranslatedWarning } = useToast();
  const { trigger: haptic } = useHaptic();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  // Check if all required fields are filled
  const isFormValid = () => {
    // Check guest name (always required)
    if (!guestName.trim()) {
      return false;
    }
    
    // Check required custom fields
    for (const field of customFields) {
      if (field.isRequired) {
        const value = customFieldValues[field.id];
        // For checkbox fields, check if at least one option is selected
        if (field.fieldType === "CHECKBOX") {
          if (!value || !Array.isArray(value) || value.length === 0) {
            return false;
          }
        } else {
          // For radio and select fields, check if value exists and is not empty
          if (!value || (typeof value === 'string' && !value.trim())) {
            return false;
          }
        }
      }
    }
    
    return true;
  };

  // Check if required custom fields are filled (for the main button)
  const areRequiredCustomFieldsFilled = () => {
    for (const field of customFields) {
      if (field.isRequired) {
        const value = customFieldValues[field.id];
        if (field.fieldType === "CHECKBOX") {
          if (!value || !Array.isArray(value) || value.length === 0) {
            return false;
          }
        } else {
          if (!value || (typeof value === 'string' && !value.trim())) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const handleConfirm = async () => {
    if (!guestName.trim()) {
      showTranslatedWarning("app.toast.warning.guest_name_required");
      return;
    }

    // Validate required custom fields
    for (const field of customFields) {
      if (field.isRequired && !customFieldValues[field.id]) {
        toast.warning(translate("app.toast.warning.custom_field_required"), {
          description: translate("app.toast.warning.custom_field_required").replace("{field}", field.label),
        });
        return;
      }
    }

    setIsPending(true);
    
    const formData = new FormData();
    formData.append("hotelSlug", hotelSlug);
    formData.append("roomCode", roomCode);
    formData.append("serviceId", serviceId);
    formData.append("quantity", quantity.toString());
    formData.append("customFieldsData", JSON.stringify(customFieldValues));
    formData.append("guestName", guestName);
    formData.append("guestPhone", guestPhone);
    formData.append("guestEmail", guestEmail);
    formData.append("notes", notes);

    try {
      const result = await createRequest(formData);
      setIsConfirmOpen(false);
      setIsPending(false);
      
      if (result && result.requestId) {
        setRequestId(result.requestId);
        setIsSuccessOpen(true);
        haptic("success");
      } else {
        showTranslatedError("app.toast.error.request_create_failed");
      }
    } catch (error) {
      console.error("Error creating request:", error);
      setIsPending(false);
      showTranslatedError("app.toast.error.request_create_failed");
    }
  };

  const canOpenDialog = areRequiredCustomFieldsFilled();

  return (
    <>
      <Button 
        onClick={() => {
          if (!canOpenDialog) {
            // Show warning for missing required custom fields
            for (const field of customFields) {
              if (field.isRequired && !customFieldValues[field.id]) {
                toast.warning(translate("app.toast.warning.custom_field_required"), {
                  description: translate("app.toast.warning.custom_field_required").replace("{field}", field.label),
                });
                break;
              }
            }
            return;
          }
          setIsConfirmOpen(true);
        }}
        disabled={!canOpenDialog}
        className="w-full h-12 text-lg rounded-xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
        style={{ backgroundColor: primaryColor || undefined }}
      >
        Confirm Order • {price}
      </Button>

      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="mx-4 sm:mx-0 max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to place this order?
            </DialogDescription>
          </DialogHeader>
          
          {roomNumber && (
            <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-900">
                Room Number: <span className="font-bold">{roomNumber}</span>
              </p>
              <p className="text-xs text-blue-700 mt-1">Please verify this is your room number</p>
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guestName" className="text-sm font-medium">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input 
                id="guestName"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestPhone" className="text-sm font-medium">
                Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
              </Label>
              <Input 
                id="guestPhone"
                type="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestEmail" className="text-sm font-medium">
                Email <span className="text-gray-400 text-xs">(Optional)</span>
              </Label>
              <Input 
                id="guestEmail"
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="Enter your email"
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">Special Requests</Label>
              <Input 
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. No mayo, extra towel..." 
                className="h-20 py-2" 
              />
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-600 space-y-2">
            <p>
              <strong>Payment Note:</strong> The payment will be charged directly to your room bill at the hotel.
            </p>
            <p className="text-xs text-gray-500">
              * If the hotel offers online payment, you will be redirected to the payment gateway. (Currently not available)
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsConfirmOpen(false)} className="w-full sm:w-auto">
              Cancel
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!isFormValid() || isPending}
              className="w-full sm:w-auto rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: primaryColor || undefined }}
            >
              {isPending ? translate("app.dashboard.common.processing") : translate("app.dashboard.common.confirm_order")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={isSuccessOpen} onOpenChange={setIsSuccessOpen}>
        <DialogContent className="mx-4 sm:mx-0 max-w-md">
          <DialogHeader>
            <div className="flex flex-col items-center text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-500">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <DialogTitle className="text-xl font-bold">{translate("app.guest.order_confirmed")}</DialogTitle>
              <DialogDescription className="text-base mt-2">
                {translate("app.guest.order_confirmed_msg")}
              </DialogDescription>
            </div>
          </DialogHeader>

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              variant="outline" 
              onClick={() => {
                setIsSuccessOpen(false);
                // Reset form
                setGuestName("");
                setGuestPhone("");
                setGuestEmail("");
                setNotes("");
              }} 
              className="w-full sm:w-auto"
            >
              {translate("app.guest.order_another")}
            </Button>
            <Button 
              onClick={() => {
                if (requestId) {
                  router.push(`/g/${hotelSlug}/${roomCode}/request/${requestId}`);
                } else {
                  setIsSuccessOpen(false);
                }
              }}
              className="w-full sm:w-auto"
              style={{ backgroundColor: primaryColor || undefined }}
            >
              {translate("app.guest.view_order_status")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

