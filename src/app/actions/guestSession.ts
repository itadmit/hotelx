"use server";

import {
  createGuestSession as createSession,
  createGuestModeSession as createGuestMode,
  deleteGuestSession as deleteSession,
} from "@/lib/guestSession";
import { revalidatePath } from "next/cache";

export async function registerGuest(formData: FormData) {
  try {
    const hotelSlug = formData.get("hotelSlug") as string;
    const roomCode = formData.get("roomCode") as string;
    const fullName = formData.get("fullName") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const email = formData.get("email") as string;

    if (!hotelSlug || !roomCode || !fullName || !phoneNumber) {
      return { success: false, error: "Missing required fields" };
    }

    const result = await createSession(hotelSlug, roomCode, {
      fullName: fullName.trim(),
      phoneNumber: phoneNumber.trim(),
      email: email?.trim() || undefined,
    });

    if (result.success) {
      revalidatePath(`/g/${hotelSlug}/${roomCode}`);
    }

    return result;
  } catch (error) {
    console.error("Error registering guest:", error);
    return { success: false, error: "Failed to register guest" };
  }
}

export async function continueAsGuest(hotelSlug: string, roomCode: string) {
  try {
    const result = await createGuestMode(hotelSlug, roomCode);

    if (result.success) {
      revalidatePath(`/g/${hotelSlug}/${roomCode}`);
    }

    return result;
  } catch (error) {
    console.error("Error creating guest mode:", error);
    return { success: false, error: "Failed to create guest mode" };
  }
}

export async function clearGuestData() {
  try {
    const result = await deleteSession();

    if (result.success) {
      revalidatePath("/");
    }

    return result;
  } catch (error) {
    console.error("Error clearing guest data:", error);
    return { success: false };
  }
}


