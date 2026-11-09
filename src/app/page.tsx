'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Shield, Cpu, Terminal, ArrowUpRight, RefreshCw, FileCode } from 'lucide-react';
import ShaderCard from '@/components/ShaderCard';

export default function LandingPage() {
  const [replaying, setReplaying] = useState(false);

  const triggerReplay = () => {
    setReplaying(true);
    setTimeout(() => setReplaying(false), 1400);
  };

  return (
    <div className="min-h-screen bg-[#F9F9F7] text-[#1A1A1A] selection:bg-[#1A1A1A] selection:text-white font-sans">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#F9F9F7]/90 backdrop-blur-md border-b border-dashed border-[#DCDAD4]">
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="w-5 h-5 bg-[#1A1A1A] flex items-center justify-center text-white text-[11px] font-bold rounded-sm tracking-tighter">
              ■
            </span>
            <span className="font-bold tracking-tight text-lg text-[#1A1A1A]">SYNORA</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-[13px] text-[#666666]">
            <a href="#how-it-works" className="hover:text-[#1A1A1A] transition-colors">How it works</a>
            <a href="#platform" className="hover:text-[#1A1A1A] transition-colors">Platform</a>
            <a href="#solutions" className="hover:text-[#1A1A1A] transition-colors">Solutions</a>
            <a href="#security" className="hover:text-[#1A1A1A] transition-colors">Security</a>
            <a href="#customers" className="hover:text-[#1A1A1A] transition-colors">Customers</a>
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
              className="bg-[#1A1A1A] hover:bg-[#333333] text-white text-[13px] font-medium px-4 py-2 rounded-md transition-all flex items-center gap-1.5 shadow-sm"
            >
              Open workspace
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 border-b border-dashed border-[#DCDAD4] overflow-hidden">
        <div className="max-w-[1240px] mx-auto px-6 text-center">
          <div className="inline-block text-[11px] font-mono tracking-widest text-[#737373] uppercase mb-4">
            Deterministic AI Infrastructure & Research Workspace
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-normal tracking-tight text-[#1A1A1A] max-w-4xl mx-auto leading-[1.06]">
            Ship AI you can <br className="hidden sm:inline" />
            <span className="italic font-serif">test like software</span>
          </h1>

          {/* Stippled Mountain Peak Engraving */}
          <div className="relative my-8 sm:my-10 max-w-[560px] mx-auto flex justify-center">
            <Image
              src="/illustrations/hero_mountain.png"
              alt="Hand-drawn stippled mountain peak"
              width={560}
              height={360}
              priority
              className="w-full max-w-[500px] h-auto object-contain filter contrast-105"
            />
          </div>

          {/* Hero Bottom Row */}
          <div className="max-w-[960px] mx-auto mt-6 flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-dashed border-[#DCDAD4]/80 text-left">
            <p className="text-sm text-[#666666] max-w-md leading-relaxed">
              SYNORA sits between your models and your stack, making every response reproducible, auditable, and grounded in cryptographic proof.
            </p>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                href="/dashboard"
                className="bg-[#1A1A1A] hover:bg-black text-white text-sm font-medium px-6 py-2.5 rounded-md transition-all shadow-sm flex items-center gap-2"
              >
                See the proof
                <ArrowRight size={14} />
              </Link>
              <a
                href="#how-it-works"
                className="text-sm font-medium text-[#1A1A1A] hover:text-[#555] px-4 py-2.5 transition-colors flex items-center gap-1.5"
              >
                Read the docs <ArrowUpRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 3-Step Process: Capture, Pin, Prove */}
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
                  From a guess to a record, in three steps.
                </h2>
              </div>
              <div className="mt-8 text-xs text-[#8C8E85] font-mono">
                GROUND TRUTH / SEC.01
              </div>
            </div>

            {/* Step 1: Capture */}
            <div className="p-8 sm:p-10 flex flex-col justify-between group hover:bg-[#F4F4F0] transition-colors">
              <div className="h-44 flex items-center justify-center mb-6">
                <Image
                  src="/illustrations/step_capture.png"
                  alt="Surveyor tripod illustration"
                  width={160}
                  height={190}
                  className="max-h-36 w-auto object-contain filter contrast-110 group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#8C8E85] mb-1">01</div>
                <h3 className="text-lg font-semibold mb-2">Capture</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Every call is recorded with its prompt, parameters, model version, and retrieved context chunks.
                </p>
              </div>
            </div>

            {/* Step 2: Pin */}
            <div className="p-8 sm:p-10 flex flex-col justify-between group hover:bg-[#F4F4F0] transition-colors">
              <div className="h-44 flex items-center justify-center mb-6">
                <Image
                  src="/illustrations/step_pin.png"
                  alt="Triangulation monument milestone"
                  width={160}
                  height={190}
                  className="max-h-36 w-auto object-contain filter contrast-110 group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#8C8E85] mb-1">02</div>
                <h3 className="text-lg font-semibold mb-2">Pin</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  SYNORA fixes the execution path, so the same input resolves to the same grounded output on every run.
                </p>
              </div>
            </div>

            {/* Step 3: Prove */}
            <div className="p-8 sm:p-10 flex flex-col justify-between group hover:bg-[#F4F4F0] transition-colors">
              <div className="h-44 flex items-center justify-center mb-6">
                <Image
                  src="/illustrations/step_prove.png"
                  alt="Summit cairn with flag"
                  width={160}
                  height={190}
                  className="max-h-36 w-auto object-contain filter contrast-110 group-hover:scale-105 transition-transform"
                />
              </div>
              <div>
                <div className="text-[11px] font-mono text-[#8C8E85] mb-1">03</div>
                <h3 className="text-lg font-semibold mb-2">Prove</h3>
                <p className="text-xs text-[#666666] leading-relaxed">
                  Replay any decision months later and get the identical answer, backed by a signed citation trail.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform & Interactive Call Record Terminal */}
      <section id="platform" className="border-b border-dashed border-[#DCDAD4] py-16 sm:py-20">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left: Platform Copy & Live Call Record */}
            <div className="lg:col-span-5 flex flex-col">
              <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-3">
                Platform
              </span>
              <h2 className="text-3xl sm:text-4xl font-normal tracking-tight mb-4">
                Built for systems that get audited.
              </h2>
              <p className="text-sm text-[#666666] leading-relaxed mb-8">
                Every call your models make is stored as a deterministic record. Select a capability on the right — the line of the record it works on lights up.
              </p>

              {/* Monospace Interactive Call Record Box */}
              <div className="bg-[#FFFFFF] border border-[#DCDAD4] rounded-xl p-5 shadow-sm font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#EAE8E2] text-[#8C8E85]">
                  <span>Call record</span>
                  <span>call_7f3a2c · 2026-03-14 09:12Z</span>
                </div>

                <div className="py-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <span className="text-[#8C8E85] w-20">model</span>
                    <span className="text-[#1A1A1A] font-medium flex-1">gemini-2.5-flash · temp 0 · seed 1182</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[#8C8E85] w-20">prompt</span>
                    <span className="text-[#555] flex-1">sha256 3e1f...a9c2</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[#8C8E85] w-20">context</span>
                    <span className="text-[#555] flex-1">4 docs · sha256 b71d...04ee</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[#8C8E85] w-20">policy</span>
                    <span className="text-emerald-700 font-medium flex-1">pii · tone · scope — 3/3 passed</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[#8C8E85] w-20">runs in</span>
                    <span className="text-[#555] flex-1">managed cloud · eu-west</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[#8C8E85] w-20">output</span>
                    <span className="text-[#1A1A1A] font-semibold flex-1">"Approve — tier B rating"</span>
                  </div>
                  <div className={`flex items-start justify-between p-1.5 rounded transition-colors ${
                    replaying ? 'bg-amber-100/70 text-amber-900' : 'bg-black/[0.03]'
                  }`}>
                    <span className="text-[#8C8E85] w-20">replay</span>
                    <span className="flex-1 flex items-center justify-between font-medium">
                      <span>{replaying ? 'replaying bit-for-bit...' : 'verified · zero divergence'}</span>
                      <button
                        onClick={triggerReplay}
                        className="text-[10px] text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
                      >
                        <RefreshCw size={10} className={replaying ? 'animate-spin' : ''} />
                        Replay
                      </button>
                    </span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[#8C8E85] w-20">drift</span>
                    <span className="text-[#555] flex-1">none in 41 days</span>
                  </div>
                  <div className="flex items-start justify-between">
                    <span className="text-[#8C8E85] w-20">signature</span>
                    <span className="text-[#555] flex-1">ed25519 9c0b...7712</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE8E2] text-[11px] text-[#8C8E85] flex items-center gap-2">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Replayed six months later — the same output, byte for byte</span>
                </div>
              </div>
            </div>

            {/* Right: Ashish Gogula Fluid Shader Cards Grid */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ShaderCard
                title="Deterministic replay"
                description="Re-run any historical call bit for bit, across model upgrades and provider outages."
                theme="blue"
                icon={<RefreshCw size={19} />}
                badge="Guaranteed"
              />

              <ShaderCard
                title="Drift detection"
                description="Know the moment a model, prompt or dependency changes behavior, before your customers do."
                theme="purple"
                icon={<Cpu size={19} />}
                badge="Telemetry"
              />

              <ShaderCard
                title="Signed audit trail"
                description="Every decision is hashed and signed, ready for an auditor or regulator without a reconstruction project."
                theme="emerald"
                icon={<Shield size={19} />}
                badge="Ed25519"
              />

              <ShaderCard
                title="Model-agnostic"
                description="Hosted, open-weight and in-house models behind one unified interface and one set of strict guarantees."
                theme="amber"
                icon={<Terminal size={19} />}
                badge="Multi-model"
              />

              <ShaderCard
                title="Policy gates"
                description="Block hallucinated or non-compliant outputs before they reach a user, with reason on record."
                theme="ruby"
                icon={<FileCode size={19} />}
                badge="Compliance"
              />

              <ShaderCard
                title="Runs where you do"
                description="Deploy to managed cloud, your isolated VPC, or fully air-gapped on-premise environments."
                theme="slate"
                icon={<Shield size={19} />}
                badge="Sovereign"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section id="solutions" className="border-b border-dashed border-[#DCDAD4] py-16 sm:py-20">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-2">
                Solutions
              </span>
              <h2 className="text-3xl sm:text-5xl font-normal tracking-tight">
                Where being wrong is expensive.
              </h2>
            </div>
            <p className="text-sm text-[#666666] max-w-md mt-4 md:mt-0 leading-relaxed">
              SYNORA earns its place where a decision has to be defended later — to an examiner, an auditor or a court.
            </p>
          </div>

          {/* Solutions Rows */}
          <div className="divide-y divide-dashed divide-[#DCDAD4] border-y border-dashed border-[#DCDAD4]">
            {[
              {
                title: 'Financial services',
                desc: 'Credit, underwriting and KYC decisions you can replay bit-for-bit for any financial regulator.',
              },
              {
                title: 'Insurance',
                desc: 'Claims triage and policy assessments that hold up when an adjudication is challenged.',
              },
              {
                title: 'Healthcare & Clinical',
                desc: 'Clinical summaries and coding that return the identical answer for the identical medical record.',
              },
              {
                title: 'Legal & compliance',
                desc: 'Contract review and policy checks with a cryptographically verified citation behind every conclusion.',
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
                Security
              </span>
              <h2 className="text-3xl sm:text-5xl font-normal tracking-tight mb-8">
                Your data never leaves <br />
                your perimeter.
              </h2>

              <div className="space-y-8 divide-y divide-dashed divide-[#DCDAD4]">
                <div className="pt-2">
                  <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1A1A1A] mb-1">
                    0
                  </div>
                  <div className="font-semibold text-sm mb-1">Bytes leave your network</div>
                  <div className="text-xs text-[#666666]">
                    Deploy in your VPC, private cloud, or fully air-gapped on-premise infrastructure.
                  </div>
                </div>

                <div className="pt-6">
                  <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1A1A1A] mb-1">
                    100%
                  </div>
                  <div className="font-semibold text-sm mb-1">Customer-held keys</div>
                  <div className="text-xs text-[#666666]">
                    We cannot read what we cannot decrypt. Bring your own keys and KMS envelopes.
                  </div>
                </div>

                <div className="pt-6">
                  <div className="text-4xl sm:text-5xl font-semibold tracking-tight text-[#1A1A1A] mb-1">
                    24/7
                  </div>
                  <div className="font-semibold text-sm mb-1">Control monitoring</div>
                  <div className="text-xs text-[#666666]">
                    Continuous compliance telemetry plus annual independent third-party audits.
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-dashed border-[#DCDAD4] text-[11px] font-mono text-[#8C8E85]">
                SOC 2 TYPE II · ISO 27001 · HIPAA · GDPR COMPLIANT
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
      <section id="customers" className="border-b border-dashed border-[#DCDAD4] py-16 sm:py-20 bg-[#F4F4F0]">
        <div className="max-w-[1240px] mx-auto px-6">
          <div className="max-w-3xl">
            <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-4">
              In production
            </span>
            <blockquote className="text-2xl sm:text-4xl font-normal tracking-tight text-[#1A1A1A] leading-snug mb-4">
              “We stopped arguing about what the model hallucinated last month. Now we just replay the citation.”
            </blockquote>
            <cite className="text-xs sm:text-sm text-[#737373] font-mono not-italic block mb-12">
              Head of Model Risk, Global Investment Bank
            </cite>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-8 border-t border-dashed border-[#DCDAD4]">
            <div>
              <div className="text-4xl sm:text-5xl font-medium tracking-tight text-[#1A1A1A] mb-1">
                3.2<span className="text-2xl font-normal text-[#8C8E85]">M</span>
              </div>
              <div className="text-xs text-[#666666]">Decisions replayed without discrepancy</div>
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-medium tracking-tight text-[#1A1A1A] mb-1">
                100<span className="text-2xl font-normal text-[#8C8E85]">%</span>
              </div>
              <div className="text-xs text-[#666666]">Bit-for-bit identical on every audit run</div>
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-medium tracking-tight text-[#1A1A1A] mb-1">
                6<span className="text-2xl font-normal text-[#8C8E85]">wks</span>
              </div>
              <div className="text-xs text-[#666666]">From enterprise pilot to live production</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Footer Call to Action */}
      <section className="border-b border-dashed border-[#DCDAD4] py-20 text-center">
        <div className="max-w-[800px] mx-auto px-6">
          <h2 className="text-3xl sm:text-5xl font-normal tracking-tight mb-4">
            Put your models on the record.
          </h2>
          <p className="text-sm text-[#666666] max-w-lg mx-auto mb-8 leading-relaxed">
            See SYNORA replay a real research decision or document query from your stack in under thirty minutes.
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
                The deterministic layer for enterprise AI & source-grounded research workspaces.
              </p>
              <div className="mt-4 text-[#8C8E85] font-mono text-[11px]">
                © 2026 SYNORA Labs, Inc.
              </div>
            </div>

            <div>
              <div className="font-semibold text-[#1A1A1A] mb-3">Product</div>
              <ul className="space-y-2 text-[#666666]">
                <li><a href="#platform" className="hover:text-black">Platform</a></li>
                <li><a href="#solutions" className="hover:text-black">Solutions</a></li>
                <li><a href="#security" className="hover:text-black">Security</a></li>
                <li><Link href="/dashboard" className="hover:text-black">Workspace</Link></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-[#1A1A1A] mb-3">Company</div>
              <ul className="space-y-2 text-[#666666]">
                <li><a href="#" className="hover:text-black">About</a></li>
                <li><a href="#" className="hover:text-black">Careers</a></li>
                <li><a href="#" className="hover:text-black">Contact</a></li>
                <li><a href="#" className="hover:text-black">Security portal</a></li>
              </ul>
            </div>

            <div>
              <div className="font-semibold text-[#1A1A1A] mb-3">Resources</div>
              <ul className="space-y-2 text-[#666666]">
                <li><a href="#" className="hover:text-black">Research papers</a></li>
                <li><a href="#" className="hover:text-black">Documentation</a></li>
                <li><a href="#" className="hover:text-black">API Reference</a></li>
                <li><a href="#" className="hover:text-black">Status</a></li>
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
