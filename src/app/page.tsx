'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Play,
  Sun,
  ChevronDown,
  User,
  LogOut,
} from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/browser';
import Living3DEcosystem from '@/components/living-3d';
import HeroMountain3D from '@/components/landing/HeroMountain3D';
import ResearchJourneyInteractive from '@/components/landing/ResearchJourneyInteractive';
import WorkspaceInteractiveShowcase from '@/components/landing/WorkspaceInteractiveShowcase';
import IntelligenceEcosystemMatrix from '@/components/landing/IntelligenceEcosystemMatrix';
import LearningEcosystemInteractiveSuite from '@/components/landing/LearningEcosystemInteractiveSuite';

export default function LandingPage() {
  const [lightTheme, setLightTheme] = useState(true);
  const [authUser, setAuthUser] = useState<{ email?: string; id?: string } | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('synora_auth_user');
      if (stored) {
        setAuthUser(JSON.parse(stored));
      }
    } catch {}

    const db = supabaseBrowser();
    if (db) {
      db.auth.getSession().then(({ data }) => {
        if (data?.session?.user) {
          const u = { email: data.session.user.email, id: data.session.user.id };
          setAuthUser(u);
          localStorage.setItem('synora_auth_user', JSON.stringify(u));
        }
      });
      const { data: authSub } = db.auth.onAuthStateChange((_evt, session) => {
        if (session?.user) {
          const u = { email: session.user.email, id: session.user.id };
          setAuthUser(u);
          localStorage.setItem('synora_auth_user', JSON.stringify(u));
        } else {
          setAuthUser(null);
          localStorage.removeItem('synora_auth_user');
        }
      });
      return () => authSub.subscription.unsubscribe();
    }
  }, []);

  const handleSignOut = async () => {
    const db = supabaseBrowser();
    if (db) {
      await db.auth.signOut();
    }
    localStorage.removeItem('synora_auth_user');
    setAuthUser(null);
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3ED] text-[#20201D] font-sans selection:bg-[#20201D] selection:text-[#FBFAF6] relative overflow-x-hidden">
      {/* =========================================================================
          LIVING 3D INTERACTIVE ECOSYSTEM
          (6 Autonomous roaming artifacts + ambient stardust in background: z-0)
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

            {authUser ? (
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFEBE2] hover:bg-[#E2DFD7] text-[#20201D] text-xs font-mono transition-all"
                  title={authUser.email}
                >
                  <span className="w-5 h-5 rounded-full bg-[#20201D] text-white flex items-center justify-center font-bold text-[10px]">
                    {(authUser.email?.[0] || 'U').toUpperCase()}
                  </span>
                  <span className="max-w-[120px] truncate hidden md:inline">{authUser.email}</span>
                </Link>

                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#20201D] hover:bg-black text-[#FBFAF6] text-[13px] font-medium shadow-sm hover:shadow-md transition-all active:scale-98"
                >
                  <span>Go to Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <button
                  type="button"
                  onClick={handleSignOut}
                  className="text-xs text-[#8A877D] hover:text-[#20201D] transition-colors cursor-pointer px-1 py-1"
                  title="Sign out"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </header>

      {/* =========================================================================
          SECTION 2: CINEMATIC HERO (Living 3D Mountain Environment)
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

            {/* Right Column: 3D Topographical Mountain Environment */}
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

              {/* Interactive 3D Mountain with Coordinate Pins */}
              <div className="w-full max-w-[560px]">
                <HeroMountain3D />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 3: THE RESEARCH JOURNEY (Connect, Verify, Act Interactive Canvas)
      ========================================================================= */}
      <section id="journey" className="py-20 sm:py-24 border-b border-[#DEDAD0]/60 relative z-10 bg-[#EFEBE2]/40">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 text-center">
          <div className="text-[11px] font-mono tracking-widest uppercase text-[#858875] font-semibold mb-3">
            — THE RESEARCH JOURNEY —
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#20201D] font-normal mb-12 tracking-tight">
            From scattered papers to verifiable intelligence.
          </h2>

          {/* Interactive Visual Stage + 3 Connected Cards */}
          <ResearchJourneyInteractive />
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: PRODUCT DEMO (Interactive Workspace Demonstration)
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

            {/* Right Column: 3D Tilt Workspace Showcase with ASCII Fish */}
            <div className="lg:col-span-7">
              <WorkspaceInteractiveShowcase />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: INTELLIGENCE CORE (Asymmetrical Ecosystem Matrix)
      ========================================================================= */}
      <section id="intelligence-core" className="py-20 sm:py-28 border-b border-[#DEDAD0]/60 relative z-10 bg-[#EFEBE2]/30">
        <div className="max-w-[1320px] mx-auto px-6 sm:px-10 text-center">
          <div className="text-[11px] font-mono tracking-widest uppercase text-[#858875] font-semibold mb-3">
            — INTELLIGENCE CORE —
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#20201D] font-normal mb-14 tracking-tight">
            An entire research ecosystem. One intelligence layer.
          </h2>

          {/* Asymmetric Ecosystem Matrix with Dual Flagships & Surrounding Modules */}
          <IntelligenceEcosystemMatrix />
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: LEARNING ECOSYSTEM (Dedicated Living Widgets)
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

            {/* Right Column: 4 Fully Interactive Learning Widgets */}
            <div className="lg:col-span-7">
              <LearningEcosystemInteractiveSuite />
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 7: DARK CTA BANNER (Planetary Horizon Arc)
      ========================================================================= */}
      <section className="py-20 sm:py-24 relative z-10 px-6 sm:px-10">
        <div className="max-w-[1320px] mx-auto rounded-3xl bg-[#141412] text-[#FBFAF6] p-10 sm:p-16 relative overflow-hidden text-center shadow-2xl">
          {/* Luminous Celestial Eclipse Arc */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
                className="px-6 py-3 rounded-full bg-transparent hover:bg-white/10 text-[#FBFAF6] border border-[#44423C] text-sm font-medium transition-all cursor-pointer"
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
