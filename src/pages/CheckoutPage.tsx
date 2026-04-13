import { useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import { CreditCard, Smartphone } from "lucide-react";
import Footer from "@/components/Footer";

const CheckoutPage = () => {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [processing, setProcessing] = useState(false);
  const [address, setAddress] = useState({ name: "", email: "", street: "", city: "", zip: "", phone: "" });
  const [card, setCard] = useState({ number: "", expiry: "", cvv: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      clearCart();
      navigate("/order-success");
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <p className="text-muted-foreground font-body text-lg">Your bag is empty</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28">
      <div className="container mx-auto px-6 py-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-heading text-3xl md:text-4xl font-bold mb-10"
        >
          Checkout
        </motion.h1>

        <form onSubmit={handleSubmit} className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            {/* Address */}
            <div>
              <h2 className="font-heading text-sm tracking-widest mb-4">SHIPPING ADDRESS</h2>
              <div className="grid gap-4">
                {(["name", "email", "phone", "street", "city", "zip"] as const).map((field) => (
                  <input
                    key={field}
                    required
                    type={field === "email" ? "email" : "text"}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={address[field]}
                    onChange={(e) => setAddress({ ...address, [field]: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-sm focus:outline-none focus:border-accent transition-colors"
                  />
                ))}
              </div>
            </div>

            {/* Payment */}
            <div>
              <h2 className="font-heading text-sm tracking-widest mb-4">PAYMENT METHOD</h2>
              <div className="flex gap-3 mb-6">
                {[
                  { id: "card", label: "Card", icon: CreditCard },
                  { id: "gpay", label: "GPay", icon: Smartphone },
                  { id: "phonepe", label: "PhonePe", icon: Smartphone },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setPaymentMethod(id)}
                    className={`flex items-center gap-2 px-5 py-3 rounded-lg text-sm font-heading tracking-wide transition-all ${
                      paymentMethod === id
                        ? "bg-primary text-primary-foreground"
                        : "border border-border hover:border-accent"
                    }`}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>

              {paymentMethod === "card" && (
                <div className="grid gap-4">
                  <input
                    required
                    placeholder="Card Number"
                    value={card.number}
                    onChange={(e) => setCard({ ...card, number: e.target.value })}
                    className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-sm focus:outline-none focus:border-accent"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      required
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={(e) => setCard({ ...card, expiry: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-sm focus:outline-none focus:border-accent"
                    />
                    <input
                      required
                      placeholder="CVV"
                      value={card.cvv}
                      onChange={(e) => setCard({ ...card, cvv: e.target.value })}
                      className="w-full px-4 py-3 bg-card border border-border rounded-lg font-body text-sm focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>
              )}

              {paymentMethod !== "card" && (
                <div className="p-6 bg-secondary rounded-lg text-center">
                  <p className="text-muted-foreground font-body text-sm">
                    You'll be redirected to {paymentMethod === "gpay" ? "Google Pay" : "PhonePe"} to complete payment.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-card border border-border rounded-xl p-6 sticky top-28">
              <h2 className="font-heading text-sm tracking-widest mb-6">ORDER SUMMARY</h2>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.product.id} className="flex gap-4">
                    <img src={item.product.image} alt={item.product.name} className="w-16 h-20 object-cover rounded-lg" />
                    <div className="flex-1">
                      <p className="font-heading text-sm font-semibold">{item.product.name}</p>
                      <p className="text-muted-foreground text-xs font-body">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-heading text-sm">₹{(item.product.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between text-sm font-body text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-body text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-heading text-lg font-bold pt-2 border-t border-border">
                  <span>Total</span>
                  <span>₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={processing}
                className="w-full mt-6 py-3.5 bg-primary text-primary-foreground font-heading text-sm tracking-widest hover:bg-primary/90 transition-all rounded-lg disabled:opacity-50"
              >
                {processing ? "PROCESSING..." : "PLACE ORDER"}
              </button>
            </div>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CheckoutPage;
