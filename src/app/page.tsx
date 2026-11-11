'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronRight,
  FileCheck,
  FileText,
  GitCompare,
  Headphones,
  Layers,
  Lock,
  Menu,
  Network,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Users2,
  X,
  Bot,
  Zap,
} from 'lucide-react';

import HeroMountain3D from '@/components/landing/HeroMountain3D';
import InteractiveProductDemo from '@/components/landing/InteractiveProductDemo';
import LearningEcosystemDemo from '@/components/landing/LearningEcosystemDemo';
import SolutionsAccordion from '@/components/landing/SolutionsAccordion';
import WorkflowPipelineFlow from '@/components/landing/WorkflowPipelineFlow';
import KnowledgeGraphInteractive from '@/components/landing/KnowledgeGraphInteractive';
import ShaderCard, { type ShaderTheme } from '@/components/ShaderCard';
import Living3DEcosystem from '@/components/living-3d';

type HighlightKey =
  | 'model'
  | 'prompt'
  | 'context'
  | 'policy'
  | 'runs'
  | 'output'
  | 'replay'
  | 'drift'
  | 'signature';

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState<HighlightKey>('replay');
  const [replaying, setReplaying] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Scroll position listener for sticky nav background
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const triggerReplay = () => {
    setReplaying(true);
    setActiveHighlight('replay');
    setTimeout(() => setReplaying(false), 1200);
  };

  return (
    <div className="min-h-screen bg-[#F5F3ED] text-[#20201D] font-sans selection:bg-[#20201D] selection:text-[#FBFAF6]">
      {/* Living 3D Interactive Object Ecosystem */}
      <Living3DEcosystem />

      {/* =========================================================================
          SECTION 01: PREMIUM NAVIGATION
      ========================================================================= */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-[#F5F3ED]/92 backdrop-blur-md border-b border-[#DEDAD0] shadow-[0_4px_20px_rgba(32,32,29,0.03)]'
            : 'bg-[#F5F3ED] border-b border-[#DEDAD0]/60'
        }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Brand mark & wordmark */}
          <Link href="/" className="flex items-center gap-2.5 group" title="Synora Home">
            <span className="w-5 h-5 bg-[#20201D] flex items-center justify-center text-[#FBFAF6] text-[10px] font-bold rounded-sm tracking-tighter shadow-xs group-hover:rotate-45 group-hover:scale-110 transition-all duration-300">
              ■
            </span>
            <span className="font-bold tracking-tight text-lg text-[#20201D] group-hover:tracking-normal transition-all">
              SYNORA
            </span>
          </Link>

          {/* Center: Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-[13px] text-[#77756E] font-medium">
            <a href="#how-it-works" className="hover:text-[#20201D] transition-colors">How it works</a>
            <a href="#demo" className="hover:text-[#20201D] transition-colors">Demonstration</a>
            <a href="#platform" className="hover:text-[#20201D] transition-colors">Intelligence Core</a>
            <a href="#learning" className="hover:text-[#20201D] transition-colors">Learning Ecosystem</a>
            <a href="#solutions" className="hover:text-[#20201D] transition-colors">Research Solutions</a>
            <a href="#security" className="hover:text-[#20201D] transition-colors">Sovereignty</a>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[13px] font-medium text-[#77756E] hover:text-[#20201D] px-3.5 py-1.5 transition-colors hidden sm:block"
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="bg-[#20201D] hover:bg-black text-[#FBFAF6] text-[13px] font-medium px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md hover:scale-102 active:scale-95 group"
            >
              <span>Start workspace</span>
              <ArrowRight size={13} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-[#77756E] hover:text-[#20201D] hover:bg-[#EFEBE2] transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-[#DEDAD0] bg-[#F5F3ED] px-6 py-5 space-y-4 animate-scale-in">
            <nav className="flex flex-col gap-3 text-sm text-[#77756E] font-medium">
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#20201D]"
              >
                How it works
              </a>
              <a
                href="#demo"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#20201D]"
              >
                Interactive Demonstration
              </a>
              <a
                href="#platform"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#20201D]"
              >
                Intelligence Core
              </a>
              <a
                href="#learning"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#20201D]"
              >
                Learning Ecosystem
              </a>
              <a
                href="#solutions"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#20201D]"
              >
                Research Solutions
              </a>
              <a
                href="#security"
                onClick={() => setMobileMenuOpen(false)}
                className="py-1 hover:text-[#20201D]"
              >
                Privacy & Sovereignty
              </a>
            </nav>
            <div className="pt-3 border-t border-[#DEDAD0] flex items-center justify-between">
              <Link href="/login" className="text-xs font-semibold text-[#20201D]">
                Sign in
              </Link>
              <Link
                href="/dashboard"
                className="text-xs font-semibold px-4 py-2 rounded-lg bg-[#20201D] text-white"
              >
                Open workspace →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          SECTION 02: CINEMATIC HERO
      ========================================================================= */}
      <section id="hero" className="relative pt-16 sm:pt-20 pb-16 sm:pb-24 overflow-hidden border-b border-[#DEDAD0]">
        <div className="max-w-[1240px] mx-auto px-6 text-center">
          {/* Editorial Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#EFEBE2] border border-[#DEDAD0] text-[11px] font-mono tracking-widest text-[#858875] uppercase mb-6 shadow-2xs cursor-default animate-float-gentle">
            <span className="w-1.5 h-1.5 rounded-full bg-[#858875]" />
            <span>CROSS-NOTEBOOK INTELLIGENCE · RESEARCH STUDIO</span>
          </div>

          {/* Master Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-normal tracking-tight text-[#20201D] max-w-4xl mx-auto leading-[1.08] mb-6 font-serif">
            Don’t just store knowledge.{' '}
            <br className="hidden sm:inline" />
            <span className="italic">Understand, challenge, and act.</span>
          </h1>

          {/* Supporting Statement */}
          <p className="text-sm sm:text-base md:text-lg text-[#77756E] max-w-2xl mx-auto leading-relaxed mb-8">
            SYNORA transforms scattered papers, clinical trials, and technical documentation into connected knowledge, verifiable intelligence, and actionable outcomes.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <Link
              href="/dashboard"
              className="bg-[#20201D] hover:bg-black text-[#FBFAF6] text-sm font-medium px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md hover:scale-102 active:scale-95 flex items-center gap-2 group"
            >
              <span>Start research workspace</span>
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <a
              href="#how-it-works"
              className="bg-[#FBFAF6] hover:bg-[#EFEBE2] text-[#20201D] text-sm font-medium px-5 py-3 rounded-xl border border-[#DEDAD0] transition-all hover:border-[#858875] flex items-center gap-1.5 group"
            >
              <span>Explore intelligence</span>
              <ArrowUpRight size={15} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>

          {/* 3D Topographical Architectural Mountain Centerpiece */}
          <HeroMountain3D />
        </div>
      </section>

      {/* =========================================================================
          SECTION 03: THE RESEARCH TRANSFORMATION (Connect, Verify, Act)
      ========================================================================= */}
      <section id="how-it-works" className="bg-[#EFEBE2] border-b border-[#DEDAD0] py-20 sm:py-24">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="max-w-2xl mb-14 text-left">
            <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase block mb-2 font-semibold">
              TRANSFORMATION METHODOLOGY · SEC. 01
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#20201D] tracking-tight">
              From scattered papers to verifiable intelligence.
            </h2>
            <p className="text-sm sm:text-base text-[#77756E] mt-3 leading-relaxed">
              Three interconnected phases that turn passive document repositories into active synthesis engines.
            </p>
          </div>

          {/* 3 Step Interactive Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Step 1: Connect */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-8 flex flex-col justify-between hover-lift transition-all duration-300 group cursor-pointer">
              <div>
                <div className="h-44 flex items-center justify-center mb-6">
                  <Image
                    src="/illustrations/step_capture.png"
                    alt="Surveyor tripod instrument"
                    width={180}
                    height={190}
                    className="max-h-36 w-auto object-contain filter contrast-105 group-hover:scale-108 transition-transform duration-300"
                  />
                </div>
                <div className="text-xs font-mono text-[#858875] mb-1 font-semibold group-hover:text-[#20201D] transition-colors">
                  01 / INGESTION & TOPOLOGY
                </div>
                <h3 className="text-xl font-serif text-[#20201D] mb-2">Connect</h3>
                <p className="text-xs sm:text-sm text-[#77756E] leading-relaxed">
                  Bring PDF papers, clinical trial protocols, technical reports, and YouTube transcripts together into a single unified knowledge graph.
                </p>
              </div>
              <div className="pt-6 border-t border-[#E8E4DA] mt-6 text-[11px] font-mono text-[#858875] flex items-center justify-between">
                <span>Multi-Source Chunking</span>
                <span className="text-[#20201D] font-semibold">Explore ↗</span>
              </div>
            </div>

            {/* Step 2: Verify */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-8 flex flex-col justify-between hover-lift transition-all duration-300 group cursor-pointer">
              <div>
                <div className="h-44 flex items-center justify-center mb-6">
                  <Image
                    src="/illustrations/step_pin.png"
                    alt="Triangulation monument milestone"
                    width={180}
                    height={190}
                    className="max-h-36 w-auto object-contain filter contrast-105 group-hover:scale-108 transition-transform duration-300"
                  />
                </div>
                <div className="text-xs font-mono text-[#858875] mb-1 font-semibold group-hover:text-[#20201D] transition-colors">
                  02 / TRUTH & CITATION AUDIT
                </div>
                <h3 className="text-xl font-serif text-[#20201D] mb-2">Verify</h3>
                <p className="text-xs sm:text-sm text-[#77756E] leading-relaxed">
                  Contradiction Detection automatically highlights conflicting claims and pins every assertion to exact page and paragraph coordinates.
                </p>
              </div>
              <div className="pt-6 border-t border-[#E8E4DA] mt-6 text-[11px] font-mono text-[#858875] flex items-center justify-between">
                <span>Zero Hallucination Proof</span>
                <span className="text-[#20201D] font-semibold">Explore ↗</span>
              </div>
            </div>

            {/* Step 3: Act */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-8 flex flex-col justify-between hover-lift transition-all duration-300 group cursor-pointer">
              <div>
                <div className="h-44 flex items-center justify-center mb-6">
                  <Image
                    src="/illustrations/step_prove.png"
                    alt="Summit cairn with flag"
                    width={180}
                    height={190}
                    className="max-h-36 w-auto object-contain filter contrast-105 group-hover:scale-108 transition-transform duration-300"
                  />
                </div>
                <div className="text-xs font-mono text-[#858875] mb-1 font-semibold group-hover:text-[#20201D] transition-colors">
                  03 / ACTIONABLE MASTERY
                </div>
                <h3 className="text-xl font-serif text-[#20201D] mb-2">Act</h3>
                <p className="text-xs sm:text-sm text-[#77756E] leading-relaxed">
                  Knowledge-to-Action converts verified findings into executive decision briefs, implementation roadmaps, dynamic flashcards, and dual-speaker audio.
                </p>
              </div>
              <div className="pt-6 border-t border-[#E8E4DA] mt-6 text-[11px] font-mono text-[#858875] flex items-center justify-between">
                <span>Export to DOCX, PDF & MD</span>
                <span className="text-[#20201D] font-semibold">Explore ↗</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 04: INTERACTIVE PRODUCT DEMONSTRATION (Living SYNORA Showcase)
      ========================================================================= */}
      <section id="demo" className="bg-[#FBFAF6] border-b border-[#DEDAD0] py-20 sm:py-28">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="max-w-2xl mb-12 text-left">
            <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase block mb-2 font-semibold">
              INTERACTIVE PRODUCT SHOWCASE · SEC. 02
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#20201D] tracking-tight">
              Research is more than asking questions.
            </h2>
            <p className="text-sm sm:text-base text-[#77756E] mt-3 leading-relaxed">
              Test drive the live reasoning pipeline below. Click citations to inspect exact source passages or toggle between grounded answer, concept graph, flashcards, and audio.
            </p>
          </div>

          <InteractiveProductDemo />
        </div>
      </section>

      {/* =========================================================================
          SECTION 05: INTELLIGENCE CORE (Call Record + Dynamic Knowledge Graph + 10 Pillars)
      ========================================================================= */}
      <section id="platform" className="bg-[#F5F3ED] border-b border-[#DEDAD0] py-20 sm:py-28">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="max-w-2xl mb-14 text-left">
            <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase block mb-2 font-semibold">
              INTELLIGENCE ARCHITECTURE · SEC. 03
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#20201D] tracking-tight">
              An entire research ecosystem. One intelligence layer.
            </h2>
            <p className="text-sm sm:text-base text-[#77756E] mt-3 leading-relaxed">
              Every query, chunk retrieval, and reasoning step is recorded with cryptographic provenance.
            </p>
          </div>

          {/* Top Row: Alim QED Call Record Card + Interactive Knowledge Graph */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-16">
            {/* Left: Alim QED Call Record Box matching user's Image 3 reference */}
            <div className="lg:col-span-5 bg-white border border-[#DEDAD0] rounded-3xl p-6 sm:p-7 shadow-[0_4px_24px_rgba(32,32,29,0.03)] font-mono text-[13px] leading-relaxed hover-lift transition-all duration-300">
              {/* Header */}
              <div className="flex items-center justify-between pb-3 text-[#77756E]">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  <span className="font-mono text-[#555] text-sm font-normal">Call record</span>
                </div>
                <span className="text-xs text-[#77756E] font-mono">call_7f3a2c · 2026-03-14 09:12Z</span>
              </div>

              <div className="border-t border-[#E8E4DA] my-3" />

              {/* Key-Value Rows */}
              <div className="py-2 space-y-2.5">
                {/* model */}
                <div
                  onMouseEnter={() => setActiveHighlight('model')}
                  className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeHighlight === 'model'
                      ? 'bg-[#EFEBE2] text-[#20201D] font-semibold'
                      : 'hover:bg-black/[0.02]'
                  }`}
                >
                  <span className="w-24 shrink-0 text-[#77756E]">model</span>
                  <span className="text-[#20201D] flex-1">gemini-2.5-flash · temp 0 · seed 1182</span>
                </div>

                {/* prompt */}
                <div
                  onMouseEnter={() => setActiveHighlight('prompt')}
                  className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeHighlight === 'prompt'
                      ? 'bg-[#EFEBE2] text-[#20201D] font-semibold'
                      : 'hover:bg-black/[0.02]'
                  }`}
                >
                  <span className="w-24 shrink-0 text-[#77756E]">prompt</span>
                  <span className="text-[#20201D] flex-1">sha256 3e1f...a9c2</span>
                </div>

                {/* context */}
                <div
                  onMouseEnter={() => setActiveHighlight('context')}
                  className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeHighlight === 'context'
                      ? 'bg-[#EFEBE2] text-[#20201D] font-semibold'
                      : 'hover:bg-black/[0.02]'
                  }`}
                >
                  <span className="w-24 shrink-0 text-[#77756E]">context</span>
                  <span className="text-[#20201D] flex-1">4 docs · sha256 b71d...04ee</span>
                </div>

                {/* policy */}
                <div
                  onMouseEnter={() => setActiveHighlight('policy')}
                  className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeHighlight === 'policy'
                      ? 'bg-emerald-50 text-emerald-950 font-semibold'
                      : 'hover:bg-black/[0.02]'
                  }`}
                >
                  <span className="w-24 shrink-0 text-[#77756E]">policy</span>
                  <span className="text-[#858875] font-semibold flex-1">pii · tone · scope — 3/3 passed</span>
                </div>

                {/* runs in */}
                <div
                  onMouseEnter={() => setActiveHighlight('runs')}
                  className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeHighlight === 'runs'
                      ? 'bg-[#EFEBE2] text-[#20201D] font-semibold'
                      : 'hover:bg-black/[0.02]'
                  }`}
                >
                  <span className="w-24 shrink-0 text-[#77756E]">runs in</span>
                  <span className="text-[#77756E] flex-1">managed cloud · eu-west</span>
                </div>

                {/* output */}
                <div
                  onMouseEnter={() => setActiveHighlight('output')}
                  className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeHighlight === 'output'
                      ? 'bg-amber-50 text-amber-950 font-bold'
                      : 'hover:bg-black/[0.02]'
                  }`}
                >
                  <span className="w-24 shrink-0 text-[#77756E]">output</span>
                  <span className="font-bold text-[#111] flex-1">"Approve — tier B rating"</span>
                </div>

                {/* replay row matching Image 3 with blue Replay button */}
                <div
                  onMouseEnter={() => setActiveHighlight('replay')}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeHighlight === 'replay' || replaying
                      ? 'bg-[#EFEBE2] border border-[#20201D]/20 shadow-xs'
                      : 'bg-[#F5F3ED] border border-[#DEDAD0] hover:bg-[#EFEBE2]'
                  }`}
                >
                  <div className="flex items-center flex-1">
                    <span className="w-24 shrink-0 text-[#77756E]">replay</span>
                    <span className="text-[#20201D] font-normal">
                      {replaying ? 'replaying bit-for-bit...' : 'verified · zero divergence'}
                    </span>
                  </div>
                  <button
                    onClick={triggerReplay}
                    className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1.5 font-sans font-medium transition-all ml-4 shrink-0 active:scale-95 group/btn"
                  >
                    <RefreshCw
                      size={12}
                      className={`transition-transform ${replaying ? 'animate-spin' : 'group-hover/btn:rotate-180 duration-500'}`}
                    />
                    <span>Replay</span>
                  </button>
                </div>

                {/* drift */}
                <div
                  onMouseEnter={() => setActiveHighlight('drift')}
                  className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeHighlight === 'drift'
                      ? 'bg-[#EFEBE2] text-[#20201D] font-semibold'
                      : 'hover:bg-black/[0.02]'
                  }`}
                >
                  <span className="w-24 shrink-0 text-[#77756E]">drift</span>
                  <span className="text-[#77756E] flex-1">none in 41 days</span>
                </div>

                {/* signature */}
                <div
                  onMouseEnter={() => setActiveHighlight('signature')}
                  className={`flex items-baseline px-2.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                    activeHighlight === 'signature'
                      ? 'bg-[#EFEBE2] text-[#20201D] font-semibold'
                      : 'hover:bg-black/[0.02]'
                  }`}
                >
                  <span className="w-24 shrink-0 text-[#77756E]">signature</span>
                  <span className="text-[#77756E] flex-1">ed25519 9c0b...7712</span>
                </div>
              </div>

              <div className="border-t border-[#E8E4DA] my-3" />

              {/* Footer matching Image 3 */}
              <div className="flex items-center gap-2 pt-1 text-xs text-[#77756E]">
                <CheckCircle2 size={15} className="text-emerald-700 shrink-0" />
                <span>Replayed six months later — the same output, byte for byte</span>
              </div>
            </div>

            {/* Right: Interactive Knowledge Graph */}
            <div className="lg:col-span-7">
              <KnowledgeGraphInteractive />
            </div>
          </div>

          {/* Ten Signature Differentiators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                num: '01',
                title: 'Cross-Notebook Intelligence',
                badge: 'Core',
                desc: 'Understand relationships across your entire knowledge library rather than isolating documents into separate siloed folders.',
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
                className="bg-white border border-[#DEDAD0] rounded-3xl p-7 shadow-xs hover:border-[#20201D]/40 hover-lift transition-all duration-300 group cursor-default relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-[#20201D] transition-colors duration-300" />
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-[#858875] group-hover:text-[#20201D] transition-colors">
                    {f.num}
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-[#EFEBE2] text-[#77756E] border border-[#DEDAD0] group-hover:border-[#20201D]/20 transition-all">
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-lg font-serif font-semibold text-[#20201D] mb-2 group-hover:translate-x-0.5 transition-transform duration-200">
                  {f.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#77756E] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 06: THE LEARNING INTELLIGENCE ECOSYSTEM
      ========================================================================= */}
      <section id="learning" className="bg-[#EAE6DC] border-b border-[#DEDAD0] py-20 sm:py-28">
        <div className="max-w-[1240px] mx-auto px-6 mb-14 text-left">
          <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase block mb-2 font-semibold">
            LEARNING INTELLIGENCE · SEC. 04
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#20201D] tracking-tight">
            Research doesn’t end with understanding.
          </h2>
          <p className="text-sm sm:text-base text-[#77756E] mt-3 leading-relaxed max-w-2xl">
            SYNORA transforms raw literature into durable cognitive mastery through active recall, two-speaker debates, Socratic interrogation, and adaptive assessment.
          </p>
        </div>

        <LearningEcosystemDemo />
      </section>

      {/* =========================================================================
          SECTION 07: WHY SYNORA IS DIFFERENT (Where being wrong is expensive)
      ========================================================================= */}
      <section id="solutions" className="bg-[#FBFAF6] border-b border-[#DEDAD0] py-20 sm:py-28">
        <div className="max-w-[1240px] mx-auto px-6 mb-14 text-left">
          <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase block mb-2 font-semibold">
            RESEARCH SOLUTIONS · SEC. 05
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#20201D] tracking-tight">
            Where being wrong is expensive.
          </h2>
          <p className="text-sm sm:text-base text-[#77756E] mt-3 leading-relaxed max-w-2xl">
            Engineered for high-stakes inquiry where hallucinations carry severe clinical, legal, or strategic consequences. Click any domain to expand its verified workflow.
          </p>
        </div>

        <SolutionsAccordion />
      </section>

      {/* =========================================================================
          SECTION 08: RESEARCH PRIVACY & DATA SOVEREIGNTY
      ========================================================================= */}
      <section id="security" className="bg-[#E8E4DA] border-b border-[#DEDAD0] py-20 sm:py-28">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left: Fortress Pen & Ink Engraving */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="p-8 rounded-3xl bg-[#FBFAF6] border border-[#DEDAD0] shadow-sm max-w-md w-full text-center hover-lift transition-all">
                <Image
                  src="/illustrations/security_cottage.png"
                  alt="Sovereign research fortress"
                  width={340}
                  height={280}
                  className="w-full h-auto object-contain filter contrast-105 mb-4 mx-auto"
                />
                <div className="text-xs font-mono text-[#858875] tracking-widest uppercase">
                  SOVEREIGN ENCLAVE · ROW-LEVEL SECURITY
                </div>
              </div>
            </div>

            {/* Right: Security & Privacy Commitments */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div>
                <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase block mb-2 font-semibold">
                  PRIVACY & DATA SOVEREIGNTY · SEC. 06
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#20201D] tracking-tight">
                  Your research never leaves your perimeter.
                </h2>
                <p className="text-sm sm:text-base text-[#77756E] mt-3 leading-relaxed">
                  We believe institutional knowledge must remain sovereign. SYNORA is architected with strict tenant isolation, signed provenance, and zero third-party model training.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {[
                  {
                    title: 'Private Isolated Notebooks',
                    desc: 'Each notebook operates as an air-gapped knowledge enclave accessible only by authorized team credentials.',
                  },
                  {
                    title: 'Row-Level Security (RLS)',
                    desc: 'Database access policies enforce cryptographic boundaries at the PostgreSQL kernel level.',
                  },
                  {
                    title: 'Zero Model Training',
                    desc: 'Your uploaded source PDFs, notes, and citations are never used to train foundation models.',
                  },
                  {
                    title: 'Signed Provenance Trails',
                    desc: 'Every synthesized output is hashed with SHA-256 for deterministic compliance audit.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#FBFAF6] border border-[#DEDAD0]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <ShieldCheck size={16} className="text-[#858875]" />
                      <h4 className="text-xs font-semibold text-[#20201D]">{item.title}</h4>
                    </div>
                    <p className="text-[11px] text-[#77756E] leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#20201D] hover:underline"
                >
                  Inspect enterprise sovereignty documentation <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 09: RESEARCH WORKFLOW SHOWCASE (Flow Diagram)
      ========================================================================= */}
      <section className="bg-[#EFEBE2] border-b border-[#DEDAD0] py-20 sm:py-28">
        <div className="max-w-[1240px] mx-auto px-6 mb-14 text-left">
          <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase block mb-2 font-semibold">
            PIPELINE TELEMETRY · SEC. 07
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal text-[#20201D] tracking-tight">
            The Complete Research Journey.
          </h2>
          <p className="text-sm sm:text-base text-[#77756E] mt-3 leading-relaxed max-w-2xl">
            From raw source ingestion to verifiable executive decisions. Click any stage to inspect the technical specification and latency benchmarks.
          </p>
        </div>

        <WorkflowPipelineFlow />
      </section>

      {/* =========================================================================
          SECTION 10: FINAL CONVERSION & PANORAMIC EDITORIAL FOOTER
      ========================================================================= */}
      <section className="bg-[#252520] text-[#F5F3ED] py-24 sm:py-32 relative overflow-hidden">
        <div className="max-w-[1140px] mx-auto px-6 text-center relative z-10">
          <span className="text-[11px] font-mono tracking-widest text-[#D6C9B5] uppercase block mb-4">
            BEGIN REVOLUTIONARY INQUIRY
          </span>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-normal tracking-tight mb-6 leading-tight max-w-3xl mx-auto">
            Your next breakthrough starts with understanding.
          </h2>

          <p className="text-sm sm:text-base text-[#D6C9B5]/80 max-w-xl mx-auto leading-relaxed mb-10">
            Bring your sources together. Discover what connects them. Build knowledge that goes beyond the page.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/dashboard"
              className="bg-[#FBFAF6] hover:bg-white text-[#20201D] text-sm font-semibold px-7 py-3.5 rounded-xl transition-all shadow-md hover:scale-102 active:scale-95 flex items-center gap-2 group"
            >
              <span>Start your research</span>
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>

            <Link
              href="/dashboard"
              className="bg-transparent hover:bg-white/10 text-[#F5F3ED] text-sm font-medium px-6 py-3.5 rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
            >
              <span>Explore workspace</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Panoramic Mountain Range Engraving Footer */}
      <footer className="bg-[#F5F3ED] border-t border-[#DEDAD0] pt-16 pb-12">
        <div className="max-w-[1240px] mx-auto px-6">
          {/* Panoramic Mountain Artwork */}
          <div className="relative w-full max-w-[980px] mx-auto mb-16 opacity-85 hover:opacity-100 transition-opacity duration-500">
            <Image
              src="/illustrations/mountain_panorama.png"
              alt="Hand-drawn panoramic mountain range"
              width={980}
              height={140}
              className="w-full h-auto object-contain filter contrast-105"
            />
          </div>

          {/* Directory Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-[#DEDAD0] text-xs text-left">
            <div>
              <div className="font-mono text-[10px] text-[#858875] uppercase tracking-wider mb-3 font-semibold">
                Product
              </div>
              <ul className="space-y-2 text-[#77756E]">
                <li><Link href="/dashboard" className="hover:text-[#20201D]">Workspace</Link></li>
                <li><Link href="/dashboard" className="hover:text-[#20201D]">Notebook Studio</Link></li>
                <li><a href="#platform" className="hover:text-[#20201D]">GraphRAG</a></li>
                <li><a href="#learning" className="hover:text-[#20201D]">Audio Overviews</a></li>
                <li><a href="#learning" className="hover:text-[#20201D]">Recall Flashcards</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-[10px] text-[#858875] uppercase tracking-wider mb-3 font-semibold">
                Intelligence
              </div>
              <ul className="space-y-2 text-[#77756E]">
                <li><a href="#platform" className="hover:text-[#20201D]">Deterministic Replay</a></li>
                <li><a href="#how-it-works" className="hover:text-[#20201D]">Contradiction Engine</a></li>
                <li><a href="#platform" className="hover:text-[#20201D]">Dynamic Evidence Maps</a></li>
                <li><a href="#learning" className="hover:text-[#20201D]">Multiple Perspectives</a></li>
                <li><a href="#platform" className="hover:text-[#20201D]">Research Watchtower</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-[10px] text-[#858875] uppercase tracking-wider mb-3 font-semibold">
                Solutions
              </div>
              <ul className="space-y-2 text-[#77756E]">
                <li><a href="#solutions" className="hover:text-[#20201D]">Academic Literature</a></li>
                <li><a href="#solutions" className="hover:text-[#20201D]">Strategic Intelligence</a></li>
                <li><a href="#solutions" className="hover:text-[#20201D]">Clinical & Pharmacology</a></li>
                <li><a href="#solutions" className="hover:text-[#20201D]">Regulatory Compliance</a></li>
                <li><a href="#solutions" className="hover:text-[#20201D]">Engineering Systems</a></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-[10px] text-[#858875] uppercase tracking-wider mb-3 font-semibold">
                Resources
              </div>
              <ul className="space-y-2 text-[#77756E]">
                <li><Link href="/dashboard" className="hover:text-[#20201D]">Documentation</Link></li>
                <li><a href="https://github.com/Lokesh0652H/SYNORA" target="_blank" rel="noopener noreferrer" className="hover:text-[#20201D]">GitHub Repository ↗</a></li>
                <li><a href="#how-it-works" className="hover:text-[#20201D]">Architecture Guide</a></li>
                <li><Link href="/login" className="hover:text-[#20201D]">API Reference</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-mono text-[10px] text-[#858875] uppercase tracking-wider mb-3 font-semibold">
                Sovereignty
              </div>
              <ul className="space-y-2 text-[#77756E]">
                <li><a href="#security" className="hover:text-[#20201D]">Privacy Policy</a></li>
                <li><a href="#security" className="hover:text-[#20201D]">Terms of Service</a></li>
                <li><a href="#security" className="hover:text-[#20201D]">Tenant Isolation</a></li>
                <li><a href="#security" className="hover:text-[#20201D]">Audit Trails</a></li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Operational Status */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#77756E]">
            <div className="flex items-center gap-3">
              <span className="w-4 h-4 bg-[#20201D] text-white flex items-center justify-center text-[9px] font-bold rounded-sm">
                ■
              </span>
              <span>SYNORA Research Technologies © 2026. All rights reserved.</span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-[#858875]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>DETERMINISTIC ENGINE · ALL WORKSPACES OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
