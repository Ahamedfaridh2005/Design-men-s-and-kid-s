import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import {
  Package, User, MapPin, LogOut
} from "lucide-react";
import Footer from "@/components/Footer";
import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/use-toast";
import OrderTrackingModal from "@/components/OrderTrackingModal";
import AddressModal from "@/components/AddressModal";

type Tab = "orders" | "account" | "addresses";

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "orders", label: "My Orders", icon: Package },
  { id: "account", label: "Account Details", icon: User },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
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
  const { products } = useProducts();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<Tab>("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [trackingOrder, setTrackingOrder] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [accountForm, setAccountForm] = useState({
    display_name: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    if (profile) {
      setAccountForm({
        display_name: profile.display_name || "",
        email: user?.email || "",
        phone: profile.phone || ""
      });
    }
  }, [profile, user]);

  const handleUpdateProfile = async () => {
    if (!user) return;
    setUpdatingProfile(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: accountForm.display_name,
          phone: accountForm.phone,
        })
        .eq("user_id", user.id);

      if (error) throw error;
      
      await refreshProfile();
      toast({ title: "Profile updated successfully" });
    } catch (error: any) {
      toast({
        title: "Error updating profile",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUpdatingProfile(false);
    }
  };

  const fetchAddresses = async () => {
    if (!user) return;
    setLoadingAddresses(true);
    const { data } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false });
    setAddresses(data || []);
    setLoadingAddresses(false);
  };

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
    fetchAddresses();
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
                          {product && (
                            <img 
                              src={product.image_url && !product.image_url.startsWith('http') && !product.image_url.startsWith('blob:') && !product.image_url.startsWith('/') 
                                ? `/assets/products/${product.image_url}` 
                                : product.image_url} 
                              alt={product.name} 
                              className="w-14 h-16 object-cover rounded-lg" 
                            />
                          )}
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
                <input 
                  type="text" 
                  value={accountForm.display_name} 
                  onChange={(e) => setAccountForm({ ...accountForm, display_name: e.target.value })}
                  className="w-full border border-border p-3 focus:outline-none focus:border-primary transition-colors font-body text-sm bg-transparent" 
                />
              </div>
              <div>
                <label className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground block mb-3 uppercase">Email Address</label>
                <input 
                  type="email" 
                  value={accountForm.email} 
                  disabled
                  className="w-full border border-border p-3 focus:outline-none focus:border-primary transition-colors font-body text-sm bg-transparent opacity-60 cursor-not-allowed" 
                />
                <p className="text-[10px] text-muted-foreground mt-1 font-body">Email cannot be changed directly here.</p>
              </div>
              <div>
                <label className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground block mb-3 uppercase">Phone Number</label>
                <input 
                  type="tel" 
                  value={accountForm.phone} 
                  onChange={(e) => setAccountForm({ ...accountForm, phone: e.target.value })}
                  className="w-full border border-border p-3 focus:outline-none focus:border-primary transition-colors font-body text-sm bg-transparent" 
                />
              </div>
              <button 
                onClick={handleUpdateProfile}
                disabled={updatingProfile}
                className="bg-[#1a1a1a] text-white px-8 py-3.5 text-xs font-heading font-bold tracking-widest hover:bg-black transition-colors mt-6 uppercase disabled:opacity-50"
              >
                {updatingProfile ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        );
      case "addresses":
        return (
          <div>
            <h2 className="font-heading text-2xl mb-8">Saved Addresses</h2>
            {loadingAddresses ? (
              <div className="space-y-4 max-w-3xl">
                {[1].map((i) => (
                  <div key={i} className="h-32 bg-secondary animate-pulse rounded-xl" />
                ))}
              </div>
            ) : addresses.length === 0 ? (
              <div className="border border-border p-6 mb-6 bg-card/30 max-w-3xl">
                <p className="text-muted-foreground font-body text-sm">No address saved yet.</p>
              </div>
            ) : (
              <div className="space-y-4 max-w-3xl mb-8">
                {addresses.map((address) => (
                  <div key={address.id} className="border border-border p-6 bg-card/30">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        {address.is_default && (
                          <span className="bg-[#1a1a1a] text-white text-[10px] font-heading font-bold px-2 py-0.5 tracking-wider uppercase">Default</span>
                        )}
                        <span className="bg-secondary text-[10px] font-heading font-bold px-2 py-0.5 tracking-wider uppercase">{address.label || "Address"}</span>
                        <span className="font-heading font-semibold text-[15px] uppercase">{address.full_name?.toUpperCase()}</span>
                      </div>
                      <button 
                        onClick={() => { setSelectedAddress(address); setIsAddressModalOpen(true); }}
                        className="text-xs text-muted-foreground hover:text-foreground underline decoration-muted-foreground underline-offset-4"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="space-y-1 text-muted-foreground font-body text-sm">
                      <p>{address.street}</p>
                      <p>{address.city}, {address.state} {address.zip}</p>
                      <p>{address.country}</p>
                      <p className="pt-2 text-foreground font-medium">Phone: {address.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button 
              onClick={() => { setSelectedAddress(null); setIsAddressModalOpen(true); }}
              className="border border-border px-6 py-3.5 text-[11px] font-heading font-bold tracking-widest hover:bg-secondary transition-colors uppercase flex items-center gap-2"
            >
              <span className="text-lg leading-none mt-[-2px]">+</span> ADD NEW ADDRESS
            </button>
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
                <p className="text-xs text-muted-foreground font-body mb-2">{user?.email}</p>
                <div className="flex justify-center">
                  <span className={`px-2 py-0.5 text-[9px] font-heading font-bold tracking-widest uppercase rounded ${profile?.role === 'admin' ? 'bg-[#1a1a1a] text-white' : 'bg-secondary text-muted-foreground'}`}>
                    {profile?.role || 'user'}
                  </span>
                </div>
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

      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSuccess={fetchAddresses}
        address={selectedAddress}
      />
    </div>
  );
};

export default DashboardPage;
