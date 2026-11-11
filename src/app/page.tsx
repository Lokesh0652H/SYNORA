'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle2,
  Shield,
  Cpu,
  Terminal,
  ArrowUpRight,
  RefreshCw,
  FileCode,
  Network,
  GitCompare,
  Bot,
  Brain,
  Layers,
  Sparkles,
  Compass,
} from 'lucide-react';
import ShaderCard, { type ShaderTheme } from '@/components/ShaderCard';

type HighlightKey =
  | 'replay'
  | 'drift'
  | 'signature'
  | 'context'
  | 'policy'
  | 'runs'
  | 'model'
  | 'prompt'
  | 'output';

interface CapabilityFeature {
  id: HighlightKey;
  title: string;
  description: string;
  theme: ShaderTheme;
  badge: string;
  icon: any;
  targetLine: string;
}

const CAPABILITIES: CapabilityFeature[] = [
  {
    id: 'context',
    title: 'Cross-Notebook Intelligence',
    description: 'Connect concepts across multiple notebooks and sources instead of treating each document in a silo.',
    theme: 'blue',
    badge: 'GraphRAG',
    icon: Network,
    targetLine: 'context',
  },
  {
    id: 'policy',
    title: 'Contradiction & Evidence Detection',
    description: 'Identify conflicting statements across uploaded sources and verify every claim against citations.',
    theme: 'ruby',
    badge: 'Verification',
    icon: GitCompare,
    targetLine: 'policy',
  },
  {
    id: 'replay',
    title: 'Deterministic Replay',
    description: 'Re-run historical research queries bit-for-bit across model upgrades with signed citation trails.',
    theme: 'emerald',
    badge: 'Zero Drift',
    icon: RefreshCw,
    targetLine: 'replay',
  },
  {
    id: 'prompt',
    title: 'Autonomous Research Agent',
    description: 'Decompose complex research objectives into multi-step investigative plans with human approval.',
    theme: 'purple',
    badge: 'Agentic',
    icon: Bot,
    targetLine: 'prompt',
  },
  {
    id: 'signature',
    title: 'Signed Provenance & Audit Trail',
    description: 'Every synthesized conclusion is cryptographically hashed with page-level citations for regulatory audit.',
    theme: 'slate',
    badge: 'Ed25519',
    icon: Shield,
    targetLine: 'signature',
  },
  {
    id: 'output',
    title: 'Knowledge-to-Action Engine',
    description: 'Transform verified research directly into structured reports, slide outlines, roadmaps, and task lists.',
    theme: 'amber',
    badge: 'Synthesis',
    icon: Sparkles,
    targetLine: 'output',
  },
];

export default function LandingPage() {
  const [activeHighlight, setActiveHighlight] = useState<HighlightKey>('replay');
  const [replaying, setReplaying] = useState(false);
  const platformSectionRef = useRef<HTMLElement>(null);
  const isHoveringRef = useRef(false);

  // Auto-advance highlight subtly when scrolled into view (if not actively hovered)
  useEffect(() => {
    const timer = setInterval(() => {
      if (isHoveringRef.current) return;
      setActiveHighlight((prev) => {
        const keys: HighlightKey[] = ['context', 'policy', 'replay', 'prompt', 'signature', 'output'];
        const idx = keys.indexOf(prev);
        return keys[(idx + 1) % keys.length];
      });
    }, 3200);

    return () => clearInterval(timer);
  }, []);

  const triggerReplay = () => {
    setReplaying(true);
    setActiveHighlight('replay');
    setTimeout(() => setReplaying(false), 1400);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-white font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#F9F9F7]/90 backdrop-blur-md border-b border-dashed border-[#DCDAD4]">
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group" title="Synora Home">
            <span className="w-5 h-5 bg-[#1A1A1A] flex items-center justify-center text-white text-[11px] font-bold rounded-sm tracking-tighter shadow-xs group-hover:rotate-45 group-hover:scale-110 transition-all duration-300">
              ■
            </span>
            <span className="font-bold tracking-tight text-lg text-[#1A1A1A] group-hover:text-black transition-colors">SYNORA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[13px] text-[#666666]">
            <a href="#how-it-works" className="hover:text-[#1A1A1A] hover:-translate-y-0.5 transition-all">How it works</a>
            <a href="#platform" className="hover:text-[#1A1A1A] hover:-translate-y-0.5 transition-all">Intelligence Core</a>
            <a href="#solutions" className="hover:text-[#1A1A1A] hover:-translate-y-0.5 transition-all">Research Solutions</a>
            <a href="#security" className="hover:text-[#1A1A1A] hover:-translate-y-0.5 transition-all">Sovereignty</a>
            <a href="#features" className="hover:text-[#1A1A1A] hover:-translate-y-0.5 transition-all">Signature Pillars</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[13px] text-[#666666] hover:text-[#1A1A1A] px-3 py-1.5 transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="bg-[#1A1A1A] hover:bg-[#333333] text-white text-[13px] font-medium px-4 py-2 rounded-md transition-all flex items-center gap-1.5 shadow-sm group hover:shadow-md"
            >
              Open workspace
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 border-b border-dashed border-[#DCDAD4] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EAE8E0]/70 border border-[#D5D3CB] text-[11px] font-mono tracking-widest text-[#555] uppercase mb-4 shadow-2xs hover:bg-[#EAE8E0] transition-colors cursor-default animate-float-gentle">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A1A1A]"></span>
            <span>Cross-Notebook Intelligence & Autonomous Research Studio</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#1A1A1A] max-w-4xl mx-auto leading-[1.08]">
            Don’t just store knowledge. <br className="hidden sm:inline" />
            <span className="italic font-serif">Understand, challenge, and act.</span>
          </h1>

          {/* Stippled Mountain Peak Engraving */}
          <div className="relative my-8 sm:my-10 max-w-[560px] mx-auto flex justify-center animate-float-slow">
            <Image
              src="/illustrations/hero_mountain.png"
              alt="Hand-drawn stippled mountain peak"
              width={560}
              height={360}
              priority
              className="w-full max-w-[500px] h-auto object-contain filter contrast-105 hover:scale-103 transition-transform duration-500"
            />
          </div>

          {/* Hero Bottom Row */}
          <div className="max-w-[960px] mx-auto mt-6 flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-dashed border-[#DCDAD4]/80 text-left">
            <p className="text-sm text-[#666666] max-w-md leading-relaxed">
              SYNORA connects concepts across your entire document library, discovers contradictions, verifies claims with page-level citations, and turns research into action.
            </p>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                href="/dashboard"
                className="bg-[#1A1A1A] hover:bg-black text-white text-sm font-medium px-6 py-2.5 rounded-md transition-all shadow-sm flex items-center gap-2 group hover:shadow-md"
              >
                Start research session
                <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-[#1A1A1A] hover:text-[#555] px-4 py-2.5 transition-colors flex items-center gap-1.5 group"
              >
                Explore intelligence <ArrowUpRight size={14} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process: Connect, Verify, Act */}
      <section id="how-it-works" className="border-b border-dashed border-[#DCDAD4]">
        <div className="max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-dashed divide-[#DCDAD4]">
            {/* Column 1: Header */}
            <div className="p-8 sm:p-10 flex flex-col justify-between">
              <div>
                <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-4">
                  How it works
                </span>
                <h2 className="text-2xl sm:text-3xl font-normal tracking-tight leading-snug">
                  From scattered papers to verifiable intelligence.
                </h2>
              </div>
              <div className="mt-8 text-xs text-[#8C8E85] font-mono">
                INTELLIGENCE CORE / SEC.01
              </div>
            </div>

            {/* Step 1: Connect */}
            <div className="p-8 sm:p-10 flex flex-col justify-between group hover:bg-[#F4F4F0] hover-lift transition-all duration-300 cursor-pointer">
              <div className="h-44 flex items-center justify-center mb-6">
                <Image
                  src="/illustrations/step_capture.png"
                  alt="Surveyor tripod instrument"
                  width={160}
                  height={190}
                  className="max-h-36 w-auto object-contain filter contrast-110 group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#8C8E85] mb-1 group-hover:text-black transition-colors">01</div>
                <h3 className="text-lg font-semibold mb-2">Connect</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Cross-Notebook Intelligence maps concepts, authors, entities, and citations across all your private collections.
                </p>
              </div>
            </div>

            {/* Step 2: Verify */}
            <div className="p-8 sm:p-10 flex flex-col justify-between group hover:bg-[#F4F4F0] hover-lift transition-all duration-300 cursor-pointer">
              <div className="h-44 flex items-center justify-center mb-6">
                <Image
                  src="/illustrations/step_pin.png"
                  alt="Triangulation monument milestone"
                  width={160}
                  height={190}
                  className="max-h-36 w-auto object-contain filter contrast-110 group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#8C8E85] mb-1 group-hover:text-black transition-colors">02</div>
                <h3 className="text-lg font-semibold mb-2">Verify</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Contradiction Detection automatically highlights conflicting claims and pins every conclusion to an exact passage.
                </p>
              </div>
            </div>

            {/* Step 3: Act */}
            <div className="p-8 sm:p-10 flex flex-col justify-between group hover:bg-[#F4F4F0] hover-lift transition-all duration-300 cursor-pointer">
              <div className="h-44 flex items-center justify-center mb-6">
                <Image
                  src="/illustrations/step_prove.png"
                  alt="Summit cairn with flag"
                  width={160}
                  height={190}
                  className="max-h-36 w-auto object-contain filter contrast-110 group-hover:scale-108 transition-transform duration-300"
                />
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#8C8E85] mb-1 group-hover:text-black transition-colors">03</div>
                <h3 className="text-lg font-semibold mb-2">Act</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Knowledge-to-Action converts findings into executive reports, presentations, roadmaps, and adaptive study plans.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform & Interactive Call Record Terminal with Live Hover/Scroll Sync */}
      <section
        id="platform"
        ref={platformSectionRef}
        className="border-b border-dashed border-[#DCDAD4] py-16 sm:py-20"
      >
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Platform Copy & Live Synchronized Call Record */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-3">
                INTELLIGENCE CORE
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight mb-4">
                Built for systems that get audited.
              </h2>
              <p className="text-sm text-[#666666] leading-relaxed mb-8">
                Every query, chunk retrieval, and reasoning step is recorded with signed provenance. Hover or scroll past any capability on the right to see its corresponding record line light up.
              </p>

              {/* Monospace Interactive Call Record Box matching Image 3 with pixel precision */}
              <div className="bg-white border border-[#E5E5E0] rounded-2xl p-6 sm:p-7 shadow-[0_4px_20px_rgba(0,0,0,0.03)] font-mono text-[13px] leading-relaxed hover-lift transition-all duration-300">
                {/* Header */}
                <div className="flex items-center justify-between pb-3 text-[#7A7C75]">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="font-mono text-[#555] text-sm font-normal">Call record</span>
                  </div>
                  <span className="text-xs text-[#7A7C75] font-mono">call_7f3a2c · 2026-03-14 09:12Z</span>
                </div>

                <div className="border-t border-[#EFEFEA] my-3" />

                {/* Key-Value Rows */}
                <div className="py-2 space-y-2.5">
                  {/* model */}
                  <div
                    onMouseEnter={() => {
                      isHoveringRef.current = true;
                      setActiveHighlight('model');
                    }}
                    onMouseLeave={() => (isHoveringRef.current = false)}
                    className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeHighlight === 'model'
                        ? 'bg-black/[0.05] text-black font-semibold'
                        : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <span className="w-24 shrink-0 text-[#7A7C75]">model</span>
                    <span className="text-[#1E201D] flex-1">gemini-2.5-flash · temp 0 · seed 1182</span>
                  </div>

                  {/* prompt */}
                  <div
                    onMouseEnter={() => {
                      isHoveringRef.current = true;
                      setActiveHighlight('prompt');
                    }}
                    onMouseLeave={() => (isHoveringRef.current = false)}
                    className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeHighlight === 'prompt'
                        ? 'bg-purple-50 text-purple-950 font-semibold'
                        : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <span className="w-24 shrink-0 text-[#7A7C75]">prompt</span>
                    <span className="text-[#1E201D] flex-1">sha256 3e1f...a9c2</span>
                  </div>

                  {/* context */}
                  <div
                    onMouseEnter={() => {
                      isHoveringRef.current = true;
                      setActiveHighlight('context');
                    }}
                    onMouseLeave={() => (isHoveringRef.current = false)}
                    className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeHighlight === 'context'
                        ? 'bg-blue-50 text-blue-950 font-semibold'
                        : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <span className="w-24 shrink-0 text-[#7A7C75]">context</span>
                    <span className="text-[#1E201D] flex-1">4 docs · sha256 b71d...04ee</span>
                  </div>

                  {/* policy */}
                  <div
                    onMouseEnter={() => {
                      isHoveringRef.current = true;
                      setActiveHighlight('policy');
                    }}
                    onMouseLeave={() => (isHoveringRef.current = false)}
                    className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeHighlight === 'policy'
                        ? 'bg-teal-50 text-teal-950 font-semibold'
                        : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <span className="w-24 shrink-0 text-[#7A7C75]">policy</span>
                    <span className="text-[#0D9488] font-medium flex-1">pii · tone · scope — 3/3 passed</span>
                  </div>

                  {/* runs in */}
                  <div
                    onMouseEnter={() => {
                      isHoveringRef.current = true;
                      setActiveHighlight('runs');
                    }}
                    onMouseLeave={() => (isHoveringRef.current = false)}
                    className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeHighlight === 'runs'
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <span className="w-24 shrink-0 text-[#7A7C75]">runs in</span>
                    <span className="text-[#4A4D46] flex-1">managed cloud · eu-west</span>
                  </div>

                  {/* output */}
                  <div
                    onMouseEnter={() => {
                      isHoveringRef.current = true;
                      setActiveHighlight('output');
                    }}
                    onMouseLeave={() => (isHoveringRef.current = false)}
                    className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeHighlight === 'output'
                        ? 'bg-amber-50 text-amber-950 font-bold'
                        : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <span className="w-24 shrink-0 text-[#7A7C75]">output</span>
                    <span className="font-bold text-[#111] flex-1">"Approve — tier B rating"</span>
                  </div>

                  {/* replay row (pill container matching Image 3 with blue Replay button) */}
                  <div
                    onMouseEnter={() => {
                      isHoveringRef.current = true;
                      setActiveHighlight('replay');
                    }}
                    onMouseLeave={() => (isHoveringRef.current = false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg transition-all cursor-pointer ${
                      activeHighlight === 'replay' || replaying
                        ? 'bg-[#EEEDE8] border border-black/[0.08] shadow-xs'
                        : 'bg-[#F4F4F0] border border-black/[0.04] hover:bg-[#EBEBE5]'
                    }`}
                  >
                    <div className="flex items-center flex-1">
                      <span className="w-24 shrink-0 text-[#7A7C75]">replay</span>
                      <span className="text-[#1E201D] font-normal">
                        {replaying ? 'replaying bit-for-bit...' : 'verified · zero divergence'}
                      </span>
                    </div>
                    <button
                      onClick={triggerReplay}
                      className="text-xs text-[#2563EB] hover:text-[#1D4ED8] flex items-center gap-1.5 font-sans font-medium transition-all ml-4 shrink-0 active:scale-95 group/btn"
                    >
                      <RefreshCw size={12} className={`transition-transform ${replaying ? 'animate-spin' : 'group-hover/btn:rotate-180 duration-500'}`} />
                      <span>Replay</span>
                    </button>
                  </div>

                  {/* drift */}
                  <div
                    onMouseEnter={() => {
                      isHoveringRef.current = true;
                      setActiveHighlight('drift');
                    }}
                    onMouseLeave={() => (isHoveringRef.current = false)}
                    className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeHighlight === 'drift'
                        ? 'bg-purple-50 text-purple-950 font-semibold'
                        : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <span className="w-24 shrink-0 text-[#7A7C75]">drift</span>
                    <span className="text-[#4A4D46] flex-1">none in 41 days</span>
                  </div>

                  {/* signature */}
                  <div
                    onMouseEnter={() => {
                      isHoveringRef.current = true;
                      setActiveHighlight('signature');
                    }}
                    onMouseLeave={() => (isHoveringRef.current = false)}
                    className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeHighlight === 'signature'
                        ? 'bg-slate-100 text-slate-900 font-semibold'
                        : 'hover:bg-black/[0.02]'
                    }`}
                  >
                    <span className="w-24 shrink-0 text-[#7A7C75]">signature</span>
                    <span className="text-[#4A4D46] flex-1">ed25519 9c0b...7712</span>
                  </div>
                </div>

                <div className="border-t border-[#EFEFEA] my-3" />

                {/* Footer matching Image 3 */}
                <div className="flex items-center gap-2 pt-1 text-xs text-[#4A4D46]">
                  <CheckCircle2 size={15} className="text-[#059669] shrink-0" />
                  <span>Replayed six months later — the same output, byte for byte</span>
                </div>
              </div>
            </div>

            {/* Right: Ashish Gogula Fluid Shader Cards Grid with Live Hover Triggers */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {CAPABILITIES.map((cap) => {
                const Icon = cap.icon;
                const isSelected = activeHighlight === cap.id;
                return (
                  <div
                    key={cap.id}
                    onMouseEnter={() => {
                      isHoveringRef.current = true;
                      setActiveHighlight(cap.id);
                    }}
                    onMouseLeave={() => {
                      isHoveringRef.current = false;
                    }}
                    className={`transition-transform duration-200 ${
                      isSelected ? 'ring-2 ring-black/20 rounded-[24px]' : ''
                    }`}
                  >
                    <ShaderCard
                      title={cap.title}
                      description={cap.description}
                      theme={cap.theme}
                      icon={<Icon size={19} />}
                      badge={cap.badge}
                      meta={
                        <div className="flex items-center justify-between text-[11px]">
                          <span>Lights up line: <code className="font-mono text-[10px] font-bold">{cap.targetLine}</code></span>
                          <span>SYNORA Core ↗</span>
                        </div>
                      }
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* The 10 Signature Features Section */}
      <section id="features" className="border-b border-dashed border-[#DCDAD4] py-16 sm:py-20 bg-[#F4F4F0]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="max-w-2xl mb-12">
            <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-2">
              SIGNATURE IDENTITY
            </span>
            <h2 className="text-3xl sm:text-5xl font-normal tracking-tight mb-4">
              Ten differentiators that set SYNORA apart.
            </h2>
            <p className="text-sm text-[#666666] leading-relaxed">
              Not every feature receives equal development priority. These ten capabilities sit at the very center of our product architecture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: '01',
                title: 'Cross-Notebook Intelligence',
                badge: 'Core',
                desc: 'Understand relationships across your entire knowledge library rather than isolating documents into separate folders.',
              },
              {
                num: '02',
                title: 'Dynamic Knowledge Graph',
                badge: 'GraphRAG',
                desc: 'Automatically identify concepts, authors, technologies, events, and latent semantic relationships between them.',
              },
              {
                num: '03',
                title: 'Contradiction & Evidence Detection',
                badge: 'Truth Engine',
                desc: 'Surface conflicting claims across disparate sources, assessing source authority, methodology, and empirical support.',
              },
              {
                num: '04',
                title: 'Autonomous Research Agent',
                badge: 'Multi-Step',
                desc: 'Accept high-level research objectives, formulate multi-step investigative plans, search external literature, and log every decision.',
              },
              {
                num: '05',
                title: 'Multiple AI Research Perspectives',
                badge: 'Debate Mode',
                desc: 'Engage Researcher, Critical Thinker, Analyst, Teacher, and Strategist modes to challenge assumptions and build consensus.',
              },
              {
                num: '06',
                title: 'Adaptive AI Learning System',
                badge: 'Pedagogy',
                desc: 'Personalized AI tutor with knowledge mastery tracking, weak area detection, dynamic flashcards, and spaced repetition.',
              },
              {
                num: '07',
                title: 'Knowledge-to-Action Engine',
                badge: 'Productivity',
                desc: 'Convert research findings into publication-ready executive reports, slide outlines, implementation plans, and roadmaps.',
              },
              {
                num: '08',
                title: 'Research Watchtower',
                badge: 'Telemetry',
                desc: 'Monitor selected topics and publications over time. Receive alerts the moment new evidence challenges existing conclusions.',
              },
              {
                num: '09',
                title: 'Interactive Evidence Maps',
                badge: 'Visualization',
                desc: 'Visually connect claims, primary sources, supporting data points, and counter-arguments in an intuitive canvas.',
              },
              {
                num: '10',
                title: 'Research Evolution Tracking',
                badge: 'Versioned Insight',
                desc: 'Inspect how your understanding and conclusions evolved chronologically as new papers and notes were added.',
              },
            ].map((f) => (
              <div
                key={f.num}
                className="bg-white border border-[#E0DED7] rounded-2xl p-6 sm:p-7 shadow-xs hover:border-black/30 hover-lift transition-all duration-300 group cursor-pointer relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-[#1A1A1A] transition-colors duration-300" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#8C8E85] group-hover:text-black transition-colors">
                    {f.num}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#F4F4F0] text-[#666] border border-black/[0.05] group-hover:border-black/20 group-hover:bg-[#EAEAE5] transition-all">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2 group-hover:translate-x-0.5 transition-transform duration-200">{f.title}</h3>
                <p className="text-xs sm:text-sm text-[#666666] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="border-b border-dashed border-[#DCDAD4] py-16 sm:py-20">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-2">
                RESEARCH APPLICATIONS
              </span>
              <h2 className="text-3xl sm:text-5xl font-normal tracking-tight">
                Where being wrong is expensive.
              </h2>
            </div>
            <p className="text-sm text-[#666666] max-w-md mt-4 md:mt-0 leading-relaxed">
              SYNORA earns its place where an insight must be defended later — to an academic committee, an investment board, or a court of law.
            </p>
          </div>

          {/* Solutions Rows */}
          <div className="divide-y divide-dashed divide-[#DCDAD4] border-y border-dashed border-[#DCDAD4]">
            {[
              {
                title: 'Cross-Disciplinary Academic Research',
                desc: 'Connect papers across separate fields, discover unexpected conceptual links, and detect unaddressed gaps in the literature.',
              },
              {
                title: 'Competitive & Strategic Intelligence',
                desc: 'Track research evolution across corporate disclosures, earnings transcripts, and patents with zero hallucination risk.',
              },
              {
                title: 'Systematic Literature & Clinical Review',
                desc: 'Compare trials, isolate conflicting methodologies, and extract structured tables directly into meta-analyses.',
              },
              {
                title: 'Legal & Regulatory Compliance Audits',
                desc: 'Verify policy adherence and contractual clauses with a tamper-evident, cryptographically signed citation behind every finding.',
              },
            ].map((sol, i) => (
              <div
                key={i}
                className="py-6 sm:py-8 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:bg-[#F2F2EC] px-4 -mx-4 rounded-lg transition-colors cursor-pointer"
              >
                <div className="md:w-1/3">
                  <h3 className="text-lg sm:text-xl font-medium text-[#1A1A1A] group-hover:text-black">
                    {sol.title}
                  </h3>
                </div>
                <div className="md:w-1/2 text-xs sm:text-sm text-[#666666]">
                  {sol.desc}
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-black/10 group-hover:bg-[#1A1A1A] group-hover:text-white transition-all">
                    <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="border-b border-dashed border-[#DCDAD4] py-16 sm:py-20">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Security Stats */}
            <div className="lg:col-span-6">
              <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-2">
                SOVEREIGN DATA PERIMETER
              </span>
              <h2 className="text-3xl sm:text-5xl font-normal tracking-tight mb-8">
                Your research never leaves <br />
                your perimeter.
              </h2>

              <div className="space-y-8 divide-y divide-dashed divide-[#DCDAD4]">
                <div className="pt-2">
                  <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1A1A1A] mb-1">
                    0
                  </div>
                  <div className="font-semibold text-sm mb-1">Bytes trained on or cached in public models</div>
                  <div className="text-xs text-[#666666]">
                    Deploy in your private cloud, on-premise, or in air-gapped secure enclaves with zero data retention.
                  </div>
                </div>

                <div className="pt-6">
                  <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1A1A1A] mb-1">
                    100%
                  </div>
                  <div className="font-semibold text-sm mb-1">Customer-held keys & private vectors</div>
                  <div className="text-xs text-[#666666]">
                    Row Level Security (RLS) ensures vector embeddings are isolated strictly to authenticated notebook owners.
                  </div>
                </div>

                <div className="pt-6">
                  <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1A1A1A] mb-1">
                    24/7
                  </div>
                  <div className="font-semibold text-sm mb-1">Signed provenance verification</div>
                  <div className="text-xs text-[#666666]">
                    Every chunk citation maps to its exact page coordinate with cryptographic verification.
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-[#DCDAD4] text-[11px] font-mono text-[#8C8E85]">
                SOC 2 TYPE II · ISO 27001 · HIPAA · GDPR COMPLIANT ARCHITECTURE
              </div>
            </div>

            {/* Right: Engraved Cliff Cottage Illustration */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="max-w-[500px]">
                <Image
                  src="/illustrations/security_cottage.png"
                  alt="Stippled cliffside fortress cottage"
                  width={520}
                  height={380}
                  className="w-full h-auto object-contain filter contrast-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Testimonial Section */}
      <section className="border-b border-dashed border-[#DCDAD4] py-16 sm:py-20 bg-[#F4F4F0]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="max-w-3xl">
            <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-4">
              PRODUCT PROMISE
            </span>
            <blockquote className="text-2xl sm:text-4xl font-normal tracking-tight text-[#1A1A1A] leading-snug mb-4">
              “Don’t just store knowledge. Understand it, connect it, challenge it, learn from it, and turn it into something useful.”
            </blockquote>
            <cite className="text-xs sm:text-sm text-[#737373] font-mono not-italic block mb-12">
              The Synora Research Philosophy
            </cite>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-dashed border-[#DCDAD4]">
            <div>
              <div className="text-4xl sm:text-5xl font-medium tracking-tight text-[#1A1A1A] mb-1">
                3.2<span className="text-2xl font-normal text-[#8C8E85]">M</span>
              </div>
              <div className="text-xs text-[#666666]">Citations verified without divergence</div>
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-medium tracking-tight text-[#1A1A1A] mb-1">
                100<span className="text-2xl font-normal text-[#8C8E85]">%</span>
              </div>
              <div className="text-xs text-[#666666]">Ground-truth evidence linkage across all runs</div>
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-medium tracking-tight text-[#1A1A1A] mb-1">
                0
              </div>
              <div className="text-xs text-[#666666]">Hallucinated claims accepted by Policy Gates</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Footer Call to Action */}
      <section className="border-b border-dashed border-[#DCDAD4] py-20 text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight mb-4">
            Put your research on the record.
          </h2>
          <p className="text-sm text-[#666666] max-w-lg mx-auto mb-8 leading-relaxed">
            Organize complex papers, test conflicting hypotheses, and generate cited intelligence in minutes.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-[#1A1A1A] hover:bg-black text-white text-sm font-medium px-6 py-3 rounded-md transition-all shadow-sm flex items-center gap-2"
            >
              Open workspace
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/signup"
              className="border border-[#DCDAD4] hover:bg-white text-sm font-medium px-5 py-3 rounded-md transition-all text-[#1A1A1A]"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>

      {/* Panoramic Mountain Landscape Footer */}
      <footer className="relative bg-[#F9F9F7] pt-12 pb-16 overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12 text-xs">
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-3">
                <span className="w-4 h-4 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold rounded-sm">
                  ■
                </span>
                <span className="font-bold text-sm tracking-tight">SYNORA</span>
              </div>
              <p className="text-[#666666] max-w-xs leading-relaxed">
                The Cross-Notebook Intelligence Core & Autonomous Research Studio.
              </p>
              <div className="mt-4 text-[#8C8E85] font-mono text-[11px]">
                © 2026 SYNORA Labs, Inc.
              </div>
            </div>

            <div>
              <div className="font-semibold text-[#1A1A1A] mb-3">Intelligence</div>
              <ul className="space-y-2 text-[#666666]">
                <li><a href="#platform" className="hover:text-black">Cross-Notebook Graph</a></li>
                <li><a href="#platform" className="hover:text-black">Contradiction Detection</a></li>
                <li><a href="#platform" className="hover:text-black">Autonomous Agent</a></li>
                <li><Link href="/dashboard" className="hover:text-black">Workspace</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-[#1A1A1A] mb-3">Modes</div>
              <ul className="space-y-2 text-[#666666]">
                <li><a href="#features" className="hover:text-black">Critical Thinker</a></li>
                <li><a href="#features" className="hover:text-black">Debate Perspective</a></li>
                <li><a href="#features" className="hover:text-black">Adaptive Tutor</a></li>
                <li><a href="#features" className="hover:text-black">Watchtower</a></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-[#1A1A1A] mb-3">Knowledge-to-Action</div>
              <ul className="space-y-2 text-[#666666]">
                <li><a href="#" className="hover:text-black">Research-to-Report</a></li>
                <li><a href="#" className="hover:text-black">Research-to-Roadmap</a></li>
                <li><a href="#" className="hover:text-black">Evidence Maps</a></li>
                <li><a href="#" className="hover:text-black">API Reference</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Panoramic Mountain Range Engraving along bottom */}
        <div className="w-full relative mt-6 border-t border-dashed border-[#DCDAD4]">
          <Image
            src="/illustrations/mountain_panorama.png"
            alt="Panoramic mountain engraving"
            width={1280}
            height={460}
            className="w-full h-auto object-cover max-h-56 opacity-85 filter contrast-105"
          />
        </div>
      </footer>
    </div>
  );
}
