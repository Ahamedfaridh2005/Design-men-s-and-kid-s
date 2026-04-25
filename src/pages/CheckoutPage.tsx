import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Smartphone, Check, MapPin, Package, ShieldCheck, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("gpay");
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState({ name: "", email: "", street: "", city: "", zip: "", phone: "" });
  const [upiId, setUpiId] = useState("");
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  useEffect(() => {
    const autofillData = async () => {
      if (!user) return;
      
      const { data: profileData } = await supabase
        .from("profiles")
        .select("display_name, phone, email")
        .eq("user_id", user.id)
        .single();
        
      const { data: addrData } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_default", true)
        .maybeSingle();
        
      if (profileData || addrData) {
        setAddress({
          name: profileData?.display_name || "",
          phone: profileData?.phone || addrData?.phone || "",
          email: profileData?.email || user.email || "",
          street: addrData?.street || "",
          city: addrData?.city || "",
          zip: addrData?.zip || "",
        });
      }
    };
    autofillData();
  }, [user]);

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setScreenshot(file);
      setScreenshotPreview(URL.createObjectURL(file));
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    
    setIsApplyingCoupon(true);
    try {
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .eq('code', couponInput.toUpperCase())
        .eq('status', 'ACTIVE')
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setAppliedCoupon(data);
        toast({
          title: "Coupon Applied",
          description: `You saved using code ${data.code}`,
        });
        setCouponInput("");
      } else {
        toast({
          title: "Invalid Coupon",
          description: "This coupon code does not exist or is inactive.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Failed to apply coupon.",
        variant: "destructive",
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    toast({
      title: "Coupon Removed",
    });
  };


  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep((prev) => Math.min(prev + 1, 3));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditStep = (targetStep: number) => {
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      handleNextStep(e);
      return;
    }

    setProcessing(true);

    const orderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
    const orderItems = items.map((item) => ({
      productId: item.product.id,
      name: item.product.name,
      price: item.product.price,
      quantity: item.quantity,
    }));

    if (user) {
      let paymentProofUrl = null;

      // Upload screenshot if it exists
      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${orderNumber}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user.id}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment_proofs')
          .upload(filePath, screenshot);

        if (uploadError) {
          toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
          setProcessing(false);
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('payment_proofs')
          .getPublicUrl(filePath);
        
        paymentProofUrl = publicUrl;
      }

      const { error } = await supabase.from("orders").insert({
        user_id: user.id,
        order_number: orderNumber,
        items: orderItems,
        total: finalPrice,
        status: "Processing",
        shipping_address: address,
        payment_method: paymentMethod === "gpay" ? "Google Pay" : "PhonePe",
        upi_id: upiId,
        payment_proof_url: paymentProofUrl
      });

      if (error) {
        toast({ title: "Order failed", description: error.message, variant: "destructive" });
        setProcessing(false);
        return;
      }
    }

    setTimeout(() => {
      clearCart();
      navigate("/order-success");
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 text-center flex flex-col items-center">
        <p className="text-muted-foreground font-body text-lg mb-6">Your bag is empty</p>
        <button onClick={() => navigate("/shop")} className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-heading tracking-widest text-sm hover:bg-primary/90 transition-colors">
          RETURN TO SHOP
        </button>
      </div>
    );
  }

  const originalTotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const totalProductDiscount = items.reduce((sum, item) => sum + (item.product.discount || 0) * item.quantity, 0);
  
  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'Percent') {
      couponDiscountAmount = (originalTotal - totalProductDiscount) * (appliedCoupon.discount_value / 100);
    } else {
      couponDiscountAmount = appliedCoupon.discount_value;
    }
  }
  
  const platformFee = 0;
  const deliveryCharges = 0;
  const finalPrice = Math.max(0, originalTotal - totalProductDiscount - couponDiscountAmount + platformFee + deliveryCharges);

  return (
    <div className="min-h-screen pt-28 bg-[#f1f3f6]">
      <div className="container mx-auto px-4 py-6 max-w-6xl font-body">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area */}
          <div className="flex-1 space-y-4 shadow-sm">

            {/* Step 1: Address */}
            <div className="bg-white rounded-sm overflow-hidden">
              <div
                className={`px-6 py-4 flex items-center justify-between transition-colors ${step === 1 ? 'bg-primary text-primary-foreground' : 'cursor-pointer hover:bg-gray-50'}`}
                onClick={() => handleEditStep(1)}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-sm transition-colors ${step === 1 ? 'bg-primary-foreground text-primary' : 'bg-gray-200 text-gray-500'}`}>
                    1
                  </span>
                  <div className="flex items-center gap-4">
                    <h2 className={`text-sm tracking-widest uppercase font-bold text-current`}>Delivery Address</h2>
                    {step > 1 && address.name && (
                      <div className="hidden sm:flex flex-col">
                        <span className="text-sm font-semibold capitalize">{address.name}</span>
                        <span className="text-xs text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">{address.street}, {address.city}</span>
                      </div>
                    )}
                  </div>
                </div>
                {step > 1 && (
                  <button type="button" className="text-xs text-accent font-bold px-4 py-1.5 border border-border/20 rounded shadow-sm hover:bg-accent/5 focus:outline-none transition-all">
                    CHANGE
                  </button>
                )}
              </div>

              <AnimatePresence>
                {step === 1 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white">
                    <form onSubmit={handleNextStep} className="p-6 px-12">
                      <div className="space-y-4 mb-6 max-w-2xl">
                        <div className="grid md:grid-cols-2 gap-4">
                          <input required type="text" placeholder="Name" value={address.name} onChange={(e) => setAddress({ ...address, name: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm transition-colors" />
                          <input required type="text" pattern="[0-9]{10}" placeholder="10-digit mobile number" value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm transition-colors" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <input required type="text" placeholder="Pincode" value={address.zip} onChange={(e) => setAddress({ ...address, zip: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm transition-colors" />
                          <input required type="text" placeholder="City / District" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm transition-colors" />
                        </div>
                        <div className="w-full">
                          <textarea required placeholder="Address (Area and Street)" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} rows={3} className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm transition-colors resize-none" />
                        </div>
                        <div className="w-full">
                          <input type="email" placeholder="Email Address (Optional)" value={address.email} onChange={(e) => setAddress({ ...address, email: e.target.value })} className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm transition-colors" />
                        </div>
                      </div>

                      <div className="mt-8 pt-4">
                        <button type="submit" className="bg-[#fb641b] text-white px-12 py-4 uppercase font-medium text-sm rounded shadow-sm hover:bg-[#e05615] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#fb641b]">
                          Deliver Here
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 2: Order Summary */}
            <div className="bg-white rounded-sm overflow-hidden">
              <div
                className={`px-6 py-4 flex items-center justify-between transition-colors ${step === 2 ? 'bg-primary text-primary-foreground' : step > 2 ? 'cursor-pointer hover:bg-gray-50' : 'bg-white text-gray-400'}`}
                onClick={() => handleEditStep(2)}
              >
                <div className="flex items-center gap-4">
                  <span className={`w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-sm transition-colors ${step === 2 ? 'bg-primary-foreground text-primary' : step > 2 ? 'bg-gray-200 text-gray-500' : 'bg-gray-100 text-gray-400'}`}>
                    2
                  </span>
                  <div className="flex items-center gap-4">
                    <h2 className={`text-sm tracking-widest uppercase font-bold ${step < 2 ? 'text-gray-400' : 'text-current'}`}>Order Summary</h2>
                    {step > 2 && (
                      <span className="hidden sm:inline-block text-sm font-semibold">{items.length} Items</span>
                    )}
                  </div>
                </div>
                {step > 2 && (
                  <button type="button" className="text-xs text-accent font-bold px-4 py-1.5 border border-border/20 rounded shadow-sm hover:bg-accent/5 focus:outline-none transition-all">
                    CHANGE
                  </button>
                )}
              </div>

              <AnimatePresence>
                {step === 2 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white">
                    <div className="p-0">
                      <div className="divide-y divide-gray-100">
                        {items.map((item) => (
                          <div key={item.product.id} className="flex gap-6 p-6 px-8">
                            <div className="w-24 h-24 flex-shrink-0">
                              <img src={item.product.image_url || (item.product as any).image} alt={item.product.name} className="w-full h-full object-cover rounded shadow-sm" />
                            </div>
                            <div className="flex-1 flex flex-col justify-start">
                              <h3 className="text-base font-medium">{item.product.name}</h3>
                              <p className="text-sm text-gray-500 mt-1 mb-3">Size: M</p>

                              <div className="flex items-baseline gap-3">
                                {item.product.discount ? (
                                  <>
                                    <span className="text-sm text-gray-500 line-through">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                                    <span className="text-lg font-bold">₹{((item.product.price - item.product.discount) * item.quantity).toLocaleString()}</span>
                                    <span className="text-sm text-green-600 font-medium tracking-wide">{item.product.discount * item.quantity} Off</span>
                                  </>
                                ) : (
                                  <span className="text-lg font-bold">₹{(item.product.price * item.quantity).toLocaleString()}</span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm font-medium self-start whitespace-nowrap">
                              Qty : {item.quantity}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] p-4 px-8 sticky bottom-0 z-10">
                        <div className="text-sm font-medium text-gray-700">
                          Order confirmation email will be sent to <br /><span className="font-bold text-gray-900">{address.email || address.phone}</span>
                        </div>
                        <button onClick={handleNextStep} className="bg-[#fb641b] text-white px-14 py-3.5 uppercase font-medium text-base rounded shadow-sm hover:bg-[#e05615] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#fb641b]">
                          Continue
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Step 3: Payment */}
            <div className="bg-white rounded-sm overflow-hidden">
              <div className={`px-6 py-4 flex items-center gap-4 transition-colors ${step === 3 ? 'bg-primary text-primary-foreground' : 'bg-white text-gray-400'}`}>
                <span className={`w-6 h-6 flex items-center justify-center text-xs font-semibold rounded-sm transition-colors ${step === 3 ? 'bg-primary-foreground text-primary' : 'bg-gray-100 text-gray-400'}`}>
                  3
                </span>
                <h2 className={`text-sm tracking-widest uppercase font-bold ${step < 3 ? 'text-gray-400' : 'text-current'}`}>Payment Options</h2>
              </div>

              <AnimatePresence>
                {step === 3 && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-white">
                    <form onSubmit={handleSubmit} className="p-0">
                      <div className="flex flex-col md:flex-row border-t border-gray-100">
                        {/* Payment Sidebar area */}
                        <div className="w-full md:w-1/3 bg-gray-50/50 border-r border-gray-200 flex flex-col">

                          <button type="button" onClick={() => setPaymentMethod("gpay")} className={`w-full text-left px-6 py-5 text-sm font-medium border-l-4 transition-colors ${paymentMethod === "gpay" ? "bg-white border-primary text-primary shadow-sm z-10" : "border-transparent text-gray-600 hover:bg-gray-100"}`}>
                            <div className="flex items-center gap-3">
                              <Smartphone size={18} />
                              Google Pay
                            </div>
                          </button>
                          <button type="button" onClick={() => setPaymentMethod("phonepe")} className={`w-full text-left px-6 py-5 text-sm font-medium border-l-4 transition-colors ${paymentMethod === "phonepe" ? "bg-white border-primary text-primary shadow-sm z-10" : "border-transparent text-gray-600 hover:bg-gray-100"}`}>
                            <div className="flex items-center gap-3">
                              <Smartphone size={18} />
                              PhonePe
                            </div>
                          </button>
                        </div>
                        {/* Selected Payment Detail area */}
                        <div className="w-full md:w-2/3 p-8 min-h-[350px] bg-white relative">
                          <div className="space-y-6 animate-in fade-in zoom-in duration-300">
                            <div className="space-y-4">
                              <label className="block text-sm font-semibold text-gray-700">Enter UPI ID</label>
                              <input
                                required
                                type="text"
                                placeholder="example@upi"
                                value={upiId}
                                onChange={(e) => setUpiId(e.target.value)}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm transition-colors"
                              />
                            </div>

                            <div className="space-y-4">
                              <label className="block text-sm font-semibold text-gray-700">Payment proof by uploading screenshots</label>
                              <div className="relative">
                                <input
                                  required
                                  type="file"
                                  accept="image/*"
                                  onChange={handleScreenshotChange}
                                  className="hidden"
                                  id="screenshot-upload"
                                />
                                <label
                                  htmlFor="screenshot-upload"
                                  className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-primary focus:outline-none"
                                >
                                  {screenshotPreview ? (
                                    <div className="relative w-full h-full p-2">
                                      <img src={screenshotPreview} alt="Preview" className="w-full h-full object-contain" />
                                    </div>
                                  ) : (
                                    <span className="flex items-center space-x-2">
                                      <Upload size={20} className="text-gray-400" />
                                      <span className="font-medium text-gray-600">
                                        Click to upload screenshot
                                      </span>
                                    </span>
                                  )}
                                </label>
                              </div>
                            </div>

                            <button type="submit" disabled={processing} className="w-full bg-[#fb641b] text-white px-12 py-4 uppercase font-medium text-base rounded shadow-sm hover:bg-[#e05615] transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-[#fb641b] disabled:opacity-70">
                              {processing ? "Processing..." : "SUBMIT"}
                            </button>
                          </div>

                          <div className="absolute bottom-8 right-8 flex items-center gap-2 text-xs text-gray-500 font-medium">
                            <ShieldCheck size={16} className="text-green-600" />
                            100% Secure
                          </div>
                        </div>
                      </div>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* Price Details Sidebar (Flipkart Style) */}
          <div className="w-full lg:w-[320px] shrink-0">
            <div className="bg-white rounded-sm shadow-sm sticky top-28 divide-y divide-gray-100">
              <h3 className="px-6 py-4 uppercase font-bold text-gray-500 text-sm tracking-wide">
                Price Details
              </h3>
              <div className="p-6 space-y-5">
                <div className="flex justify-between text-sm">
                  <span>Price ({items.length} items)</span>
                  <span>₹{originalTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount</span>
                  <span className="text-green-600">- ₹{totalProductDiscount.toLocaleString()}</span>
                </div>
                
                {/* Coupon Section */}
                <div className="pt-2">
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="Enter Coupon Code" 
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 px-3 py-2 border border-border text-xs focus:outline-none focus:border-primary uppercase"
                      />
                      <button 
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponInput.trim()}
                        className="bg-primary text-primary-foreground px-4 py-2 text-[10px] font-bold tracking-widest uppercase hover:bg-primary/90 disabled:opacity-50 transition-colors"
                      >
                        {isApplyingCoupon ? "..." : "Apply"}
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center bg-green-50 p-2 border border-green-100 rounded-sm">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-green-700 uppercase tracking-widest">{appliedCoupon.code}</span>
                        <span className="text-[9px] text-green-600">Coupon Applied Successfully</span>
                      </div>
                      <button onClick={removeCoupon} className="text-muted-foreground hover:text-destructive p-1">
                        <Check size={14} className="text-green-600" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-sm">
                  <span>Coupons for you</span>
                  <span className="text-green-600">- ₹{couponDiscountAmount.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Charges</span>
                  <span className="text-green-600">Free</span>
                </div>

                <div className="border-t border-dashed border-gray-300 pt-5 flex justify-between font-bold text-lg">
                  <span>Total Amount</span>
                  <span>₹{finalPrice.toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
                </div>

                <div className="pt-2 text-green-700 text-sm font-bold tracking-wide">
                  You will save ₹{(totalProductDiscount + couponDiscountAmount).toLocaleString(undefined, {maximumFractionDigits: 0})} on this order
                </div>
              </div>
            </div>

            {/* Trust badge */}
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500 font-medium p-4 text-center">
              <ShieldCheck size={20} className="text-gray-400" />
              Safe and Secure Payments. Easy returns. 100% Authentic products.
            </div>
          </div>

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
