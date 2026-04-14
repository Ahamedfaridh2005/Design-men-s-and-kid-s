import { useState } from "react";
import { X, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal = ({ isOpen, onClose }: SupportModalProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: "Order Tracking",
    description: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.description.trim()) return;

    setLoading(true);

    try {
      const { error } = await supabase.from("issue_tickets").insert([
        {
          user_id: user?.id || null, // Allow anonymous tickets if needed 
          subject: formData.subject,
          issue_description: formData.description,
          status: "open",
        },
      ]);

      if (error) {
        throw error;
      }

      toast({
        title: "Ticket Submitted Successfully",
        description: "Our support team will get back to you shortly.",
      });

      setFormData({ subject: "Order Tracking", description: "" });
      onClose();
    } catch (error: any) {
      toast({
        title: "Failed to submit ticket",
        description: error.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]"
          />
          <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-white shadow-2xl rounded-sm overflow-hidden font-body pointer-events-auto"
            >
            <div className="bg-primary text-primary-foreground p-6 flex justify-between items-center">
              <h2 className="text-lg font-heading tracking-widest uppercase font-bold">Support & Help</h2>
              <button onClick={onClose} className="hover:text-gray-300 transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Contact Information */}
              <div className="flex items-center gap-4 bg-gray-50 p-4 rounded mb-6 border border-gray-100">
                <div className="w-10 h-10 bg-black text-white flex items-center justify-center rounded-full shrink-0">
                  <PhoneCall size={18} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-0.5">Direct Line</p>
                  <p className="text-lg font-heading text-black font-semibold">+1 (800) 123-4567</p>
                </div>
              </div>

              <div className="mb-6 border-t border-gray-100 pt-6">
                <h3 className="text-sm font-bold uppercase tracking-wide mb-4">Report an Issue</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:border-black transition-colors"
                    >
                      <option value="Order Tracking">Order Tracking</option>
                      <option value="Returns & Refunds">Returns & Refunds</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Website Issue">Website Bug / Issue</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                      Description
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Please explain your issue in detail..."
                      className="w-full border border-gray-300 bg-white px-4 py-3 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#1a1a1a] text-white py-3.5 text-xs font-heading font-bold tracking-[0.2em] uppercase hover:bg-black transition-colors disabled:opacity-50 mt-2"
                  >
                    {loading ? "Submitting..." : "Submit Ticket"}
                  </button>
                </form>
              </div>
            </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
