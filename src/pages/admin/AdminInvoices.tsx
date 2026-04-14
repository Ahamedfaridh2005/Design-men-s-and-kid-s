import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Search, FileText } from "lucide-react";

export default function AdminInvoices() {
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

  const totalSales = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Store</p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <h1 className="font-heading text-3xl text-[#2c2c2c]">Invoices</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input type="text" placeholder="Search invoices..." className="border border-border pl-10 pr-4 py-2 font-body text-sm bg-transparent focus:outline-none w-[250px]" />
            </div>
            <button className="bg-[#1a1a1a] text-white px-6 py-2.5 text-[10px] font-heading font-bold tracking-widest uppercase hover:bg-black transition-colors shrink-0">
              + New Invoice
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Total Invoices</p>
            <p className="font-heading text-2xl mb-1">{orders.length}</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Paid</p>
            <p className="font-heading text-2xl mb-1 text-[#1b8c4c]">{orders.length}</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Total Sales</p>
            <p className="font-heading text-2xl mb-1">${totalSales.toLocaleString(undefined, {minimumFractionDigits: 2})}</p>
          </div>
        </div>

        <div className="border border-border bg-transparent overflow-x-auto">
          <table className="w-full text-sm text-left font-body min-w-[800px]">
            <thead className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase bg-[#f5f4ef] border-b border-border">
              <tr>
                <th className="px-6 py-4 font-normal">Invoice #</th>
                <th className="px-6 py-4 font-normal">Customer</th>
                <th className="px-6 py-4 font-normal">Date</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Amount</th>
                <th className="px-6 py-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : orders.map((order) => {
                const statusColor = order.status?.toLowerCase() === 'delivered' ? 'bg-[#e0f8eb] text-[#1b8c4c]' : 'bg-[#f4e8ff] text-[#7124cc]';
                
                return (
                <tr key={order.id} className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                  <td className="px-6 py-4 text-xs font-mono text-muted-foreground">INV-{order.order_number?.substring(0,8).toUpperCase()}</td>
                  <td className="px-6 py-4">
                    <p className="font-heading text-xs tracking-wider uppercase mb-0.5">{order.shipping_address?.full_name || "Guest"}</p>
                    <p className="text-[10px] text-muted-foreground lowercase">{order.shipping_address?.email || "example@domain.com"}</p>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[9px] font-heading font-bold tracking-widest uppercase rounded ${statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-heading font-bold text-sm">${Number(order.total).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
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
