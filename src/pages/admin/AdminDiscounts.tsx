import AdminLayout from "@/components/admin/AdminLayout";
import { Tag, Trash2, Loader2, Pencil } from "lucide-react";
import { useState } from "react";
import { useDiscounts, Discount } from "@/hooks/useDiscounts";
import AddDiscountModal from "@/components/admin/AddDiscountModal";

export default function AdminDiscounts() {
  const { discounts, loading, addDiscount, updateDiscount, deleteDiscount } = useDiscounts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  const activeCount = discounts.filter(d => d.status === "ACTIVE").length;
  const inactiveCount = discounts.filter(d => d.status === "INACTIVE").length;

  const handleSave = async (data: any) => {
    if (editingDiscount) {
      await updateDiscount(editingDiscount.id, data);
    } else {
      await addDiscount(data);
    }
    setEditingDiscount(null);
  };

  const handleEdit = (discount: Discount) => {
    setEditingDiscount(discount);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDiscount(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this discount code?")) {
      await deleteDiscount(id);
    }
  };

  return (
    <AdminLayout>
      <div className="w-full">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Marketing</p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <h1 className="font-heading text-3xl text-[#2c2c2c]">Discounts</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-[#1a1a1a] text-white px-6 py-2.5 text-[10px] font-heading font-bold tracking-widest uppercase hover:bg-black transition-colors shrink-0"
          >
             + Add Code
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Total Codes</p>
            <p className="font-heading text-2xl mb-1">{discounts.length}</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Active</p>
            <p className="font-heading text-2xl mb-1 text-[#1b8c4c]">{activeCount}</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Inactive</p>
            <p className="font-heading text-2xl mb-1 text-muted-foreground">{inactiveCount}</p>
          </div>
        </div>

        <div className="border border-border bg-transparent overflow-x-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="animate-spin mb-4" size={32} />
              <p className="text-sm font-body">Loading discounts...</p>
            </div>
          ) : discounts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <Tag size={40} className="mb-4 opacity-20" />
              <p className="text-sm font-body">No discount codes found. Create one to get started.</p>
            </div>
          ) : (
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
                {discounts.map((d) => (
                <tr key={d.id} className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                  <td className="px-6 py-4 flex items-center gap-2 font-heading font-semibold text-xs text-[#2c2c2c] uppercase">
                    <Tag size={13} className="text-muted-foreground -scale-x-100 rotate-90" />
                    {d.code}
                  </td>
                  <td className="px-6 py-4 text-xs font-semibold text-[#2c2c2c]">
                    {d.discount_type === "Percent" ? `${d.discount_value}%` : `₹${d.discount_value}`}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{d.discount_type}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{d.uses}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-[9px] font-heading font-bold tracking-widest uppercase rounded ${d.status === "ACTIVE" ? "bg-[#e0f8eb] text-[#1b8c4c]" : "bg-[#f5f5f5] text-[#888888]"}`}>
                      {d.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                     <button 
                       onClick={() => handleEdit(d)}
                       className="text-muted-foreground hover:text-primary transition-colors p-2"
                     >
                       <Pencil size={14} />
                     </button>
                     <button 
                       onClick={() => handleDelete(d.id)}
                       className="text-[#ff7875] hover:text-[#ff4d4f] transition-colors p-2"
                     >
                       <Trash2 size={14} />
                     </button>
                  </td>
                </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AddDiscountModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSave={handleSave} 
        initialData={editingDiscount}
      />
    </AdminLayout>
  );
}

