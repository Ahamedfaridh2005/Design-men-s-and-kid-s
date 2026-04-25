import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Search, Eye, X, Smartphone } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const { data: storeOrders } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      
      // Fetch manual online invoices
      const { data: manualInvoices } = await supabase
        .from("admin_invoices")
        .select("*");
      
      const filteredManual = (manualInvoices || [])
        .filter(inv => inv.customer_details?.order_mode === 'online')
        .map(inv => ({
          ...inv,
          isManual: true,
          shipping_address: inv.customer_details // map for consistency
        }));

      const combined = [...(storeOrders || []), ...filteredManual].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setOrders(combined);
      setLoading(false);
    }
    fetchData();
  }, []);

  const updateOrderStatus = async (orderId: string, newStatus: string, orderNumber: string) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    try {
      // Update orders table
      await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);
      
      // Also update admin_invoices table if it exists there
      if (orderNumber) {
        await supabase
          .from("admin_invoices")
          .update({ status: newStatus })
          .eq("order_number", orderNumber);
      }
    } catch (err) {
      console.error("Backend update failed:", err);
    }
  };
  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    
    return (
      order.order_number?.toLowerCase().includes(query) ||
      order.shipping_address?.name?.toLowerCase().includes(query) ||
      order.shipping_address?.full_name?.toLowerCase().includes(query) ||
      order.shipping_address?.email?.toLowerCase().includes(query) ||
      `#${order.order_number}`.toLowerCase().includes(query)
    );
  });
  return (
    <AdminLayout>
      <div className="w-full">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Manage</p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <h1 className="font-heading text-3xl text-[#2c2c2c]">Orders</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search orders..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-border pl-10 pr-4 py-2 font-body text-sm bg-transparent focus:outline-none w-[250px]" 
            />
          </div>
        </div>

        <div className="border border-border bg-transparent overflow-x-auto">
          <table className="w-full text-sm text-left font-body min-w-[800px]">
            <thead className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase bg-[#f5f4ef] border-b border-border">
              <tr>
                <th className="px-6 py-4 font-normal min-w-[120px]">Order</th>
                <th className="px-6 py-4 font-normal">Customer</th>
                <th className="px-6 py-4 font-normal">Items</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Total</th>
                <th className="px-6 py-4 font-normal min-w-[150px]">Date</th>
                <th className="px-6 py-4 font-normal text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : filteredOrders.map((order) => {
                let statusColor = "bg-[#f4e8ff] text-[#7124cc]"; // Default (Shipped/Ordered)
                if (order.status?.toUpperCase() === "DELIVERED") statusColor = "bg-[#e0f8eb] text-[#1b8c4c]";
                if (order.status?.toUpperCase() === "PROCESSING" || order.status?.toUpperCase() === "ORDERED") statusColor = "bg-[#fdf4e8] text-[#cc8a24]";
                if (order.status?.toUpperCase() === "OUT FOR DELIVERY") statusColor = "bg-[#e8f4fd] text-[#248acc]";
                if (order.status?.toUpperCase() === "CANCELLED") statusColor = "bg-[#ffe8e8] text-[#cc2424]";

                const itemsCount = Array.isArray(order.items) ? order.items.reduce((s:number, i:any)=>s+(i.quantity||1), 0) : 0;
                
                return (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                  <td className="px-6 py-4 text-xs font-mono text-muted-foreground">#{order.order_number?.substring(0,8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="font-heading text-xs tracking-wider uppercase mb-0.5">{order.shipping_address?.name || order.shipping_address?.full_name || "Guest"}</p>
                    <p className="text-[10px] text-muted-foreground lowercase">{order.shipping_address?.email || "example@domain.com"}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground text-center sm:text-left">{itemsCount}</td>
                  <td className="px-6 py-4">
                    <div className="relative w-fit">
                      <select 
                        value={order.status?.toUpperCase() || 'PROCESSING'} 
                        onChange={(e) => updateOrderStatus(order.id, e.target.value, order.order_number)}
                        className={`px-3 py-1 pr-6 text-[9px] font-heading font-bold tracking-widest uppercase rounded cursor-pointer appearance-none outline-none ${statusColor}`}
                      >
                        <option value="ORDERED">ORDERED</option>
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="SHIPPED">SHIPPED</option>
                        <option value="OUT FOR DELIVERY">OUT FOR DELIVERY</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                      <svg width="8" height="5" viewBox="0 0 10 6" fill="none" className="opacity-50 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-heading font-bold text-sm">₹{Number(order.total || order.total_amount || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-accent hover:text-accent/80 transition-colors p-2 flex items-center gap-1.5"
                        title="View Payment Details"
                      >
                        <Eye size={14} />
                        <span className="text-[10px] font-heading font-bold tracking-widest uppercase">Verify</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-[#f5f4ef]">
              <h2 className="font-heading font-bold text-sm tracking-widest uppercase">Payment Verification</h2>
              <button onClick={() => setSelectedOrder(null)} className="p-1 hover:bg-black/5 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-accent/5 rounded-lg border border-accent/10">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                  <Smartphone size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase mb-0.5">UPI ID</p>
                  <p className="font-mono text-sm font-bold">{selectedOrder.upi_id || "Not provided"}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase mb-3">Payment Proof Screenshot</p>
                {selectedOrder.payment_proof_url ? (
                  <div className="border border-border rounded-lg overflow-hidden bg-gray-50 aspect-[4/3] flex items-center justify-center">
                    <img 
                      src={selectedOrder.payment_proof_url} 
                      alt="Payment Proof" 
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="border border-dashed border-border rounded-lg p-10 text-center text-muted-foreground italic text-sm">
                    No screenshot uploaded
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t border-border flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2 bg-primary text-primary-foreground font-heading text-[10px] font-bold tracking-widest uppercase rounded hover:bg-primary/90 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}
