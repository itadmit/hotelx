"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendAdminNotification, emailTemplates } from "@/lib/email";

export async function createComplaint(formData: FormData) {
  try {
    const hotelSlug = formData.get("hotelSlug") as string;
    const roomCode = formData.get("roomCode") as string;
    const type = formData.get("type") as string;
    const description = formData.get("description") as string;
    const requestId = formData.get("requestId") as string | null;

    if (!hotelSlug || !roomCode || !type || !description) {
      return { success: false, error: "Missing required fields" };
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

    // Determine priority based on type
    let priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" = "MEDIUM";
    if (type === "DELAY" || type === "ORDER_ISSUE") {
      priority = "HIGH";
    } else if (type === "NOISE" || type === "ROOM_ISSUE") {
      priority = "HIGH";
    }

    // Create complaint
    const complaint = await prisma.complaint.create({
      data: {
        hotelId: hotel.id,
        roomId: room.id,
        requestId: requestId || null,
        type: type as any,
        description: description.trim(),
        priority,
        status: "NEW",
      },
    });

    // Send email notification to admin
    await sendAdminNotification(
      ...Object.values(emailTemplates.newComplaint(
        hotel.name,
        room.number,
        type,
        description,
        priority
      ))
    );

    revalidatePath("/dashboard/complaints");
    return { success: true, complaintId: complaint.id };
  } catch (error) {
    console.error("Error creating complaint:", error);
    return { success: false, error: "Failed to create complaint" };
  }
}

export async function updateComplaintStatus(
  complaintId: string,
  status: "NEW" | "IN_PROGRESS" | "RESOLVED" | "CANCELLED"
) {
  try {
    const updateData: any = { status };
    if (status === "RESOLVED") {
      updateData.resolvedAt = new Date();
    }

    await prisma.complaint.update({
      where: { id: complaintId },
      data: updateData,
    });

    revalidatePath("/dashboard/complaints");
    return { success: true };
  } catch (error) {
    console.error("Error updating complaint:", error);
    return { success: false, error: "Failed to update complaint" };
  }
}

export async function assignComplaint(complaintId: string, staffId: string | null) {
  try {
    await prisma.complaint.update({
      where: { id: complaintId },
      data: { assigneeId: staffId },
    });

    revalidatePath("/dashboard/complaints");
    return { success: true };
  } catch (error) {
    console.error("Error assigning complaint:", error);
    return { success: false, error: "Failed to assign complaint" };
  }
}


