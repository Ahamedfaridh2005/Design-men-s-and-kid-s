import { motion } from "framer-motion";
import { Star, ArrowLeft } from "lucide-react";
import { useReviews } from "@/hooks/useReviews";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ReviewsPage = () => {
  const { reviews, loading } = useReviews();

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA]">
      <Navbar />
      
      <main className="flex-grow pt-32 pb-24 px-6">
        <div className="container mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
            <div>
              <h1 className="font-heading text-4xl md:text-6xl font-bold mb-4 text-[#1A1F2C]">Community Feedback</h1>
              <p className="text-muted-foreground font-body text-lg">Hear what our customers have to say about their experience.</p>
            </div>
            <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="text-4xl font-bold text-[#1A1F2C]">4.8</div>
              <div>
                <div className="flex text-yellow-400 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">{reviews.length} total reviews</p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-card/50 animate-pulse rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-card p-8 rounded-3xl shadow-sm border border-border/50 flex flex-col h-full hover:shadow-md transition-all duration-300"
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
                  <p className="text-foreground/80 font-body italic mb-8 flex-grow leading-relaxed">
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
                      <p className="text-xs text-muted-foreground">Verified Buyer</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {!loading && reviews.length === 0 && (
            <div className="text-center py-24">
              <p className="text-muted-foreground text-lg">No reviews found yet.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ReviewsPage;
