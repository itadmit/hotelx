import { auth } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { ReviewsClient } from "@/components/dashboard/ReviewsClient";

export default async function ReviewsPage() {
  const session = await auth();
  
  if (!session?.user?.hotelId) {
    redirect("/login");
  }

  const hotelId = session.user.hotelId;

  try {
    // Fetch reviews
    const reviews = await prisma.review.findMany({
      where: { hotelId },
      include: {
        room: true,
        request: {
          include: {
            service: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate statistics
    const totalReviews = reviews.length;
    const averageRating = totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;
    
    const ratingDistribution = {
      5: reviews.filter(r => r.rating === 5).length,
      4: reviews.filter(r => r.rating === 4).length,
      3: reviews.filter(r => r.rating === 3).length,
      2: reviews.filter(r => r.rating === 2).length,
      1: reviews.filter(r => r.rating === 1).length,
    };

    return (
      <ReviewsClient
        initialReviews={reviews.map(r => ({
          id: r.id,
          rating: r.rating,
          comment: r.comment,
          category: r.category,
          roomNumber: r.room.number,
          serviceName: r.request?.service?.name || null,
          createdAt: r.createdAt,
        }))}
        stats={{
          totalReviews,
          averageRating,
          ratingDistribution,
        }}
      />
    );
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Error Loading Reviews</h1>
        <p className="text-gray-600">{error instanceof Error ? error.message : "An unexpected error occurred"}</p>
      </div>
    );
  }
}

