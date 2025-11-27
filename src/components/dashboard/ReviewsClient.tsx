"use client";

import { useState } from "react";
import { Star, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";

type Review = {
  id: string;
  rating: number;
  comment: string | null;
  category: string;
  roomNumber: string;
  serviceName: string | null;
  createdAt: Date;
};

interface ReviewsClientProps {
  initialReviews: Review[];
  stats: {
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
  };
}

export function ReviewsClient({ initialReviews, stats }: ReviewsClientProps) {
  const { translate } = useLanguage();
  const t = (key: string) => translate(`app.dashboard.reviews.${key}`);
  
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = !searchQuery ||
      r.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.serviceName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRating = ratingFilter === null || r.rating === ratingFilter;
    
    return matchesSearch && matchesRating;
  });

  const getCategoryLabel = (category: string) => {
    return translate(`app.guest.category_${category.toLowerCase()}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{t("title")}</h1>
          <p className="text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{t("total_reviews")}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{stats.totalReviews}</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{t("average_rating")}</p>
          <div className="flex items-center gap-2 mt-2">
            <h3 className="text-3xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</h3>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= Math.round(stats.averageRating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">{t("positive_reviews")}</p>
          <h3 className="text-3xl font-bold text-green-600 mt-2">
            {stats.ratingDistribution[5] + stats.ratingDistribution[4]}
          </h3>
          <p className="text-xs text-gray-500 mt-1">
            {stats.totalReviews > 0
              ? Math.round(((stats.ratingDistribution[5] + stats.ratingDistribution[4]) / stats.totalReviews) * 100)
              : 0}% {t("of_total")}
          </p>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t("rating_distribution")}</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
            const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-20">
                  <span className="text-sm font-medium text-gray-700">{rating}</span>
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-yellow-400 h-full transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("search_placeholder")}
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <button
              key={rating}
              onClick={() => setRatingFilter(ratingFilter === rating ? null : rating)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                ratingFilter === rating
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {rating} ⭐
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filteredReviews.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm">
            {t("no_reviews")}
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-900">{t("room")} {review.roomNumber}</span>
                      {review.serviceName && (
                        <span className="text-sm text-gray-500">• {review.serviceName}</span>
                      )}
                    </div>
                    <Badge className="mt-1 bg-blue-100 text-blue-800">
                      {getCategoryLabel(review.category)}
                    </Badge>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>

              {review.comment && (
                <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

