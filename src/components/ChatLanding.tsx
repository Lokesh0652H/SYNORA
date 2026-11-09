'use client';

import React from 'react';
import AsciiSharkMotion from '@/components/AsciiSharkMotion';

export default function ChatLanding() {
  return (
    <div className="relative w-full h-full min-h-[440px] flex flex-col items-center justify-center text-center overflow-hidden select-none">
      {/* Background Multi-creature ASCII motion */}
      <AsciiSharkMotion className="opacity-90" />

      {/* Foreground Stacked Typography */}
      <div className="relative z-10 px-6 max-w-lg">
        <div className="text-[10px] font-mono tracking-widest text-[#8C8E85] uppercase mb-3">
          Research Notebook · Verified Citations
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-normal text-[#1E201D] tracking-tight leading-tight mb-3">
          what’s on your mind?
        </h2>
        <p className="text-xs sm:text-sm text-[#7A7C75] max-w-md mx-auto leading-relaxed">
          Ask questions across your uploaded sources. Every synthesized answer maps directly back to the original page.
        </p>
      </div>
    </div>
  );
}
