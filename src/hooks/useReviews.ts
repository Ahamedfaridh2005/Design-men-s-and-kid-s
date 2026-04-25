import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Review {
  id: string;
  user_name: string;
  rating: number;
  content: string;
  avatar_url?: string;
  created_at: string;
}

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const addReview = async (review: Omit<Review, 'id' | 'created_at'>) => {
    try {
      const { error } = await supabase.from("reviews").insert([review]);
      if (error) throw error;
      await fetchReviews();
      return { success: true };
    } catch (error) {
      console.error("Error adding review:", error);
      return { success: false, error };
    }
  };

  return { reviews, loading, refetch: fetchReviews, addReview };
};
