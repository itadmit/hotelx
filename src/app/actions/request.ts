"use server";

import prisma from "@/lib/prisma";
import { sendAdminNotification, emailTemplates } from "@/lib/email";

export async function createRequest(formData: FormData) {
  const hotelSlug = formData.get("hotelSlug") as string;
  const roomCode = formData.get("roomCode") as string;
  const serviceId = formData.get("serviceId") as string;
  const quantityStr = formData.get("quantity") as string;
  const quantity = parseInt(quantityStr) || 1;
  const customFieldsDataStr = formData.get("customFieldsData") as string;
  let customFieldsData = null;
  if (customFieldsDataStr) {
    try {
      customFieldsData = JSON.parse(customFieldsDataStr);
    } catch (e) {
      throw new Error("Invalid custom fields data format");
    }
  }
  const notes = formData.get("notes") as string;
  const guestName = formData.get("guestName") as string;
  const guestPhone = formData.get("guestPhone") as string;
  const guestEmail = formData.get("guestEmail") as string;

  if (!hotelSlug || !roomCode || !serviceId) {
    throw new Error("Missing required fields");
  }

  if (!guestName || guestName.trim() === "") {
    throw new Error("Guest name is required");
  }

  if (quantity < 1) {
    throw new Error("Quantity must be at least 1");
  }

  // 1. Validate Hotel
  const hotel = await prisma.hotel.findUnique({
    where: { slug: hotelSlug },
  });

  if (!hotel) {
    throw new Error("Hotel not found");
  }

  // 2. Validate Room (roomCode is now the room number)
  const room = await prisma.room.findFirst({
    where: {
      number: roomCode,
      hotelId: hotel.id,
    },
  });

  if (!room) {
    throw new Error("Invalid room number");
  }

  // 3. Validate Service (try by slug first, then by ID for backwards compatibility)
  let service = await prisma.service.findFirst({
    where: { 
      slug: serviceId,
      hotelId: hotel.id
    },
    select: { id: true, name: true },
  });

  // If not found by slug, try by ID
  if (!service) {
    service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true, name: true },
    });
  }

  if (!service) {
    throw new Error("Service not found");
  }

  // Use the actual service ID for the request
  const actualServiceId = service.id;

  // 4. Create Request
  const request = await prisma.request.create({
    data: {
      hotelId: hotel.id,
      roomId: room.id,
      serviceId: actualServiceId,
      quantity: quantity,
      customFieldsData: customFieldsData,
      notes: notes || null,
      guestName: guestName.trim(),
      guestPhone: guestPhone && guestPhone.trim() !== "" ? guestPhone.trim() : null,
      guestEmail: guestEmail && guestEmail.trim() !== "" ? guestEmail.trim() : null,
      status: "NEW",
    },
  });

  // 5. Send email notification to admin
  if (service) {
    await sendAdminNotification(
      ...Object.values(emailTemplates.newRequest(
        hotel.name,
        room.number,
        service.name
      ))
    );
  }

  // 6. Return request ID instead of redirecting (client will handle redirect with animation)
  return {
    success: true,
    requestId: request.id,
    hotelSlug,
    roomNumber: room.number,
  };
}

