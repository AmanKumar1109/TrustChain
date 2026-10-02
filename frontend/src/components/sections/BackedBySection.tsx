import React from 'react';
import { BACKER_BRANDS } from '../../constants/backers';

export const BackedBySection: React.FC = () => {
  return (
    <section className="bg-[#F5F5F5] px-6 py-14 border-t border-b border-black/5">
      <div className="max-w-[88rem] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 items-center">
        {/* Left column (1/4) */}
        <div className="md:col-span-1">
          <p className="text-black/70 text-base leading-relaxed whitespace-pre-line">
            {'Backed by global standards\nand industry leaders.'}
          </p>
        </div>

        {/* Right column (3/4): Infinite Marquee */}
        <div className="md:col-span-3 overflow-hidden relative">
          <style>
            {`
              @keyframes backers-marquee {
                0% { transform: translateX(0); }
                100% { transform: translateX(-50%); }
              }
              .backers-track {
                display: flex;
                width: max-content;
                animation: backers-marquee 30s linear infinite;
              }
              .backers-track:hover {
                animation-play-state: paused;
              }
            `}
          </style>

          <div className="backers-track" aria-label="Backed by Global Standards and Partners">
            {/* First sequence */}
            {BACKER_BRANDS.map((item, idx) => (
              <div
                key={`backer-1-${item.id}-${idx}`}
                className="mx-10 shrink-0 text-black/50 whitespace-nowrap select-none"
                style={item.style}
              >
                {item.name}
              </div>
            ))}
            {/* Second sequence for seamless loop */}
            {BACKER_BRANDS.map((item, idx) => (
              <div
                key={`backer-2-${item.id}-${idx}`}
                className="mx-10 shrink-0 text-black/50 whitespace-nowrap select-none"
                style={item.style}
                aria-hidden="true"
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BackedBySection;
