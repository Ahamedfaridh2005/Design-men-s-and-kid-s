import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
export default function AdminDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [customers, setCustomers] = useState(0);
  const [activeProducts, setActiveProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function fetchData() {
      const { data: oData } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      const { count: cCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: pCount } = await supabase.from("products").select("*", { count: "exact", head: true });
      
      const overrideStatuses = JSON.parse(localStorage.getItem('orderStatusOverrides') || '{}');
      const ordersWithOverrides = (oData || []).map((o: any) => ({
        ...o,
        status: overrideStatuses[o.id] || o.status
      }));

      setOrders(ordersWithOverrides);
      setCustomers(cCount || 0);
      setActiveProducts(pCount || 0);
      setLoading(false);
    }
    fetchData();
  }, []);

  const filteredOrders = orders.filter(order => {
    const orderDate = new Date(order.created_at);
    orderDate.setHours(0, 0, 0, 0);
    
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      if (orderDate < start) return false;
    }
    
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(0, 0, 0, 0);
      if (orderDate > end) return false;
    }
    
    return true;
  });

  const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.total_amount || order.total || 0), 0);
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString());
  const todaySales = todayOrders.reduce((sum, order) => sum + Number(order.total_amount || order.total || 0), 0);
  const avgOrderValue = filteredOrders.length ? totalRevenue / filteredOrders.length : 0;
  const pendingOrders = filteredOrders.filter(o => o.status !== 'Delivered' && o.status !== 'Shipped' && o.status !== 'DELIVERED').length;


  return (
    <AdminLayout>
      <div className="w-full">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Overview</p>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="font-heading text-3xl text-[#2c2c2c]">Dashboard</h1>
          
          <div className="flex flex-wrap items-center gap-3 p-3 bg-[#f5f4ef] border border-border/60">
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-heading font-bold tracking-widest text-muted-foreground uppercase">From</label>
              <input 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white border border-border px-2 py-1 text-xs focus:outline-none focus:border-black"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[9px] font-heading font-bold tracking-widest text-muted-foreground uppercase">To</label>
              <input 
                type="date" 
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="bg-white border border-border px-2 py-1 text-xs focus:outline-none focus:border-black"
              />
            </div>
            {(startDate || endDate) && (
              <button 
                onClick={() => { setStartDate(""); setEndDate(""); }}
                className="text-[9px] font-heading font-bold tracking-widest text-accent uppercase hover:underline"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Total Revenue</p>
            <p className="font-heading text-2xl mb-1">₹{totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            <p className="text-[11px] font-body text-muted-foreground">{filteredOrders.length} filtered orders</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Today's Sales</p>
            <p className="font-heading text-2xl mb-1">₹{todaySales.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            <p className="text-[11px] font-body text-muted-foreground">{todayOrders.length} orders</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Avg Order</p>
            <p className="font-heading text-2xl mb-1">₹{avgOrderValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
            <p className="text-[11px] font-body text-muted-foreground">Per transaction</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Active Products</p>
            <p className="font-heading text-2xl mb-1">{activeProducts}</p>
            <p className="text-[11px] font-body text-muted-foreground">{activeProducts} total</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Customers</p>
            <p className="font-heading text-2xl mb-1">{customers}</p>
            <p className="text-[11px] font-body text-muted-foreground">registered</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Pending Orders</p>
            <p className="font-heading text-2xl mb-1">{pendingOrders}</p>
            <p className="text-[11px] font-body text-muted-foreground">awaiting fulfillment</p>
          </div>
        </div>

        <div>
          <h2 className="font-heading text-xl mb-6 text-[#2c2c2c]">Recent Orders</h2>
          <div className="border border-border bg-transparent">
            <table className="w-full text-sm text-left font-body">
              <thead className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase bg-[#f5f4ef] border-b border-border">
                <tr>
                  <th className="px-6 py-4 font-normal">Order</th>
                  <th className="px-6 py-4 font-normal">Customer</th>
                  <th className="px-6 py-4 font-normal">Status</th>
                  <th className="px-6 py-4 font-normal">Total</th>
                  <th className="px-6 py-4 text-right font-normal">Date</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
                ) : filteredOrders.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No orders in this period.</td></tr>
                ) : (
                  filteredOrders.slice(0, 10).map((order) => {
                    let statusColor = "bg-[#f4e8ff] text-[#7124cc]"; // Default (Shipped/Ordered)
                    if (order.status?.toUpperCase() === "DELIVERED") statusColor = "bg-[#e0f8eb] text-[#1b8c4c]";
                    if (order.status?.toUpperCase() === "PROCESSING" || order.status?.toUpperCase() === "ORDERED") statusColor = "bg-[#fdf4e8] text-[#cc8a24]";
                    if (order.status?.toUpperCase() === "OUT FOR DELIVERY") statusColor = "bg-[#e8f4fd] text-[#248acc]";
                    if (order.status?.toUpperCase() === "CANCELLED") statusColor = "bg-[#ffe8e8] text-[#cc2424]";

                    return (
                      <tr key={order.id} className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                        <td className="px-6 py-4 text-xs font-mono text-muted-foreground">#{order.order_number?.substring(0,8)}</td>
                        <td className="px-6 py-4 font-heading text-xs tracking-wider uppercase">{order.shipping_address?.full_name || order.shipping_address?.name || "Guest"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-[9px] font-heading font-bold tracking-widest uppercase rounded ${statusColor}`}>
                            {order.status || 'PROCESSING'}
                          </span>
                        </td>
                        <td className="px-6 py-4 font-heading font-semibold text-sm">₹{Number(order.total_amount || order.total || 0).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                        <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
