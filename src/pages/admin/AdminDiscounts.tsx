import AdminLayout from "@/components/admin/AdminLayout";
import { Tag, Trash2 } from "lucide-react";

export default function AdminDiscounts() {
  const discounts = [
    { code: "VELOUR20", value: "20%", type: "Percent", uses: 0, status: "ACTIVE" },
    { code: "FIRST10", value: "10%", type: "Percent", uses: 0, status: "ACTIVE" },
    { code: "SAVE15", value: "15%", type: "Percent", uses: 0, status: "INACTIVE" },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Marketing</p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <h1 className="font-heading text-3xl text-[#2c2c2c]">Discounts</h1>
          <button className="bg-[#1a1a1a] text-white px-6 py-2.5 text-[10px] font-heading font-bold tracking-widest uppercase hover:bg-black transition-colors shrink-0">
             + Add Code
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Total Codes</p>
            <p className="font-heading text-2xl mb-1">3</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Active</p>
            <p className="font-heading text-2xl mb-1 text-[#1b8c4c]">2</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Inactive</p>
            <p className="font-heading text-2xl mb-1 text-muted-foreground">1</p>
          </div>
        </div>

        <div className="border border-border bg-transparent overflow-x-auto">
          <table className="w-full text-sm text-left font-body min-w-[700px]">
            <thead className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase bg-[#f5f4ef] border-b border-border">
              <tr>
                <th className="px-6 py-4 font-normal">Code</th>
                <th className="px-6 py-4 font-normal">Discount</th>
                <th className="px-6 py-4 font-normal">Type</th>
                <th className="px-6 py-4 font-normal">Uses</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map((d, i) => (
              <tr key={i} className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                <td className="px-6 py-4 flex items-center gap-2 font-heading font-semibold text-xs text-[#2c2c2c] uppercase">
                  <Tag size={13} className="text-muted-foreground -scale-x-100 rotate-90" />
                  {d.code}
                </td>
                <td className="px-6 py-4 text-xs font-semibold text-[#2c2c2c]">{d.value}</td>
                <td className="px-6 py-4 text-xs text-muted-foreground">{d.type}</td>
                <td className="px-6 py-4 text-xs text-muted-foreground">{d.uses}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-[9px] font-heading font-bold tracking-widest uppercase rounded ${d.status === "ACTIVE" ? "bg-[#e0f8eb] text-[#1b8c4c]" : "bg-[#f5f5f5] text-[#888888]"}`}>
                    {d.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <button className="text-[#ff7875] hover:text-[#ff4d4f] transition-colors p-2"><Trash2 size={14} /></button>
                </td>
              </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
