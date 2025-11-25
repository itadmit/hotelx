"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
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

function SubmitButton({ price, onClick, primaryColor }: { price: string, onClick: (e: React.MouseEvent) => void, primaryColor?: string | null }) {
  const { pending } = useFormStatus();
  
  return (
    <Button 
      type="button" 
      onClick={onClick}
      disabled={pending} 
      className="w-full h-12 text-lg rounded-md shadow-lg shadow-primary/20 transition-all"
      style={{ backgroundColor: primaryColor || undefined }}
    >
      {pending ? "Processing..." : `Confirm Order • ${price}`}
    </Button>
  );
}

interface ServiceRequestFormProps {
  hotelSlug: string;
  roomCode: string;
  serviceId: string;
  price: string;
  roomNumber?: string | null;
  primaryColor?: string | null;
}

export function ServiceRequestForm({ 
  hotelSlug, 
  roomCode, 
  serviceId, 
  price,
  roomNumber,
  primaryColor 
}: ServiceRequestFormProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");

  const handleInitialSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsConfirmOpen(true);
  };

  return (
    <>
      <form action={createRequest} className="mt-auto space-y-6" id="request-form">
        <input type="hidden" name="hotelSlug" value={hotelSlug} />
        <input type="hidden" name="roomCode" value={roomCode} />
        <input type="hidden" name="serviceId" value={serviceId} />
        <input type="hidden" name="guestName" value={guestName} />
        <input type="hidden" name="guestPhone" value={guestPhone} />
        <input type="hidden" name="guestEmail" value={guestEmail} />
        
        <div className="space-y-2 text-left">
          <Label htmlFor="notes">Special Requests</Label>
          <Input 
            id="notes"
            name="notes" 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. No mayo, extra towel..." 
            className="h-20 py-2 text-left" 
          />
        </div>
        
        <SubmitButton price={price} onClick={handleInitialSubmit} primaryColor={primaryColor} />

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
                onClick={() => {
                  if (!guestName.trim()) {
                    // Validation will be handled by the form
                    return;
                  }
                  // Submitting the form programmatically
                  const form = document.getElementById('request-form') as HTMLFormElement;
                  if (form) form.requestSubmit();
                  setIsConfirmOpen(false);
                }}
                className="w-full sm:w-auto rounded-md"
                style={{ backgroundColor: primaryColor || undefined }}
              >
                Confirm Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </form>
    </>
  );
}
