import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Search, Edit2, Trash2, Save, X } from "lucide-react";
import AddProductModal from "@/components/admin/AddProductModal";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminProducts() {
  const [prodList, setProdList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) {
      toast.error("Failed to fetch products");
    } else if (data) {
      setProdList(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const uploadImage = async (file: File) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${fileName}`;

    // Try to upload to 'product-images' bucket
    const { error: uploadError } = await supabase.storage
      .from('product-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);

    return publicUrl;
  };

  const handleSaveProduct = async (productData: any) => {
    const isUpdate = !!productData.id;
    setLoading(true);
    
    try {
      let imageUrl = productData.image_url;

      if (productData.image instanceof File) {
        toast.info("Uploading image...");
        imageUrl = await uploadImage(productData.image);
      } else if (!imageUrl) {
        imageUrl = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&q=80";
      }

      const dbPayload = {
        name: productData.name,
        price: productData.price,
        category: productData.category,
        gender: productData.gender || "men",
        description: productData.description || "Premium product.",
        discount: productData.discount || 0,
        sizes: productData.sizes || [],
        status: productData.status || "active",
        image_url: imageUrl
      };

      if (isUpdate) {
        const { error } = await supabase
          .from('products')
          .update(dbPayload)
          .eq('id', productData.id);
          
        if (error) throw error;
        toast.success("Product updated successfully");
      } else {
        const newId = productData.category.charAt(0).toLowerCase() + Date.now().toString().slice(-4);
        const { error } = await supabase
          .from('products')
          .insert({ id: newId, ...dbPayload });
          
        if (error) throw error;
        toast.success("Product created successfully");
      }
      
      fetchProducts();
      setIsModalOpen(false);
      setEditingProduct(null);
    } catch (error: any) {
      console.error("Error saving product:", error);
      toast.error(error.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;
    
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
       toast.error("Failed to delete product");
    } else {
       toast.success("Product deleted");
       fetchProducts();
    }
  };

  const handleEditClick = (product: any) => {
    setEditingProduct({ ...product, discount: product.discount || 0 });
    setIsModalOpen(true);
  };

  const [searchQuery, setSearchQuery] = useState("");

  const filteredProducts = prodList.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="w-full">
        <p className="text-[10px] font-heading font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">Manage</p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
          <h1 className="font-heading text-3xl text-[#2c2c2c]">Products</h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-border pl-10 pr-4 py-2 font-body text-sm bg-transparent focus:outline-none w-[250px]" 
              />
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
                <th className="px-6 py-4 font-normal">Discount</th>
                <th className="px-6 py-4 font-normal text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                   <td colSpan={6} className="px-6 py-10 text-center font-body text-sm text-muted-foreground">Loading products...</td>
                </tr>
              ) : filteredProducts.map((product) => {
                  // Handle dynamic image url parsing vs static file vs unsplash
                  let displayImg = product.image_url;
                  if (displayImg && !displayImg.startsWith('http') && !displayImg.startsWith('blob:') && !displayImg.startsWith('/')) {
                     // Resolve relative paths from public folder
                     displayImg = `/assets/products/${displayImg}`; 
                  }
                  if (!displayImg) displayImg = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=80";

                 return (
                <tr key={product.id} className="border-b border-border last:border-0 hover:bg-[#fbfaf8]">
                  <td className="px-6 py-4 flex items-center gap-4 min-w-[250px]">
                    <img src={displayImg} alt={product.name} className="w-10 h-12 object-cover bg-secondary overflow-hidden shrink-0" />
                    <span className="font-heading text-sm min-w-0 truncate">{product.name}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground capitalize">{product.gender} / {product.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 text-[9px] font-heading font-bold tracking-widest uppercase rounded ${product.status === 'active' || product.status === 'Active' ? 'bg-[#e0f8eb] text-[#1b8c4c]' : 'bg-[#f4e8ff] text-[#7124cc]'}`}>
                      {product.status || 'Active'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-heading font-bold text-sm text-[#2c2c2c] min-w-[120px]">
                    ₹{Number(product.price).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">₹{product.discount || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleEditClick(product)} className="text-muted-foreground hover:text-primary transition-colors p-1 inline-block"><Edit2 size={13} /></button>
                    <button onClick={() => handleDelete(product.id)} className="text-muted-foreground hover:text-destructive transition-colors p-1 ml-2 inline-block"><Trash2 size={13} /></button>
                  </td>
                </tr>
              )})}
              {!loading && filteredProducts.length === 0 && (
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
