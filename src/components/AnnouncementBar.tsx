import { useState } from "react";
import { Sparkles } from "lucide-react";

export const AnnouncementBar = () => {
  const [isHovered, setIsHovered] = useState(false);
  const announcements = [
    "Free Shipping Over $150", 
    "Sustainable Materials", 
    "Crafted in Italy", 
    "New Arrivals Live Now"
  ];

  // Duplicate items to ensure a seamless infinite scroll
  const scrollItems = [...announcements, ...announcements, ...announcements, ...announcements];

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-white/5 py-3 overflow-hidden relative">
      <div 
        className="flex whitespace-nowrap"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className={`flex items-center space-x-12 px-6 animate-marquee ${isHovered ? '[animation-play-state:paused]' : ''}`}
        >
          {scrollItems.map((text, idx) => (
            <div key={idx} className="flex items-center shrink-0">
              <span className="text-[#E5CCA3] font-heading text-[11px] md:text-sm tracking-[0.2em] uppercase font-medium">
                {text}
              </span>
              <Sparkles size={12} className="text-[#E5CCA3]/50 ml-12" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
