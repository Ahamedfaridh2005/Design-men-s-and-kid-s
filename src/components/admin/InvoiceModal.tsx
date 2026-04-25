import { useEffect, useRef } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Printer, Download, X, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoiceData: any;
  autoAction?: 'print' | 'pdf' | null;
}

export default function InvoiceModal({ isOpen, onClose, invoiceData, autoAction }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && autoAction && invoiceData) {
      const timer = setTimeout(() => {
        if (autoAction === 'print') {
          window.print();
        } else if (autoAction === 'pdf') {
          handleDownloadPDF();
        }
      }, 800); // Wait for the modal and its content to render fully
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoAction, invoiceData]);

  if (!invoiceData) return null;

  const handleSaveInvoice = async () => {
    if (!invoiceData) return;
    
    try {
      // Check if already exists to avoid duplicate order numbers
      const { data: existing } = await supabase
        .from("admin_invoices")
        .select("id")
        .eq("order_number", invoiceData.order_number)
        .maybeSingle();

      if (existing) {
        toast.info("Invoice record already exists");
        return;
      }

      const { error } = await supabase.from("admin_invoices").insert({
        order_number: invoiceData.order_number,
        customer_details: invoiceData.shipping_address || invoiceData.customer_details || {},
        items: invoiceData.items || [],
        total: invoiceData.total || 0,
        status: invoiceData.status || "processing"
      });

      if (error) throw error;
      toast.success("Invoice saved to records successfully");
    } catch (error: any) {
      console.error("Error saving invoice", error);
      toast.error(error.message || "Failed to save invoice record");
    }
  };

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;
    
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice-${invoiceData.order_number?.substring(0,8).toUpperCase()}.pdf`);
    } catch (error) {
      console.error("Error generating PDF", error);
    }
  };

  const formattedDate = new Date(invoiceData.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const invoiceNumber = `INV-${invoiceData.order_number?.substring(0,8).toUpperCase()}`;
  
  // Parse items safely
  let items = [];
  try {
    items = typeof invoiceData.items === 'string' ? JSON.parse(invoiceData.items) : (invoiceData.items || []);
  } catch (e) {
    items = [];
  }
  
  if (items.length === 0) {
    items = [{
      name: "Assorted Apparel",
      quantity: 1,
      price: invoiceData.total
    }];
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none bg-background shadow-2xl print:shadow-none print:w-[100vw] print:max-w-[100vw] print:h-[100vh] print:m-0 print:border-0 [&>button]:hidden">
        {/* Header - Hidden during print */}
        <div className="flex justify-between items-center p-6 border-b border-border/40 print:hidden bg-[#fcfaf8]">
          <h2 className="font-heading text-2xl tracking-wider text-[#2c2c2c]">Invoice</h2>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => window.print()} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
            >
              <Printer size={14} /> Print
            </button>
            <button 
              onClick={handleDownloadPDF} 
              className="flex items-center gap-2 px-4 py-2 bg-white border border-border text-xs font-bold tracking-widest uppercase hover:bg-gray-50 transition-colors"
            >
              <Download size={14} /> Download PDF
            </button>
            <button 
              onClick={handleSaveInvoice} 
              className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white text-xs font-bold tracking-widest uppercase hover:bg-black transition-colors"
            >
              <Save size={14} /> Save to Records
            </button>
            <button onClick={onClose} className="ml-2 text-muted-foreground hover:text-black">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Printable Content */}
        <div 
          ref={printRef}
          id="printable-invoice"
          className="p-10 bg-[#fdfdfc] print:p-8 print:bg-white min-h-[500px]"
        >
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-widest uppercase text-[#2c2c2c] mb-1">
                VELOUR
              </h1>
              <p className="text-muted-foreground text-sm">Premium Fashion</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-1">Invoice</p>
              <p className="font-heading font-medium text-lg text-[#2c2c2c]">{invoiceNumber}</p>
              <p className="text-sm text-muted-foreground">{formattedDate}</p>
            </div>
          </div>

          <div className="mb-10">
            <p className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground mb-2">Bill To</p>
            <p className="font-heading font-medium text-lg uppercase text-[#2c2c2c] mb-1">
              {invoiceData.shipping_address?.full_name || "Guest Account"}
            </p>
            <p className="text-muted-foreground text-sm mb-1">{invoiceData.shipping_address?.email || "customer@example.com"}</p>
            {invoiceData.shipping_address?.address && (
              <p className="text-muted-foreground text-sm max-w-[300px]">
                {invoiceData.shipping_address?.address}, {invoiceData.shipping_address?.city}, {invoiceData.shipping_address?.state} {invoiceData.shipping_address?.postal_code}, {invoiceData.shipping_address?.country}
              </p>
            )}
          </div>

          <table className="w-full mb-8">
            <thead className="border-b border-border text-[10px] font-bold tracking-widest uppercase text-muted-foreground">
              <tr>
                <th className="pb-3 text-left font-normal">Item</th>
                <th className="pb-3 text-center font-normal">Qty</th>
                <th className="pb-3 text-right font-normal">Price</th>
                <th className="pb-3 text-right font-normal">Discount</th>
                <th className="pb-3 text-right font-normal">Total</th>
              </tr>
            </thead>
            <tbody className="text-sm border-b border-border">
              {items.map((item: any, idx: number) => (
                <tr key={idx} className="border-b border-border/20 last:border-0">
                  <td className="py-4 text-[#2c2c2c]">{item.name || "Apparel Item"}</td>
                  <td className="py-4 text-center text-muted-foreground">{item.quantity || 1}</td>
                  <td className="py-4 text-right text-muted-foreground">₹{Number(item.price || 0).toFixed(2)}</td>
                  <td className="py-4 text-right text-muted-foreground">₹{Number(item.discount || 0).toFixed(2)}</td>
                  <td className="py-4 text-right font-medium text-[#2c2c2c]">₹{((Number(item.price || 0) * Number(item.quantity || 1)) - Number(item.discount || 0)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-[300px]">
              <div className="flex justify-between items-center py-3 border-t border-border">
                <span className="font-heading font-bold text-lg text-[#2c2c2c]">Total</span>
                <span className="font-heading font-bold text-xl text-[#2c2c2c]">
                  ₹{Number(invoiceData.total).toLocaleString(undefined, {minimumFractionDigits: 2})}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-muted-foreground mt-8 print:mt-16">
            Thank you for shopping with VELOUR.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
