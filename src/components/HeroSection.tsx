import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "react-router-dom";
import heroMale from "@/assets/hero-male.jpg";
import heroKid from "@/assets/hero-kid.png";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      <motion.div style={{ scale }} className="absolute inset-0">
        <div className="absolute inset-0">
          <div className="relative overflow-hidden w-full h-full flex">
            <div className="w-1/2 h-full relative">
              <img src={heroMale} alt="Men's Collection" loading="eager" fetchpriority="high" decoding="async" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/20 md:bg-black/10" />
            </div>
            <div className="w-1/2 h-full relative">
              <img src={heroKid} alt="Kids' Collection" loading="eager" fetchpriority="high" decoding="async" className="w-full h-full object-cover object-center" />
              <div className="absolute inset-0 bg-black/20 md:bg-black/10" />
            </div>
          </div>
        </div>
        <div className="hero-overlay absolute inset-0" />
      </motion.div>

      <motion.div
        style={{ opacity, y }}
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="font-body text-sm tracking-[0.3em] text-muted-foreground mb-4"
        >
          SPRING / SUMMER 2026
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
          className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none mb-6"
        >
          Define Your
          <br />
          <span className="text-[#8c6b4a]">Elegance</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="font-body text-muted-foreground text-lg max-w-md mb-10"
        >
          Where timeless craftsmanship meets contemporary style.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex gap-4"
        >
          <Link
            to="/shop?gender=men"
            className="px-8 py-3.5 bg-primary text-primary-foreground font-heading text-sm tracking-widest hover:bg-primary/90 transition-all"
          >
            SHOP MEN
          </Link>
          <Link
            to="/shop?gender=kids"
            className="px-8 py-3.5 border border-foreground text-foreground font-heading text-sm tracking-widest hover:bg-foreground hover:text-background transition-all"
          >
            SHOP KIDS
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
