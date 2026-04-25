import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Product } from "@/hooks/useProducts";
import ProductPrice from "./ProductPrice";

interface Props {
  product: Product;
  priority?: boolean;
}

const ProductCard = ({ product, priority = false }: Props) => {
  const navigate = useNavigate();

  // Use image_url if available, fallback to image for backward compatibility
  let imageUrl = product.image_url || (product as any).image;
  
  // Handle relative paths from seeded data
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob:') && !imageUrl.startsWith('/')) {
    imageUrl = `/assets/products/${imageUrl}`;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onClick={() => navigate(`/product/${product.id}`)}
        className="group cursor-pointer"
      >
        <div className="relative overflow-hidden rounded-lg bg-card mb-4 aspect-[3/4]">
          <img
            src={imageUrl}
            alt={product.name}
            loading={priority ? "eager" : "lazy"}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-all duration-300" />
        </div>
        <h3 className="font-heading font-semibold text-sm mb-1">{product.name}</h3>
        <ProductPrice price={product.price} discount={product.discount} size="sm" />
      </motion.div>
    </>
  );
};

export default ProductCard;

