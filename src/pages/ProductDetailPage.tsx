import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { Share2, Truck, ShieldCheck, Minus, Plus, ShoppingBag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import ProductPrice from "@/components/ProductPrice";

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, loading } = useProducts();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<any>(null);
  const [selectedSize, setSelectedSize] = useState<string>("S");
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<"description" | "materials" | "care">("description");

  const sizes = ["S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    if (!loading) {
      const foundProduct = products.find(p => p.id === id);
      if (foundProduct) {
        setProduct(foundProduct);
        if (foundProduct.sizes && foundProduct.sizes.length > 0) {
          setSelectedSize(foundProduct.sizes[0]);
        } else {
          setSelectedSize(""); // No sizes available
        }
      } else {
        toast.error("Product not found");
        navigate("/shop");
      }
    }
  }, [id, products, loading, navigate]);

  if (loading || !product) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-[#fcfbf9]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground font-body tracking-widest text-sm uppercase">Loading...</p>
        </div>
      </div>
    );
  }

  // Resolve image URL
  let imageUrl = product.image_url || (product as any).image;
  if (imageUrl && !imageUrl.startsWith('http') && !imageUrl.startsWith('blob:') && !imageUrl.startsWith('/')) {
    imageUrl = `/assets/products/${imageUrl}`;
  }

  const handleAddToCart = () => {
    // Add to cart multiple times based on quantity or update CartContext to handle quantity
    // Currently CartContext addToCart might just add 1, let's add it multiple times or rely on context
    for (let i = 0; i < quantity; i++) {
       addToCart({ ...product, image: imageUrl });
    }
    toast.success(`Added ${quantity} ${quantity > 1 ? 'items' : 'item'} to bag`);
  };

  return (
    <div className="min-h-screen bg-[#fcfbf9] pt-28 pb-20">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column - Image */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full aspect-[4/5] bg-secondary rounded-xl overflow-hidden relative"
          >
            <img 
              src={imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Right Column - Details */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col py-4"
          >
            {/* Header section */}
            <div className="flex justify-between items-start mb-4">
              <p className="text-xs font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase">
                {product.gender} · {product.category}
              </p>

            </div>

            <h1 className="font-heading text-4xl lg:text-5xl mb-4 text-[#2c2c2c]">{product.name}</h1>
            <ProductPrice price={product.price} discount={product.discount} size="lg" className="mb-8" />

            {/* Colour */}
            <div className="mb-6">
              <p className="text-xs font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-3">
                Colour <span className="text-foreground ml-2">— {product.color || 'Standard'}</span>
              </p>
            </div>

            {/* Size */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase">
                  Size
                </p>

              </div>
              <div className="flex flex-wrap gap-3">
                {sizes.map((size) => {
                  const isAvailable = product.sizes && product.sizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => isAvailable && setSelectedSize(size)}
                      disabled={!isAvailable}
                      className={`w-12 h-12 flex items-center justify-center border text-sm font-heading transition-all ${
                        !isAvailable 
                          ? 'opacity-30 cursor-not-allowed bg-gray-100 border-gray-200 text-gray-400 line-through' 
                          : selectedSize === size 
                            ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-md ring-2 ring-accent ring-offset-2' 
                            : 'bg-transparent text-foreground border-border hover:border-foreground/50 cursor-pointer hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-8">
              <p className="text-xs font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-3">Quantity</p>
              <div className="inline-flex items-center border border-border h-12">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="w-12 h-full flex items-center justify-center font-heading text-sm">
                  {quantity}
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3 mb-10">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-[#1a1a1a] text-white py-4 flex items-center justify-center gap-3 font-heading text-sm tracking-widest hover:bg-black transition-colors uppercase"
              >
                <ShoppingBag size={18} />
                Add to Bag — ₹{((Number(product.price) - (product.discount || 0)) * quantity).toLocaleString()}
              </button>

            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 border-y border-border py-6 mb-8">
              <div className="flex flex-col items-center text-center gap-2">
                <Truck size={20} className="text-muted-foreground" strokeWidth={1.5} />
                <div>
                  <p className="font-heading text-xs font-bold mb-1">Free Shipping</p>
                  <p className="font-body text-[10px] text-muted-foreground">Orders over ₹5000</p>
                </div>
              </div>

              <div className="flex flex-col items-center text-center gap-2">
                <ShieldCheck size={20} className="text-muted-foreground" strokeWidth={1.5} />
                <div>
                  <p className="font-heading text-xs font-bold mb-1">Authentic</p>
                  <p className="font-body text-[10px] text-muted-foreground">Certified quality</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-8 border-b border-border mb-6">
                {[
                  { id: "description", label: "Description" },
                  { id: "materials", label: "Materials" },
                  { id: "care", label: "Care" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 text-xs font-heading font-bold tracking-widest uppercase relative transition-colors ${
                      activeTab === tab.id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground/80'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTab"
                        className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#1a1a1a]"
                      />
                    )}
                  </button>
                ))}
              </div>
              <div className="font-body text-sm text-muted-foreground leading-relaxed min-h-[100px]">
                {activeTab === "description" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {product.description || "Luxurious product crafted with attention to detail. Designed for comfort and style."}
                  </motion.div>
                )}
                {activeTab === "materials" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Premium {product.material || "Quality Material"}</li>
                      <li>Ethically sourced components</li>
                      <li>Durable construction</li>
                    </ul>
                  </motion.div>
                )}
                {activeTab === "care" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Machine wash cold with like colors</li>
                      <li>Do not bleach</li>
                      <li>Tumble dry low or hang to dry</li>
                      <li>Cool iron if needed</li>
                    </ul>
                  </motion.div>
                )}
              </div>
            </div>

          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;
