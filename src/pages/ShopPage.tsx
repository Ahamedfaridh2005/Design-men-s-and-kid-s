import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import { useProducts, Product } from "@/hooks/useProducts";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";

const ShopPage = () => {
  const { products, loading } = useProducts();
  const [searchParams] = useSearchParams();
  const initialGender = (searchParams.get("gender") as "men" | "kids") || undefined;
  const initialCategory = searchParams.get("category") || undefined;

  const [gender, setGender] = useState<"men" | "kids" | undefined>(initialGender);
  const [category, setCategory] = useState<string | undefined>(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [search, setSearch] = useState("");

  // Sync state when URL search parameters change
  useEffect(() => {
    const urlGender = searchParams.get("gender") as "men" | "kids" | null;
    if (urlGender !== gender) {
      setGender(urlGender || undefined);
      // Reset category if it doesn't belong to the new gender
      const menCats = ["Shirts", "T-Shirts", "Tracks", "Pants", "Others"];
      const kidsCats = ["Shorts", "T-Shirts", "Dresses"];
      const validCats = urlGender === "kids" ? kidsCats : menCats;
      if (category && !validCats.includes(category)) {
        setCategory(undefined);
      }
    }
  }, [searchParams, gender, category]);

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20000]);
  const [showFilters, setShowFilters] = useState(false);



  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (gender && p.gender !== gender) return false;
      if (category && p.category !== category) return false;
      if (selectedSizes.length > 0 && !p.sizes?.some(size => selectedSizes.includes(size))) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [gender, category, selectedSizes, search, priceRange, products]);

  const suggestions = useMemo(() => {
    if (search.length < 2) return [];
    return products
      .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
      .slice(0, 5);
  }, [search, products]);

  return (
    <div className="min-h-screen pt-24">
      <div className="container mx-auto px-6 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-4xl md:text-5xl font-bold mb-2"
        >
          {gender ? `${gender.charAt(0).toUpperCase() + gender.slice(1)}'s Collection` : "All Collections"}
        </motion.h1>
        <p className="text-muted-foreground font-body mb-10">{loading ? "Loading..." : `${filtered.length} pieces`}</p>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search collections..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg font-body text-sm focus:outline-none focus:border-accent transition-colors"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 glass-card rounded-lg overflow-hidden z-20">
                {suggestions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { setSearch(s.name); }}
                    className="block w-full text-left px-4 py-3 text-sm font-body hover:bg-secondary transition-colors"
                  >
                    {s.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-6 py-3 border border-border rounded-lg font-heading text-sm tracking-wide hover:border-accent transition-colors"
          >
            <SlidersHorizontal size={16} /> Filters
          </button>
        </div>

        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-8 p-6 bg-card border border-border rounded-lg"
          >
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="font-heading text-xs tracking-widest text-muted-foreground mb-3 block">SIZE</label>
                <div className="flex flex-wrap gap-2">
                  {["XS", "S", "M", "L", "XL", "XXL"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => {
                        setSelectedSizes(prev => 
                          prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
                        );
                      }}
                      className={`w-10 h-10 rounded-lg text-xs font-heading tracking-wide transition-all border ${
                        selectedSizes.includes(sz) ? "bg-primary text-primary-foreground border-primary" : "border-border hover:border-accent"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-heading text-xs tracking-widest text-muted-foreground mb-3 block">CATEGORY</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setCategory(undefined)}
                    className={`px-4 py-2 rounded-full text-xs font-heading tracking-wide transition-all ${
                      !category ? "bg-primary text-primary-foreground" : "border border-border hover:border-accent"
                    }`}
                  >
                    ALL
                  </button>
                  {(() => {
                    const categories = gender === "kids" 
                      ? ["Shorts", "T-Shirts", "Dresses"]
                      : ["Shirts", "T-Shirts", "Tracks", "Pants", "Others"];
                    
                    return categories.map((c) => (
                      <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-4 py-2 rounded-full text-xs font-heading tracking-wide transition-all ${
                          category === c ? "bg-primary text-primary-foreground" : "border border-border hover:border-accent"
                        }`}
                      >
                        {c.toUpperCase()}
                      </button>
                    ));
                  })()}
                </div>
              </div>
              <div>
                <label className="font-heading text-xs tracking-widest text-muted-foreground mb-3 block">
                  PRICE: ₹{priceRange[0].toLocaleString()} — ₹{priceRange[1].toLocaleString()}
                </label>
                <input
                  type="range"
                  min={0}
                  max={20000}
                  step={500}
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                  className="w-full accent-accent"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-16">
          {filtered.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={{ ...product, image: product.image_url }} 
              priority={index < 4} 
            />
          ))}
        </div>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-body text-lg">No pieces match your filters</p>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ShopPage;

