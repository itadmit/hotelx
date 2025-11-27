import { NextRequest, NextResponse } from "next/server";
import { cleanupExpiredSessions } from "@/lib/guestSession";

/**
 * Cron job endpoint to clean up expired guest sessions
 * 
 * Should be called daily via a cron service like Vercel Cron, GitHub Actions, or external service
 * 
 * Example: GET /api/cron/cleanup-sessions
 * 
 * For Vercel Cron, add to vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/cleanup-sessions",
 *     "schedule": "0 2 * * *"
 *   }]
 * }
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Add authentication for cron job
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const result = await cleanupExpiredSessions();

    return NextResponse.json({
      success: true,
      deleted: result.deleted,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in cleanup-sessions cron:", error);
    return NextResponse.json(
      { error: "Failed to cleanup sessions" },
      { status: 500 }
    );
  }
}


