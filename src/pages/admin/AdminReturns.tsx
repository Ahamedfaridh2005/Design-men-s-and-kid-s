import AdminLayout from "@/components/admin/AdminLayout";
import { Search } from "lucide-react";

export default function AdminReturns() {
  return (
    <AdminLayout>
      <div className="w-full">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Customers</p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <h1 className="font-heading text-3xl text-[#2c2c2c]">Returns</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input type="text" placeholder="Search..." className="border border-border pl-10 pr-4 py-2 font-body text-sm bg-transparent focus:outline-none w-[250px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Eligible for Return</p>
            <p className="font-heading text-2xl mb-1">1</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Return Window</p>
            <p className="font-heading text-2xl mb-1">30 <span className="text-base text-muted-foreground font-normal">days</span></p>
          </div>
        </div>

        <div className="border border-border bg-transparent overflow-x-auto">
          <table className="w-full text-sm text-left font-body min-w-[800px]">
            <thead className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase bg-[#f5f4ef] border-b border-border">
              <tr>
                <th className="px-6 py-4 font-normal">Order</th>
                <th className="px-6 py-4 font-normal">Customer</th>
                <th className="px-6 py-4 font-normal">Delivered</th>
                <th className="px-6 py-4 font-normal">Items</th>
                <th className="px-6 py-4 font-normal">Total</th>
                <th className="px-6 py-4 font-normal">Return Window</th>
                <th className="px-6 py-4 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                <td className="px-6 py-4 text-xs font-mono text-muted-foreground">#57F4298A</td>
                <td className="px-6 py-4">
                  <p className="font-heading text-xs tracking-wider uppercase mb-0.5 text-[#2c2c2c] font-semibold">CHANDRU GD</p>
                  <p className="text-[10px] text-muted-foreground lowercase">230222.cs@rmkec.ac.in</p>
                </td>
                <td className="px-6 py-4 text-xs text-muted-foreground">Apr 13, 2026</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">1</td>
                <td className="px-6 py-4 font-heading font-bold text-sm text-[#2c2c2c]">₹389.00</td>
                <td className="px-6 py-4 text-xs text-[#1b8c4c] font-semibold">29d left</td>
                <td className="px-6 py-4 text-right">
                   <button className="border border-border px-4 py-2 text-[11px] font-heading text-foreground hover:bg-secondary transition-colors">Process Return</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
