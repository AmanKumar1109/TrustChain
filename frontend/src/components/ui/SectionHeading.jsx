import React from 'react';

export default function SectionHeading({ badge, title, subtitle, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left items-start' : 'text-center items-center';

  return (
    <div className={`flex flex-col ${alignClass} mb-12 md:mb-16 max-w-3xl ${align === 'center' ? 'mx-auto' : ''}`}>
      {badge && (
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-zinc-400 text-xs font-mono tracking-wide uppercase mb-4 backdrop-blur-md shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-white/50 animate-pulse" />
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.15] mb-4">
          {title}
        </h2>
      )}

      {subtitle && (
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
