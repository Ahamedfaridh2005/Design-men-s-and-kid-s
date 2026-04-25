import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

const menCategories = ["Shirts", "T-Shirts", "Pants", "Tracks", "Others"];
const kidsCategories = ["T-Shirts", "Shorts", "Dresses"];

const CategorySection = () => {
  const [gender, setGender] = useState<"men" | "kids">("men");
  const categories = gender === "men" ? menCategories : kidsCategories;

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-heading text-4xl md:text-5xl font-bold mb-4"
        >
          Explore Collections
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-muted-foreground font-body mb-12"
        >
          Curated for the modern individual
        </motion.p>

        <div className="flex justify-center mb-14">
          <div className="inline-flex bg-secondary rounded-full p-1">
            {(["men", "kids"] as const).map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`relative px-8 py-2.5 text-sm font-heading tracking-widest transition-colors rounded-full ${
                  gender === g ? "text-primary-foreground" : "text-muted-foreground"
                }`}
              >
                {gender === g && (
                  <motion.div
                    layoutId="genderToggle"
                    className="absolute inset-0 bg-primary rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{g.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={gender}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={cat}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  to={`/shop?gender=${gender}&category=${cat}`}
                  className="group block p-8 bg-card border border-border/50 rounded-lg hover:border-accent hover:shadow-lg transition-all duration-300"
                >
                  <span className="font-heading text-lg font-semibold group-hover:text-accent transition-colors">
                    {cat}
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CategorySection;
