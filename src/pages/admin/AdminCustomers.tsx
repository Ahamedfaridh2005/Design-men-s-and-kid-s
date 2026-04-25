import { useEffect, useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Search } from "lucide-react";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // We use the secure RPC function to fetch all customers bypassing RLS safely
      const { data, error } = await supabase.rpc('get_all_customers');

      if (error) {
        console.error('Error fetching customers:', error);
      } else {
        setCustomers(data || []);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const userCount = customers.filter(c => c.role !== 'admin').length;
  const adminCount = customers.filter(c => c.role === 'admin').length;
  return (
    <AdminLayout>
      <div className="w-full">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Manage</p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <h1 className="font-heading text-3xl text-[#2c2c2c]">Customers</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input type="text" placeholder="Search customers..." className="border border-border pl-10 pr-4 py-2 font-body text-sm bg-transparent focus:outline-none w-[250px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Total Customers</p>
            <p className="font-heading text-2xl mb-1">{userCount}</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Admin Users</p>
            <p className="font-heading text-2xl mb-1">{adminCount}</p>
          </div>
        </div>

        <div className="border border-border bg-transparent overflow-x-auto">
          <table className="w-full text-sm text-left font-body min-w-[700px]">
            <thead className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase bg-[#f5f4ef] border-b border-border">
              <tr>
                <th className="px-6 py-4 font-normal">Customer</th>
                <th className="px-6 py-4 font-normal">Email</th>
                <th className="px-6 py-4 font-normal">Phone</th>
                <th className="px-6 py-4 font-normal">Orders</th>
                <th className="px-6 py-4 font-normal">Role</th>
                <th className="px-6 py-4 font-normal text-right">Joined</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                 <tr><td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : customers.map((customer) => {
                const displayName = customer.display_name || customer.email?.split('@')[0] || "Guest";
                const initial = displayName.charAt(0).toUpperCase();
                const role = (customer.role || 'user').toUpperCase();
                const roleColor = role === 'ADMIN' ? 'bg-[#1a1a1a] text-white' : 'bg-[#e5e5e5] text-[#888888]';
                
                return (
                <tr key={customer.user_id} className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                  <td className="px-6 py-4 flex items-center gap-4 min-w-[200px]">
                    <div className="w-8 h-8 rounded-full bg-[#f4e8ff] text-[#7124cc] flex items-center justify-center font-heading font-semibold text-sm">
                      {initial}
                    </div>
                    <span className="font-heading text-xs tracking-wider uppercase text-[#2c2c2c]">{displayName}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{customer.email || "N/A"}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{customer.phone || "—"}</td>
                  <td className="px-6 py-4 text-xs font-heading font-bold">{customer.order_count || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[9px] font-heading font-bold tracking-widest uppercase rounded ${roleColor}`}>
                      {role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-muted-foreground">
                    {new Date(customer.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
