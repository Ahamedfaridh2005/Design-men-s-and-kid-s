import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Search, FileText } from "lucide-react";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase.from("orders").select("*").order("created_at", { ascending: false });
      setOrders(data || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Manage</p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <h1 className="font-heading text-3xl text-[#2c2c2c]">Orders</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input type="text" placeholder="Search orders..." className="border border-border pl-10 pr-4 py-2 font-body text-sm bg-transparent focus:outline-none w-[250px]" />
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
                <th className="px-6 py-4 font-normal text-right">Invoice</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : orders.map((order) => {
                const statusColor = order.status?.toLowerCase() === 'delivered' ? 'bg-[#e0f8eb] text-[#1b8c4c]' : 'bg-[#f4e8ff] text-[#7124cc]';
                const itemsCount = Array.isArray(order.items) ? order.items.reduce((s:number, i:any)=>s+(i.quantity||1), 0) : 0;
                
                return (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                  <td className="px-6 py-4 text-xs font-mono text-muted-foreground">#{order.order_number?.substring(0,8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="font-heading text-xs tracking-wider uppercase mb-0.5">{order.shipping_address?.full_name || "Guest"}</p>
                    <p className="text-[10px] text-muted-foreground lowercase">{order.shipping_address?.email || "example@domain.com"}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground text-center sm:text-left">{itemsCount}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[9px] font-heading font-bold tracking-widest uppercase rounded flex items-center w-fit gap-2 cursor-pointer ${statusColor}`}>
                      {order.status}
                      <svg width="8" height="5" viewBox="0 0 10 6" fill="none" className="opacity-50"><path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </span>
                  </td>
                  <td className="px-6 py-4 font-heading font-bold text-sm">${Number(order.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button className="text-muted-foreground hover:text-foreground transition-colors p-2"><FileText size={14} /></button>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
