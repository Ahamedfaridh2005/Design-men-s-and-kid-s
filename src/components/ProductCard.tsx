import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Eye } from "lucide-react";
import { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import QuickViewModal from "./QuickViewModal";

interface Props {
  product: Product;
  priority?: boolean;
}

const ProductCard = ({ product, priority = false }: Props) => {
  const { addToCart } = useCart();
  const [showQuickView, setShowQuickView] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-lg bg-card mb-4 aspect-[3/4]">
          <img
            src={product.image}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            fetchpriority={priority ? "high" : "auto"}
            decoding="async"
            width={400}
            height={533}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileHover={{ opacity: 1, y: 0 }}
            className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <button
              onClick={() => addToCart(product)}
              className="flex-1 flex items-center justify-center gap-2 py-3 glass-card rounded-lg text-sm font-heading tracking-wide hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <ShoppingBag size={16} />
              Add to Bag
            </button>
            <button
              onClick={() => setShowQuickView(true)}
              className="p-3 glass-card rounded-lg hover:bg-primary hover:text-primary-foreground transition-all"
            >
              <Eye size={16} />
            </button>
          </motion.div>
        </div>
        <h3 className="font-heading font-semibold text-sm mb-1">{product.name}</h3>
        <p className="font-body text-muted-foreground text-sm">₹{product.price.toLocaleString()}</p>
      </motion.div>

      <QuickViewModal
        product={product}
        isOpen={showQuickView}
        onClose={() => setShowQuickView(false)}
      />
    </>
  );
};

export default ProductCard;
