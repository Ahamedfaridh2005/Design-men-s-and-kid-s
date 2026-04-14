import AdminLayout from "@/components/admin/AdminLayout";
import { products } from "@/data/products";
import { Search } from "lucide-react";

export default function AdminInventory() {
  const totalSkus = products.length;

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Store</p>
        
        <div className="flex justify-between items-end mb-10">
          <h1 className="font-heading text-3xl text-[#2c2c2c]">Inventory</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <input type="text" placeholder="Search products..." className="border border-border pl-10 pr-4 py-2 font-body text-sm bg-transparent focus:outline-none w-[250px]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Total SKUs</p>
            <p className="font-heading text-2xl mb-1">{totalSkus}</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Low Stock</p>
            <p className="font-heading text-2xl mb-1">0</p>
          </div>
          <div className="border border-border p-6 bg-transparent">
            <p className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Out of Stock</p>
            <p className="font-heading text-2xl mb-1">0</p>
          </div>
        </div>

        <div className="border border-border bg-transparent overflow-x-auto">
          <table className="w-full text-sm text-left font-body min-w-[700px]">
            <thead className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase bg-[#f5f4ef] border-b border-border">
              <tr>
                <th className="px-6 py-4 font-normal">Product</th>
                <th className="px-6 py-4 font-normal">Category</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Stock Level</th>
                <th className="px-6 py-4 font-normal text-right">Update Stock</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                 const stockLevel = (product.id.charCodeAt(0) + product.id.charCodeAt(1)) * 3 % 45 + 5;
                 return (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                  <td className="px-6 py-4 flex items-center gap-4 min-w-[250px]">
                    <img src={product.image} alt={product.name} className="w-10 h-12 object-cover bg-secondary" />
                    <span className="font-heading text-sm">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground capitalize">{product.gender}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 text-[9px] font-heading font-bold tracking-widest uppercase rounded bg-[#e0f8eb] text-[#1b8c4c]">Active</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground font-semibold">{stockLevel}</td>
                  <td className="px-6 py-4 text-right">
                     <input type="number" defaultValue={stockLevel} className="w-[80px] border border-border p-2 focus:outline-none focus:border-primary transition-colors font-body text-sm bg-white text-center ml-auto" />
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
