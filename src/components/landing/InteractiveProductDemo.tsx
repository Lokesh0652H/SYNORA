'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Sparkles,
  Link2,
  CheckCircle2,
  ArrowUpRight,
  BookOpen,
  Network,
  Headphones,
  Brain,
  X,
  Play,
  Pause,
  ExternalLink,
} from 'lucide-react';

type SourceDoc = {
  id: string;
  title: string;
  type: 'pdf' | 'arxiv' | 'journal' | 'web';
  badge: string;
  citation: string;
  excerpt: string;
};

const SAMPLE_SOURCES: SourceDoc[] = [
  {
    id: 'src-1',
    title: 'Attention Is All You Need (arXiv:1706.03762)',
    type: 'arxiv',
    badge: 'Primary Literature',
    citation: 'Vaswani et al., 2017 · p. 4, §3.2',
    excerpt:
      'Multi-head attention allows the model to jointly attend to information from different representation subspaces at different positions. With a single attention head, averaging inhibits this.',
  },
  {
    id: 'src-2',
    title: 'FlashAttention-2: Faster Attention with Better Parallelism',
    type: 'pdf',
    badge: 'Benchmark',
    citation: 'Dao, 2023 · p. 7, Tab. 2',
    excerpt:
      'FlashAttention-2 yields a 2× speedup over FlashAttention, reaching up to 73% of theoretical maximum FLOPs/s on A100 GPU by reducing memory IO operations between SRAM and HBM.',
  },
  {
    id: 'src-3',
    title: 'Direct Preference Optimization (Stanford NLP)',
    type: 'journal',
    badge: 'Empirical Study',
    citation: 'Rafailov et al., 2023 · p. 11, §5.1',
    excerpt:
      'DPO implicitly optimizes the same objective as existing RLHF algorithms (with a Bradley-Terry reward model) but is stable, performant, and completely free of reinforcement learning.',
  },
];

export default function InteractiveProductDemo() {
  const [activeStep, setActiveStep] = useState<number>(3); // Default at grounded synthesis
  const [selectedSource, setSelectedSource] = useState<SourceDoc>(SAMPLE_SOURCES[0]);
  const [citationModal, setCitationModal] = useState<SourceDoc | null>(null);
  const [activeTab, setActiveTab] = useState<'answer' | 'graph' | 'flashcards' | 'audio'>('answer');

  const steps = [
    { num: '01', title: 'Ingest Sources', desc: 'PDFs, arXiv, URLs' },
    { num: '02', title: 'Graph Understanding', desc: 'Entities & Chunks' },
    { num: '03', title: 'Grounded Query', desc: 'Synthesis & Citations' },
    { num: '04', title: 'Verification', desc: 'Page-level Audit' },
    { num: '05', title: 'Action Output', desc: 'Briefs & Mastery' },
  ];

  return (
    <div className="w-full max-w-[1140px] mx-auto bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-6 sm:p-10 shadow-[0_16px_50px_-12px_rgba(32,32,29,0.06)] relative overflow-hidden">
      {/* Top Controls: Step Flow Progress */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#E8E4DA]">
        <div>
          <div className="text-[11px] font-mono tracking-widest text-[#858875] uppercase mb-1">
            LIVING PRODUCT DEMONSTRATION · ZERO SIMULATED LATENCY
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-normal text-[#20201D] tracking-tight">
            How SYNORA synthesizes intelligence in practice.
          </h3>
        </div>

        {/* Step Buttons */}
        <div className="flex items-center gap-1.5 bg-[#EFEBE2] p-1.5 rounded-2xl border border-[#DEDAD0]">
          {steps.map((s, idx) => {
            const stepNum = idx + 1;
            const isActive = activeStep === stepNum;
            return (
              <button
                key={s.num}
                onClick={() => setActiveStep(stepNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-[#20201D] text-[#FBFAF6] shadow-sm font-semibold'
                    : 'text-[#77756E] hover:text-[#20201D] hover:bg-[#E8E4DA]/60'
                }`}
              >
                <span className="font-mono text-[10px] opacity-70">{s.num}</span>
                <span className="hidden md:inline">{s.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Showcase Workspace Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Connected Sources Explorer */}
        <div className="lg:col-span-4 flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#77756E]">
              Indexed Sources (3)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFEBE2] text-[#858875] border border-[#DEDAD0]">
              SHA-256 Verified
            </span>
          </div>

          {SAMPLE_SOURCES.map((src) => {
            const isSelected = selectedSource.id === src.id;
            return (
              <div
                key={src.id}
                onClick={() => {
                  setSelectedSource(src);
                  setCitationModal(src);
                }}
                className={`p-4 rounded-2xl border transition-all duration-200 cursor-pointer text-left hover-lift ${
                  isSelected
                    ? 'bg-[#EFEBE2] border-[#20201D]/40 shadow-xs'
                    : 'bg-[#FBFAF6] border-[#DEDAD0] hover:border-[#B98F7B]/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white text-[#77756E] border border-[#DEDAD0]">
                    {src.badge}
                  </span>
                  <ExternalLink size={12} className="text-[#A09C92]" />
                </div>
                <h4 className="text-xs font-semibold text-[#20201D] line-clamp-1 mb-1">
                  {src.title}
                </h4>
                <p className="text-[11px] font-mono text-[#858875] truncate">
                  {src.citation}
                </p>
              </div>
            );
          })}

          <div className="p-3.5 rounded-2xl bg-[#EFEBE2]/60 border border-dashed border-[#DEDAD0] text-[11px] text-[#77756E] flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={13} className="text-[#858875]" />
              Multi-source chunk overlap active
            </span>
            <span className="font-mono text-[10px] text-[#20201D]">42 Chunks</span>
          </div>
        </div>

        {/* Right Column: Grounded Reasoning & Action Tabs */}
        <div className="lg:col-span-8 flex flex-col bg-white border border-[#DEDAD0] rounded-2xl p-6 sm:p-7 shadow-xs">
          {/* Query Bar */}
          <div className="p-3.5 rounded-xl bg-[#F5F3ED] border border-[#DEDAD0] mb-5 flex items-start gap-3">
            <Search size={16} className="text-[#858875] shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="text-[10px] font-mono text-[#858875] uppercase tracking-wider mb-0.5">
                Research Inquiry
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#20201D] leading-snug">
                How does multi-head attention mitigate IO bottlenecks, and how does FlashAttention-2 optimize memory access over SRAM?
              </p>
            </div>
          </div>

          {/* Synthesis View Switcher */}
          <div className="flex items-center gap-2 mb-4 border-b border-[#E8E4DA] pb-3 text-xs font-medium">
            <button
              onClick={() => setActiveTab('answer')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'answer'
                  ? 'bg-[#20201D] text-white font-semibold'
                  : 'text-[#77756E] hover:text-[#20201D] hover:bg-[#EFEBE2]'
              }`}
            >
              <FileText size={13} /> Grounded Answer
            </button>
            <button
              onClick={() => setActiveTab('graph')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'graph'
                  ? 'bg-[#20201D] text-white font-semibold'
                  : 'text-[#77756E] hover:text-[#20201D] hover:bg-[#EFEBE2]'
              }`}
            >
              <Network size={13} /> Concept Graph
            </button>
            <button
              onClick={() => setActiveTab('flashcards')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'flashcards'
                  ? 'bg-[#20201D] text-white font-semibold'
                  : 'text-[#77756E] hover:text-[#20201D] hover:bg-[#EFEBE2]'
              }`}
            >
              <Brain size={13} /> Flashcard
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'audio'
                  ? 'bg-[#20201D] text-white font-semibold'
                  : 'text-[#77756E] hover:text-[#20201D] hover:bg-[#EFEBE2]'
              }`}
            >
              <Headphones size={13} /> Audio Overview
            </button>
          </div>

          {/* Tab 1: Grounded Answer with Interactive Citations */}
          {activeTab === 'answer' && (
            <div className="space-y-4 text-xs sm:text-sm text-[#20201D] leading-relaxed animate-scale-in">
              <p>
                Multi-head attention projects queries, keys, and values $h$ times with learned linear projections to $d_k, d_k,$ and $d_v$ dimensions. Instead of performing a single attention function, this enables simultaneous subspace representation{' '}
                <button
                  type="button"
                  onClick={() => setCitationModal(SAMPLE_SOURCES[0])}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#EFEBE2] hover:bg-[#DEDAD0] text-[#858875] font-mono text-[11px] font-semibold border border-[#DEDAD0] transition-colors cursor-pointer"
                >
                  [Vaswani 2017 · p. 4, §3.2]
                </button>
                .
              </p>

              <p>
                However, standard scaled dot-product attention scales quadratically with sequence length $O(N^2)$, causing severe memory IO bottlenecks between high-bandwidth GPU memory (HBM) and on-chip SRAM. FlashAttention-2 eliminates these redundant memory roundtrips by tiling the softmax computation over query-key blocks{' '}
                <button
                  type="button"
                  onClick={() => setCitationModal(SAMPLE_SOURCES[1])}
                  className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-[#EFEBE2] hover:bg-[#DEDAD0] text-[#858875] font-mono text-[11px] font-semibold border border-[#DEDAD0] transition-colors cursor-pointer"
                >
                  [Dao 2023 · p. 7, Tab. 2]
                </button>
                , reaching up to 73% theoretical peak FLOPs/s.
              </p>

              <div className="pt-3 border-t border-[#E8E4DA] flex items-center justify-between text-xs text-[#77756E]">
                <span className="flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#858875]" /> Grounded via Gemini 2.5 Flash
                </span>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1 text-[#20201D] font-medium hover:underline"
                >
                  Open in SYNORA Workspace <ArrowUpRight size={13} />
                </Link>
              </div>
            </div>
          )}

          {/* Tab 2: Concept Graph Preview */}
          {activeTab === 'graph' && (
            <div className="p-6 rounded-xl bg-[#F5F3ED] border border-[#DEDAD0] text-center animate-scale-in">
              <div className="text-xs font-mono text-[#858875] uppercase tracking-wider mb-2">
                Knowledge Topology · 3 Clustered Entities
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 py-6">
                <span className="px-3.5 py-2 rounded-xl bg-[#FBFAF6] border border-[#DEDAD0] shadow-xs text-xs font-semibold text-[#20201D]">
                  ● Multi-Head Subspaces
                </span>
                <span className="text-[#858875] text-xs">──[IO Bottleneck]──</span>
                <span className="px-3.5 py-2 rounded-xl bg-[#20201D] text-[#FBFAF6] shadow-sm text-xs font-semibold">
                  ● FlashAttention-2 Tiling
                </span>
                <span className="text-[#858875] text-xs">──[2× Speedup]──</span>
                <span className="px-3.5 py-2 rounded-xl bg-[#FBFAF6] border border-[#DEDAD0] shadow-xs text-xs font-semibold text-[#20201D]">
                  ● On-Chip SRAM Cache
                </span>
              </div>
              <p className="text-xs text-[#77756E] max-w-md mx-auto">
                SYNORA automatically extracts topological relations between conceptual principles and empirical benchmark results.
              </p>
            </div>
          )}

          {/* Tab 3: Flashcard Preview */}
          {activeTab === 'flashcards' && (
            <div className="p-6 rounded-xl bg-[#F5F3ED] border border-[#DEDAD0] text-left animate-scale-in">
              <div className="flex items-center justify-between text-[10px] font-mono text-[#858875] uppercase mb-2">
                <span>Card 01 of 12 · Active Recall</span>
                <span className="px-2 py-0.5 rounded-full bg-white border border-[#DEDAD0]">Difficulty: High</span>
              </div>
              <h5 className="text-sm font-semibold text-[#20201D] mb-3">
                Q: Why does FlashAttention-2 split the softmax computation into blocks rather than computing the full matrix?
              </h5>
              <div className="p-3 rounded-lg bg-white border border-[#DEDAD0] text-xs text-[#77756E] leading-relaxed">
                <strong className="text-[#20201D]">A:</strong> To keep intermediate values entirely inside fast on-chip SRAM, eliminating constant slow roundtrips to GPU High Bandwidth Memory (HBM).
              </div>
            </div>
          )}

          {/* Tab 4: Audio Overview Preview */}
          {activeTab === 'audio' && (
            <div className="p-6 rounded-xl bg-[#F5F3ED] border border-[#DEDAD0] text-left animate-scale-in">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[10px] font-mono text-[#858875] uppercase">Deep Dive Discussion</div>
                  <div className="text-sm font-semibold text-[#20201D]">The Hardware Roadblocks of Modern Attention</div>
                </div>
                <div className="text-xs font-mono text-[#77756E]">04:12 / 12:45</div>
              </div>

              {/* Waveform Bars */}
              <div className="flex items-center gap-1 h-8 mb-4">
                {[40, 65, 80, 50, 90, 75, 40, 60, 100, 85, 70, 45, 60, 80, 55, 35, 70, 90, 60, 40, 55, 75].map((h, i) => (
                  <div
                    key={i}
                    style={{ height: `${h}%` }}
                    className={`flex-1 rounded-full ${i < 10 ? 'bg-[#20201D]' : 'bg-[#DEDAD0]'}`}
                  />
                ))}
              </div>

              <p className="text-xs text-[#77756E] italic">
                “Dr. Aris: If you examine table 2 on page 7, the real bottleneck wasn't the FLOP count—it was memory bandwidth...”
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Citation Popover Modal when user clicks any citation marker */}
      {citationModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-scale-in"
          onClick={() => setCitationModal(null)}
        >
          <div
            className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#E8E4DA]">
              <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase">
                Verifiable Source Passage
              </span>
              <button
                onClick={() => setCitationModal(null)}
                className="w-7 h-7 rounded-lg hover:bg-[#EFEBE2] flex items-center justify-center text-[#77756E] hover:text-[#20201D] transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <h4 className="text-sm font-semibold text-[#20201D] mb-1">
              {citationModal.title}
            </h4>
            <div className="text-xs font-mono text-[#858875] mb-4">
              {citationModal.citation}
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#DEDAD0] text-xs leading-relaxed text-[#20201D] font-serif italic mb-5">
              “{citationModal.excerpt}”
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-[#77756E] flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#858875]" /> Cryptographically signed
              </span>
              <Link
                href="/dashboard"
                className="text-xs font-medium text-[#20201D] px-4 py-2 rounded-lg bg-[#EFEBE2] hover:bg-[#DEDAD0] transition-colors inline-flex items-center gap-1"
              >
                Open Document View <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
