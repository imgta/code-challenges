import { useState } from 'react';
import { Star, X, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { TennisCourt, CourtReview } from '@/utils/mock-data';

interface ReviewModalProps {
  court: TennisCourt;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ court, isOpen, onClose }: ReviewModalProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !userName.trim() || !comment.trim()) {
      toast("Missing Information",
        { description: "Please fill in all fields and select a rating." }
      );
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast("Review Submitted!",
      { description: "Thank you for your feedback. Your review will be visible shortly." },
    );

    // Reset form
    setRating(0);
    setHoveredRating(0);
    setUserName('');
    setComment('');
    setIsSubmitting(false);
    onClose();
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hoveredRating || rating);

      return (
        <button
          key={i}
          type="button"
          onClick={() => setRating(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="p-1 hover:scale-110 transition-transform"
        >
          <Star
            className={`size-6 ${isActive ? "fill-yellow-400 text-yellow-400" : "text-gray-300 hover:text-yellow-300"
              }`}
          />
        </button>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Add Review</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <X className="size-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Share your experience at {court.name}</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Rating *</Label>
              <div className="flex items-center gap-1">
                {renderStars()}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground">
                    {rating} star{rating !== 1 ? "s" : ''}
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userName">Your Name *</Label>
              <Input
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your name"
                maxLength={50}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment">Your Review *</Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell others about your experience..."
                rows={4}
                maxLength={500}
              />
              <div className="text-xs text-muted-foreground text-right">{comment.length}/500 characters</div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting || !rating || !userName.trim() || !comment.trim()}
              >
                {isSubmitting ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

interface ReviewSectionProps {
  court: TennisCourt;
  reviews: CourtReview[];
}

export function ReviewSection({ court, reviews }: ReviewSectionProps) {
  const [showAddReview, setShowAddReview] = useState(false);

  const reviewCount = reviews.filter(reviews => reviews.courtId === court.id).length;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`size-3 ${i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Reviews</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddReview(true)}
            className="flex items-center gap-2"
          >
            <Plus className="size-4" />
            Add Review
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Rating Summary */}
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold">{court.rating}</div>
            <div className="flex items-center gap-1 mb-1">{renderStars(Math.round(court.rating))}</div>
            <div className="text-xs text-muted-foreground">{reviewCount} reviews</div>
          </div>
          <div className="flex-1">
            <div className="space-y-1">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = reviews.filter((r) => r.rating === stars).length;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-2 text-xs">
                    <span className="w-3">{stars}</span>
                    <Star className="size-3 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                      <div className="bg-yellow-400 h-1.5 rounded-full" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="w-8 text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.id} className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-sm">{review.userName}</div>
                    <div className="flex items-center gap-1">{renderStars(review.rating)}</div>
                  </div>
                  <span className="text-xs text-muted-foreground">{formatDate(review.date)}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                {review !== reviews[reviews.length - 1] && <Separator />}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No reviews yet</p>
              <Button variant="outline" onClick={() => setShowAddReview(true)} className="flex items-center gap-2">
                <Plus className="size-4" />
                Be the first to review
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <ReviewModal court={court} isOpen={showAddReview} onClose={() => setShowAddReview(false)} />
    </Card>
  );
}