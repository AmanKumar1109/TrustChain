import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';

export default function HeroControls() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [0, 1, 2, 3];

  return (
    <div className="relative z-20 w-full px-6 md:px-12 lg:px-16 flex items-end justify-between select-none">
      
      {/* Bottom Left: Scroll Down Indicator */}
      <button
        type="button"
        onClick={() => {
          window.scrollBy({ top: 300, behavior: 'smooth' });
        }}
        className="group flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-200 cursor-pointer"
        aria-label="Scroll down to explore"
      >
        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-black transition-transform duration-200 group-hover:translate-y-0.5">
          <ArrowDown className="w-3 h-3 stroke-[2.5]" />
        </div>
        <span className="text-[12px] font-mono text-zinc-400 group-hover:text-zinc-200 transition-colors">
          02/03 . Scroll down
        </span>
      </button>

      {/* Bottom Right: DeFi horizons Carousel Indicator */}
      <div className="flex flex-col items-end gap-2">
        <span className="text-[13px] font-medium tracking-wide text-[#d4b35e]">
          DeFi horizons
        </span>
        
        {/* Dash Indicators */}
        <div className="flex items-center gap-1.5">
          {slides.map((index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === index
                  ? 'w-6 bg-white shadow-[0_0_8px_rgba(255,255,255,0.6)]'
                  : 'w-6 bg-white/20 hover:bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
