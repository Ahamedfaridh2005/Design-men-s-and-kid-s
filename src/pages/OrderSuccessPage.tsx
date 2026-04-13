import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const OrderSuccessPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-md"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle size={40} className="text-accent" />
        </motion.div>
        <h1 className="font-heading text-3xl font-bold mb-3">Order Confirmed</h1>
        <p className="text-muted-foreground font-body mb-8">
          Thank you for your purchase. Your order is being processed and you'll receive a confirmation soon.
        </p>
        <Link
          to="/"
          className="inline-block px-8 py-3.5 bg-primary text-primary-foreground font-heading text-sm tracking-widest hover:bg-primary/90 transition-all rounded-lg"
        >
          CONTINUE SHOPPING
        </Link>
      </motion.div>
    </div>
  );
};

export default OrderSuccessPage;
