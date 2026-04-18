import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { RequestStatus } from "@prisma/client"
import { z } from "zod"

const updateRequestSchema = z.object({
  status: z.nativeEnum(RequestStatus).optional(),
  assigneeId: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ requestId: string }> }
) {
  try {
    const user = await requireSessionUser()
    const { requestId } = await params
    const body = await request.json()
    const parsed = updateRequestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid payload" },
        { status: 400 }
      )
    }

    const nextData: {
      status?: RequestStatus
      assigneeId?: string | null
      notes?: string | null
      completedAt?: Date | null
    } = {}

    if (parsed.data.status) {
      nextData.status = parsed.data.status
      nextData.completedAt =
        parsed.data.status === RequestStatus.COMPLETED ? new Date() : null
    }

    if (parsed.data.assigneeId !== undefined) {
      nextData.assigneeId = parsed.data.assigneeId
    }

    if (parsed.data.notes !== undefined) {
      nextData.notes = parsed.data.notes
    }

    const updatedCount = await prisma.request.updateMany({
      where: { id: requestId, hotelId: user.hotelId! },
      data: nextData,
    })

    if (updatedCount.count === 0) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    const updatedRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: { room: true, service: true, assignee: true },
    })

    return NextResponse.json({ request: updatedRequest })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    )
  }
}
