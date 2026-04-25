import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Search, Menu, X, User } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { AuthModal } from "@/components/AuthModal";
import { SupportModal } from "@/components/SupportModal";

const Navbar = () => {
  const { totalItems, setIsCartOpen } = useCart();
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isShop = location.pathname === "/shop";
  const searchParams = new URLSearchParams(location.search);
  const genderQuery = searchParams.get("gender");

  const isMenActive = isShop && genderQuery === "men";
  const isKidsActive = isShop && genderQuery === "kids";
  const isAllActive = isShop && !genderQuery;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "glass-card py-3" : "bg-transparent py-6"
        }`}
      >
        <div className="w-full px-6 lg:px-12 flex items-center justify-between max-w-[2000px] mx-auto">
          <Link to="/" className="font-heading text-lg lg:text-xl font-bold tracking-wider shrink-0 whitespace-nowrap mr-6">
            Designz Men's & Kid's
          </Link>

          <div className="hidden md:flex items-center gap-6 lg:gap-10 font-body text-sm tracking-wide">
            <Link to="/shop?gender=men" className={`transition-colors ${isMenActive ? 'text-accent font-bold' : 'hover:text-accent'}`}>MEN</Link>
            <Link to="/shop?gender=kids" className={`transition-colors ${isKidsActive ? 'text-accent font-bold' : 'hover:text-accent'}`}>KIDS</Link>
            <Link to="/shop" className={`transition-colors ${isAllActive ? 'text-accent font-bold' : 'hover:text-accent'}`}>ALL</Link>
            <button onClick={() => setSupportModalOpen(true)} className="hover:text-accent transition-colors uppercase">SUPPORT</button>
          </div>

          <div className="flex items-center gap-5">
            {profile?.role === "admin" && (
              <Link to="/admin" className="hidden sm:flex border border-border/80 px-3 py-1.5 text-[11px] font-heading font-bold tracking-widest uppercase text-muted-foreground hover:bg-secondary/50 transition-colors mr-1">
                ADMIN
              </Link>
            )}
            <Link to="/shop" className="hover:text-accent transition-colors">
              <Search size={20} />
            </Link>
            <button
              onClick={() => user ? navigate("/dashboard") : setAuthModalOpen(true)}
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
                <Link to="/shop?gender=men" onClick={() => setMobileOpen(false)} className={`${isMenActive ? 'text-accent font-bold' : ''}`}>MEN</Link>
                <Link to="/shop?gender=kids" onClick={() => setMobileOpen(false)} className={`${isKidsActive ? 'text-accent font-bold' : ''}`}>KIDS</Link>
                <Link to="/shop" onClick={() => setMobileOpen(false)} className={`${isAllActive ? 'text-accent font-bold' : ''}`}>ALL</Link>
                <button onClick={() => { setSupportModalOpen(true); setMobileOpen(false); }} className="uppercase">SUPPORT</button>
                {user ? (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>MY ACCOUNT</Link>
                ) : (
                  <button onClick={() => { setAuthModalOpen(true); setMobileOpen(false); }} className="uppercase">
                    SIGN IN
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SupportModal isOpen={supportModalOpen} onClose={() => setSupportModalOpen(false)} />
    </>
  );
};

export default Navbar;
