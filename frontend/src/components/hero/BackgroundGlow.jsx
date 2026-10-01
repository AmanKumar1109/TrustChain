import React from 'react';

export default function BackgroundGlow() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none" aria-hidden="true">
      
      {/* Top Right White Aurora Glow */}
      <div
        className="absolute -top-[10%] right-[-10%] w-[680px] h-[680px] rounded-full opacity-20 animate-pulse-glow"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(200,200,200,0.08) 45%, transparent 75%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Secondary Top Right Ambient Soft White Light */}
      <div
        className="absolute top-[5%] right-[15%] w-[380px] h-[380px] rounded-full opacity-15"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
          filter: 'blur(75px)',
        }}
      />

      {/* Bottom Left Subtle White Haze */}
      <div
        className="absolute bottom-[-10%] left-[-5%] w-[480px] h-[480px] rounded-full opacity-12"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Center Subtle Atmosphere */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] rounded-full opacity-8"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Cosmic Stardust Particles — white only */}
      <div className="absolute inset-0">
        <span className="absolute top-[22%] left-[28%] w-1 h-1 bg-white/40 rounded-full animate-twinkle" style={{ animationDelay: '0.2s' }} />
        <span className="absolute top-[35%] left-[18%] w-0.5 h-0.5 bg-white/50 rounded-full animate-twinkle" style={{ animationDelay: '1.4s' }} />
        <span className="absolute top-[68%] left-[25%] w-1 h-1 bg-white/30 rounded-full animate-twinkle" style={{ animationDelay: '0.8s' }} />
        <span className="absolute top-[75%] left-[34%] w-0.5 h-0.5 bg-white/40 rounded-full" />
        <span className="absolute top-[18%] right-[32%] w-1 h-1 bg-white/50 rounded-full animate-twinkle" style={{ animationDelay: '2.1s' }} />
        <span className="absolute top-[42%] right-[22%] w-0.5 h-0.5 bg-white/35 rounded-full animate-twinkle" style={{ animationDelay: '1.1s' }} />
        <span className="absolute top-[65%] right-[28%] w-1 h-1 bg-white/40 rounded-full animate-twinkle" style={{ animationDelay: '3.2s' }} />
        <span className="absolute top-[82%] right-[38%] w-0.5 h-0.5 bg-white/30 rounded-full" />
        <span className="absolute top-[48%] left-[45%] w-0.5 h-0.5 bg-white/25 rounded-full" />
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(6,7,9,0.65) 100%)' }} />
    </div>
  );
}
