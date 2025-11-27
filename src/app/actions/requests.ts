"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail, sendAdminNotification, emailTemplates } from "@/lib/email";

export async function updateRequestStatus(requestId: string, status: string) {
  try {
    const request = await prisma.request.update({
      where: { id: requestId },
      data: { status: status as any },
      include: {
        hotel: true,
        room: true,
        service: true,
      },
    });

    // Send email notification to guest if they have a session with email
    if (request.roomId) {
      const guestSession = await prisma.guestSession.findFirst({
        where: {
          hotelId: request.hotelId,
          roomCode: request.room.code,
          email: { not: null },
        },
        orderBy: { lastActive: "desc" },
      });

      if (guestSession?.email) {
        await sendEmail({
          to: guestSession.email,
          ...emailTemplates.requestStatusUpdate(
            guestSession.email,
            request.hotel.name,
            request.service.name,
            status
          ),
        });
      }
    }
    
    revalidatePath("/dashboard/requests");
    return { success: true };
  } catch (error) {
    console.error("Error updating request status:", error);
    return { success: false, error: "Failed to update request status" };
  }
}

export async function assignRequest(requestId: string, assigneeId: string | null) {
  try {
    await prisma.request.update({
      where: { id: requestId },
      data: { assigneeId },
    });
    
    revalidatePath("/dashboard/requests");
    return { success: true };
  } catch (error) {
    console.error("Error assigning request:", error);
    return { success: false, error: "Failed to assign request" };
  }
}

export async function deleteRequest(requestId: string) {
  try {
    await prisma.request.delete({
      where: { id: requestId },
    });
    
    revalidatePath("/dashboard/requests");
    return { success: true };
  } catch (error) {
    console.error("Error deleting request:", error);
    return { success: false, error: "Failed to delete request" };
  }
}

export async function getHotelStaff(hotelId: string) {
  try {
    const staff = await prisma.user.findMany({
      where: { 
        hotelId,
        role: { in: ['STAFF', 'MANAGER'] }
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    
    return { success: true, staff };
  } catch (error) {
    console.error("Error fetching staff:", error);
    return { success: false, error: "Failed to fetch staff", staff: [] };
  }
}

export async function createRequest(formData: FormData) {
  try {
    const hotelId = formData.get("hotelId") as string;
    const roomNumber = formData.get("roomNumber") as string;
    const serviceId = formData.get("serviceId") as string;
    const notes = formData.get("notes") as string;
    const guestName = formData.get("guestName") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 1;

    if (!hotelId || !roomNumber || !serviceId) {
      return { success: false, error: "Missing required fields" };
    }

    // Find room by number
    const room = await prisma.room.findFirst({
      where: {
        hotelId,
        number: roomNumber,
      },
    });

    if (!room) {
      return { success: false, error: "Room not found" };
    }

    const request = await prisma.request.create({
      data: {
        hotelId,
        roomId: room.id,
        serviceId,
        quantity,
        notes: notes || null,
        guestName: guestName || null,
        status: "NEW",
      },
    });

    revalidatePath("/dashboard/requests");
    return { success: true, requestId: request.id };
  } catch (error) {
    console.error("Error creating request:", error);
    return { success: false, error: "Failed to create request" };
  }
}

export async function updateRequest(formData: FormData) {
  try {
    const requestId = formData.get("requestId") as string;
    const roomNumber = formData.get("roomNumber") as string;
    const serviceId = formData.get("serviceId") as string;
    const notes = formData.get("notes") as string;
    const guestName = formData.get("guestName") as string;
    const quantity = parseInt(formData.get("quantity") as string) || 1;

    if (!requestId) {
      return { success: false, error: "Request ID is required" };
    }

    const updateData: any = {
      quantity,
      notes: notes || null,
      guestName: guestName || null,
    };

    if (serviceId) {
      updateData.serviceId = serviceId;
    }

    if (roomNumber) {
      const request = await prisma.request.findUnique({
        where: { id: requestId },
        include: { hotel: true },
      });

      if (request) {
        const room = await prisma.room.findFirst({
          where: {
            hotelId: request.hotelId,
            number: roomNumber,
          },
        });

        if (room) {
          updateData.roomId = room.id;
        }
      }
    }

    await prisma.request.update({
      where: { id: requestId },
      data: updateData,
    });

    revalidatePath("/dashboard/requests");
    return { success: true };
  } catch (error) {
    console.error("Error updating request:", error);
    return { success: false, error: "Failed to update request" };
  }
}

