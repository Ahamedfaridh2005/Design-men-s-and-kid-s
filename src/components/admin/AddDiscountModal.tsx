import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tag, Percent, IndianRupee, Activity } from "lucide-react";

interface AddDiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (discountData: any) => void;
  initialData?: any;
}

export default function AddDiscountModal({ isOpen, onClose, onSave, initialData }: AddDiscountModalProps) {
  const [formData, setFormData] = useState({
    code: "",
    discount_value: "",
    discount_type: "Percent",
    status: "ACTIVE",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          code: initialData.code,
          discount_value: initialData.discount_value.toString(),
          discount_type: initialData.discount_type,
          status: initialData.status,
        });
      } else {
        setFormData({
          code: "",
          discount_value: "",
          discount_type: "Percent",
          status: "ACTIVE",
        });
      }
    }
  }, [isOpen, initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      discount_value: Number(formData.discount_value),
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-transparent shadow-2xl">
        <div className="w-full bg-card rounded-xl overflow-hidden relative">
          <div className="px-8 pt-10 pb-8">
            <div className="text-center mb-8">
              <h1 className="font-heading text-3xl font-bold tracking-wider mb-2">
                {initialData ? "Edit Discount" : "New Discount"}
              </h1>
              <p className="text-muted-foreground font-body text-sm">
                {initialData ? "Update the discount code details" : "Create a new discount code for your customers"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Tag size={18} className="absolute left-4 top-[17px] text-muted-foreground" />
                <input 
                  required
                  type="text" 
                  placeholder="Discount Code (e.g. SUMMER25)"
                  value={formData.code}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  {formData.discount_type === 'Percent' ? (
                    <Percent size={18} className="absolute left-4 top-[17px] text-muted-foreground" />
                  ) : (
                    <IndianRupee size={18} className="absolute left-4 top-[17px] text-muted-foreground" />
                  )}
                  <input 
                    required
                    type="number" 
                    placeholder="Value"
                    value={formData.discount_value}
                    onChange={(e) => setFormData({...formData, discount_value: e.target.value})}
                    className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all"
                  />
                </div>
                <div className="relative">
                  <select 
                    value={formData.discount_type}
                    onChange={(e) => setFormData({...formData, discount_type: e.target.value})}
                    className="w-full pl-4 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none cursor-pointer"
                  >
                    <option value="Percent">Percent (%)</option>
                    <option value="Fixed">Fixed (₹)</option>
                  </select>
                </div>
              </div>

              <div className="relative">
                <Activity size={18} className="absolute left-4 top-[17px] text-muted-foreground z-10" />
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full pl-12 pr-4 py-3.5 bg-background border border-border/50 rounded-lg font-body text-sm focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent transition-all appearance-none cursor-pointer"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>

              <div className="pt-4">
                <button 
                  type="submit"
                  className="w-full py-3.5 bg-primary text-primary-foreground font-heading text-sm tracking-widest hover:bg-primary/90 transition-all rounded-lg uppercase"
                >
                  {initialData ? "Update Discount" : "Create Discount"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
