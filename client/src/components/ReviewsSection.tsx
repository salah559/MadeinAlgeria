import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Review, InsertReview } from "@shared/schema";
import { Star, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface ReviewsSectionProps {
  factoryId: string;
}

export default function ReviewsSection({ factoryId }: ReviewsSectionProps) {
  const { language } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [commentAr, setCommentAr] = useState("");

  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews", factoryId],
  });

  const addReviewMutation = useMutation({
    mutationFn: async (review: InsertReview) => {
      return await apiRequest("POST", "/api/reviews", review);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews", factoryId] });
      queryClient.invalidateQueries({ queryKey: ["/api/factories", factoryId] });
      setRating(0);
      setComment("");
      setCommentAr("");
      toast({
        title: language === "ar" ? "تم إضافة التقييم" : "Review Added",
        description: language === "ar" ? "شكراً لمشاركتك!" : "Thanks for sharing!",
      });
    },
  });

  const handleSubmit = () => {
    if (!user) {
      toast({
        title: language === "ar" ? "يجب تسجيل الدخول" : "Login Required",
        description: language === "ar" 
          ? "يرجى تسجيل الدخول لإضافة تقييم"
          : "Please login to add a review",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: language === "ar" ? "يجب اختيار تقييم" : "Rating Required",
        description: language === "ar" 
          ? "يرجى اختيار عدد النجوم"
          : "Please select a star rating",
        variant: "destructive",
      });
      return;
    }

    addReviewMutation.mutate({
      factoryId,
      userId: user.id,
      rating,
      comment: comment || null,
      commentAr: commentAr || null,
    });
  };

  const averageRating = reviews && reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  return (
    <div className="space-y-6" data-testid="reviews-section">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            {language === "ar" ? "التقييمات والمراجعات" : language === "fr" ? "Avis et Critiques" : "Reviews & Ratings"}
          </h2>
          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(averageRating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
              <span className="text-sm text-muted-foreground">
                ({reviews.length} {language === "ar" ? "تقييم" : language === "fr" ? "avis" : "reviews"})
              </span>
            </div>
          )}
        </div>
      </div>

      {user && (
        <Card data-testid="add-review-form">
          <CardHeader>
            <h3 className="font-semibold">
              {language === "ar" ? "أضف تقييمك" : language === "fr" ? "Ajoutez votre avis" : "Add Your Review"}
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "ar" ? "التقييم" : language === "fr" ? "Note" : "Rating"}
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-8 h-8 cursor-pointer transition-colors ${
                      star <= rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                    onClick={() => setRating(star)}
                    data-testid={`star-${star}`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "ar" ? "التعليق (عربي)" : "Comment (Arabic)"}
              </label>
              <Textarea
                value={commentAr}
                onChange={(e) => setCommentAr(e.target.value)}
                placeholder={language === "ar" ? "شارك تجربتك..." : "Share your experience..."}
                rows={3}
                data-testid="input-comment-ar"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {language === "ar" ? "التعليق (إنجليزي/فرنسي)" : "Comment (English/French)"}
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience..."
                rows={3}
                data-testid="input-comment"
              />
            </div>

            <Button 
              onClick={handleSubmit}
              disabled={addReviewMutation.isPending}
              data-testid="button-submit-review"
            >
              {addReviewMutation.isPending
                ? (language === "ar" ? "جاري الإرسال..." : "Submitting...")
                : (language === "ar" ? "إرسال التقييم" : language === "fr" ? "Soumettre" : "Submit Review")
              }
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="space-y-4">
        {reviews?.map((review) => (
          <Card key={review.id} data-testid={`review-${review.id}`}>
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarFallback>
                    {review.userId.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString(
                        language === "ar" ? "ar-DZ" : language === "fr" ? "fr-FR" : "en-US"
                      )}
                    </span>
                  </div>
                  <p className="text-sm md:text-base">
                    {language === "ar" && review.commentAr 
                      ? review.commentAr 
                      : review.comment || (language === "ar" ? "بدون تعليق" : "No comment")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!isLoading && (!reviews || reviews.length === 0) && (
        <div className="text-center py-8 text-muted-foreground">
          {language === "ar" 
            ? "لا توجد تقييمات بعد. كن أول من يقيّم!"
            : language === "fr"
            ? "Pas encore d'avis. Soyez le premier à évaluer!"
            : "No reviews yet. Be the first to review!"}
        </div>
      )}
    </div>
  );
}
