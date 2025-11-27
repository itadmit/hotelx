"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendAdminNotification, emailTemplates } from "@/lib/email";

export async function createReview(formData: FormData) {
  try {
    const hotelSlug = formData.get("hotelSlug") as string;
    const roomCode = formData.get("roomCode") as string;
    const requestId = formData.get("requestId") as string;
    const ratingStr = formData.get("rating") as string;
    const comment = formData.get("comment") as string | null;
    const category = formData.get("category") as string;

    if (!hotelSlug || !roomCode || !requestId || !ratingStr || !category) {
      return { success: false, error: "Missing required fields" };
    }

    const rating = parseInt(ratingStr);
    if (rating < 1 || rating > 5) {
      return { success: false, error: "Rating must be between 1 and 5" };
    }

    // Find hotel
    const hotel = await prisma.hotel.findUnique({
      where: { slug: hotelSlug },
    });

    if (!hotel) {
      return { success: false, error: "Hotel not found" };
    }

    // Find room
    const room = await prisma.room.findFirst({
      where: {
        number: roomCode,
        hotelId: hotel.id,
      },
    });

    if (!room) {
      return { success: false, error: "Room not found" };
    }

    // Verify request exists and is completed
    const request = await prisma.request.findUnique({
      where: { id: requestId },
    });

    if (!request || request.status !== "COMPLETED") {
      return { success: false, error: "Request not found or not completed" };
    }

    // Check if review already exists for this request
    const existingReview = await prisma.review.findFirst({
      where: { requestId },
    });

    if (existingReview) {
      // Update existing review
      const review = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment: comment?.trim() || null,
          category: category as any,
        },
      });

      revalidatePath("/dashboard/reviews");
      return { success: true, reviewId: review.id };
    }

    // Create new review
    const review = await prisma.review.create({
      data: {
        hotelId: hotel.id,
        roomId: room.id,
        requestId,
        rating,
        comment: comment?.trim() || null,
        category: category as any,
      },
    });

    // Send email notification to admin
    await sendAdminNotification(
      ...Object.values(emailTemplates.newReview(
        hotel.name,
        room.number,
        rating,
        category,
        comment?.trim() || undefined
      ))
    );

    revalidatePath("/dashboard/reviews");
    return { success: true, reviewId: review.id };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, error: "Failed to create review" };
  }
}


