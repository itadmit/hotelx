import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { RequestStatus } from "@prisma/client"
import { z } from "zod"
import { emitNotification } from "@/lib/notifications/emit"

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

    const previous = await prisma.request.findFirst({
      where: { id: requestId, hotelId: user.hotelId! },
      select: { status: true, assigneeId: true },
    })

    if (!previous) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 })
    }

    await prisma.request.updateMany({
      where: { id: requestId, hotelId: user.hotelId! },
      data: nextData,
    })

    const updatedRequest = await prisma.request.findUnique({
      where: { id: requestId },
      include: {
        room: { select: { id: true, number: true, code: true } },
        service: { select: { id: true, name: true } },
        assignee: true,
        hotel: { select: { slug: true } },
      },
    })

    if (updatedRequest) {
      const baseCtx = {
        serviceName: updatedRequest.service.name,
        roomNumber: updatedRequest.room.number,
        hotelSlug: updatedRequest.hotel.slug,
        roomCode: updatedRequest.room.code,
        requestId: updatedRequest.id,
      }

      const statusChanged =
        parsed.data.status !== undefined &&
        parsed.data.status !== previous.status

      if (statusChanged) {
        const isCompleted = updatedRequest.status === RequestStatus.COMPLETED
        void emitNotification({
          hotelId: user.hotelId!,
          audience: "GUEST",
          type: isCompleted ? "REQUEST_COMPLETED" : "REQUEST_STATUS_CHANGED",
          roomId: updatedRequest.room.id,
          requestId: updatedRequest.id,
          context: { ...baseCtx, status: updatedRequest.status },
        })

        if (isCompleted) {
          void emitNotification({
            hotelId: user.hotelId!,
            audience: "STAFF",
            type: "REQUEST_COMPLETED",
            roomId: updatedRequest.room.id,
            requestId: updatedRequest.id,
            context: { ...baseCtx, status: updatedRequest.status },
          })
        }
      }

      const assigneeChanged =
        parsed.data.assigneeId !== undefined &&
        parsed.data.assigneeId !== previous.assigneeId &&
        updatedRequest.assigneeId

      if (assigneeChanged) {
        void emitNotification({
          hotelId: user.hotelId!,
          audience: "STAFF",
          type: "REQUEST_ASSIGNED",
          roomId: updatedRequest.room.id,
          requestId: updatedRequest.id,
          userId: updatedRequest.assigneeId,
          context: {
            ...baseCtx,
            assigneeName: updatedRequest.assignee?.name ?? null,
          },
        })
      }
    }

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
