import { useState } from "react";
import { SupportModal } from "./SupportModal";

const Footer = () => {
  const [supportOpen, setSupportOpen] = useState(false);

  return (
    <footer className="py-16 px-6 border-t border-border">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <h3 className="font-heading text-lg font-bold tracking-wider mb-4">Eleve</h3>
            <p className="text-muted-foreground font-body text-sm leading-relaxed">
              Where timeless craftsmanship meets contemporary elegance.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-sm tracking-widest mb-4">SHOP</h4>
            <div className="space-y-2 text-sm text-muted-foreground font-body flex flex-col items-start">
              <button className="hover:text-foreground transition-colors">Men</button>
              <button className="hover:text-foreground transition-colors">Women</button>
              <button className="hover:text-foreground transition-colors">New Arrivals</button>
              <button className="hover:text-foreground transition-colors">Sale</button>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm tracking-widest mb-4">HELP</h4>
            <div className="space-y-2 text-sm text-muted-foreground font-body flex flex-col items-start">
              <button onClick={() => setSupportOpen(true)} className="hover:text-foreground transition-colors">Contact Support / Report Issue</button>
              <button className="hover:text-foreground transition-colors">Shipping</button>
              <button className="hover:text-foreground transition-colors">Returns</button>
              <button className="hover:text-foreground transition-colors">FAQ</button>
            </div>
          </div>
          <div>
            <h4 className="font-heading text-sm tracking-widest mb-4">CONNECT</h4>
            <div className="space-y-2 text-sm text-muted-foreground font-body flex flex-col items-start">
              <button className="hover:text-foreground transition-colors">Instagram</button>
              <button className="hover:text-foreground transition-colors">Twitter</button>
              <button className="hover:text-foreground transition-colors">Pinterest</button>
              <p className="pt-4 text-foreground mt-4 border-t border-border/50 text-left w-full">Location: Moolakadai, Madhavaram</p>
            </div>
          </div>
        </div>
        <div className="border-t border-border pt-8 text-center text-xs text-muted-foreground font-body">
          © 2026 Eleve. All rights reserved.
        </div>
      </div>
      <SupportModal isOpen={supportOpen} onClose={() => setSupportOpen(false)} />
    </footer>
  );
};

export default Footer;
