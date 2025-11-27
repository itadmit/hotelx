"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/useToast";
import { createReview } from "@/app/actions/reviews";

interface ReviewFormProps {
  hotelSlug: string;
  roomCode: string;
  requestId: string;
  serviceName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewForm({
  hotelSlug,
  roomCode,
  requestId,
  serviceName,
  isOpen,
  onClose,
}: ReviewFormProps) {
  const { translate } = useLanguage();
  const { showTranslatedSuccess, showTranslatedError } = useToast();
  const t = (key: string) => translate(`app.guest.${key}`);
  
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [category, setCategory] = useState<"QUALITY" | "SPEED" | "STAFF" | "VALUE" | "OVERALL">("OVERALL");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (rating === 0) {
      showTranslatedError("app.toast.error.rating_required");
      return;
    }

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("hotelSlug", hotelSlug);
    formData.append("roomCode", roomCode);
    formData.append("requestId", requestId);
    formData.append("rating", rating.toString());
    formData.append("comment", comment);
    formData.append("category", category);

    const result = await createReview(formData);

    if (result.success) {
      showTranslatedSuccess("app.toast.success.review_submitted");
      setRating(0);
      setComment("");
      setCategory("OVERALL");
      onClose();
    } else {
      showTranslatedError("app.toast.error.review_failed");
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{t("rate_service")}</DialogTitle>
          <DialogDescription>
            {t("rate_service_desc").replace("{service}", serviceName)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating Stars */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="focus:outline-none transition-transform active:scale-90"
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600">
                {rating === 1 && t("rating_1")}
                {rating === 2 && t("rating_2")}
                {rating === 3 && t("rating_3")}
                {rating === 4 && t("rating_4")}
                {rating === 5 && t("rating_5")}
              </p>
            )}
          </div>

          {/* Category Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t("review_category")}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="OVERALL">{t("category_overall")}</option>
              <option value="QUALITY">{t("category_quality")}</option>
              <option value="SPEED">{t("category_speed")}</option>
              <option value="STAFF">{t("category_staff")}</option>
              <option value="VALUE">{t("category_value")}</option>
            </select>
          </div>

          {/* Comment */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">{t("add_comment")} ({t("optional")})</label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={t("comment_placeholder")}
              rows={4}
              className="resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              disabled={isSubmitting || rating === 0}
            >
              {isSubmitting ? t("submitting") : t("submit_review")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}



