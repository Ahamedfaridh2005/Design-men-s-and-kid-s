import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { products } from "@/data/products";
import { Search, Edit2, Trash2, Save, X } from "lucide-react";
import AddProductModal from "@/components/admin/AddProductModal";

export default function AdminProducts() {
  const [prodList, setProdList] = useState([...products]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const handleSaveProduct = (productData: any) => {
    if (productData.id) {
      // Update existing
      const index = products.findIndex(p => p.id === productData.id);
      if (index > -1) {
        products[index] = {
          ...products[index],
          name: productData.name,
          price: productData.price,
          category: productData.category,
          gender: productData.category.toLowerCase() as "men" | "women" | "kids",
          description: productData.description || products[index].description,
          ...(productData.image ? { image: URL.createObjectURL(productData.image) } : {})
        };
      }
    } else {
      // Add new
      const newId = (productData.category.charAt(0).toLowerCase()) + (products.length + 1);
      const newProduct = {
        id: newId,
        name: productData.name,
        price: productData.price,
        category: productData.category,
        gender: productData.category.toLowerCase() as "men" | "women" | "kids",
        image: productData.image ? URL.createObjectURL(productData.image) : "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80",
        description: productData.description || "Premium product.",
      };
      products.push(newProduct);
    }
    
    setProdList([...products]);
    setIsModalOpen(false);
    setEditingProduct(null);
  };

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

  const handleEditClick = (product: any, stockLevel: number) => {
    setEditingProduct({ ...product, stock: stockLevel });
    setIsModalOpen(true);
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
            <button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="bg-[#1a1a1a] text-white px-6 py-2.5 text-[10px] font-heading font-bold tracking-widest uppercase hover:bg-black transition-colors shrink-0">
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
                 
                 return (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                  <td className="px-6 py-4 flex items-center gap-4 min-w-[250px]">
                    <img src={product.image} alt={product.name} className="w-10 h-12 object-cover bg-secondary overflow-hidden shrink-0" />
                    <span className="font-heading text-sm min-w-0 truncate">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground capitalize">{product.gender}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-0.5 text-[9px] font-heading font-bold tracking-widest uppercase rounded bg-[#e0f8eb] text-[#1b8c4c]">Active</span>
                  </td>
                  <td className="px-6 py-4 font-heading font-bold text-sm text-[#2c2c2c] min-w-[120px]">
                    ${(product.price).toLocaleString(undefined, {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{stockLevel}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEditClick(product, stockLevel)} className="text-muted-foreground hover:text-primary transition-colors p-1 inline-block"><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1 ml-2 inline-block"><Trash2 size={13} /></button>
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
      <AddProductModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setEditingProduct(null); }} 
        onSave={handleSaveProduct}
        initialData={editingProduct}
      />
    </AdminLayout>
  );
}
