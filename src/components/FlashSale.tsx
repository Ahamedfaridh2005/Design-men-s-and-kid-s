import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Zap, ArrowRight, Clock } from "lucide-react";

export const FlashSale = () => {
  // Setup functional countdown timer (Targeting 47h 40m remaining from mockup, but we'll make it dynamic from 48h)
  const [timeLeft, setTimeLeft] = useState(() => {
    return 48 * 60 * 60 - 2000; // 48 hours minus some random seconds
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return {
      hours: hours.toString().padStart(2, '0'),
      minutes: minutes.toString().padStart(2, '0'),
      seconds: seconds.toString().padStart(2, '0')
    };
  };

  const time = formatTime(timeLeft);

  return (
    <div className="w-full bg-[#111] border-b border-border/10 relative overflow-hidden group py-10 md:py-12">
      {/* Subtle diagonal background texture/pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(45deg, #222 25%, transparent 25%, transparent 50%, #222 50%, #222 75%, transparent 75%, transparent)',
          backgroundSize: '10px 10px'
        }}
      ></div>
      
      {/* Soft central glow behind text */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#D4AF37]/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col xl:flex-row items-center justify-between gap-10 xl:gap-8">
          
          {/* Left Column: Text & Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8 max-w-2xl">
            <div className="w-12 h-12 rounded-full bg-[#f6a018] flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(246,160,24,0.3)]">
              <Zap size={22} className="text-white fill-white" />
            </div>
            <div>
              <div className="text-[#D4AF37] text-[10px] sm:text-xs font-heading font-extrabold tracking-[0.25em] uppercase mb-3">
                Limited Time Promo
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-[42px] text-white font-medium mb-3 tracking-wide" style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic' }}>
                Flash Sale <span className="text-white/60 mx-1">—</span> Up to 30% off
              </h2>
              <p className="text-gray-400 font-body text-sm sm:text-base">
                Selected styles. While stocks last. Elevate your wardrobe instantly.
              </p>
            </div>
          </div>

          {/* Right Column: Timer & CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-8 lg:gap-16">
            
            {/* Timer Block */}
            <div className="flex items-center gap-4 sm:gap-6 text-white text-center">
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl lg:text-[40px] font-heading font-light tracking-tight">{time.hours}</span>
                <span className="text-[9px] text-[#D4AF37] tracking-widest font-heading uppercase mt-1">Hours</span>
              </div>
              <span className="text-xl text-gray-600 mb-4">:</span>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl lg:text-[40px] font-heading font-light tracking-tight">{time.minutes}</span>
                <span className="text-[9px] text-[#D4AF37] tracking-widest font-heading uppercase mt-1">Mins</span>
              </div>
              <span className="text-xl text-gray-600 mb-4">:</span>
              <div className="flex flex-col">
                <span className="text-3xl sm:text-4xl lg:text-[40px] font-heading font-light tracking-tight">{time.seconds}</span>
                <span className="text-[9px] text-[#D4AF37] tracking-widest font-heading uppercase mt-1">Secs</span>
              </div>
              <div className="hidden lg:flex items-center gap-2 ml-6 text-gray-500 text-[10px] tracking-widest uppercase font-heading">
                <Clock size={12} />
                Remaining
              </div>
            </div>

            {/* Product Preview Thumbnails & Button */}
            <div className="flex items-center gap-6">
              <div className="hidden md:flex items-center -space-x-2">
                <div className="w-12 h-14 bg-gray-800 border border-gray-700/50 object-cover z-30 shadow-lg brightness-90 filter hover:brightness-110 transition-all flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=100&q=80" alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-14 bg-gray-800 border border-gray-700/50 object-cover z-20 shadow-lg brightness-75 filter hover:brightness-100 transition-all flex items-center justify-center overflow-hidden">
                  <img src="https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=100&q=80" alt="Product" className="w-full h-full object-cover" />
                </div>
                <div className="w-12 h-14 bg-gray-900 border border-gray-700/50 z-10 flex items-center justify-center shadow-lg group-hover:bg-[#f6a018]/10 transition-colors">
                  <span className="text-[10px] text-gray-400 font-heading">+4</span>
                </div>
              </div>

              <Link 
                to="/shop" 
                className="bg-[#f6a018] text-white font-heading text-xs sm:text-sm tracking-[0.2em] uppercase font-bold px-8 sm:px-10 py-4 shadow-[0_4px_14px_rgba(246,160,24,0.3)] hover:shadow-[0_6px_20px_rgba(246,160,24,0.4)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
              >
                Shop Sale
                <ArrowRight size={16} />
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
