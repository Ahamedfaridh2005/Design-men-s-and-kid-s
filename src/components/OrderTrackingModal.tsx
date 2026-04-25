import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Check, X } from "lucide-react";

interface OrderTrackingModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: any;
}

export default function OrderTrackingModal({ isOpen, onClose, order }: OrderTrackingModalProps) {
  if (!order) return null;

  const status = (order.status || "PROCESSING").toUpperCase();
  const isCancelled = status === "CANCELLED";

  const steps = [
    { label: "Ordered", isActive: ["ORDERED", "PROCESSING", "SHIPPED", "OUT FOR DELIVERY", "DELIVERED"].includes(status) },
    { label: "Processing", isActive: ["PROCESSING", "SHIPPED", "OUT FOR DELIVERY", "DELIVERED"].includes(status) },
    { label: "Shipped", isActive: ["SHIPPED", "OUT FOR DELIVERY", "DELIVERED"].includes(status) },
    { label: "Out for delivery", isActive: ["OUT FOR DELIVERY", "DELIVERED"].includes(status) },
    { label: "Delivered", isActive: ["DELIVERED"].includes(status) },
  ];

  // Determine current active or final step to show in the header
  let headlineStatus = status === "ORDERED" ? "Ordered" :
                       status === "PROCESSING" ? "Processing" :
                       status === "SHIPPED" ? "Shipped" :
                       status === "OUT FOR DELIVERY" ? "Out for delivery" :
                       status === "DELIVERED" ? "Delivered" :
                       status === "CANCELLED" ? "Cancelled" : status;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-8 overflow-hidden border-none bg-card shadow-2xl rounded-xl custom-scrollbar max-h-[90vh] overflow-y-auto w-[90vw] md:w-full">
        <div className="text-center mb-8">
          <h2 className="font-heading text-2xl font-bold mb-2 tracking-wider">
            {headlineStatus}
          </h2>
          <p className="text-sm font-body text-muted-foreground">
            Order #{order.order_number}
          </p>
        </div>

        {isCancelled ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
              <X size={32} />
            </div>
            <p className="font-heading text-lg font-bold">Order Cancelled</p>
            <p className="font-body text-sm text-muted-foreground mt-2 text-balance">
              This order has been cancelled and will not be delivered.
            </p>
          </div>
        ) : (
          <div className="py-6 px-2">
            <div className="relative flex items-center justify-between z-10 w-full mb-8">
              {/* Progress Line */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2 w-full bg-secondary -z-10 rounded-full" />
              
              {/* Dynamic Progress Line Fill */}
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-2 bg-[#2ba3b6] -z-10 rounded-full transition-all duration-500 ease-in-out" 
                style={{ 
                  width: status === "DELIVERED" ? '100%' : 
                         status === "OUT FOR DELIVERY" ? '75%' : 
                         status === "SHIPPED" ? '50%' : 
                         status === "PROCESSING" ? '25%' : '0%' 
                }} 
              />

              {/* Steps Markers */}
              {steps.map((step, idx) => (
                <div key={idx} className="relative flex flex-col items-center group">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 font-bold transition-all duration-300 ${
                      step.isActive ? 'bg-[#2ba3b6] text-white shadow-md' : 'bg-secondary text-transparent'
                    }`}
                  >
                    {step.isActive ? <Check size={16} strokeWidth={3} /> : <div className="w-3 h-3 rounded-full bg-muted/30" />}
                  </div>
                  <span className={`absolute -bottom-6 w-24 text-center text-[10px] sm:text-xs font-body whitespace-nowrap transition-all duration-300 ${
                    step.isActive ? 'text-foreground font-semibold' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Delivery address context block below */}
            <div className="mt-16 bg-[#fbfaf8] border border-border p-5 rounded-lg">
                <p className="font-heading text-sm font-bold tracking-widest mb-2 uppercase text-muted-foreground">Delivery To</p>
                <p className="font-body text-sm font-semibold mb-1">{order.shipping_address?.full_name}</p>
                <p className="font-body text-xs text-muted-foreground text-balance">
                    {order.shipping_address?.street}, {order.shipping_address?.city} {order.shipping_address?.zip}
                </p>
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-6 py-3.5 bg-primary text-primary-foreground font-heading text-xs uppercase tracking-widest hover:bg-primary/90 transition-all rounded-lg"
        >
          Close
        </button>
      </DialogContent>
    </Dialog>
  );
}
