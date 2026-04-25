import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingBag } from "lucide-react";
import { Product } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";

interface Props {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewModal = ({ product, isOpen, onClose }: Props) => {
  const { addToCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative glass-card rounded-xl max-w-2xl w-full grid md:grid-cols-2 overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 hover:text-accent transition-colors">
              <X size={20} />
            </button>
            <div className="aspect-[3/4] md:aspect-auto">
              <img 
                src={(product.image_url || (product as any).image) && !(product.image_url || (product as any).image).startsWith('http') && !(product.image_url || (product as any).image).startsWith('blob:') && !(product.image_url || (product as any).image).startsWith('/') 
                  ? `/assets/products/${product.image_url || (product as any).image}` 
                  : (product.image_url || (product as any).image)} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="p-8 flex flex-col justify-center">
              <p className="text-xs tracking-[0.2em] text-muted-foreground mb-2 font-body">{product.category.toUpperCase()}</p>
              <h2 className="font-heading text-2xl font-bold mb-2">{product.name}</h2>
              <p className="text-accent font-heading text-xl font-semibold mb-4">₹{product.price.toLocaleString()}</p>
              <p className="text-muted-foreground font-body text-sm mb-8">{product.description}</p>
              <button
                onClick={() => { addToCart(product); onClose(); }}
                className="flex items-center justify-center gap-2 py-3.5 bg-primary text-primary-foreground font-heading text-sm tracking-widest hover:bg-primary/90 transition-all rounded-lg"
              >
                <ShoppingBag size={16} />
                ADD TO BAG
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
