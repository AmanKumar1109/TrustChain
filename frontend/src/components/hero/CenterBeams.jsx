import React from 'react';

export default function CenterBeams() {
  const beams = [
    { id: 1, left: 'calc(50% - 24px)', height: '85px', delay: '0s', opacity: '0.85' },
    { id: 2, left: 'calc(50% - 4px)', height: '145px', delay: '0.4s', opacity: '0.95' },
    { id: 3, left: 'calc(50% + 18px)', height: '110px', delay: '0.8s', opacity: '0.9' },
    { id: 4, left: 'calc(50% + 38px)', height: '65px', delay: '0.2s', opacity: '0.75' },
  ];

  return (
    <div className="relative w-full h-40 pointer-events-none select-none flex justify-center items-start overflow-visible">
      {beams.map((beam) => (
        <div
          key={beam.id}
          className="absolute top-0 flex flex-col items-center animate-beam-pulse"
          style={{
            left: beam.left,
            animationDelay: beam.delay,
          }}
        >
          {/* Glowing Head Bead — pure white */}
          <div 
            className="w-[2px] h-[3px] rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_14px_rgba(255,255,255,0.6)]"
          />
          {/* Vertical Laser Beam — white gradient */}
          <div
            className="w-[1.5px] rounded-full"
            style={{
              height: beam.height,
              background: 'linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.55) 25%, rgba(255,255,255,0.2) 60%, transparent 100%)',
              boxShadow: '0 0 6px rgba(255,255,255,0.25)',
            }}
          />
        </div>
      ))}
    </div>
  );
}
