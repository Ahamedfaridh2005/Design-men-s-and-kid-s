import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, User, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import { Link } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const ReviewsSection = () => {
  const { reviews, loading, addReview } = useReviews();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    user_name: "",
    rating: 5,
    content: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_name || !formData.content) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    const result = await addReview(formData);
    setIsSubmitting(false);

    if (result.success) {
      toast.success("Thank you for your review!");
      setIsModalOpen(false);
      setFormData({ user_name: "", rating: 5, content: "" });
    } else {
      toast.error("Failed to submit review. Please try again.");
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <section className="py-24 px-6 bg-[#F8F9FA]">
        <div className="container mx-auto text-center">
          <p className="animate-pulse text-muted-foreground">Loading reviews...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 bg-[#F8F9FA] overflow-hidden">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-[#1A1F2C]">Customer Reviews</h2>
            <p className="text-muted-foreground font-body">What our community says about us</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="text-4xl font-bold text-[#1A1F2C]">4.8</div>
            <div>
              <div className="flex text-yellow-400 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">{reviews.length} reviews</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
          <div className="lg:col-span-3 relative px-10">
            <Carousel
              opts={{
                align: "start",
                loop: false,
              }}
              className="w-full"
            >
              <CarouselContent className="-ml-4">
                {reviews.map((review, index) => (
                  <CarouselItem key={review.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-card p-8 rounded-3xl shadow-sm border border-border/50 flex flex-col h-full hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex text-yellow-400 mb-6">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            fill={i < review.rating ? "currentColor" : "none"}
                            className={i < review.rating ? "text-yellow-400" : "text-gray-300"}
                          />
                        ))}
                      </div>
                      <p className="text-foreground/80 font-body italic mb-8 flex-grow leading-relaxed line-clamp-4">
                        "{review.content}"
                      </p>
                      <div className="flex items-center gap-4 pt-6 border-t border-border/50">
                        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
                          {review.avatar_url ? (
                            <img src={review.avatar_url} alt={review.user_name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-white font-bold text-xs">
                              {review.user_name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-bold text-foreground text-sm truncate">{review.user_name}</h4>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="absolute -left-10 top-1/2 -translate-y-1/2 bg-white border-2 border-gray-100 hover:bg-gray-50 h-10 w-10" />
              <CarouselNext className="absolute -right-10 top-1/2 -translate-y-1/2 bg-white border-2 border-gray-100 hover:bg-gray-50 h-10 w-10" />
            </Carousel>
          </div>

          <div className="flex flex-col gap-4 justify-center">
            <Link 
              to="/reviews" 
              className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold hover:bg-primary/90 transition-all shadow-sm hover:translate-y-[-2px] text-center"
            >
              See All Reviews
            </Link>
            
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <button className="w-full py-4 border-2 border-border bg-card text-foreground rounded-2xl font-bold hover:bg-muted/50 transition-all shadow-sm hover:translate-y-[-2px]">
                  Write a Review
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] rounded-3xl">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-heading font-bold">Write a Review</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="user_name">Name</Label>
                    <Input 
                      id="user_name" 
                      placeholder="Your Name" 
                      value={formData.user_name}
                      onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                      className="rounded-xl"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Rating</Label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({...formData, rating: star})}
                          className="focus:outline-none"
                        >
                          <Star 
                            size={24} 
                            fill={star <= formData.rating ? "#FBBF24" : "none"}
                            className={star <= formData.rating ? "text-yellow-400" : "text-gray-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="content">Review</Label>
                    <Textarea 
                      id="content" 
                      placeholder="Share your experience..." 
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="min-h-[100px] rounded-xl"
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full py-6 rounded-xl font-bold text-lg" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
