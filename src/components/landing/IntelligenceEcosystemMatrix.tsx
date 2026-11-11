'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Network,
  CheckCircle2,
  Search,
  Bot,
  Layers,
  Brain,
  Zap,
  Bell,
  Map,
  Clock,
  ArrowRight,
  Shield,
  Activity,
  Check,
  RefreshCw,
  GitBranch,
} from 'lucide-react';

interface ConceptNode {
  id: string;
  label: string;
  category: string;
  snippet: string;
  source: string;
  page: string;
}

const CONCEPT_NODES: ConceptNode[] = [
  {
    id: 'topo',
    label: 'Topological Anyons',
    category: 'Quantum Mechanics',
    snippet: 'Non-Abelian anyonic braiding guarantees topological protection against local Hamiltonian perturbations.',
    source: 'ArXiv_2024_Topological_Qubits.pdf',
    page: 'p. 14',
  },
  {
    id: 'maj',
    label: 'Majorana Zero Modes',
    category: 'Condensed Matter',
    snippet: 'Zero-bias conductance peaks confirmed at semiconductor-superconductor nanowire interfaces.',
    source: 'Nature_Physics_2023.pdf',
    page: 'p. 38',
  },
  {
    id: 'braid',
    label: 'Braiding Unitaries',
    category: 'Quantum Gates',
    snippet: 'Geometric phase accumulation enables universal quantum gate synthesis without continuous active error correction.',
    source: 'Physical_Review_Letters.pdf',
    page: 'p. 82',
  },
  {
    id: 'deco',
    label: 'Boundary Decoherence',
    category: 'Noise Modeling',
    snippet: 'Quasiparticle poisoning at junction terminals establishes the upper boundary on coherence lifetime.',
    source: 'Physical_Review_B.pdf',
    page: 'p. 91',
  },
];

export default function IntelligenceEcosystemMatrix() {
  const [selectedFeature, setSelectedFeature] = useState<string>('graph');
  const [activeNode, setActiveNode] = useState<ConceptNode>(CONCEPT_NODES[0]);
  const [replayingCall, setReplayingCall] = useState<boolean>(false);

  const handleReplay = () => {
    setReplayingCall(true);
    setTimeout(() => setReplayingCall(false), 1200);
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto space-y-6">
      {/* Top Section: Dual Large Flagship Showcases */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Flagship Showcase 1: Dynamic Knowledge Graph & Cross-Notebook Synthesis */}
        <div className="lg:col-span-7 bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden">
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[radial-gradient(#D5D0C5_1px,transparent_1px)] [background-size:16px_16px] opacity-35 pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center text-[#20201D]">
                  <Network className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#20201D]">
                    Dynamic Knowledge Graph
                  </h3>
                  <div className="text-[11px] font-mono text-[#8A877D]">
                    Cross-Notebook Semantic Synthesis
                  </div>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full bg-[#EAE6DC] text-[#2D5A43] text-[10px] font-mono font-bold">
                Live Interactive Core
              </span>
            </div>

            <p className="text-xs sm:text-sm text-[#66635B] leading-relaxed mb-6">
              SYNORA automatically maps conceptual relationships, identifying hidden bridges across independent notebooks and disparate document formats.
            </p>

            {/* Interactive Concept Node Network */}
            <div className="p-4 rounded-2xl bg-[#F5F2EA] border border-[#E5E0D5] space-y-4">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#5A554A]">
                <span>SELECT CONCEPT NODE</span>
                <span className="text-[#8A877D]">4 Linked Entities</span>
              </div>

              {/* 4 Interactive Nodes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {CONCEPT_NODES.map((node) => {
                  const isCurrent = activeNode.id === node.id;
                  return (
                    <button
                      key={node.id}
                      onClick={() => setActiveNode(node)}
                      className={`p-2.5 rounded-xl text-left transition-all cursor-pointer ${
                        isCurrent
                          ? 'bg-[#20201D] text-[#FBFAF6] shadow-sm scale-102'
                          : 'bg-white/80 hover:bg-white text-[#20201D] border border-[#DEDAD0]'
                      }`}
                    >
                      <div className="text-[9px] font-mono opacity-70">{node.category}</div>
                      <div className="text-xs font-serif font-medium mt-0.5 truncate">
                        {node.label}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Node Excerpt Preview */}
              <motion.div
                key={activeNode.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-white border border-[#E5E0D5] text-xs space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between text-[10px] font-mono text-[#8A877D]">
                  <span className="flex items-center gap-1">
                    <FileText className="w-3 h-3 text-[#858875]" />
                    <span className="font-medium text-[#20201D]">{activeNode.source}</span>
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#EFEBE2] text-[#20201D] font-bold">
                    {activeNode.page}
                  </span>
                </div>
                <p className="text-[#20201D] leading-relaxed italic font-serif">
                  &ldquo;{activeNode.snippet}&rdquo;
                </p>
              </motion.div>
            </div>
          </div>

          <div className="relative z-10 mt-6 pt-4 border-t border-[#EAE6DC] flex items-center justify-between text-xs">
            <span className="text-[11px] font-mono text-[#8A877D]">
              RPC: match_document_chunks(cosine &lt;=&gt;)
            </span>
            <span className="text-[#2D5A43] font-medium font-mono text-[11px] flex items-center gap-1">
              <Check className="w-3.5 h-3.5" />
              <span>Grounded attribution verified</span>
            </span>
          </div>
        </div>

        {/* Flagship Showcase 2: Deterministic Retrieval & Cryptographic Call Audit */}
        <div className="lg:col-span-5 bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center text-[#20201D]">
                  <Search className="w-4 h-4 stroke-[1.5]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium text-[#20201D]">
                    Deterministic Replay
                  </h3>
                  <div className="text-[11px] font-mono text-[#8A877D]">
                    Cryptographic Audit Telemetry
                  </div>
                </div>
              </div>

              <button
                onClick={handleReplay}
                className="px-2.5 py-1 rounded-full bg-[#20201D] hover:bg-black text-[#FBFAF6] text-[10px] font-mono flex items-center gap-1 cursor-pointer transition-all"
              >
                <RefreshCw className={`w-3 h-3 ${replayingCall ? 'animate-spin' : ''}`} />
                <span>Replay</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#66635B] leading-relaxed mb-6">
              Track prompt hashes, model seeds, and exact citation bounds for repeatable research verification.
            </p>

            {/* Cryptographic Call Record Card */}
            <div className="rounded-2xl border border-[#DEDAD0] bg-[#FAF8F5] p-4 text-[11px] font-mono space-y-2 text-[#4A4740] shadow-xs">
              <div className="flex justify-between border-b border-[#EAE6DC] pb-2 text-[10px] text-[#8A877D]">
                <span>Call Record: call_7f3a2c</span>
                <span>2026-03-14 09:12Z</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#8A877D]">Model:</span>
                <span className="font-bold text-[#20201D]">gemini-2.5-flash · temp 0 · seed 1182</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#8A877D]">Prompt Hash:</span>
                <span className="text-[#55534E]">sha256 3e1f...a9c2</span>
              </div>

              <div className="flex justify-between">
                <span className="text-[#8A877D]">Context:</span>
                <span className="text-[#55534E]">4 chunks · sha256 b71d...04ee</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-[#8A877D]">Policy Check:</span>
                <span className="text-emerald-700 font-bold">pii · tone · scope (3/3 passed)</span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-[#EAE6DC]">
                <span className="text-[#8A877D]">Replay Verification:</span>
                <span className="text-emerald-800 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>zero divergence (byte-for-byte)</span>
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#EAE6DC] text-[11px] font-mono text-[#8A877D] flex justify-between items-center">
            <span>Drift: none in 41 days</span>
            <span>Ed25519 signature verified</span>
          </div>
        </div>
      </div>

      {/* Bottom Section: 10 Surrounding Capabilities in Asymmetric Editorial Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 text-left">
        {[
          {
            id: 'evidence',
            icon: CheckCircle2,
            title: 'Evidence Detection',
            desc: 'Detect conflicting statements across sources.',
            tag: 'Truth Engine',
          },
          {
            id: 'autonomous',
            icon: Bot,
            title: 'Autonomous Research',
            desc: 'Break objectives into verifiable sub-tasks.',
            tag: 'Agentic',
          },
          {
            id: 'perspectives',
            icon: Layers,
            title: 'Multiple Perspectives',
            desc: 'Analyze evidence through competing theoretical lenses.',
            tag: 'Synthesis',
          },
          {
            id: 'adaptive',
            icon: Brain,
            title: 'Adaptive Learning',
            desc: 'Generate tailored study materials based on comprehension.',
            tag: 'Pedagogy',
          },
          {
            id: 'action',
            icon: Zap,
            title: 'Knowledge-to-Action',
            desc: 'Translate conclusions into execution roadmaps.',
            tag: 'Outcomes',
          },
          {
            id: 'watchtower',
            icon: Bell,
            title: 'Research Watchtower',
            desc: 'Monitor literature updates and citation drift.',
            tag: 'Monitoring',
          },
          {
            id: 'maps',
            icon: Map,
            title: 'Interactive Maps',
            desc: 'Explore topological concept cartography.',
            tag: 'Visual',
          },
          {
            id: 'evolution',
            icon: Clock,
            title: 'Research Evolution',
            desc: 'Track how scientific conclusions change over time.',
            tag: 'Chronology',
          },
          {
            id: 'cross',
            icon: FileText,
            title: 'Cross-Notebook Intelligence',
            desc: 'Unify insights across multiple project workspaces.',
            tag: 'Perimeter',
          },
          {
            id: 'more',
            icon: ArrowRight,
            title: 'And much more... →',
            desc: 'Explore the full sovereign capability matrix.',
            tag: 'Complete Studio',
            isSpecial: true,
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => setSelectedFeature(item.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                item.isSpecial
                  ? 'bg-[#ECE7DC] border-[#DEDAD0] hover:border-[#20201D] text-[#20201D]'
                  : selectedFeature === item.id
                  ? 'bg-white border-[#20201D] shadow-sm'
                  : 'bg-[#FBFAF6] border-[#DEDAD0] hover:border-[#858875] shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center text-[#20201D] group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4 stroke-[1.5]" />
                  </div>
                  <span className="text-[9px] font-mono text-[#8A877D] uppercase">
                    {item.tag}
                  </span>
                </div>

                <h4 className="font-serif font-medium text-xs sm:text-sm text-[#20201D] leading-snug">
                  {item.title}
                </h4>

                <p className="text-[11px] text-[#66635B] mt-1 leading-normal">
                  {item.desc}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-[#EAE6DC] flex items-center justify-between text-[10px] font-mono text-[#8A877D]">
                <span>Sovereign RAG</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
