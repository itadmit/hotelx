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
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (!guestName.trim()) {
      alert("Please enter your full name");
      return;
    }

    // Validate required custom fields
    for (const field of customFields) {
      if (field.isRequired && !customFieldValues[field.id]) {
        alert(`Please fill in the required field: ${field.label}`);
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
      await createRequest(formData);
      setIsConfirmOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating request:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsConfirmOpen(true)}
        className="w-full h-12 text-lg rounded-xl shadow-lg transition-all"
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
              disabled={isPending}
              className="w-full sm:w-auto rounded-md"
              style={{ backgroundColor: primaryColor || undefined }}
            >
              {isPending ? translate("app.dashboard.common.processing") : translate("app.dashboard.common.confirm_order")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

