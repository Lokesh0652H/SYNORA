'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Network,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ChevronRight,
  Sliders,
  Cpu,
  BookmarkCheck,
} from 'lucide-react';

export default function ResearchJourneyInteractive() {
  const [activeStage, setActiveStage] = useState<1 | 2 | 3>(1);
  const [methodologySlider, setMethodologySlider] = useState<number>(75);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);

  // Auto-cycle through the 3 stages if the user hasn't explicitly interacted
  useEffect(() => {
    if (!autoRotate) return;
    const interval = setInterval(() => {
      setActiveStage((prev) => (prev === 3 ? 1 : ((prev + 1) as 1 | 2 | 3)));
    }, 6000);
    return () => clearInterval(interval);
  }, [autoRotate]);

  const selectStage = (stage: 1 | 2 | 3) => {
    setAutoRotate(false);
    setActiveStage(stage);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-8">
      {/* 1. Stage Selector Pills */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-full bg-[#EAE6DC] border border-[#DEDAD0] max-w-xl mx-auto text-xs font-mono">
        {[
          { id: 1 as const, num: '01', label: 'CONNECT', icon: FileText },
          { id: 2 as const, num: '02', label: 'VERIFY', icon: Network },
          { id: 3 as const, num: '03', label: 'ACT', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStage === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => selectStage(tab.id)}
              className={`flex-1 py-2 px-3 sm:px-4 rounded-full flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#20201D] text-[#FBFAF6] shadow-sm font-semibold'
                  : 'text-[#55534E] hover:text-[#20201D] hover:bg-[#E0DCD1]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 2. Interactive Visual Stage Canvas */}
      <div className="bg-[#FAF8F5] border border-[#DEDAD0] rounded-3xl p-6 sm:p-10 shadow-lg min-h-[360px] relative overflow-hidden flex flex-col justify-center">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#D5D0C5_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

        <AnimatePresence mode="wait">
          {/* STAGE 1: CONNECT */}
          {activeStage === 1 && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              {/* Left: Heterogeneous Sources */}
              <div className="md:col-span-4 space-y-2.5">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#8A877D] mb-1">
                  Ingested Research Sources
                </div>
                {[
                  { name: 'Phase_III_Clinical_Protocol.pdf', type: 'PDF · 48 pgs', badge: 'Validated' },
                  { name: 'Regulatory_CFR_Title21.docx', type: 'DOCX · 112 pgs', badge: 'Indexed' },
                  { name: 'Quantum_Decoherence_Atlas.md', type: 'Markdown · 14 pgs', badge: 'Normalized' },
                ].map((doc, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-white border border-[#E5E0D5] shadow-xs flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <FileText className="w-4 h-4 text-[#858875] shrink-0" />
                      <div className="truncate">
                        <div className="font-medium text-[#20201D] truncate">{doc.name}</div>
                        <div className="text-[10px] text-[#8A877D] font-mono">{doc.type}</div>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {doc.badge}
                    </span>
                  </div>
                ))}
              </div>

              {/* Center: Data Stream Particle Transfer */}
              <div className="md:col-span-4 flex flex-col items-center justify-center text-center py-4">
                <div className="relative w-20 h-20 rounded-2xl bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center shadow-inner">
                  {/* Rotating orbital pulse */}
                  <div className="absolute inset-0 rounded-2xl border-2 border-[#D4AF37]/40 animate-ping opacity-25" />
                  <Cpu className="w-8 h-8 text-[#20201D]" />
                </div>
                <div className="mt-3 font-mono text-xs font-bold text-[#20201D]">
                  SLIDING CHUNKING ENGINE
                </div>
                <div className="text-[11px] font-mono text-[#8A877D] mt-0.5">
                  1,200 chars · 180 overlap · 3,072d vectors
                </div>
              </div>

              {/* Right: Unified Vector Namespace */}
              <div className="md:col-span-4 bg-white/90 border border-[#E5E0D5] rounded-2xl p-4 shadow-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8A877D]">TARGET NAMESPACE</span>
                  <span className="text-[#2D5A43] font-bold">READY</span>
                </div>
                <div className="space-y-1.5 text-xs text-[#55534E]">
                  <div className="flex justify-between">
                    <span>Extracted Chunks:</span>
                    <span className="font-mono font-medium text-[#20201D]">328 vectors</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pagination Map:</span>
                    <span className="font-mono font-medium text-[#20201D]">100% Attributed</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Index Structure:</span>
                    <span className="font-mono font-medium text-[#20201D]">HNSW (m=16, ef=64)</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE 2: VERIFY */}
          {activeStage === 2 && (
            <motion.div
              key="verify"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              {/* Left: Prismatic Facet Cleaving */}
              <div className="md:col-span-5 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#8A877D] uppercase">Evidence Triangulation</span>
                  <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                    Contradiction Detected
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D5]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8A877D]">
                      <span>Source 1: Phase III Trial (p. 22)</span>
                      <span className="text-emerald-700 font-bold">Confidence 94.2%</span>
                    </div>
                    <p className="mt-1 text-[#20201D]">
                      &ldquo;Longitudinal cohort shows sustained enzymatic suppression through Month 12.&rdquo;
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-[#E5E0D5]">
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8A877D]">
                      <span>Source 2: Meta-Review 2024 (p. 104)</span>
                      <span className="text-amber-700 font-bold">Conflict: 67.8%</span>
                    </div>
                    <p className="mt-1 text-[#20201D]">
                      &ldquo;Elevated rebound rates documented in refractory subgroup 2B.&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Right: Interactive Confidence Calibration Slider */}
              <div className="md:col-span-7 bg-white/90 border border-[#E5E0D5] rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#858875]" />
                    <span className="font-serif font-medium text-sm text-[#20201D]">
                      Methodology Calibration Slider
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#EFEBE2] text-[#20201D]">
                    {methodologySlider}% Weight
                  </span>
                </div>

                <p className="text-xs text-[#66635B]">
                  Adjust the empirical weight between sample size versus follow-up duration to evaluate composite claim robustness:
                </p>

                <input
                  type="range"
                  min="20"
                  max="95"
                  value={methodologySlider}
                  onChange={(e) => setMethodologySlider(Number(e.target.value))}
                  className="w-full accent-[#20201D] cursor-pointer"
                />

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EAE6DC]">
                    <div className="text-[10px] text-[#8A877D]">Synthesized Confidence</div>
                    <div className="text-sm font-bold text-[#2D5A43] mt-0.5">
                      {(81.2 + (methodologySlider - 50) * 0.14).toFixed(1)}% Verified
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#FAF8F5] border border-[#EAE6DC]">
                    <div className="text-[10px] text-[#8A877D]">Hallucination Risk</div>
                    <div className="text-sm font-bold text-emerald-800 mt-0.5">
                      0.00% Grounded
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STAGE 3: ACT */}
          {activeStage === 3 && (
            <motion.div
              key="act"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
            >
              <div className="md:col-span-5 space-y-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#8A877D]">
                  Crystallized Research Outputs
                </div>
                <h3 className="font-serif text-2xl font-normal text-[#20201D] leading-snug">
                  Transform understanding into concrete action.
                </h3>
                <p className="text-xs sm:text-sm text-[#66635B] leading-relaxed">
                  Synthesized intelligence doesn&rsquo;t sit idle. SYNORA instantly drafts structured briefings, active recall decks, and phased execution roadmaps.
                </p>
              </div>

              {/* 4 Actionable Output Tiles */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { title: 'Executive Briefing', desc: '14-point thesis with citations', tag: 'Studio Guide' },
                  { title: 'Active Recall Decks', desc: '3D flashcards with spaced repetition', tag: 'Flashcards' },
                  { title: 'Diagnostic Assessment', desc: 'Self-scoring multi-choice quiz', tag: 'Quizzes' },
                  { title: 'Implementation Roadmap', desc: 'Milestone timeline with dependencies', tag: 'Action Plan' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-white border border-[#E5E0D5] shadow-xs hover:border-[#20201D] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#8A877D] mb-1">
                      <span>{item.tag}</span>
                      <BookmarkCheck className="w-3.5 h-3.5 text-[#2D5A43]" />
                    </div>
                    <div className="text-xs font-serif font-medium text-[#20201D] group-hover:text-[#2D5A43] transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-[#77756E] mt-0.5">{item.desc}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 3. Three Connected Cards Matching the Image */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-center">
        {/* Card 1: CONNECT */}
        <div
          onClick={() => selectStage(1)}
          className={`rounded-2xl p-6 sm:p-7 text-left transition-all cursor-pointer border ${
            activeStage === 1
              ? 'bg-[#FBFAF6] border-[#20201D] shadow-md scale-102'
              : 'bg-[#FBFAF6]/70 border-[#DEDAD0] hover:bg-[#FBFAF6] hover:border-[#858875]'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center text-[#20201D] mb-4">
            <FileText className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-wider text-[#20201D] uppercase">
              CONNECT
            </span>
            <span className="text-[10px] font-mono text-[#8A877D]">Stage 01</span>
          </div>
          <p className="text-sm text-[#6E6A61] mt-2 leading-relaxed">
            Bring research sources together in one place.
          </p>
        </div>

        {/* Card 2: VERIFY */}
        <div
          onClick={() => selectStage(2)}
          className={`rounded-2xl p-6 sm:p-7 text-left transition-all cursor-pointer border ${
            activeStage === 2
              ? 'bg-[#FBFAF6] border-[#20201D] shadow-md scale-102'
              : 'bg-[#FBFAF6]/70 border-[#DEDAD0] hover:bg-[#FBFAF6] hover:border-[#858875]'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center text-[#20201D] mb-4">
            <Network className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-wider text-[#20201D] uppercase">
              VERIFY
            </span>
            <span className="text-[10px] font-mono text-[#8A877D]">Stage 02</span>
          </div>
          <p className="text-sm text-[#6E6A61] mt-2 leading-relaxed">
            Understand claims and evaluate evidence.
          </p>
        </div>

        {/* Card 3: ACT */}
        <div
          onClick={() => selectStage(3)}
          className={`rounded-2xl p-6 sm:p-7 text-left transition-all cursor-pointer border ${
            activeStage === 3
              ? 'bg-[#FBFAF6] border-[#20201D] shadow-md scale-102'
              : 'bg-[#FBFAF6]/70 border-[#DEDAD0] hover:bg-[#FBFAF6] hover:border-[#858875]'
          }`}
        >
          <div className="w-11 h-11 rounded-xl bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center text-[#20201D] mb-4">
            <Sparkles className="w-5 h-5 stroke-[1.5]" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold tracking-wider text-[#20201D] uppercase">
              ACT
            </span>
            <span className="text-[10px] font-mono text-[#8A877D]">Stage 03</span>
          </div>
          <p className="text-sm text-[#6E6A61] mt-2 leading-relaxed">
            Turn knowledge into meaningful outcomes.
          </p>
        </div>
      </div>
    </div>
  );
}
