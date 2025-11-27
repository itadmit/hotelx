"use client";

import { useState, useEffect } from "react";
import { ReviewForm } from "./ReviewForm";

interface CompletedOrder {
  id: string;
  serviceName: string;
  hasReview: boolean;
}

interface AutoReviewPopupProps {
  hotelSlug: string;
  roomCode: string;
  completedOrders: CompletedOrder[];
}

export function AutoReviewPopup({ hotelSlug, roomCode, completedOrders }: AutoReviewPopupProps) {
  const [currentOrderIndex, setCurrentOrderIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [reviewedOrders, setReviewedOrders] = useState<Set<string>>(new Set());

  // Filter orders that don't have reviews and haven't been reviewed in this session
  const ordersToReview = completedOrders.filter(
    order => !order.hasReview && !reviewedOrders.has(order.id)
  );

  useEffect(() => {
    // Show popup after 2 seconds if there are orders to review
    if (ordersToReview.length > 0) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [ordersToReview.length]);

  const handleClose = () => {
    const currentOrder = ordersToReview[currentOrderIndex];
    if (currentOrder) {
      // Mark as reviewed in this session (even if they closed without rating)
      setReviewedOrders(prev => new Set(prev).add(currentOrder.id));
    }

    // Move to next order if available
    if (currentOrderIndex < ordersToReview.length - 1) {
      setCurrentOrderIndex(prev => prev + 1);
      // Open again for next order after a short delay
      setTimeout(() => setIsOpen(true), 1000);
    } else {
      setIsOpen(false);
    }
  };

  if (ordersToReview.length === 0 || currentOrderIndex >= ordersToReview.length) {
    return null;
  }

  const currentOrder = ordersToReview[currentOrderIndex];

  return (
    <ReviewForm
      hotelSlug={hotelSlug}
      roomCode={roomCode}
      requestId={currentOrder.id}
      serviceName={currentOrder.serviceName}
      isOpen={isOpen}
      onClose={handleClose}
    />
  );
}



