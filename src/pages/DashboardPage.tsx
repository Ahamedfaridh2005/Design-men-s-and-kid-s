import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Package, User, MapPin, Heart, RotateCcw, CreditCard, MessageSquare, LogOut,
} from "lucide-react";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

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
  Processing: "bg-yellow-100 text-yellow-700",
  Shipped: "bg-blue-100 text-blue-700",
  "Out for Delivery": "bg-purple-100 text-purple-700",
  Delivered: "bg-green-100 text-green-700",
};

const DashboardPage = () => {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setOrders(data || []);
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
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-heading font-semibold ${statusColors[order.status] || "bg-secondary text-foreground"}`}>
                          {order.status?.toUpperCase()}
                        </span>
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
            <h2 className="font-heading text-2xl font-bold mb-6">Account Details</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-xs font-heading tracking-widest text-muted-foreground">NAME</label>
                <p className="font-body mt-1">{profile?.display_name || "—"}</p>
              </div>
              <div>
                <label className="text-xs font-heading tracking-widest text-muted-foreground">EMAIL</label>
                <p className="font-body mt-1">{user?.email}</p>
              </div>
              <div>
                <label className="text-xs font-heading tracking-widest text-muted-foreground">PHONE</label>
                <p className="font-body mt-1">{profile?.phone || "—"}</p>
              </div>
            </div>
          </div>
        );
      case "addresses":
        return (
          <div>
            <h2 className="font-heading text-2xl font-bold mb-6">Saved Addresses</h2>
            <p className="text-muted-foreground font-body">No saved addresses yet. Add one during checkout.</p>
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
            <h2 className="font-heading text-2xl font-bold mb-6">Payment Methods</h2>
            <p className="text-muted-foreground font-body">No saved payment methods.</p>
          </div>
        );
      case "issues":
        return (
          <div>
            <h2 className="font-heading text-2xl font-bold mb-6">Issue Reports</h2>
            <p className="text-muted-foreground font-body">No issues reported.</p>
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
    </div>
  );
};

export default DashboardPage;
