import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Printer, Download, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface NewInvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (action: 'save' | 'print' | 'pdf', data?: any) => void;
}

export default function NewInvoiceModal({ isOpen, onClose, onSuccess }: NewInvoiceModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'online' | 'offline'>('offline');
  const [searchOrderId, setSearchOrderId] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [customer, setCustomer] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: ""
  });
  
  const [items, setItems] = useState([
    { name: "", quantity: 1, price: 0, discount: 0 }
  ]);

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (Number(item.price) * Number(item.quantity)) - Number(item.discount || 0), 0);
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1, price: 0, discount: 0 }]);
  };

  const handleItemChange = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleFetchOrder = async () => {
    if (!searchOrderId.trim()) return;
    
    setIsSearching(true);
    try {
      const cleanId = searchOrderId.replace('#', '').trim().toUpperCase();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", cleanId)
        .maybeSingle();

      if (error) throw error;
      
      if (data) {
        setMode('online');
        setCustomer({
          fullName: data.shipping_address?.name || data.shipping_address?.full_name || "",
          email: data.shipping_address?.email || "",
          phone: data.shipping_address?.phone || "",
          address: `${data.shipping_address?.street || ""}, ${data.shipping_address?.city || ""}`.trim().replace(/^,|,$/g, '')
        });
        
        if (Array.isArray(data.items)) {
          setItems(data.items.map((item: any) => ({
            name: item.name || "Product",
            quantity: item.quantity || 1,
            price: item.price || 0,
            discount: 0
          })));
        }
        
        toast({
          title: "Order Found",
          description: `Details for order #${cleanId} have been imported.`,
        });
      } else {
        toast({
          title: "Order Not Found",
          description: "No order exists with that ID.",
          variant: "destructive"
        });
      }
    } catch (e: any) {
      toast({
        title: "Search Failed",
        description: e.message || "Could not fetch order details.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSubmit = async (action: 'save' | 'print' | 'pdf') => {
    try {
      setLoading(true);
      
      const orderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
      const total = calculateTotal();
      
        const orderData = {
        order_number: orderNumber,
        items: items.map(item => ({
          name: item.name || "Custom Item",
          quantity: item.quantity,
          price: item.price,
          discount: item.discount || 0
        })),
        total: total,
        status: mode === 'offline' ? "DELIVERED" : "PROCESSING",
        customer_details: {
          full_name: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          address: customer.address,
          order_mode: mode
        }
      };

      const { data: insertedData, error } = await supabase
        .from('admin_invoices')
        .insert([orderData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invoice created successfully",
      });

      onSuccess(action, insertedData);
      onClose();
    } catch (e: any) {
      toast({
        title: "Error",
        description: e.message || "Failed to create invoice",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none bg-[#fdfdfc] shadow-2xl [&>button]:hidden">
        <div className="flex justify-between items-center p-6 border-b border-border/40 bg-[#fdfdfc]">
          <h2 className="font-heading text-2xl tracking-wider text-[#2c2c2c]">New Invoice</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-black">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 max-h-[70vh] overflow-y-auto">
          {/* Order Search */}
          <div className="mb-8 p-4 bg-[#f5f4ef] border border-border/60">
            <h3 className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Import from Order ID</h3>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                className="flex-1 border border-border p-2 bg-white text-sm focus:outline-none focus:border-black uppercase font-mono"
                placeholder="e.g. #PEA690MK"
                onKeyDown={(e) => e.key === 'Enter' && handleFetchOrder()}
              />
              <button 
                type="button"
                onClick={handleFetchOrder}
                disabled={isSearching || !searchOrderId.trim()}
                className="px-6 py-2 bg-[#1a1a1a] text-white text-[10px] font-heading font-bold tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-50"
              >
                {isSearching ? "Searching..." : "Fetch Details"}
              </button>
            </div>
            <p className="mt-2 text-[9px] text-muted-foreground">
              Enter an order number to automatically populate customer and item details.
            </p>
          </div>

          {/* Order Mode */}
          <div className="mb-8">
            <h3 className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Order Mode</h3>
            <div className="flex gap-4">
              <button 
                type="button"
                onClick={() => setMode('offline')}
                className={`flex-1 py-3 px-4 text-xs font-heading font-bold tracking-widest uppercase border transition-all ${mode === 'offline' ? 'bg-[#1a1a1a] text-white border-black' : 'bg-white text-gray-400 border-border hover:border-gray-400'}`}
              >
                Offline Order
              </button>
              <button 
                type="button"
                onClick={() => setMode('online')}
                className={`flex-1 py-3 px-4 text-xs font-heading font-bold tracking-widest uppercase border transition-all ${mode === 'online' ? 'bg-[#1a1a1a] text-white border-black' : 'bg-white text-gray-400 border-border hover:border-gray-400'}`}
              >
                Online Order
              </button>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground italic">
              {mode === 'offline' ? "* Offline orders are automatically marked as Delivered." : "* Online orders can be managed in the Orders Dashboard."}
            </p>
          </div>

          {/* Customer Details */}
          <div className="mb-8">
            <h3 className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Customer Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  value={customer.fullName}
                  onChange={(e) => setCustomer({...customer, fullName: e.target.value})}
                  className="w-full border border-border p-2 bg-transparent text-sm focus:outline-none focus:border-black"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1 block">Email</label>
                <input 
                  type="email" 
                  value={customer.email}
                  onChange={(e) => setCustomer({...customer, email: e.target.value})}
                  className="w-full border border-border p-2 bg-transparent text-sm focus:outline-none focus:border-black"
                  placeholder="jane@example.com"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1 block">Phone</label>
                <input 
                  type="text" 
                  value={customer.phone}
                  onChange={(e) => setCustomer({...customer, phone: e.target.value})}
                  className="w-full border border-border p-2 bg-transparent text-sm focus:outline-none focus:border-black"
                  placeholder="+1 555 000 0000"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1 block">Shipping Address</label>
                <input 
                  type="text" 
                  value={customer.address}
                  onChange={(e) => setCustomer({...customer, address: e.target.value})}
                  className="w-full border border-border p-2 bg-transparent text-sm focus:outline-none focus:border-black"
                  placeholder="123 Main St, City"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <h3 className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase mb-4">Line Items</h3>
            <div className="space-y-3">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-end">
                  <div className="flex-1">
                    {idx === 0 && <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1 block">Item Name</label>}
                    <input 
                      type="text" 
                      value={item.name}
                      onChange={(e) => handleItemChange(idx, 'name', e.target.value)}
                      className="w-full border border-border p-2 bg-transparent text-sm focus:outline-none focus:border-black"
                      placeholder="Product name"
                    />
                  </div>
                  <div className="w-24">
                    {idx === 0 && <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1 block">Qty</label>}
                    <input 
                      type="number" 
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(idx, 'quantity', e.target.value)}
                      className="w-full border border-border p-2 bg-transparent text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="w-32">
                    {idx === 0 && <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1 block">Price (₹)</label>}
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={item.price}
                      onChange={(e) => handleItemChange(idx, 'price', e.target.value)}
                      className="w-full border border-border p-2 bg-transparent text-sm focus:outline-none focus:border-black"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="w-24">
                    {idx === 0 && <label className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1 block">Discount (₹)</label>}
                    <input 
                      type="number" 
                      min="0"
                      step="0.01"
                      value={item.discount}
                      onChange={(e) => handleItemChange(idx, 'discount', e.target.value)}
                      className="w-full border border-border p-2 bg-transparent text-sm focus:outline-none focus:border-black"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleAddItem}
              className="mt-4 flex items-center gap-1 text-sm text-muted-foreground hover:text-black transition-colors"
            >
              <Plus size={14} /> Add Item
            </button>
          </div>

          <div className="mt-12 pt-6 border-t border-border flex justify-end">
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-heading font-bold tracking-widest text-[#888888] uppercase">Total</span>
              <span className="font-heading text-2xl text-[#2c2c2c]">₹{calculateTotal().toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[#fcfaf8] border-t border-border flex justify-between items-center">
          <button 
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-border text-[10px] font-heading font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <div className="flex gap-3">
            <button 
              onClick={() => handleSubmit('print')}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-[10px] font-heading font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Printer size={14} /> Save & Print
            </button>
            <button 
              onClick={() => handleSubmit('pdf')}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border text-[10px] font-heading font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <Download size={14} /> Save & PDF
            </button>
            <button 
              onClick={() => handleSubmit('save')}
              disabled={loading}
              className="px-6 py-2.5 bg-[#1a1a1a] text-white text-[10px] font-heading font-bold tracking-widest uppercase hover:bg-black transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save Invoice"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
