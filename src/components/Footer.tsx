const Footer = () => (
  <footer className="py-16 px-6 border-t border-border">
    <div className="container mx-auto">
      <div className="grid md:grid-cols-4 gap-10 mb-12">
        <div>
          <h3 className="font-heading text-xl font-bold tracking-wider mb-4">ÉLEVE</h3>
          <p className="text-muted-foreground font-body text-sm leading-relaxed">
            Where timeless craftsmanship meets contemporary elegance.
          </p>
        </div>
        <div>
          <h4 className="font-heading text-sm tracking-widest mb-4">SHOP</h4>
          <div className="space-y-2 text-sm text-muted-foreground font-body">
            <p>Men</p><p>Women</p><p>New Arrivals</p><p>Sale</p>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm tracking-widest mb-4">HELP</h4>
          <div className="space-y-2 text-sm text-muted-foreground font-body">
            <p>Contact Us</p><p>Shipping</p><p>Returns</p><p>FAQ</p>
          </div>
        </div>
        <div>
          <h4 className="font-heading text-sm tracking-widest mb-4">CONNECT</h4>
          <div className="space-y-2 text-sm text-muted-foreground font-body">
            <p>Instagram</p><p>Twitter</p><p>Pinterest</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-8 text-center text-xs text-muted-foreground font-body">
        © 2026 ÉLEVE. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
