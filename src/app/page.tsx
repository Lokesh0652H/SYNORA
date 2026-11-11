'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  FileText,
  Network,
  Sparkles,
  Layers,
  Search,
  Bot,
  Brain,
  Zap,
  Bell,
  Map,
  Clock,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sun,
  Send,
  Plus,
  Mic,
  CornerDownLeft,
  ChevronDown,
} from 'lucide-react';
import AsciiSharkMotion from '@/components/AsciiSharkMotion';
import Living3DEcosystem from '@/components/living-3d';

export default function LandingPage() {
  const [demoPrompt, setDemoPrompt] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeQuizOption, setActiveQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [flippedCard, setFlippedCard] = useState(false);
  const [activeMindNode, setActiveMindNode] = useState<string>('core');
  const [lightTheme, setLightTheme] = useState(true);

  // Audio simulation timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setTimeout(() => setIsPlayingAudio(false), 8000);
    }
    return () => clearTimeout(interval);
  }, [isPlayingAudio]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3ED] text-[#20201D] font-sans selection:bg-[#20201D] selection:text-[#FBFAF6] relative overflow-x-hidden">
      {/* =========================================================================
          LIVING 3D INTERACTIVE ECOSYSTEM (In Background behind cards: z-0)
      ========================================================================= */}
      <Living3DEcosystem />

      {/* =========================================================================
          SECTION 1: NAVBAR (Exact match to top bar of image)
      ========================================================================= */}
      <header className="sticky top-0 z-40 bg-[#F5F3ED]/92 backdrop-blur-md border-b border-[#DEDAD0] transition-colors">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-lg bg-[#20201D] flex items-center justify-center text-white shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full border-2 border-white" />
            </div>
            <span className="font-serif font-bold text-lg tracking-tight text-[#20201D]">
              SYNORA
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-[13px] text-[#55534E] font-medium">
            <button
              onClick={() => scrollToSection('journey')}
              className="hover:text-[#20201D] transition-colors cursor-pointer"
            >
              How it works
            </button>
            <button
              onClick={() => scrollToSection('intelligence-core')}
              className="hover:text-[#20201D] transition-colors cursor-pointer"
            >
              Intelligence Core
            </button>
            <button
              onClick={() => scrollToSection('product-demo')}
              className="hover:text-[#20201D] transition-colors cursor-pointer"
            >
              Research Solutions
            </button>
            <button
              onClick={() => scrollToSection('learning-ecosystem')}
              className="hover:text-[#20201D] transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            <div className="relative group cursor-pointer flex items-center gap-1 hover:text-[#20201D]">
              <span>Knowledge</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
            </div>
          </nav>

          {/* Right Action Cluster */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLightTheme(!lightTheme)}
              className="p-2 rounded-full text-[#66635B] hover:text-[#20201D] hover:bg-[#EFEBE2] transition-colors cursor-pointer"
              title="Toggle theme"
              aria-label="Toggle theme"
            >
              <Sun className="w-4 h-4" />
            </button>

            <Link
              href="/login"
              className="text-[13px] font-medium text-[#4A4740] hover:text-[#20201D] transition-colors hidden sm:inline-block"
            >
              Sign in
            </Link>

            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#20201D] hover:bg-black text-[#FBFAF6] text-[13px] font-medium shadow-sm hover:shadow-md transition-all active:scale-98"
            >
              <span>Get started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* =========================================================================
          SECTION 2: CINEMATIC HERO (Exact match to split layout in image)
      ========================================================================= */}
      <section id="hero" className="relative pt-12 sm:pt-16 pb-20 sm:pb-28 border-b border-[#DEDAD0]/60 z-10">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-6 space-y-6 text-left">
              {/* Category Tag */}
              <div className="inline-block text-[11px] font-mono tracking-widest uppercase text-[#858875] font-semibold">
                AI RESEARCH INTELLIGENCE
              </div>

              {/* Master Heading */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-[58px] font-normal leading-[1.12] text-[#20201D] tracking-tight">
                Don’t just store knowledge. <br />
                <span className="italic font-serif">Understand, challenge, and act.</span>
                <span className="inline-block w-1.5 h-8 bg-[#20201D] ml-2 align-middle animate-pulse" />
              </h1>

              {/* Subheading Paragraph */}
              <p className="text-base sm:text-lg text-[#6E6A61] leading-relaxed max-w-xl font-normal">
                SYNORA transforms scattered information into connected knowledge, verifiable intelligence, and actionable understanding.
              </p>

              {/* CTA Button Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#20201D] hover:bg-black text-[#FBFAF6] text-sm font-medium shadow-sm hover:shadow-md hover:scale-102 active:scale-98 transition-all"
                >
                  <span>Start research workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => scrollToSection('product-demo')}
                  className="inline-flex items-center gap-2.5 px-5 py-3 rounded-full bg-[#FBFAF6] hover:bg-[#EFEBE2] text-[#20201D] border border-[#DEDAD0] text-sm font-medium transition-all shadow-xs cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full bg-[#20201D] text-white flex items-center justify-center">
                    <Play className="w-2.5 h-2.5 ml-0.5 fill-white" />
                  </span>
                  <span>Watch demo</span>
                </button>
              </div>

              {/* 3 Stats Row with Vertical Dividers */}
              <div className="pt-8 border-t border-[#E5E0D5] flex items-center gap-8 sm:gap-12">
                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                    25+
                  </div>
                  <div className="text-xs text-[#8A877D] font-mono mt-0.5">Powerful features</div>
                </div>

                <div className="w-px h-10 bg-[#DEDAD0]" />

                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                    100%
                  </div>
                  <div className="text-xs text-[#8A877D] font-mono mt-0.5">Research grounded</div>
                </div>

                <div className="w-px h-10 bg-[#DEDAD0]" />

                <div>
                  <div className="font-serif text-2xl sm:text-3xl font-medium text-[#20201D]">
                    ∞
                  </div>
                  <div className="text-xs text-[#8A877D] font-mono mt-0.5">Possibilities</div>
                </div>
              </div>
            </div>

            {/* Right Column: Sunlit Mountain & Vertical Research Nav */}
            <div className="lg:col-span-6 relative flex items-center justify-center">
              {/* Vertical Research Nav (matching top right of image) */}
              <div className="absolute top-2 right-4 sm:right-8 z-20 hidden sm:flex flex-col items-start gap-3 bg-[#FBFAF6]/85 backdrop-blur-md px-3.5 py-3 rounded-xl border border-[#DEDAD0] shadow-xs text-xs font-mono text-[#5A554A]">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#20201D]" />
                  <span>Research</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A877D]" />
                  <span>Connect</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A877D]" />
                  <span>Learn</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8A877D]" />
                  <span>Grow</span>
                </div>
                <div className="w-full flex justify-center pt-0.5 opacity-60">
                  <span>▾</span>
                </div>
              </div>

              {/* Sunlit Mountain Illustration */}
              <div className="relative w-full max-w-[560px] aspect-[4/3] rounded-2xl overflow-hidden">
                <Image
                  src="/illustrations/hero_mountain_trans.png"
                  alt="SYNORA Alpine Mountain"
                  fill
                  priority
                  className="object-contain drop-shadow-md select-none pointer-events-none scale-105"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE RESEARCH JOURNEY (Connect, Verify, Act)
      ========================================================================= */}
      <section id="journey" className="py-20 sm:py-24 border-b border-[#DEDAD0]/60 relative z-10 bg-[#EFEBE2]/40">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 text-center">
          {/* Section Subtitle */}
          <div className="text-[11px] font-mono tracking-widest uppercase text-[#858875] font-semibold mb-3">
            — THE RESEARCH JOURNEY —
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#20201D] font-normal mb-12 tracking-tight">
            From scattered papers to verifiable intelligence.
          </h2>

          {/* 3 Horizontal Connected Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative items-center max-w-5xl mx-auto">
            {/* Card 1: CONNECT */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-2xl p-6 sm:p-8 text-left shadow-xs hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center text-[#20201D] mb-5">
                <FileText className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="text-xs font-mono font-bold tracking-wider text-[#20201D] uppercase">
                CONNECT
              </div>
              <p className="text-sm text-[#6E6A61] mt-2 leading-relaxed">
                Bring research sources together in one place.
              </p>
            </div>

            {/* Arrow connector 1 */}
            <div className="hidden md:flex justify-center text-[#8A877D] text-lg font-mono">
              →
            </div>

            {/* Card 2: VERIFY */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-2xl p-6 sm:p-8 text-left shadow-xs hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center text-[#20201D] mb-5">
                <Network className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="text-xs font-mono font-bold tracking-wider text-[#20201D] uppercase">
                VERIFY
              </div>
              <p className="text-sm text-[#6E6A61] mt-2 leading-relaxed">
                Understand claims and evaluate evidence.
              </p>
            </div>

            {/* Arrow connector 2 */}
            <div className="hidden md:flex justify-center text-[#8A877D] text-lg font-mono">
              →
            </div>

            {/* Card 3: ACT */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-2xl p-6 sm:p-8 text-left shadow-xs hover:shadow-md transition-shadow relative">
              <div className="w-12 h-12 rounded-xl bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center text-[#20201D] mb-5">
                <Sparkles className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div className="text-xs font-mono font-bold tracking-wider text-[#20201D] uppercase">
                ACT
              </div>
              <p className="text-sm text-[#6E6A61] mt-2 leading-relaxed">
                Turn knowledge into meaningful outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PRODUCT DEMO (Living Workspace Showcase)
      ========================================================================= */}
      <section id="product-demo" className="py-20 sm:py-28 border-b border-[#DEDAD0]/60 relative z-10 bg-[#FBFAF6]">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Explanatory Content & 4 Bullets */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="text-[11px] font-mono tracking-widest uppercase text-[#858875] font-semibold">
                PRODUCT DEMO —
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#20201D] font-normal leading-tight tracking-tight">
                Research is more than asking questions.
              </h2>

              <p className="text-sm sm:text-base text-[#6E6A61] leading-relaxed">
                Explore, analyze and synthesize information with an intelligent research environment.
              </p>

              {/* 4 Numbered Bullets */}
              <div className="space-y-4 pt-2">
                {[
                  { id: '1', title: 'Add multiple sources', icon: '≡' },
                  { id: '2', title: 'Let SYNORA process', icon: 'λ' },
                  { id: '3', title: 'Ask complex questions', icon: 'i' },
                  { id: '4', title: 'Discover insights', icon: '✦' },
                ].map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm text-[#3A3730] font-medium">
                    <span className="w-6 h-6 rounded-full bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center font-mono text-xs text-[#20201D]">
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#20201D] hover:bg-black text-[#FBFAF6] text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-98"
                >
                  <span>Try it yourself</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: Full Dashboard Card with ASCII Fish Simulation */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-[#DEDAD0] bg-[#FAF8F5] shadow-xl overflow-hidden relative">
                {/* Top Window Bar */}
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

                {/* Dashboard Inner Body */}
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

                  {/* Main Workspace Area with Creature Simulation */}
                  <div className="col-span-12 sm:col-span-9 p-6 relative flex flex-col justify-between bg-[#FAF8F5]">
                    {/* Top Controls */}
                    <div className="flex items-center justify-between text-xs mb-4">
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

                    {/* Central Creature & Title */}
                    <div className="relative my-6 text-center">
                      {/* ASCII Creature Simulation */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-85">
                        <AsciiSharkMotion />
                      </div>

                      <div className="relative z-10 py-6">
                        <h3 className="font-serif text-3xl sm:text-4xl text-[#20201D] font-normal tracking-tight">
                          what’s on your mind?
                        </h3>
                      </div>
                    </div>

                    {/* Floating Prompt Bar */}
                    <div className="mt-4 bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-2.5 shadow-md flex items-center gap-3">
                      <span className="text-[#8A877D] hover:text-[#20201D] cursor-pointer">
                        <Plus className="w-4 h-4" />
                      </span>
                      <span className="text-[#8A877D] hover:text-[#20201D] cursor-pointer">
                        <Mic className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        placeholder="Ask Synora anything..."
                        value={demoPrompt}
                        onChange={(e) => setDemoPrompt(e.target.value)}
                        className="flex-1 bg-transparent text-xs text-[#20201D] placeholder-[#A09D94] outline-none"
                      />
                      <div className="hidden sm:flex items-center gap-2 text-[10px] font-mono text-[#8A877D]">
                        <span>↵ send</span>
                        <span>⇧↵ newline</span>
                      </div>
                      <Link
                        href="/dashboard"
                        className="w-7 h-7 rounded-lg bg-[#20201D] text-white flex items-center justify-center hover:bg-black transition-colors"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: INTELLIGENCE CORE (Exact 6x2 grid of cards from image)
      ========================================================================= */}
      <section id="intelligence-core" className="py-20 sm:py-28 border-b border-[#DEDAD0]/60 relative z-10 bg-[#EFEBE2]/30">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 text-center">
          <div className="text-[11px] font-mono tracking-widest uppercase text-[#858875] font-semibold mb-3">
            — INTELLIGENCE CORE —
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#20201D] font-normal mb-14 tracking-tight">
            An entire research ecosystem. One intelligence layer.
          </h2>

          {/* 6-Column Grid x 2 Rows */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 max-w-[1280px] mx-auto text-left">
            {/* Card 1: Cross-Notebook Intelligence */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#20201D] transition-all group">
              <div>
                <FileText className="w-5 h-5 text-[#858875] mb-3 stroke-[1.5]" />
                <h4 className="font-medium text-xs text-[#20201D] leading-snug">
                  Cross-Notebook Intelligence
                </h4>
                <p className="text-[11px] text-[#77756E] mt-1 leading-normal">
                  Connect ideas across notebooks.
                </p>
              </div>
            </div>

            {/* Card 2: Dynamic Knowledge Graph */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#20201D] transition-all group">
              <div>
                <Network className="w-5 h-5 text-[#858875] mb-3 stroke-[1.5]" />
                <h4 className="font-medium text-xs text-[#20201D] leading-snug">
                  Dynamic Knowledge Graph
                </h4>
                <p className="text-[11px] text-[#77756E] mt-1 leading-normal">
                  Discover relationships.
                </p>
              </div>
            </div>

            {/* Card 3: Evidence Detection */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#20201D] transition-all group">
              <div>
                <CheckCircle2 className="w-5 h-5 text-[#858875] mb-3 stroke-[1.5]" />
                <h4 className="font-medium text-xs text-[#20201D] leading-snug">
                  Evidence Detection
                </h4>
                <p className="text-[11px] text-[#77756E] mt-1 leading-normal">
                  Find contradictions.
                </p>
              </div>
            </div>

            {/* Card 4: Deterministic Retrieval */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#20201D] transition-all group">
              <div>
                <Search className="w-5 h-5 text-[#858875] mb-3 stroke-[1.5]" />
                <h4 className="font-medium text-xs text-[#20201D] leading-snug">
                  Deterministic Retrieval
                </h4>
                <p className="text-[11px] text-[#77756E] mt-1 leading-normal">
                  Get reliable results.
                </p>
              </div>
            </div>

            {/* Card 5: Autonomous Research Agent */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#20201D] transition-all group">
              <div>
                <Bot className="w-5 h-5 text-[#858875] mb-3 stroke-[1.5]" />
                <h4 className="font-medium text-xs text-[#20201D] leading-snug">
                  Autonomous Research Agent
                </h4>
                <p className="text-[11px] text-[#77756E] mt-1 leading-normal">
                  Automate deep research.
                </p>
              </div>
            </div>

            {/* Card 6: Multiple Perspectives */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#20201D] transition-all group">
              <div>
                <Layers className="w-5 h-5 text-[#858875] mb-3 stroke-[1.5]" />
                <h4 className="font-medium text-xs text-[#20201D] leading-snug">
                  Multiple Perspectives
                </h4>
                <p className="text-[11px] text-[#77756E] mt-1 leading-normal">
                  Explore from different angles.
                </p>
              </div>
            </div>

            {/* Row 2 - Card 7: Adaptive Learning */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#20201D] transition-all group">
              <div>
                <Brain className="w-5 h-5 text-[#858875] mb-3 stroke-[1.5]" />
                <h4 className="font-medium text-xs text-[#20201D] leading-snug">
                  Adaptive Learning
                </h4>
                <p className="text-[11px] text-[#77756E] mt-1 leading-normal">
                  Turn research into personalized learning.
                </p>
              </div>
            </div>

            {/* Card 8: Knowledge-to-Action */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#20201D] transition-all group">
              <div>
                <Zap className="w-5 h-5 text-[#858875] mb-3 stroke-[1.5]" />
                <h4 className="font-medium text-xs text-[#20201D] leading-snug">
                  Knowledge-to-Action
                </h4>
                <p className="text-[11px] text-[#77756E] mt-1 leading-normal">
                  Convert insights into real action.
                </p>
              </div>
            </div>

            {/* Card 9: Research Watchtower */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#20201D] transition-all group">
              <div>
                <Bell className="w-5 h-5 text-[#858875] mb-3 stroke-[1.5]" />
                <h4 className="font-medium text-xs text-[#20201D] leading-snug">
                  Research Watchtower
                </h4>
                <p className="text-[11px] text-[#77756E] mt-1 leading-normal">
                  Stay updated.
                </p>
              </div>
            </div>

            {/* Card 10: Interactive Maps */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#20201D] transition-all group">
              <div>
                <Map className="w-5 h-5 text-[#858875] mb-3 stroke-[1.5]" />
                <h4 className="font-medium text-xs text-[#20201D] leading-snug">
                  Interactive Maps
                </h4>
                <p className="text-[11px] text-[#77756E] mt-1 leading-normal">
                  Visualize connections.
                </p>
              </div>
            </div>

            {/* Card 11: Research Evolution */}
            <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs hover:shadow-sm hover:border-[#20201D] transition-all group">
              <div>
                <Clock className="w-5 h-5 text-[#858875] mb-3 stroke-[1.5]" />
                <h4 className="font-medium text-xs text-[#20201D] leading-snug">
                  Research Evolution
                </h4>
                <p className="text-[11px] text-[#77756E] mt-1 leading-normal">
                  Track your learning.
                </p>
              </div>
            </div>

            {/* Card 12: Architectural Arches "And much more... →" */}
            <div className="bg-[#ECE7DC] border border-[#DEDAD0] rounded-xl p-4 flex flex-col justify-between shadow-2xs relative overflow-hidden group cursor-pointer hover:border-[#20201D] transition-all">
              {/* Architectural Arched Colonnade illustration / styling */}
              <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#D5CBB8_1px,transparent_1px)] [background-size:12px_12px]" />
              <div className="absolute right-0 top-0 w-28 h-28 border-l border-b border-[#C8BDAB] rounded-bl-full opacity-60" />
              <div className="absolute right-2 top-2 w-20 h-20 border-l border-b border-[#C8BDAB] rounded-bl-full opacity-40" />

              <div className="relative z-10 pt-8" />
              <div className="relative z-10 pt-4 flex items-center justify-between text-xs font-medium text-[#20201D]">
                <span>And much more...</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: LEARNING ECOSYSTEM (Audio, Flashcards, Mind Map, Quizzes)
      ========================================================================= */}
      <section id="learning-ecosystem" className="py-20 sm:py-28 border-b border-[#DEDAD0]/60 relative z-10 bg-[#FBFAF6]">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Heading & Explore Button */}
            <div className="lg:col-span-5 space-y-6 text-left">
              <div className="text-[11px] font-mono tracking-widest uppercase text-[#858875] font-semibold">
                LEARNING ECOSYSTEM
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-[#20201D] font-normal leading-tight tracking-tight">
                Research doesn’t end with understanding.
              </h2>

              <p className="text-sm sm:text-base text-[#6E6A61] leading-relaxed">
                Turn research into skills with interactive tools built for modern learners.
              </p>

              <div className="pt-2">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#20201D] hover:bg-black text-[#FBFAF6] text-sm font-medium shadow-sm hover:shadow-md transition-all active:scale-98"
                >
                  <span>Explore learning tools</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column: 4 Interactive Learning Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Card 1: Audio Overviews */}
              <div className="bg-[#FAF8F5] border border-[#DEDAD0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div className="text-xs font-mono text-[#8A877D] uppercase mb-4">
                  Audio Overviews
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-full bg-[#20201D] text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer shrink-0 shadow-sm"
                    aria-label="Play audio briefing"
                  >
                    <Play className={`w-3.5 h-3.5 ml-0.5 ${isPlayingAudio ? 'fill-white animate-pulse' : 'fill-white'}`} />
                  </button>
                  {/* Waveform Visualization */}
                  <div className="flex-1 flex items-center gap-0.5 h-8">
                    {[12, 24, 18, 28, 14, 32, 20, 26, 16, 22, 30, 15, 25, 19, 27, 14, 21].map((h, i) => (
                      <span
                        key={i}
                        className={`w-1 rounded-full transition-all duration-300 ${
                          isPlayingAudio ? 'bg-[#20201D]' : 'bg-[#D5D0C5]'
                        }`}
                        style={{ height: `${isPlayingAudio ? (h * 1.2) % 32 + 6 : h * 0.7}px` }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-[#77756E]">12:36</span>
                </div>
              </div>

              {/* Card 2: Flashcards */}
              <div
                onClick={() => setFlippedCard(!flippedCard)}
                className="bg-[#FAF8F5] border border-[#DEDAD0] rounded-2xl p-5 shadow-xs flex flex-col justify-between cursor-pointer hover:border-[#20201D] transition-all"
              >
                <div className="flex justify-between items-center text-xs font-mono text-[#8A877D] uppercase mb-3">
                  <span>Flashcards</span>
                  <span className="text-[10px] text-[#A09D94]">Click to flip</span>
                </div>
                <div className="flex items-center justify-center gap-3 py-2">
                  <div className={`w-14 h-16 rounded-xl border flex items-center justify-center font-serif text-lg font-bold transition-all shadow-xs ${
                    !flippedCard ? 'bg-white border-[#20201D] text-[#20201D]' : 'bg-[#EFEBE2] border-[#DEDAD0] text-[#8A877D]'
                  }`}>
                    Q
                  </div>
                  <div className={`w-14 h-16 rounded-xl border flex items-center justify-center font-serif text-lg font-bold transition-all shadow-xs ${
                    flippedCard ? 'bg-[#20201D] border-[#20201D] text-white' : 'bg-white border-[#DEDAD0] text-[#20201D]'
                  }`}>
                    A
                  </div>
                </div>
              </div>

              {/* Card 3: Mind Map */}
              <div className="bg-[#FAF8F5] border border-[#DEDAD0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div className="text-xs font-mono text-[#8A877D] uppercase mb-2">
                  Mind Map
                </div>
                <div className="relative h-20 flex items-center justify-center">
                  {/* Central Node */}
                  <div className="w-7 h-7 rounded-full bg-[#20201D] text-white flex items-center justify-center font-mono text-[9px] shadow-sm z-10">
                    ⌘
                  </div>
                  {/* Surrounding Nodes */}
                  <div className="absolute top-1 left-8 w-5 h-5 rounded-full bg-[#EAE6DC] border border-[#DEDAD0] flex items-center justify-center text-[8px] font-mono">
                    α
                  </div>
                  <div className="absolute top-1 right-8 w-5 h-5 rounded-full bg-[#EAE6DC] border border-[#DEDAD0] flex items-center justify-center text-[8px] font-mono">
                    β
                  </div>
                  <div className="absolute bottom-1 left-8 w-5 h-5 rounded-full bg-[#EAE6DC] border border-[#DEDAD0] flex items-center justify-center text-[8px] font-mono">
                    γ
                  </div>
                  <div className="absolute bottom-1 right-8 w-5 h-5 rounded-full bg-[#EAE6DC] border border-[#DEDAD0] flex items-center justify-center text-[8px] font-mono">
                    δ
                  </div>
                  {/* Connecting Cross Lines */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-24 h-px bg-[#D5D0C5]" />
                    <div className="h-16 w-px bg-[#D5D0C5] absolute" />
                  </div>
                </div>
              </div>

              {/* Card 4: Quizzes */}
              <div className="bg-[#FAF8F5] border border-[#DEDAD0] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
                <div className="text-xs font-mono text-[#8A877D] uppercase mb-1">
                  Quizzes
                </div>
                <div className="text-xs font-medium text-[#20201D] mb-2 truncate">
                  What is...
                </div>
                <div className="space-y-1.5 text-xs text-[#55534E]">
                  {[
                    { id: 0, label: 'A', text: 'Option A' },
                    { id: 1, label: 'B', text: 'Option B' },
                    { id: 2, label: 'C', text: 'Option C' },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => setActiveQuizOption(opt.id)}
                      className="flex items-center gap-2 cursor-pointer hover:text-[#20201D]"
                    >
                      <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center text-[9px] ${
                        activeQuizOption === opt.id
                          ? 'border-[#20201D] bg-[#20201D] text-white'
                          : 'border-[#A09D94]'
                      }`}>
                        {activeQuizOption === opt.id && '✓'}
                      </span>
                      <span>{opt.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: DARK CTA BANNER (Planetary Eclipse Horizon)
      ========================================================================= */}
      <section className="py-20 sm:py-24 relative z-10 px-6 sm:px-10">
        <div className="max-w-[1320px] mx-auto rounded-3xl bg-[#141412] text-[#FBFAF6] p-10 sm:p-16 relative overflow-hidden text-center shadow-2xl">
          {/* Glowing Planetary Horizon Arc */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {/* Luminous Eclipse Arc */}
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] sm:w-[1100px] h-[400px] rounded-[100%] border-t border-[#D4AF37]/50 shadow-[0_-20px_100px_rgba(212,175,55,0.25)]" />
            <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[350px] rounded-[100%] bg-gradient-to-b from-[#D4AF37]/15 to-transparent blur-2xl" />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-white leading-tight">
              Your next breakthrough starts with understanding.
            </h2>

            <p className="text-sm sm:text-base text-[#B0ACA2] leading-relaxed">
              Bring your sources together. Discover what connects them. Build knowledge that goes beyond the page.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-full bg-[#FBFAF6] hover:bg-white text-[#141412] text-sm font-medium shadow-md hover:shadow-lg transition-all active:scale-98"
              >
                Start your research →
              </Link>

              <button
                onClick={() => scrollToSection('hero')}
                className="px-6 py-3 rounded-full bg-transparent hover:bg-white/10 text-[#FBFAF6] border border-[#44423C] text-sm font-medium transition-all"
              >
                Explore SYNORA
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 8: FOOTER (Exact 3-column + social match from image)
      ========================================================================= */}
      <footer className="border-t border-[#DEDAD0] bg-[#F5F3ED] py-14 sm:py-16 relative z-10 text-xs text-[#66635B]">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#DEDAD0]/80">
            {/* Brand Column */}
            <div className="md:col-span-4 space-y-3">
              <Link href="/" className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-md bg-[#20201D] flex items-center justify-center text-white">
                  <span className="w-2 h-2 rounded-full border-2 border-white" />
                </div>
                <span className="font-serif font-bold text-base text-[#20201D]">
                  SYNORA
                </span>
              </Link>
              <p className="text-xs text-[#77756E] max-w-xs leading-relaxed font-serif italic">
                Knowledge is not the destination. Understanding is.
              </p>
            </div>

            {/* Navigation Columns */}
            <div className="md:col-span-6 grid grid-cols-3 gap-6">
              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#20201D] font-bold mb-3">
                  Product
                </div>
                <ul className="space-y-2 text-[#55534E]">
                  <li>
                    <Link href="/dashboard" className="hover:text-[#20201D] transition-colors">
                      Workspace
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('intelligence-core')} className="hover:text-[#20201D] transition-colors cursor-pointer">
                      Capabilities
                    </button>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-[#20201D] transition-colors">
                      Pricing
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#20201D] font-bold mb-3">
                  Resources
                </div>
                <ul className="space-y-2 text-[#55534E]">
                  <li>
                    <Link href="/dashboard" className="hover:text-[#20201D] transition-colors">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <button onClick={() => scrollToSection('journey')} className="hover:text-[#20201D] transition-colors cursor-pointer">
                      Guides
                    </button>
                  </li>
                  <li>
                    <Link href="/dashboard" className="hover:text-[#20201D] transition-colors">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <div className="font-mono text-[11px] uppercase tracking-wider text-[#20201D] font-bold mb-3">
                  Community
                </div>
                <ul className="space-y-2 text-[#55534E]">
                  <li>
                    <a
                      href="https://github.com/Lokesh0652H/SYNORA"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[#20201D] transition-colors"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-[#20201D] transition-colors">
                      Discord
                    </a>
                  </li>
                  <li>
                    <a href="mailto:support@synora.internal" className="hover:text-[#20201D] transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Social Icons & Sun Toggle */}
            <div className="md:col-span-2 flex items-start md:justify-end gap-3 text-[#55534E]">
              <a
                href="https://github.com/Lokesh0652H/SYNORA"
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:text-[#20201D] hover:bg-[#EFEBE2] transition-colors"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-1.5 rounded-lg hover:text-[#20201D] hover:bg-[#EFEBE2] transition-colors"
                aria-label="Twitter / X"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-1.5 rounded-lg hover:text-[#20201D] hover:bg-[#EFEBE2] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <button
                onClick={() => setLightTheme(!lightTheme)}
                className="p-1.5 rounded-lg hover:text-[#20201D] hover:bg-[#EFEBE2] transition-colors cursor-pointer"
                aria-label="Toggle theme"
              >
                <Sun className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Bottom Copyright & Legal */}
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#8A877D] text-[11px] font-mono">
            <div>© 2026 SYNORA. All rights reserved.</div>
            <div className="flex items-center gap-6">
              <Link href="/login" className="hover:text-[#20201D] transition-colors">
                Privacy
              </Link>
              <Link href="/login" className="hover:text-[#20201D] transition-colors">
                Terms
              </Link>
              <a href="mailto:contact@synora.internal" className="hover:text-[#20201D] transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
