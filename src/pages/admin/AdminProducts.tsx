import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { products } from "@/data/products";
import { Search, Edit2, Trash2, Save, X } from "lucide-react";

export default function AdminProducts() {
  const [prodList, setProdList] = useState([...products]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ name: "", price: 0 });

  const handleDelete = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    
    // Mutate the original global array to reflect in Dashboard
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
      products.splice(index, 1);
    }
    setProdList([...products]);
  };

  const startEdit = (product: any) => {
    setEditingId(product.id);
    setEditForm({ name: product.name, price: product.price });
  };

  const saveEdit = (id: string) => {
    // Mutate the original global array
    const index = products.findIndex(p => p.id === id);
    if (index > -1) {
      products[index].name = editForm.name;
      products[index].price = editForm.price;
    }
    setProdList([...products]);
    setEditingId(null);
  };

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Manage</p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <h1 className="font-heading text-3xl text-[#2c2c2c]">Products</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input type="text" placeholder="Search..." className="border border-border pl-10 pr-4 py-2 font-body text-sm bg-transparent focus:outline-none w-[250px]" />
            </div>
            <button className="bg-[#1a1a1a] text-white px-6 py-2.5 text-[10px] font-heading font-bold tracking-widest uppercase hover:bg-black transition-colors shrink-0">
              + Add Product
            </button>
          </div>
        </div>

        <div className="border border-border bg-transparent overflow-x-auto">
          <table className="w-full text-sm text-left font-body min-w-[700px]">
            <thead className="text-[10px] font-heading font-bold tracking-widest text-muted-foreground uppercase bg-[#f5f4ef] border-b border-border">
              <tr>
                <th className="px-6 py-4 font-normal">Product</th>
                <th className="px-6 py-4 font-normal">Category</th>
                <th className="px-6 py-4 font-normal">Status</th>
                <th className="px-6 py-4 font-normal">Price</th>
                <th className="px-6 py-4 font-normal">Stock</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prodList.map((product) => {
                 const stockLevel = (product.id.charCodeAt(0) + product.id.charCodeAt(1)) * 3 % 45 + 5;
                 const isEditing = editingId === product.id;
                 
                 return (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                  <td className="px-6 py-4 flex items-center gap-4 min-w-[250px]">
                    <img src={product.image} alt={product.name} className="w-10 h-12 object-cover bg-secondary overflow-hidden shrink-0" />
                    {isEditing ? (
                       <input 
                         type="text" 
                         value={editForm.name} 
                         onChange={e => setEditForm({...editForm, name: e.target.value})} 
                         className="font-heading text-sm border-b border-black focus:outline-none bg-transparent w-full" 
                         autoFocus
                       />
                    ) : (
                       <span className="font-heading text-sm min-w-0 truncate">{product.name}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground capitalize">{product.gender}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 text-[9px] font-heading font-bold tracking-widest uppercase rounded bg-[#e0f8eb] text-[#1b8c4c]">Active</span>
                  </td>
                  <td className="px-6 py-4 font-heading font-bold text-sm text-[#2c2c2c] min-w-[120px]">
                    {isEditing ? (
                      <div className="flex items-center">
                        $<input 
                           type="number" 
                           value={editForm.price} 
                           onChange={e => setEditForm({...editForm, price: Number(e.target.value)})} 
                           className="w-20 ml-1 border-b border-black focus:outline-none bg-transparent font-heading" 
                        />
                      </div>
                    ) : (
                      `$${(product.price).toLocaleString(undefined, {minimumFractionDigits: 2})}`
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{stockLevel}</td>
                  <td className="px-6 py-4 text-right">
                    {isEditing ? (
                      <>
                        <button onClick={() => saveEdit(product.id)} className="text-[#1b8c4c] hover:text-green-700 transition-colors p-1"><Save size={14} /></button>
                        <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-black transition-colors p-1 ml-2"><X size={14} /></button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(product)} className="text-muted-foreground hover:text-primary transition-colors p-1 inline-block"><Edit2 size={13} /></button>
                        <button onClick={() => handleDelete(product.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1 ml-2 inline-block"><Trash2 size={13} /></button>
                      </>
                    )}
                  </td>
                </tr>
              )})}
              {prodList.length === 0 && (
                 <tr>
                    <td colSpan={6} className="px-6 py-10 text-center font-body text-sm text-muted-foreground">No products found.</td>
                 </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
