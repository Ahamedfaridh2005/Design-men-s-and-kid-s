import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import Footer from "@/components/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <CategorySection />
      <FeaturedProducts />

      {/* Editorial Banner */}
      <section className="py-24 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-2xl mx-auto"
          >
            <p className="text-xs tracking-[0.3em] text-accent font-heading mb-4">THE ÉLEVE DIFFERENCE</p>
            <h2 className="font-heading text-3xl md:text-5xl font-bold mb-6 leading-tight">
              Crafted with intention.
              <br />
              Worn with confidence.
            </h2>
            <p className="text-muted-foreground font-body mb-10 leading-relaxed">
              Every piece is designed to transcend seasons, combining premium materials with modern silhouettes that redefine everyday elegance.
            </p>
            <Link
              to="/shop"
              className="inline-block px-10 py-3.5 border border-foreground font-heading text-sm tracking-widest hover:bg-foreground hover:text-background transition-all"
            >
              DISCOVER MORE
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
