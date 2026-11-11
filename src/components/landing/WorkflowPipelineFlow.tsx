'use client';

import React, { useState } from 'react';
import {
  FileUp,
  Cpu,
  Database,
  Sparkles,
  ShieldCheck,
  Network,
  GraduationCap,
  FileSpreadsheet,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

type Stage = {
  num: string;
  name: string;
  shortDesc: string;
  icon: any;
  tech: string;
  latency: string;
  details: string;
};

const STAGES: Stage[] = [
  {
    num: '01',
    name: 'Source Ingestion',
    shortDesc: 'Multi-format PDF, DOCX, arXiv, & web parsing',
    icon: FileUp,
    tech: 'Mammoth / PDF-Parse / DOM Ingestion',
    latency: '< 800ms / 50 pages',
    details:
      'Extracts clean textual streams, page coordinates, table structures, and metadata while stripping non-semantic layout artifacts.',
  },
  {
    num: '02',
    name: 'Document Understanding',
    shortDesc: 'Context-aware chunking with token overlap',
    icon: Cpu,
    tech: 'Hierarchical Section Boundary Splitter',
    latency: 'Sub-second',
    details:
      'Splits documents into coherent argumentative units preserving paragraph coherence, section titles, and citation anchor tags.',
  },
  {
    num: '03',
    name: 'Semantic Retrieval',
    shortDesc: 'High-density vector embeddings with hybrid search',
    icon: Database,
    tech: 'Gemini Text-Embedding-004 + pgvector',
    latency: '45ms query latency',
    details:
      'Indexes chunks into high-dimensional semantic space with deterministic cosine distance ranking and exact keyword BM25 filtering.',
  },
  {
    num: '04',
    name: 'Grounded AI Reasoning',
    shortDesc: 'Multi-document synthesis strictly bound to source text',
    icon: Sparkles,
    tech: 'Gemini 2.5 Flash · Temp 0.0',
    latency: 'Streamed tokens',
    details:
      'Deploys strict instruction priors prohibiting hallucination or extrapolation outside the provided retrieval context.',
  },
  {
    num: '05',
    name: 'Evidence Verification',
    shortDesc: 'Page-level citation matching & claim audit',
    icon: ShieldCheck,
    tech: 'Tamper-Evident SHA-256 Signature',
    latency: 'Deterministic',
    details:
      'Every synthesized sentence is tagged with exact document ID, page number, and paragraph coordinates for human audit.',
  },
  {
    num: '06',
    name: 'Knowledge Topology',
    shortDesc: 'Entity, concept, and relationship extraction',
    icon: Network,
    tech: 'Dynamic GraphRAG Node Clustering',
    latency: 'Real-time graph sync',
    details:
      'Automatically discovers latent semantic links between authors, empirical claims, and experimental results across multiple notebooks.',
  },
  {
    num: '07',
    name: 'Learning Generation',
    shortDesc: 'Flashcards, quizzes, audio dialogues & mind maps',
    icon: GraduationCap,
    tech: 'Pedagogical Synthesis Engine',
    latency: 'Parallel generation',
    details:
      'Transforms validated research findings into active-recall flashcard sets, Socratic quizzes, and dual-host audio overviews.',
  },
  {
    num: '08',
    name: 'Actionable Deliverables',
    shortDesc: 'Executive briefs, decision roadmaps, & exports',
    icon: FileSpreadsheet,
    tech: 'Markdown, PDF & DOCX Export Engine',
    latency: 'Instant export',
    details:
      'Generates decision-ready executive briefs, strategic implementation roadmaps, and presentation outlines with citations intact.',
  },
];

export default function WorkflowPipelineFlow() {
  const [selectedStage, setSelectedStage] = useState<number>(3); // Default at Grounded AI Reasoning

  const stage = STAGES[selectedStage];
  const Icon = stage.icon;

  return (
    <div className="w-full max-w-[1240px] mx-auto px-6">
      {/* 8-Stage Progress Track */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
        {STAGES.map((s, idx) => {
          const isSelected = selectedStage === idx;
          const StageIcon = s.icon;
          return (
            <button
              key={s.num}
              onClick={() => setSelectedStage(idx)}
              className={`p-3.5 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[110px] hover-lift ${
                isSelected
                  ? 'bg-[#20201D] text-[#FBFAF6] border-[#20201D] shadow-md -translate-y-1'
                  : 'bg-[#FBFAF6] border-[#DEDAD0] text-[#77756E] hover:border-[#858875] hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`font-mono text-[10px] font-semibold ${isSelected ? 'text-[#D6C9B5]' : 'text-[#858875]'}`}>
                  {s.num}
                </span>
                <StageIcon size={14} className={isSelected ? 'text-white' : 'text-[#77756E]'} />
              </div>
              <div>
                <div className={`text-xs font-semibold leading-tight line-clamp-2 ${isSelected ? 'text-white' : 'text-[#20201D]'}`}>
                  {s.name}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Stage Detail Panel */}
      <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-6 sm:p-10 shadow-xs animate-scale-in">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center text-[#20201D]">
                <Icon size={18} />
              </div>
              <div>
                <div className="text-[10px] font-mono tracking-widest text-[#858875] uppercase">
                  STAGE {stage.num} · PIPELINE SPECIFICATION
                </div>
                <h4 className="text-xl sm:text-2xl font-serif text-[#20201D]">
                  {stage.name}: {stage.shortDesc}
                </h4>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#77756E] leading-relaxed max-w-2xl">
              {stage.details}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-mono text-[#858875]">
              <span className="px-3 py-1 rounded-full bg-[#EFEBE2] border border-[#DEDAD0]">
                Architecture: {stage.tech}
              </span>
              <span className="px-3 py-1 rounded-full bg-[#EFEBE2] border border-[#DEDAD0]">
                Latency Profile: {stage.latency}
              </span>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col justify-center p-6 rounded-2xl bg-[#F5F3ED] border border-[#DEDAD0] text-left space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#20201D]">
              <CheckCircle2 size={15} className="text-[#858875]" />
              <span>Deterministic Invariant</span>
            </div>
            <p className="text-xs text-[#77756E] leading-relaxed">
              Every stage maintains cryptographic data integrity with zero training on your uploaded research assets.
            </p>
            <div className="pt-2 border-t border-[#DEDAD0]/60 flex items-center justify-between text-xs font-medium text-[#20201D]">
              <span>Next Stage: {STAGES[(selectedStage + 1) % STAGES.length].name}</span>
              <button
                onClick={() => setSelectedStage((selectedStage + 1) % STAGES.length)}
                className="hover:underline flex items-center gap-1 font-semibold"
              >
                Advance <ArrowRight size={13} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
