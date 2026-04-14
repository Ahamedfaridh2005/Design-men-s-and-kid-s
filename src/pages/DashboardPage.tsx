import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Package, User, MapPin, Heart, RotateCcw, CreditCard, MessageSquare, LogOut, AlertCircle
} from "lucide-react";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import OrderTrackingModal from "@/components/OrderTrackingModal";

type Tab = "orders" | "account" | "addresses" | "wishlist" | "returns" | "payment" | "issues";

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "account", label: "Account Details", icon: User },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "wishlist", label: "Wishlist", icon: Heart },
  { id: "returns", label: "Returns & Refunds", icon: RotateCcw },
  { id: "payment", label: "Payment Methods", icon: CreditCard },
  { id: "issues", label: "Issue Reports", icon: MessageSquare },
];

const statusColors: Record<string, string> = {
  PROCESSING: "bg-yellow-100 text-yellow-700",
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  SHIPPED: "bg-purple-100 text-purple-700",
  DELIVERED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const DashboardPage = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState<any>(null);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
        
      const overrideStatuses = JSON.parse(localStorage.getItem('orderStatusOverrides') || '{}');
      const ordersWithOverrides = (data || []).map((o: any) => ({
        ...o,
        status: overrideStatuses[o.id] || o.status
      }));
      
      setOrders(ordersWithOverrides);
      setLoadingOrders(false);
    };
    fetchOrders();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const initials = profile?.display_name
    ? profile.display_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const renderContent = () => {
    switch (activeTab) {
      case "orders":
        return (
          <div>
            <h2 className="font-heading text-2xl font-bold mb-6">Order History</h2>
            {loadingOrders ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="h-32 bg-secondary animate-pulse rounded-xl" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <Package size={48} className="mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-body">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <motion.div
                    key={order.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-border rounded-xl p-5"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-heading text-sm text-muted-foreground">#{order.order_number}</p>
                        <p className="text-xs text-muted-foreground font-body">
                          {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => setTrackingOrder(order)}
                          className="px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-heading font-bold tracking-widest uppercase bg-[#f5f4ef] text-[#2c2c2c] hover:bg-black hover:text-white transition-colors border border-border/50"
                        >
                          Track Order
                        </button>
                        <span className="font-heading font-bold">₹{Number(order.total).toLocaleString()}</span>
                      </div>
                    </div>
                    {Array.isArray(order.items) && order.items.map((item: any, idx: number) => {
                      const product = products.find((p) => p.id === item.productId);
                      return (
                        <div key={idx} className="flex gap-4 items-center py-2">
                          {product && <img src={product.image} alt={product.name} className="w-14 h-16 object-cover rounded-lg" />}
                          <div className="flex-1">
                            <p className="font-heading text-sm font-semibold">{item.name || product?.name}</p>
                            <p className="text-xs text-muted-foreground font-body">Qty: {item.quantity}</p>
                          </div>
                          <p className="font-heading text-sm">₹{Number(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                      );
                    })}
                    {order.shipping_address && (
                      <p className="text-xs text-muted-foreground font-body mt-3 pt-3 border-t border-border">
                        {order.payment_method} · {(order.shipping_address as any).street}, {(order.shipping_address as any).city} {(order.shipping_address as any).zip}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        );
      case "account":
        return (
          <div>
            <h2 className="font-heading text-2xl mb-8">Account Details</h2>
            <div className="space-y-6 max-w-2xl">
              <div>
                <label className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground block mb-3 uppercase">Full Name</label>
                <input type="text" defaultValue={profile?.display_name || ""} className="w-full border border-border p-3 focus:outline-none focus:border-primary transition-colors font-body text-sm bg-transparent" />
              </div>
              <div>
                <label className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground block mb-3 uppercase">Email Address</label>
                <input type="email" defaultValue={user?.email || ""} className="w-full border border-border p-3 focus:outline-none focus:border-primary transition-colors font-body text-sm bg-transparent" />
              </div>
              <div>
                <label className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground block mb-3 uppercase">Phone Number</label>
                <input type="tel" defaultValue={profile?.phone || ""} className="w-full border border-border p-3 focus:outline-none focus:border-primary transition-colors font-body text-sm bg-transparent" />
              </div>
              <button className="bg-[#1a1a1a] text-white px-8 py-3.5 text-xs font-heading font-bold tracking-widest hover:bg-black transition-colors mt-6 uppercase">
                Save Changes
              </button>
            </div>
          </div>
        );
      case "addresses":
        return (
          <div>
            <h2 className="font-heading text-2xl mb-8">Saved Addresses</h2>
            <div className="border border-border p-6 mb-6 bg-card/30 max-w-3xl">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="bg-[#1a1a1a] text-white text-[10px] font-heading font-bold px-2 py-0.5 tracking-wider uppercase">Default</span>
                  <span className="font-heading font-semibold text-[15px] uppercase">{profile?.display_name?.toUpperCase() || "USER"}</span>
                </div>
                <button className="text-xs text-muted-foreground hover:text-foreground underline decoration-muted-foreground underline-offset-4">Edit</button>
              </div>
              <p className="text-muted-foreground font-body text-sm">No address saved yet.</p>
            </div>
            <button className="border border-border px-6 py-3.5 text-[11px] font-heading font-bold tracking-widest hover:bg-secondary transition-colors uppercase flex items-center gap-2">
              <span className="text-lg leading-none mt-[-2px]">+</span> ADD NEW ADDRESS
            </button>
          </div>
        );
      case "wishlist":
        return (
          <div>
            <h2 className="font-heading text-2xl font-bold mb-6">Wishlist</h2>
            <p className="text-muted-foreground font-body">Your wishlist is empty.</p>
          </div>
        );
      case "returns":
        return (
          <div>
            <h2 className="font-heading text-2xl font-bold mb-6">Returns & Refunds</h2>
            <p className="text-muted-foreground font-body">No return requests.</p>
          </div>
        );
      case "payment":
        return (
          <div>
            <h2 className="font-heading text-2xl mb-8">Payment Methods</h2>
            <div className="border border-border p-16 mb-6 flex flex-col items-center justify-center text-center bg-card/30 min-h-[300px] max-w-3xl">
              <CreditCard className="w-10 h-10 text-muted-foreground/30 mb-6 stroke-[1.5]" />
              <h3 className="font-heading text-xl mb-2 text-muted-foreground/80">No saved payment methods</h3>
              <p className="font-body text-sm text-muted-foreground">Add a card for faster checkout</p>
            </div>
            <button className="border border-border px-6 py-3.5 text-[11px] font-heading font-bold tracking-widest hover:bg-secondary transition-colors uppercase flex items-center gap-2">
              <span className="text-lg leading-none mt-[-2px]">+</span> ADD PAYMENT METHOD
            </button>
          </div>
        );
      case "issues":
        return (
          <div>
            <h2 className="font-heading text-2xl mb-8">Report an Issue</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
              {["Wrong Item Received", "Damaged Product", "Missing Item", "Size / Fit Issue", "Quality Concern", "Delivery Problem"].map((category) => (
                <button key={category} className="border border-border p-5 text-left hover:border-primary transition-colors flex items-start gap-4 bg-card group min-h-[80px]">
                  <AlertCircle className="w-5 h-5 text-muted-foreground group-hover:text-foreground shrink-0 mt-0.5 stroke-[1.5]" />
                  <span className="font-body text-sm text-muted-foreground group-hover:text-foreground">{category}</span>
                </button>
              ))}
            </div>

            <div className="bg-[#fcfbf9]/50 border border-border p-8 max-w-3xl">
              <h3 className="font-heading text-xl mb-8">Submit a Ticket</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground block mb-3 uppercase">Order</label>
                  <div className="relative">
                    <select className="w-full border border-border p-3.5 focus:outline-none focus:border-primary transition-colors font-body text-sm bg-transparent appearance-none cursor-pointer">
                      <option value="">Select an order...</option>
                      {orders.map((order) => (
                        <option key={order.id} value={order.id}>
                          Order #{order.order_number} - {new Date(order.created_at).toLocaleDateString()}
                        </option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground block mb-3 uppercase">Issue Category</label>
                  <div className="relative">
                    <select className="w-full border border-border p-3.5 focus:outline-none focus:border-primary transition-colors font-body text-sm bg-transparent appearance-none cursor-pointer">
                      <option value="">Select category...</option>
                      {["Wrong Item Received", "Damaged Product", "Missing Item", "Size / Fit Issue", "Quality Concern", "Delivery Problem"].map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground block mb-3 uppercase">Description</label>
                  <textarea 
                    rows={5} 
                    className="w-full border border-border p-3.5 focus:outline-none focus:border-primary transition-colors font-body text-sm bg-transparent resize-none"
                    placeholder="Describe your issue in detail..."
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen pt-28">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-72 shrink-0">
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3">
                  <span className="font-heading text-xl font-bold">{initials}</span>
                </div>
                <h3 className="font-heading text-lg font-bold tracking-wider">{profile?.display_name?.toUpperCase()}</h3>
                <p className="text-xs text-muted-foreground font-body">{user?.email}</p>
              </div>

              <nav className="space-y-1">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-body transition-all ${
                      activeTab === id
                        ? "bg-secondary font-semibold"
                        : "hover:bg-secondary/50 text-muted-foreground"
                    }`}
                  >
                    <Icon size={18} />
                    {label}
                  </button>
                ))}
              </nav>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 mt-4 text-sm font-body text-destructive hover:bg-destructive/10 rounded-lg transition-all"
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </main>
        </div>
      </div>
      <Footer />
      
      <OrderTrackingModal 
        isOpen={!!trackingOrder} 
        onClose={() => setTrackingOrder(null)} 
        order={trackingOrder} 
      />
    </div>
  );
};

export default DashboardPage;
