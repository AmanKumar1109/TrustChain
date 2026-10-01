import React from 'react';

export default function PartnersBar() {
  return (
    <footer className="relative z-20 w-full pb-8 pt-4 px-6 md:px-12 lg:px-16">
      <div className="w-full flex flex-wrap items-center justify-center md:justify-between gap-6 md:gap-8 text-zinc-500">
        
        {/* Vercel */}
        <div className="flex items-center gap-2 text-zinc-400/80 hover:text-zinc-200 transition-colors cursor-pointer select-none">
          <svg className="w-4 h-4 fill-current" viewBox="0 0 1155 1000">
            <path d="m577.3 0 577.4 1000H0z" />
          </svg>
          <span className="text-[15px] font-semibold tracking-tight">Vercel</span>
        </div>

        {/* Loom */}
        <div className="flex items-center gap-2 text-zinc-400/80 hover:text-zinc-200 transition-colors cursor-pointer select-none">
          <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="2" x2="12" y2="22" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
            <line x1="19.07" y1="4.93" x2="4.93" y2="19.07" />
          </svg>
          <span className="text-[15px] font-semibold lowercase tracking-tight">loom</span>
        </div>

        {/* Cash App */}
        <div className="flex items-center gap-2 text-zinc-400/80 hover:text-zinc-200 transition-colors cursor-pointer select-none">
          <div className="w-4 h-4 rounded-[4px] border border-current flex items-center justify-center text-[10px] font-bold">
            $
          </div>
          <span className="text-[14px] font-semibold tracking-tight">Cash App</span>
        </div>

        {/* Loops */}
        <div className="flex items-center gap-2 text-zinc-400/80 hover:text-zinc-200 transition-colors cursor-pointer select-none">
          <svg className="w-4 h-4 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <circle cx="12" cy="12" r="4.5" />
          </svg>
          <span className="text-[15px] font-medium tracking-tight">Loops</span>
        </div>

        {/* Zapier */}
        <div className="flex items-center gap-1.5 text-zinc-400/80 hover:text-zinc-200 transition-colors cursor-pointer select-none">
          <span className="text-[16px] font-bold">_</span>
          <span className="text-[15px] font-semibold lowercase tracking-tight">zapier</span>
        </div>

        {/* Ramp */}
        <div className="flex items-center gap-2 text-zinc-400/80 hover:text-zinc-200 transition-colors cursor-pointer select-none">
          <span className="text-[15px] font-bold lowercase tracking-tight">ramp</span>
          <svg className="w-3.5 h-3.5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M4 20C10 20 18 18 20 4" />
          </svg>
        </div>

        {/* Raycast */}
        <div className="flex items-center gap-2 text-zinc-400/80 hover:text-zinc-200 transition-colors cursor-pointer select-none">
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
          </svg>
          <span className="text-[14.5px] font-medium tracking-tight">Raycast</span>
        </div>

      </div>
    </footer>
  );
}
