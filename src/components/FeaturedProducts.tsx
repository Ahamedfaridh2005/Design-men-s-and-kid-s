import { motion } from "framer-motion";
import { useProducts } from "@/hooks/useProducts";
import ProductCard from "./ProductCard";

const FeaturedProducts = () => {
  const { products, loading } = useProducts();
  const featured = products.slice(0, 4);

  if (loading && products.length === 0) {
    return (
      <section className="py-24 px-6 bg-card">
        <div className="container mx-auto text-center">
          <p className="text-muted-foreground animate-pulse">Loading products...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 px-6 bg-card">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">New Arrivals</h2>
          <p className="text-muted-foreground font-body">The latest additions to our collection</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={{ ...product, image: product.image_url }} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

