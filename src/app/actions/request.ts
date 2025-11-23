"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createRequest(formData: FormData) {
  const hotelSlug = formData.get("hotelSlug") as string;
  const roomCode = formData.get("roomCode") as string;
  const serviceId = formData.get("serviceId") as string;
  const quantityStr = formData.get("quantity") as string;
  const quantity = parseInt(quantityStr) || 1;
  const customFieldsDataStr = formData.get("customFieldsData") as string;
  const customFieldsData = customFieldsDataStr ? JSON.parse(customFieldsDataStr) : null;
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

  // 2. Validate Room
  const room = await prisma.room.findUnique({
    where: {
      code: roomCode,
      // We verify the room belongs to the hotel implicitly via the unique constraint if code is unique globally,
      // but schema says code is @unique globally?
      // schema: code String @unique
      // schema: @@unique([hotelId, number])
      // Let's check if the room belongs to the hotel
    },
  });

  if (!room || room.hotelId !== hotel.id) {
    throw new Error("Invalid room code");
  }

  // 3. Create Request
  const request = await prisma.request.create({
    data: {
      hotelId: hotel.id,
      roomId: room.id,
      serviceId: serviceId,
      quantity: quantity,
      customFieldsData: customFieldsData,
      notes: notes || null,
      guestName: guestName.trim(),
      guestPhone: guestPhone && guestPhone.trim() !== "" ? guestPhone.trim() : null,
      guestEmail: guestEmail && guestEmail.trim() !== "" ? guestEmail.trim() : null,
      status: "NEW",
    },
  });

  // 4. Redirect to status page
  redirect(`/g/${hotelSlug}/${roomCode}/request/${request.id}`);
}

