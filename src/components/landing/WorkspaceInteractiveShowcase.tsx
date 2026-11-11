'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  Send,
  Plus,
  Mic,
  FileText,
  Sparkles,
  CheckCircle2,
  Info,
  CornerDownLeft,
  Search,
} from 'lucide-react';
import AsciiSharkMotion from '@/components/AsciiSharkMotion';

export default function WorkspaceInteractiveShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(null);
  const [composerInput, setComposerInput] = useState('');
  const [simulatedAnswer, setSimulatedAnswer] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotX(-y * 8);
    setRotY(x * 12);
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
  };

  const handleRunPrompt = (query: string) => {
    setComposerInput(query);
    setSimulatedAnswer(
      'According to trial protocol Section 4.2 [^1], the investigators utilized a double-blind, randomized crossover design across 412 patients, demonstrating an 89.4% sustained response rate.'
    );
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative select-none transition-transform duration-300 ease-out"
      style={{
        perspective: '1200px',
      }}
    >
      {/* Floating 3D Document Objects in Orbit around the workspace */}
      <div className="absolute -top-4 -left-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-[#DEDAD0] shadow-md text-xs font-mono text-[#20201D] animate-float-gentle">
        <FileText className="w-3.5 h-3.5 text-[#858875]" />
        <span>Phase_III_Trial.pdf</span>
        <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-1 rounded">
          Indexed
        </span>
      </div>

      <div className="absolute -bottom-4 -right-4 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 border border-[#DEDAD0] shadow-md text-xs font-mono text-[#20201D] animate-float-gentle" style={{ animationDelay: '1.5s' }}>
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>Vector Chunk #812 (Cosine 0.94)</span>
      </div>

      {/* Main Workspace Frame with Dynamic 3D Tilt */}
      <div
        className="rounded-2xl border border-[#DEDAD0] bg-[#FAF8F5] shadow-2xl overflow-hidden relative transition-transform duration-200"
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
        }}
      >
        {/* Top Window Header */}
        <div className="h-10 bg-[#EFEBE2] border-b border-[#DEDAD0] px-4 flex items-center justify-between text-xs text-[#55534E]">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-[#20201D] text-[8px] text-white flex items-center justify-center font-bold">
              ■
            </div>
            <span className="font-serif font-bold text-xs text-[#20201D]">SYNORA</span>
            <span className="opacity-40">/</span>
            <span className="font-mono text-[11px] text-[#77756E]">Workspace</span>
            <span className="opacity-40">/</span>
            <span className="font-mono text-[11px] text-[#20201D] font-medium">Dashboard</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono">
            <span className="inline-flex items-center gap-1.5 text-[#2D5A43]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>DETERMINISTIC RETRIEVAL</span>
            </span>
            <span className="text-[#8A877D] hidden sm:inline">All Workspaces</span>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="grid grid-cols-12 min-h-[380px]">
          {/* Mini Sidebar */}
          <div className="hidden sm:block sm:col-span-3 border-r border-[#E5E0D5] p-3 text-[11px] space-y-4 bg-[#F5F2EA]/60">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-[#8A877D] px-2 mb-1">
                WORKSPACE
              </div>
              <div className="space-y-0.5">
                <div className="px-2 py-1.5 rounded bg-[#20201D] text-[#FBFAF6] font-medium">
                  Overview
                </div>
                <div className="px-2 py-1.5 rounded text-[#55534E] hover:bg-[#EAE6DC]">
                  All notebooks
                </div>
              </div>
            </div>

            <div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-[#8A877D] px-2 mb-1">
                NOTEBOOKS (2)
              </div>
              <div className="space-y-0.5">
                <div className="px-2 py-1 rounded text-[#55534E] hover:bg-[#EAE6DC] truncate">
                  Notebook: Research
                </div>
                <div className="px-2 py-1 rounded text-[#55534E] hover:bg-[#EAE6DC] truncate font-medium">
                  ML
                </div>
              </div>
            </div>

            <div className="pt-8 text-[10px] text-[#8A877D] px-2">
              <div className="flex items-center gap-1.5 text-[#20201D] font-medium">
                <span className="w-4 h-4 rounded-full bg-[#20201D] text-white flex items-center justify-center text-[9px]">
                  N
                </span>
                <span>Research Studio</span>
              </div>
            </div>
          </div>

          {/* Main Area with Creature Simulation & Prompt Hero */}
          <div className="col-span-12 sm:col-span-9 p-6 relative flex flex-col justify-between bg-[#FAF8F5]">
            {/* Top Workspace Controls */}
            <div className="flex items-center justify-between text-xs mb-3">
              <div className="px-2.5 py-1 rounded-full bg-[#EFEBE2] border border-[#DEDAD0] text-[11px] font-mono text-[#5A554A]">
                History ⌵
              </div>
              <Link
                href="/dashboard"
                className="px-3 py-1 rounded-full bg-[#20201D] text-[#FBFAF6] text-[11px] font-mono hover:bg-black transition-colors"
              >
                + New notebook
              </Link>
            </div>

            {/* Central Animated ASCII Creature & "what's on your mind?" */}
            <div className="relative my-4 text-center">
              {/* The preserved animated periodic-table ASCII fish */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
                <AsciiSharkMotion />
              </div>

              <div className="relative z-10 py-6">
                <h3 className="font-serif text-3xl sm:text-4xl text-[#20201D] font-normal tracking-tight">
                  what’s on your mind?
                </h3>
              </div>
            </div>

            {/* Simulated Answer Reveal if user clicked sample prompt */}
            {simulatedAnswer && (
              <div className="mb-3 p-3 rounded-xl bg-white border border-[#E5E0D5] text-xs space-y-1 shadow-xs animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8A877D]">
                  <span className="text-[#2D5A43] font-bold">Grounded Answer · 1 Citation</span>
                  <span>gemini-2.5-flash</span>
                </div>
                <p className="text-[#20201D] leading-relaxed font-sans">{simulatedAnswer}</p>
              </div>
            )}

            {/* Quick Sample Prompts */}
            <div className="flex flex-wrap gap-1.5 mb-2">
              {[
                'What was the primary trial methodology?',
                'Identify conflicting claims',
                'Generate active flashcards',
              ].map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleRunPrompt(q)}
                  className="px-2.5 py-1 rounded-full bg-[#EFEBE2] hover:bg-[#20201D] hover:text-white text-[10px] font-mono text-[#55534E] transition-colors cursor-pointer"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Floating Prompt Bar */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-2.5 shadow-md flex items-center gap-3">
              <span className="text-[#8A877D] hover:text-[#20201D] cursor-pointer">
                <Plus className="w-4 h-4" />
              </span>
              <span className="text-[#8A877D] hover:text-[#20201D] cursor-pointer">
                <Mic className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Ask Synora anything..."
                value={composerInput}
                onChange={(e) => setComposerInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRunPrompt(composerInput || 'What was the primary trial methodology?');
                  }
                }}
                className="flex-1 bg-transparent text-xs text-[#20201D] placeholder-[#A09D94] outline-none"
              />
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-[#8A877D]">
                <span>↵ send</span>
                <span>⇧↵ newline</span>
              </div>
              <button
                onClick={() =>
                  handleRunPrompt(composerInput || 'What was the primary trial methodology?')
                }
                className="w-7 h-7 rounded-lg bg-[#20201D] text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
