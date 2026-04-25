import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ExternalLink, Star } from "lucide-react";

const FindUs = () => {
  const shopAddress = "45, Madhavaram High Rd, opposite to Navins Apartment, Moolakadai, Perambur, Chennai, Tamil Nadu 600060";
  const mapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.343564177651!2d80.24430047587846!3d13.140801811166723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52650058b757e7%3A0xf6398014876b5c2a!2s45%2C%20Madhavaram%20High%20Rd%2C%20Moolakadai%2C%20Kodungaiyur%2C%20Chennai%2C%20Tamil%20Nadu%20600060!5e0!3m2!1sen!2sin!4v1713783456789!5m2!1sen!2sin`;

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-heading text-4xl md:text-6xl font-bold mb-4 text-[#1A1F2C]"
          >
            Find Us
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground font-body text-lg"
          >
            Visit our showroom to experience our premium collections in person.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Info Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-[#F8F9FA] p-8 rounded-3xl border border-gray-100 flex flex-col gap-6"
            >
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <MapPin className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Address</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {shopAddress}
                  </p>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopAddress)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-primary text-sm font-bold mt-3 hover:underline"
                  >
                    Get Directions <ExternalLink size={14} />
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Phone className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Contact</h4>
                  <p className="text-muted-foreground text-sm">
                    +91 72001 90940
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center shrink-0">
                  <Clock className="text-primary" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Business Hours</h4>
                  <div className="flex justify-between gap-8 text-sm">
                    <span className="text-muted-foreground">Mon - Sun</span>
                    <span className="font-bold">10:00 AM - 10:00 PM</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-[#F8F9FA] p-8 rounded-3xl border border-gray-100"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl font-bold">4.9</div>
                <div>
                  <div className="flex text-yellow-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">7 Google Reviews</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Map Area */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="lg:col-span-8 relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white min-h-[500px]"
          >
            <iframe
              src={mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>
            
            {/* Custom Map Overlay Overlay */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h4 className="font-bold text-[#1A1F2C] text-lg">Designz Men's & Kid's</h4>
                <p className="text-muted-foreground text-sm">Moolakadai, Madhavaram, Chennai</p>
              </div>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(shopAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-3 bg-[#1A1F2C] text-white rounded-xl font-bold text-sm hover:bg-[#2D3446] transition-all shadow-lg"
              >
                Open Maps
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FindUs;
