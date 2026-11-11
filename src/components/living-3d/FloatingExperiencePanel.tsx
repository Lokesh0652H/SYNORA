'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Volume2,
  VolumeX,
  FastForward,
  Sparkles,
  Layers,
  Compass,
  FileText,
  Clock,
  Navigation,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Check,
  Copy,
} from 'lucide-react';
import { useLivingWorld } from './LivingWorldContext';
import { LIVING_OBJECTS } from './data';
import { LivingObjectId } from './types';

export default function FloatingExperiencePanel() {
  const {
    activeObjectId,
    currentStage,
    isInteracting,
    closeInteraction,
    skipToExperience,
    isAudioPlaying,
    isMuted,
    toggleAudio,
    toggleMute,
    navigateToSection,
  } = useLivingWorld();

  // Sub-component state for interactive experiences
  // Knowledge Orb
  const [selectedConceptNode, setSelectedConceptNode] = useState<number>(0);
  // Evidence Prism
  const [methodologyWeight, setMethodologyWeight] = useState<number>(65);
  // Research Compass
  const [selectedTrajectory, setSelectedTrajectory] = useState<number | null>(null);
  // Knowledge Fragment
  const [activeLens, setActiveLens] = useState<'arch' | 'econ' | 'safe'>('arch');
  const [copiedInsight, setCopiedInsight] = useState(false);
  // Time Capsule
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  if (!isInteracting || !activeObjectId) return null;

  const meta = LIVING_OBJECTS[activeObjectId];
  if (!meta) return null;

  const getObjectIcon = (id: LivingObjectId) => {
    switch (id) {
      case 'knowledge-orb':
        return <Sparkles className="w-5 h-5 text-[#D4AF37]" />;
      case 'evidence-prism':
        return <Layers className="w-5 h-5 text-[#2D5A43]" />;
      case 'research-compass':
        return <Compass className="w-5 h-5 text-[#A87932]" />;
      case 'knowledge-fragment':
        return <FileText className="w-5 h-5 text-[#8B7355]" />;
      case 'time-capsule':
        return <Clock className="w-5 h-5 text-[#9C7A4A]" />;
      case 'explorer':
        return <Navigation className="w-5 h-5 text-[#4A5859]" />;
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 40, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 40, scale: 0.96 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-24 right-4 sm:right-8 z-30 w-[calc(100vw-2rem)] sm:w-[480px] max-h-[calc(100vh-7rem)] overflow-y-auto bg-[#FBFAF6]/95 backdrop-blur-2xl border border-[#DEDAD0] shadow-[0_20px_50px_rgba(0,0,0,0.12)] rounded-2xl p-6 text-[#20201D]"
        role="dialog"
        aria-modal="true"
        aria-label={meta.name}
      >
        {/* Header Bar */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#EAE6DC]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center shadow-inner">
              {getObjectIcon(meta.id)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono tracking-wider uppercase text-[#8A877D]">
                  {meta.category}
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#EAE6DC] text-[#4A4740] font-mono font-medium">
                  Stage {currentStage}/3
                </span>
              </div>
              <h3 className="font-serif text-xl font-medium tracking-tight text-[#20201D]">
                {meta.name}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Audio narration button */}
            <button
              onClick={toggleAudio}
              className={`p-2 rounded-lg transition-colors ${
                isAudioPlaying
                  ? 'bg-[#D4AF37]/20 text-[#8B6B15] border border-[#D4AF37]/40'
                  : 'text-[#8A877D] hover:bg-[#EFEBE2]'
              }`}
              title={isAudioPlaying ? 'Pause narration' : 'Listen to narration'}
              aria-label="Toggle narration"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={toggleMute}
              className="p-2 rounded-lg text-[#8A877D] hover:bg-[#EFEBE2] transition-colors"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label="Toggle mute"
            >
              <VolumeX className="w-4 h-4" />
            </button>
            {/* Close button */}
            <button
              onClick={closeInteraction}
              className="p-2 rounded-lg text-[#8A877D] hover:text-[#20201D] hover:bg-[#EFEBE2] transition-colors"
              aria-label="Close 3D experience"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Personality Quote */}
        <div className="mt-4 px-3.5 py-2.5 rounded-xl bg-[#F5F2EA] border border-[#E5E0D5]">
          <p className="font-serif italic text-sm text-[#4A4740]">
            &ldquo;{meta.personalityQuote}&rdquo;
          </p>
        </div>

        {/* Timed Stage Progress Bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono text-[#8A877D]">
            <span>
              {currentStage === 1 && meta.stage1Title}
              {currentStage === 2 && meta.stage2Title}
              {currentStage === 3 && meta.stage3Title}
            </span>
            {currentStage < 3 && (
              <button
                onClick={skipToExperience}
                className="flex items-center gap-1 text-[#2D5A43] hover:underline font-sans cursor-pointer"
              >
                <span>Skip to experience</span>
                <FastForward className="w-3 h-3" />
              </button>
            )}
          </div>
          <div className="w-full h-1 bg-[#EAE6DC] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#20201D]"
              initial={{ width: '33%' }}
              animate={{ width: `${(currentStage / 3) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Audio Caption Card (if audio active) */}
        {isAudioPlaying && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 rounded-lg bg-[#FAF8F2] border border-[#D4AF37]/30 text-xs text-[#5A554A] flex items-start gap-2"
          >
            <Volume2 className="w-3.5 h-3.5 text-[#D4AF37] mt-0.5 shrink-0 animate-pulse" />
            <p className="leading-relaxed">{meta.narrationText}</p>
          </motion.div>
        )}

        {/* Dynamic Experience Content according to Object ID and Stage */}
        <div className="mt-5">
          {/* OBJECT A — KNOWLEDGE ORB */}
          {activeObjectId === 'knowledge-orb' && (
            <div className="space-y-4">
              <p className="text-sm text-[#66635B] leading-relaxed">
                {currentStage === 1 && meta.stage1Desc}
                {currentStage >= 2 && meta.stage2Desc}
              </p>

              {currentStage >= 2 && (
                <div className="p-4 rounded-xl bg-[#F5F2EA] border border-[#E5E0D5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-[#4A4740]">
                      TRI-NODE KNOWLEDGE CLUSTER
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#E5E0D5] text-[#2D5A43]">
                      Similarity 0.912
                    </span>
                  </div>

                  {/* 3 Clickable Concept Nodes */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { title: 'Topological Anyons', page: 'p. 14' },
                      { title: 'Braiding Statistics', page: 'p. 28' },
                      { title: 'Decoherence Limits', page: 'p. 42' },
                    ].map((node, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedConceptNode(i)}
                        className={`p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                          selectedConceptNode === i
                            ? 'bg-[#20201D] text-[#FBFAF6] shadow-sm'
                            : 'bg-white/80 hover:bg-white text-[#20201D] border border-[#DEDAD0]'
                        }`}
                      >
                        <div className="text-[10px] font-mono opacity-70">{node.page}</div>
                        <div className="text-xs font-medium truncate mt-0.5">{node.title}</div>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 rounded-lg bg-white/90 border border-[#E5E0D5] text-xs space-y-1.5">
                    <div className="font-mono text-[10px] text-[#8A877D] uppercase">
                      Evidence Synthesis
                    </div>
                    <p className="text-[#3A3730] leading-relaxed">
                      {selectedConceptNode === 0 &&
                        'Majorana zero modes demonstrate non-Abelian exchange statistics, shielding quantum memory from local thermal perturbations.'}
                      {selectedConceptNode === 1 &&
                        'Braiding operations provide an intrinsically fault-tolerant gate set, obviating the quadratic overhead of active surface codes.'}
                      {selectedConceptNode === 2 &&
                        'Decoherence occurs predominantly at boundary interfaces rather than bulk topological channels, preserving long-range coherence.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OBJECT B — EVIDENCE PRISM */}
          {activeObjectId === 'evidence-prism' && (
            <div className="space-y-4">
              <p className="text-sm text-[#66635B] leading-relaxed">
                {currentStage === 1 && meta.stage1Desc}
                {currentStage >= 2 && meta.stage2Desc}
              </p>

              {currentStage >= 2 && (
                <div className="p-4 rounded-xl bg-[#F5F2EA] border border-[#E5E0D5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-[#4A4740]">
                      EVIDENCE TRIANGULATION
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Discrepancy: Δ 26.4%
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 rounded-lg bg-white border border-[#E5E0D5]">
                      <div className="flex justify-between text-[#8A877D] font-mono text-[10px]">
                        <span>Study A (Lancet 2024, n=412)</span>
                        <span className="text-[#2D5A43] font-bold">89.4%</span>
                      </div>
                      <p className="text-[#3A3730] mt-1">
                        High persistent remission with standard preconditioning regimen.
                      </p>
                    </div>

                    <div className="p-2.5 rounded-lg bg-white border border-[#E5E0D5]">
                      <div className="flex justify-between text-[#8A877D] font-mono text-[10px]">
                        <span>Study B (NEJM 2023, n=89)</span>
                        <span className="text-amber-700 font-bold">63.0%</span>
                      </div>
                      <p className="text-[#3A3730] mt-1">
                        Significant cell exhaustion observed in prior refractory cohorts.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Methodology Weighting Slider */}
                  <div className="pt-2 border-t border-[#E5E0D5] space-y-1.5">
                    <div className="flex justify-between text-[11px] font-mono text-[#5A554A]">
                      <span>Cohort Size Weighting</span>
                      <span className="font-bold text-[#20201D]">{methodologyWeight}%</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={methodologyWeight}
                      onChange={(e) => setMethodologyWeight(Number(e.target.value))}
                      className="w-full accent-[#20201D] cursor-pointer"
                    />
                    <div className="text-[10px] text-[#8A877D] text-right font-mono">
                      Calibrated Confidence Index:{' '}
                      <span className="font-bold text-[#2D5A43]">
                        {(74.5 + (methodologyWeight - 50) * 0.18).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OBJECT C — RESEARCH COMPASS */}
          {activeObjectId === 'research-compass' && (
            <div className="space-y-4">
              <p className="text-sm text-[#66635B] leading-relaxed">
                {currentStage === 1 && meta.stage1Desc}
                {currentStage >= 2 && meta.stage2Desc}
              </p>

              {currentStage >= 2 && (
                <div className="p-4 rounded-xl bg-[#F5F2EA] border border-[#E5E0D5] space-y-3">
                  <div className="text-xs font-mono font-medium text-[#4A4740]">
                    SELECT INVESTIGATION TRAJECTORY
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 0, dir: 'N — Empirical', title: 'Stress Cohort Limits' },
                      { id: 1, dir: 'E — Algorithmic', title: 'Byzantine Latency' },
                      { id: 2, dir: 'S — Regulatory', title: 'FDA Compliance Path' },
                      { id: 3, dir: 'W — Synthesis', title: 'Meta-Analysis Matrix' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setSelectedTrajectory(t.id)}
                        className={`p-2.5 rounded-lg text-left transition-all cursor-pointer ${
                          selectedTrajectory === t.id
                            ? 'bg-[#20201D] text-[#FBFAF6]'
                            : 'bg-white border border-[#DEDAD0] hover:border-[#20201D] text-[#20201D]'
                        }`}
                      >
                        <div className="text-[10px] font-mono opacity-70">{t.dir}</div>
                        <div className="text-xs font-medium mt-0.5">{t.title}</div>
                      </button>
                    ))}
                  </div>

                  {selectedTrajectory !== null && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 rounded-lg bg-white border border-[#E5E0D5] text-xs space-y-1.5"
                    >
                      <div className="font-mono text-[10px] text-[#2D5A43] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Targeted Research Plan Formulated
                      </div>
                      <p className="text-[#3A3730]">
                        {selectedTrajectory === 0 &&
                          'Recommended next step: Ingest 3 additional longitudinal survival datasets with >500 patient cohorts to bridge the statistical power gap.'}
                        {selectedTrajectory === 1 &&
                          'Recommended next step: Execute contradiction detection between paper 2 and paper 4 regarding validator consensus round trip latency.'}
                        {selectedTrajectory === 2 &&
                          'Recommended next step: Cross-reference CFR Title 21 Section 312 statutory requirements with trial investigator documentation.'}
                        {selectedTrajectory === 3 &&
                          'Recommended next step: Trigger Studio "Compare Matrix" generator to tabulate all 7 independent variables.'}
                      </p>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* OBJECT D — KNOWLEDGE FRAGMENT */}
          {activeObjectId === 'knowledge-fragment' && (
            <div className="space-y-4">
              <p className="text-sm text-[#66635B] leading-relaxed">
                {currentStage === 1 && meta.stage1Desc}
                {currentStage >= 2 && meta.stage2Desc}
              </p>

              {currentStage >= 2 && (
                <div className="p-4 rounded-xl bg-[#F5F2EA] border border-[#E5E0D5] space-y-3">
                  {/* Lens Switcher */}
                  <div className="flex rounded-lg bg-[#EAE6DC] p-0.5 text-xs font-mono">
                    <button
                      onClick={() => setActiveLens('arch')}
                      className={`flex-1 py-1 rounded-md transition-colors cursor-pointer ${
                        activeLens === 'arch' ? 'bg-[#20201D] text-white' : 'text-[#5A554A]'
                      }`}
                    >
                      Architecture
                    </button>
                    <button
                      onClick={() => setActiveLens('econ')}
                      className={`flex-1 py-1 rounded-md transition-colors cursor-pointer ${
                        activeLens === 'econ' ? 'bg-[#20201D] text-white' : 'text-[#5A554A]'
                      }`}
                    >
                      Economic
                    </button>
                    <button
                      onClick={() => setActiveLens('safe')}
                      className={`flex-1 py-1 rounded-md transition-colors cursor-pointer ${
                        activeLens === 'safe' ? 'bg-[#20201D] text-white' : 'text-[#5A554A]'
                      }`}
                    >
                      Safety
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-white border border-[#E5E0D5] text-xs space-y-2">
                    <div className="text-[10px] font-mono text-[#8A877D]">
                      SYNTHESIZED INSIGHT #349
                    </div>
                    <p className="text-[#20201D] leading-relaxed">
                      {activeLens === 'arch' &&
                        'Decoupling vector indexing from foundation model inference reduces round-trip latency by 72% while preserving deterministic citation offsets.'}
                      {activeLens === 'econ' &&
                        'Sliding-window chunk caching avoids redundant token embedding recalculations, lowering API operational cost by 64% per notebook.'}
                      {activeLens === 'safe' &&
                        'Client secrets remain confined to server route handlers; PostgreSQL Row-Level Security blocks multi-tenant chunk leakage at the engine level.'}
                    </p>

                    <button
                      onClick={() => {
                        setCopiedInsight(true);
                        setTimeout(() => setCopiedInsight(false), 2000);
                      }}
                      className="inline-flex items-center gap-1.5 text-[11px] font-mono text-[#2D5A43] hover:underline cursor-pointer pt-1"
                    >
                      {copiedInsight ? (
                        <>
                          <Check className="w-3 h-3 text-[#2D5A43]" />
                          <span>Copied to clipboard</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy insight to research notebook</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* OBJECT E — TIME CAPSULE */}
          {activeObjectId === 'time-capsule' && (
            <div className="space-y-4">
              <p className="text-sm text-[#66635B] leading-relaxed">
                {currentStage === 1 && meta.stage1Desc}
                {currentStage >= 2 && meta.stage2Desc}
              </p>

              {currentStage >= 2 && (
                <div className="p-4 rounded-xl bg-[#F5F2EA] border border-[#E5E0D5] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-medium text-[#4A4740]">
                      30-SECOND DIAGNOSTIC QUIZ
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#20201D] border border-[#DEDAD0]">
                      Timed Recall
                    </span>
                  </div>

                  <p className="text-xs font-serif font-medium text-[#20201D]">
                    Why does HNSW graph retrieval scale logarithmically instead of linearly in high-dimensional vector spaces?
                  </p>

                  <div className="space-y-1.5">
                    {[
                      { id: 0, text: 'It compresses 3072 floats down to 8-bit binary hashes.' },
                      {
                        id: 1,
                        text: 'It constructs multi-layer hierarchical skip-list graphs with greedy routing.',
                        correct: true,
                      },
                      { id: 2, text: 'It computes exact brute-force cosine distance over all rows.' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        disabled={quizSubmitted}
                        onClick={() => {
                          setQuizAnswer(opt.id);
                          setQuizSubmitted(true);
                        }}
                        className={`w-full p-2.5 rounded-lg text-left text-xs transition-all cursor-pointer ${
                          quizSubmitted
                            ? opt.correct
                              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-medium'
                              : quizAnswer === opt.id
                              ? 'bg-rose-50 text-rose-900 border border-rose-300'
                              : 'bg-white/60 text-[#8A877D] border border-[#E5E0D5]'
                            : quizAnswer === opt.id
                            ? 'bg-[#20201D] text-white'
                            : 'bg-white hover:bg-white/90 text-[#20201D] border border-[#DEDAD0]'
                        }`}
                      >
                        {opt.text}
                      </button>
                    ))}
                  </div>

                  {quizSubmitted && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                        quizAnswer === 1
                          ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                          : 'bg-amber-50 text-amber-900 border border-amber-200'
                      }`}
                    >
                      {quizAnswer === 1 ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                      )}
                      <div>
                        <div className="font-bold">
                          {quizAnswer === 1 ? 'Correct!' : 'Close — Option B is correct.'}
                        </div>
                        <p className="mt-0.5 text-[11px] leading-relaxed opacity-90">
                          HNSW creates layered networks with exponentially decreasing connection densities, enabling sub-millisecond nearest neighbor convergence.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* OBJECT F — EXPLORER */}
          {activeObjectId === 'explorer' && (
            <div className="space-y-4">
              <p className="text-sm text-[#66635B] leading-relaxed">
                {currentStage === 1 && meta.stage1Desc}
                {currentStage >= 2 && meta.stage2Desc}
              </p>

              {currentStage >= 2 && (
                <div className="p-4 rounded-xl bg-[#F5F2EA] border border-[#E5E0D5] space-y-3">
                  <div className="text-xs font-mono font-medium text-[#4A4740]">
                    SYNORA ARCHITECTURAL STATIONS
                  </div>

                  <div className="space-y-1.5">
                    {[
                      { id: 'how-it-works', label: 'The Research Journey', desc: 'Connect, verify, and act' },
                      { id: 'demo', label: 'Product Demonstration', desc: 'Grounded query workspace' },
                      { id: 'platform', label: 'Intelligence Core', desc: 'Dynamic knowledge graphs' },
                      { id: 'learning', label: 'Learning Ecosystem', desc: 'Audio briefings & flashcards' },
                      { id: 'solutions', label: 'High-Stakes Solutions', desc: 'Where being wrong is expensive' },
                    ].map((dest) => (
                      <button
                        key={dest.id}
                        onClick={() => {
                          navigateToSection(dest.id);
                          closeInteraction();
                        }}
                        className="w-full p-2.5 rounded-lg bg-white hover:bg-[#20201D] hover:text-[#FBFAF6] border border-[#DEDAD0] text-[#20201D] flex items-center justify-between text-xs transition-all group cursor-pointer"
                      >
                        <div className="text-left">
                          <div className="font-medium">{dest.label}</div>
                          <div className="text-[10px] text-[#8A877D] group-hover:text-[#DEDAD0]">
                            {dest.desc}
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-transform" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-[#EAE6DC] flex items-center justify-between">
          <div className="text-[11px] font-mono text-[#8A877D]">
            Home section: <span className="font-semibold text-[#4A4740]">{meta.sectionLabel}</span>
          </div>

          <button
            onClick={closeInteraction}
            className="px-4 py-2 rounded-xl bg-[#20201D] text-[#FBFAF6] hover:bg-[#353530] text-xs font-medium transition-colors cursor-pointer"
          >
            Resume Exploration
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
