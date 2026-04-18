import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth"
import { RequestStatus } from "@prisma/client"

export async function GET() {
  try {
    const user = await requireSessionUser()
    const hotelId = user.hotelId!
    const since = new Date()
    since.setDate(since.getDate() - 30)

    const [
      totalRequests,
      openRequests,
      completedRequests,
      responseSamples,
      topServiceGroup,
      requests,
      roomsCount,
      servicesCount,
    ] = await Promise.all([
      prisma.request.count({ where: { hotelId } }),
      prisma.request.count({
        where: {
          hotelId,
          status: { in: [RequestStatus.NEW, RequestStatus.IN_PROGRESS] },
        },
      }),
      prisma.request.count({ where: { hotelId, status: RequestStatus.COMPLETED } }),
      prisma.request.findMany({
        where: {
          hotelId,
          status: RequestStatus.COMPLETED,
          completedAt: { not: null },
        },
        select: { createdAt: true, completedAt: true },
        take: 200,
      }),
      prisma.request.groupBy({
        by: ["serviceId"],
        where: { hotelId },
        _count: { serviceId: true },
        orderBy: { _count: { serviceId: "desc" } },
        take: 1,
      }),
      prisma.request.findMany({
        where: { hotelId, createdAt: { gte: since } },
        select: { createdAt: true },
      }),
      prisma.room.count({ where: { hotelId } }),
      prisma.service.count({ where: { hotelId, isActive: true } }),
    ])

    const topServiceId = topServiceGroup[0]?.serviceId
    const topService = topServiceId
      ? await prisma.service.findUnique({
          where: { id: topServiceId },
          select: { name: true },
        })
      : null

    const byDayMap = new Map<string, number>()
    requests.forEach((req) => {
      const key = req.createdAt.toISOString().slice(0, 10)
      byDayMap.set(key, (byDayMap.get(key) ?? 0) + 1)
    })

    const requestsByDay = [...byDayMap.entries()]
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    const responseDurations = responseSamples
      .map((sample) => {
        if (!sample.completedAt) return null
        return sample.completedAt.getTime() - sample.createdAt.getTime()
      })
      .filter((value): value is number => value !== null)

    const avgResponseMinutes =
      responseDurations.length > 0
        ? Math.round(
            responseDurations.reduce((sum, value) => sum + value, 0) /
              responseDurations.length /
              60000
          )
        : null

    return NextResponse.json({
      stats: {
        totalRequests,
        openRequests,
        completedRequests,
        roomsCount,
        servicesCount,
        avgResponseMinutes,
        topService: topService?.name ?? null,
      },
      requestsByDay,
    })
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json(
      { error: "Failed to load analytics" },
      { status: 500 }
    )
  }
}
