import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Package, AlignLeft, LayoutList, Layers, Box, List, Tag, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
  initialData?: any | null;
}

export default function AddProductModal({ isOpen, onClose, onSave, initialData }: AddProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "Shirts",
    gender: "men",
    color: "",
    material: "",
    discount: "",
    status: "Active",
    featured: false,
    image: null as File | null,
    image_url: "",
    preview_url: "",
  });

  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price ? initialData.price.toString() : "",
        category: initialData.category || "Shirts",
        gender: initialData.gender || "men",
        color: initialData.color || "",
        material: initialData.material || "",
        discount: initialData.discount ? initialData.discount.toString() : "",
        status: initialData.status || "Active",
        featured: initialData.featured || false,
        image: null,
        image_url: initialData.image_url || "",
        preview_url: "",
      });
      setSelectedSizes(initialData.sizes || []);
    } else {
      setFormData({
        name: "", description: "", price: "", category: "Shirts", gender: "men",
        color: "", material: "", discount: "", status: "Active", 
        featured: false, image: null, image_url: "", preview_url: ""
      });
      setSelectedSizes([]);
    }
  }, [initialData, isOpen]);

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ 
        ...formData, 
        image: file,
        preview_url: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedSizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }
    
    onSave({
      id: initialData?.id,
      ...formData,
      sizes: selectedSizes,
      price: Number(formData.price) || 0,
      discount: Number(formData.discount) || 0,
    });
    // Reset state after save
    setFormData({
      name: "", description: "", price: "", category: "Shirts", gender: "men",
      color: "", material: "", discount: "", status: "Active", 
      featured: false, image: null, image_url: "", preview_url: ""
    });
    setSelectedSizes([]);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none bg-transparent shadow-2xl">
        <div className="w-full bg-card rounded-xl overflow-hidden relative max-h-[90vh] overflow-y-auto">
          <div className="px-8 pt-10 pb-8">
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold tracking-wider mb-2">
                {initialData ? "Update Product" : "New Product"}
              </h1>
              <p className="text-muted-foreground font-body text-sm">
                {initialData ? "Update details of the selected product" : "Add a new item to your store's catalog"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Package size={18} className="absolute left-4 top-[17px] text-muted-foreground" />
                <input 
                  required
                  type="text" 
                  placeholder="Product Name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                />
              </div>

              <div className="relative">
                <AlignLeft size={18} className="absolute left-4 top-[17px] text-muted-foreground" />
                <textarea 
                  placeholder="Description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <span className="absolute left-4 top-[17px] text-muted-foreground font-heading text-lg leading-none">₹</span>
                  <input 
                    required
                    type="number" 
                    placeholder="Price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
                <div className="relative">
                  <LayoutList size={18} className="absolute left-4 top-[17px] text-muted-foreground z-10" />
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                  >
                    <option value="men">Men</option>
                    <option value="kids">Kids</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <LayoutList size={18} className="absolute left-4 top-[17px] text-muted-foreground z-10" />
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                  >
                    <option value="Shirts">Shirts</option>
                    <option value="T-Shirts">T-Shirts</option>
                    <option value="Pants">Pants</option>
                    <option value="Tracks">Tracks</option>
                    <option value="Shorts">Shorts</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Layers size={18} className="absolute left-4 top-[17px] text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Color"
                    value={formData.color}
                    onChange={(e) => setFormData({...formData, color: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
                <div className="relative">
                  <Box size={18} className="absolute left-4 top-[17px] text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Material"
                    value={formData.material}
                    onChange={(e) => setFormData({...formData, material: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 pl-1 mt-2">Sizes</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => toggleSize(size)}
                      className={`w-11 h-11 rounded-lg flex items-center justify-center border text-sm font-semibold transition-all ${
                        selectedSizes.includes(size) 
                          ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-md ring-2 ring-accent ring-offset-2' 
                          : 'border-border/50 bg-background hover:border-gray-400 text-foreground'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="relative">
                  <span className="absolute left-4 top-[17px] text-muted-foreground font-heading text-lg leading-none">₹</span>
                  <input 
                    type="number" 
                    placeholder="Discount Amount"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
                <div className="relative">
                  <Tag size={18} className="absolute left-4 top-[17px] text-muted-foreground z-10" />
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none cursor-pointer"
                    style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239ca3af%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem top 50%', backgroundSize: '0.65rem auto' }}
                  >
                    <option value="Active">Active</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 mb-1 pl-1">
                  <ImageIcon size={16} className="text-muted-foreground" />
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Product Image</label>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(formData.preview_url || formData.image_url) && (
                    <div className="relative aspect-square w-24 bg-secondary rounded-lg overflow-hidden border border-border">
                      <img 
                        src={formData.preview_url || (formData.image_url.startsWith('http') || formData.image_url.startsWith('blob:') || formData.image_url.startsWith('/') ? formData.image_url : `/assets/products/${formData.image_url}`)} 
                        alt="Preview" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1 flex flex-col justify-center">
                    <div className="w-full pl-4 pr-4 py-3 bg-background border border-border/50 rounded-lg flex items-center justify-between overflow-hidden">
                      <span className="text-sm font-body text-muted-foreground truncate mr-2">
                        {formData.image ? formData.image.name : "Select new image"}
                      </span>
                      <label className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-1.5 rounded text-[10px] font-bold uppercase tracking-wider transition-colors shrink-0">
                        Browse
                        <input 
                          type="file" 
                          className="hidden" 
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 pb-2 px-1">
                <input 
                  type="checkbox" 
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                  className="w-4 h-4 rounded text-accent focus:ring-accent border-gray-300"
                />
                <label htmlFor="featured" className="text-sm cursor-pointer select-none text-foreground font-medium">
                  Featured product
                </label>
              </div>

              <div className="pt-2">
                <button 
                  type="submit"
                  className="w-full py-3.5 bg-primary text-primary-foreground font-heading text-sm tracking-widest hover:bg-primary/90 transition-all rounded-lg uppercase"
                >
                  {initialData ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
