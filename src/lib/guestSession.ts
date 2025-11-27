import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const GUEST_SESSION_COOKIE = "hotelx_guest_session";
const GUEST_MODE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const REGISTERED_MODE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days

export interface GuestSessionData {
  id: string;
  hotelId: string;
  roomCode: string;
  phoneNumber: string;
  fullName: string;
  email?: string;
  isGuestMode: boolean;
  expiresAt: Date;
}

/**
 * Get current guest session from cookie
 */
export async function getGuestSession(
  hotelSlug: string,
  roomCode: string
): Promise<GuestSessionData | null> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(GUEST_SESSION_COOKIE)?.value;

    if (!sessionId) {
      return null;
    }

    // Find the hotel
    const hotel = await prisma.hotel.findUnique({
      where: { slug: hotelSlug },
      select: { id: true },
    });

    if (!hotel) {
      return null;
    }

    // Find the session
    const session = await prisma.guestSession.findFirst({
      where: {
        id: sessionId,
        hotelId: hotel.id,
        roomCode,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!session) {
      // Session expired or not found
      // Note: Cannot delete cookie here as this is called from Server Component
      // The cookie will expire naturally or can be cleared from a Server Action
      return null;
    }

    // Update last active
    await prisma.guestSession.update({
      where: { id: session.id },
      data: { lastActive: new Date() },
    });

    return {
      id: session.id,
      hotelId: session.hotelId,
      roomCode: session.roomCode,
      phoneNumber: session.phoneNumber,
      fullName: session.fullName,
      email: session.email || undefined,
      isGuestMode: session.isGuestMode,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    console.error("Error getting guest session:", error);
    return null;
  }
}

/**
 * Create a new guest session (registered with phone)
 */
export async function createGuestSession(
  hotelSlug: string,
  roomCode: string,
  data: {
    fullName: string;
    phoneNumber: string;
    email?: string;
  }
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    const cookieStore = await cookies();

    // Find the hotel
    const hotel = await prisma.hotel.findUnique({
      where: { slug: hotelSlug },
      select: { id: true },
    });

    if (!hotel) {
      return { success: false, error: "Hotel not found" };
    }

    // Check if session already exists for this phone number
    const existingSession = await prisma.guestSession.findFirst({
      where: {
        hotelId: hotel.id,
        roomCode,
        phoneNumber: data.phoneNumber,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    let sessionId: string;

    if (existingSession) {
      // Update existing session
      const updated = await prisma.guestSession.update({
        where: { id: existingSession.id },
        data: {
          fullName: data.fullName,
          email: data.email || null,
          lastActive: new Date(),
          expiresAt: new Date(Date.now() + REGISTERED_MODE_DURATION),
          isGuestMode: false,
        },
      });
      sessionId = updated.id;
    } else {
      // Create new session
      const session = await prisma.guestSession.create({
        data: {
          hotelId: hotel.id,
          roomCode,
          phoneNumber: data.phoneNumber,
          fullName: data.fullName,
          email: data.email || null,
          isGuestMode: false,
          expiresAt: new Date(Date.now() + REGISTERED_MODE_DURATION),
        },
      });
      sessionId = session.id;
    }

    // Set cookie
    cookieStore.set(GUEST_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: REGISTERED_MODE_DURATION / 1000, // in seconds
      path: "/",
    });

    return { success: true, sessionId };
  } catch (error) {
    console.error("Error creating guest session:", error);
    return { success: false, error: "Failed to create session" };
  }
}

/**
 * Create a guest mode session (24h expiry, no phone number)
 */
export async function createGuestModeSession(
  hotelSlug: string,
  roomCode: string
): Promise<{ success: boolean; sessionId?: string; error?: string }> {
  try {
    const cookieStore = await cookies();

    // Find the hotel
    const hotel = await prisma.hotel.findUnique({
      where: { slug: hotelSlug },
      select: { id: true },
    });

    if (!hotel) {
      return { success: false, error: "Hotel not found" };
    }

    // Create guest mode session with anonymous phone number
    const anonymousPhone = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    const session = await prisma.guestSession.create({
      data: {
        hotelId: hotel.id,
        roomCode,
        phoneNumber: anonymousPhone,
        fullName: "Guest",
        isGuestMode: true,
        expiresAt: new Date(Date.now() + GUEST_MODE_DURATION),
      },
    });

    // Set cookie
    cookieStore.set(GUEST_SESSION_COOKIE, session.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: GUEST_MODE_DURATION / 1000, // in seconds
      path: "/",
    });

    return { success: true, sessionId: session.id };
  } catch (error) {
    console.error("Error creating guest mode session:", error);
    return { success: false, error: "Failed to create guest mode session" };
  }
}

/**
 * Delete guest session (logout/clear data)
 */
export async function deleteGuestSession(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(GUEST_SESSION_COOKIE)?.value;

    if (sessionId) {
      // Delete from database
      await prisma.guestSession.delete({
        where: { id: sessionId },
      }).catch(() => {
        // Session might already be deleted
      });
    }

    // Clear cookie
    cookieStore.delete(GUEST_SESSION_COOKIE);

    return { success: true };
  } catch (error) {
    console.error("Error deleting guest session:", error);
    return { success: false };
  }
}

/**
 * Clean up expired sessions (should be run by a cron job)
 */
export async function cleanupExpiredSessions(): Promise<{ deleted: number }> {
  try {
    const result = await prisma.guestSession.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return { deleted: result.count };
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error);
    return { deleted: 0 };
  }
}


