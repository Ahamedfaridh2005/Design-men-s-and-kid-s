import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-card py-3" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="font-heading text-2xl font-bold tracking-wider">
          ÉLEVE
        </Link>

        <div className="hidden md:flex items-center gap-10 font-body text-sm tracking-wide">
          <Link to="/shop?gender=men" className="hover:text-accent transition-colors">MEN</Link>
          <Link to="/shop?gender=women" className="hover:text-accent transition-colors">WOMEN</Link>
          <Link to="/shop?gender=kids" className="hover:text-accent transition-colors">KIDS</Link>
          <Link to="/shop" className="hover:text-accent transition-colors">ALL</Link>
        </div>

        <div className="flex items-center gap-5">
          <Link to="/shop" className="hover:text-accent transition-colors">
            <Search size={20} />
          </Link>
          <button
            onClick={() => user ? navigate("/dashboard") : navigate("/auth")}
            className="hover:text-accent transition-colors"
          >
            <User size={20} />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative hover:text-accent transition-colors"
          >
            <ShoppingBag size={20} />
            {totalItems > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-accent-foreground text-xs flex items-center justify-center font-heading font-bold"
              >
                {totalItems}
              </motion.span>
            )}
          </button>
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-card border-t border-border/30 mt-2"
          >
            <div className="flex flex-col items-center gap-6 py-8 font-body text-sm tracking-wide">
              <Link to="/shop?gender=men" onClick={() => setMobileOpen(false)}>MEN</Link>
              <Link to="/shop?gender=women" onClick={() => setMobileOpen(false)}>WOMEN</Link>
              <Link to="/shop?gender=kids" onClick={() => setMobileOpen(false)}>KIDS</Link>
              <Link to="/shop" onClick={() => setMobileOpen(false)}>ALL</Link>
              <Link to={user ? "/dashboard" : "/auth"} onClick={() => setMobileOpen(false)}>
                {user ? "MY ACCOUNT" : "SIGN IN"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
