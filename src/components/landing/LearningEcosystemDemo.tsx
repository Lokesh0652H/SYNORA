'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Play,
  Pause,
  RotateCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  Headphones,
  Brain,
  Sparkles,
  Volume2,
  Users2,
  Check,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
} from 'lucide-react';

export default function LearningEcosystemDemo() {
  // Audio state
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSeconds, setPlaybackSeconds] = useState(14);
  const [activeSpeaker, setActiveSpeaker] = useState<'aris' | 'elena'>('aris');

  // Flashcard state
  const [cardFlipped, setCardFlipped] = useState(false);
  const [cardIndex, setCardIndex] = useState(0);

  // Quiz state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Persona state
  const [activePersona, setActivePersona] = useState<'socratic' | 'critic' | 'strategist'>('socratic');

  // Audio timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setPlaybackSeconds((prev) => (prev >= 180 ? 0 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const flashcards = [
    {
      q: 'How does self-attention differ from recurrent hidden state transitions?',
      a: 'Self-attention connects all pairs of tokens in constant $O(1)$ sequential operations, whereas RNNs require $O(N)$ sequential operations that inhibit parallelization.',
      source: 'Vaswani et al., 2017 · §2',
      difficulty: 'High',
    },
    {
      q: 'What is the primary computational bottleneck in large context transformers?',
      a: 'Quadratic memory complexity $O(N^2)$ during full matrix attention and constant HBM-to-SRAM memory bandwidth transfers on the GPU accelerator.',
      source: 'Dao, 2023 · §1',
      difficulty: 'Medium',
    },
    {
      q: 'Why does Direct Preference Optimization bypass reinforcement learning reward models?',
      a: 'DPO uses a closed-form substitution of the optimal policy into the Bradley-Terry loss, turning policy optimization into a simple binary cross-entropy objective.',
      source: 'Rafailov et al., 2023 · §4',
      difficulty: 'Advanced',
    },
  ];

  const quizQuestion = {
    prompt: 'Which mechanism directly eliminates memory IO roundtrips between GPU High Bandwidth Memory and on-chip SRAM?',
    options: [
      { text: 'Gradient checkpointing and AdamW optimizer sharding', correct: false },
      { text: 'FlashAttention-2 tiling over softmax blocks', correct: true },
      { text: 'Rotary Positional Embeddings (RoPE)', correct: false },
      { text: 'Byte-Pair Encoding (BPE) subword tokenization', correct: false },
    ],
    rationale:
      'FlashAttention-2 computes the attention matrix incrementally in SRAM tiles without materializing the full $N \\times N$ intermediate attention tensor in global HBM.',
  };

  const personas = {
    socratic: {
      name: 'Socratic Professor',
      badge: 'Pedagogy',
      quote:
        '“Before accepting that FlashAttention is merely an engineering trick, consider: why does algorithmic complexity matter less than memory hierarchy access time in modern hardware?”',
    },
    critic: {
      name: 'Adversarial Critic',
      badge: 'Debate Mode',
      quote:
        '“The authors benchmarked against standard PyTorch attention, but how does this perform on quantized int8 kernels or non-Nvidia tensor architectures?”',
    },
    strategist: {
      name: 'Executive Strategist',
      badge: 'Actionable',
      quote:
        '“Adopting block-tiled attention will cut our inference serving latency by 45%, reducing monthly GPU cluster allocation by approximately $14,000.”',
    },
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-[1240px] mx-auto px-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Module 1: AI Audio Overview Studio */}
        <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover-lift transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase flex items-center gap-1.5">
                <Headphones size={13} /> TWO-SPEAKER AUDIO OVERVIEW
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFEBE2] text-[#20201D] border border-[#DEDAD0]">
                Synthetic Studio · HD Voice
              </span>
            </div>

            <h4 className="text-xl font-serif text-[#20201D] mb-2">
              Transforming dense literature into natural conversation.
            </h4>
            <p className="text-xs sm:text-sm text-[#77756E] leading-relaxed mb-6">
              SYNORA synthesizes opposing arguments and methodologies into a dynamic dialogue between two specialist hosts.
            </p>

            {/* Interactive Player Box */}
            <div className="p-5 rounded-2xl bg-[#F5F3ED] border border-[#DEDAD0] mb-6">
              {/* Speakers Badge Row */}
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E4DA]">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveSpeaker('aris')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all ${
                      activeSpeaker === 'aris'
                        ? 'bg-[#20201D] text-white font-semibold'
                        : 'bg-white/80 text-[#77756E] border border-[#DEDAD0]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#858875]" />
                    <span>Dr. Aris (Host)</span>
                  </button>
                  <button
                    onClick={() => setActiveSpeaker('elena')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs transition-all ${
                      activeSpeaker === 'elena'
                        ? 'bg-[#20201D] text-white font-semibold'
                        : 'bg-white/80 text-[#77756E] border border-[#DEDAD0]'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-[#B98F7B]" />
                    <span>Elena (Critic)</span>
                  </button>
                </div>

                <div className="text-xs font-mono text-[#77756E]">
                  {formatTime(playbackSeconds)} / 03:00
                </div>
              </div>

              {/* Pulsing Audio Waveform */}
              <div className="flex items-center gap-1.5 h-10 mb-4 px-2">
                {[30, 50, 85, 45, 90, 70, 40, 65, 100, 80, 60, 40, 75, 95, 55, 35, 80, 65, 45, 90, 60, 40, 75, 50].map((h, i) => (
                  <div
                    key={i}
                    style={{
                      height: isPlaying ? `${Math.max(20, (h + Math.sin(playbackSeconds * 2 + i) * 30))}%` : `${h * 0.45}%`,
                    }}
                    className={`flex-1 rounded-full transition-all duration-200 ${
                      i < (playbackSeconds % 24)
                        ? 'bg-[#20201D]'
                        : 'bg-[#D6C9B5]'
                    }`}
                  />
                ))}
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="w-10 h-10 rounded-full bg-[#20201D] hover:bg-black text-[#FBFAF6] flex items-center justify-center transition-all shadow-sm hover:scale-105 active:scale-95"
                    title={isPlaying ? 'Pause audio' : 'Play synthetic overview'}
                  >
                    {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                  </button>
                  <button
                    onClick={() => setPlaybackSeconds(0)}
                    className="p-2 rounded-lg text-[#77756E] hover:text-[#20201D] transition-colors"
                    title="Restart discussion"
                  >
                    <RotateCw size={15} />
                  </button>
                </div>

                <div className="text-[11px] font-mono text-[#858875]">
                  {isPlaying ? '● AUDIO STREAMING ACTIVE' : '○ CLICK PLAY TO LISTEN'}
                </div>
              </div>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="text-xs font-semibold text-[#20201D] hover:underline inline-flex items-center gap-1"
          >
            Create custom audio overview in workspace <ArrowRight size={13} />
          </Link>
        </div>

        {/* Module 2: 3D Flip Flashcards & Active Recall */}
        <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover-lift transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase flex items-center gap-1.5">
                <Brain size={13} /> DYNAMIC RECALL FLASHCARDS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFEBE2] text-[#20201D] border border-[#DEDAD0]">
                Spaced Repetition
              </span>
            </div>

            <h4 className="text-xl font-serif text-[#20201D] mb-2">
              Active recall generated directly from source claims.
            </h4>
            <p className="text-xs sm:text-sm text-[#77756E] leading-relaxed mb-6">
              Cards flip to reveal rigorous, page-cited explanations designed for lasting conceptual retention.
            </p>

            {/* Interactive 3D Flip Flashcard */}
            <div
              onClick={() => setCardFlipped(!cardFlipped)}
              className="relative w-full h-[210px] rounded-2xl cursor-pointer perspective-1000 mb-4 select-none group"
            >
              <div
                className={`relative w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d border ${
                  cardFlipped ? 'rotate-y-180 bg-[#EFEBE2] border-[#20201D]/30' : 'bg-white border-[#DEDAD0] shadow-xs'
                } p-6 flex flex-col justify-between`}
              >
                {/* Card Header */}
                <div className="flex items-center justify-between text-[11px] font-mono text-[#858875]">
                  <span>CARD {cardIndex + 1} OF {flashcards.length}</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FBFAF6] border border-[#DEDAD0]">
                    {cardFlipped ? 'ANSWER / CITATION' : 'PROMPT / RECALL'}
                  </span>
                </div>

                {/* Card Body */}
                <div className="my-auto text-left">
                  {cardFlipped ? (
                    <div className="rotate-y-180">
                      <p className="text-xs sm:text-sm font-medium text-[#20201D] leading-relaxed mb-2">
                        {flashcards[cardIndex].a}
                      </p>
                      <span className="text-[11px] font-mono text-[#858875]">
                        Source: {flashcards[cardIndex].source}
                      </span>
                    </div>
                  ) : (
                    <div>
                      <h5 className="text-sm sm:text-base font-serif font-normal text-[#20201D] leading-snug">
                        {flashcards[cardIndex].q}
                      </h5>
                    </div>
                  )}
                </div>

                {/* Card Footer Hint */}
                <div className="text-[10px] font-mono text-[#A09C92] flex items-center justify-between">
                  <span>CLICK ANYWHERE TO FLIP CARD ↻</span>
                  <span>{flashcards[cardIndex].difficulty}</span>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setCardFlipped(false);
                  setCardIndex((prev) => (prev > 0 ? prev - 1 : flashcards.length - 1));
                }}
                className="px-3 py-1.5 rounded-xl bg-[#EFEBE2] hover:bg-[#DEDAD0] text-xs text-[#20201D] flex items-center gap-1 transition-colors"
              >
                <ChevronLeft size={14} /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {flashcards.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-2 h-2 rounded-full transition-all ${
                      cardIndex === idx ? 'bg-[#20201D] w-4' : 'bg-[#DEDAD0]'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => {
                  setCardFlipped(false);
                  setCardIndex((prev) => (prev + 1) % flashcards.length);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#EFEBE2] hover:bg-[#DEDAD0] text-xs text-[#20201D] flex items-center gap-1 transition-colors"
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E8E4DA] mt-6 flex items-center justify-between text-xs">
            <span className="text-[#77756E]">Flashcard sets auto-sync with your uploaded sources</span>
            <Link href="/dashboard" className="font-semibold text-[#20201D] hover:underline">
              Generate cards ↗
            </Link>
          </div>
        </div>

        {/* Module 3: Adaptive Assessment Quiz */}
        <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover-lift transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase flex items-center gap-1.5">
                <FileQuestion size={13} /> ADAPTIVE QUIZ & MCQS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFEBE2] text-[#20201D] border border-[#DEDAD0]">
                Immediate Feedback
              </span>
            </div>

            <h4 className="text-xl font-serif text-[#20201D] mb-2">
              Evaluate true comprehension against empirical facts.
            </h4>
            <p className="text-xs sm:text-sm text-[#77756E] leading-relaxed mb-6">
              Test your understanding with rigorous multi-choice questions linked directly to primary document passages.
            </p>

            {/* Quiz Box */}
            <div className="p-5 rounded-2xl bg-white border border-[#DEDAD0] mb-5">
              <p className="text-xs sm:text-sm font-semibold text-[#20201D] mb-4">
                {quizQuestion.prompt}
              </p>

              <div className="space-y-2 mb-4">
                {quizQuestion.options.map((opt, i) => {
                  const isSelected = selectedOption === i;
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedOption(i);
                        setQuizSubmitted(true);
                      }}
                      className={`w-full p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                        quizSubmitted
                          ? opt.correct
                            ? 'bg-[#EFEBE2] border-[#858875] text-[#20201D] font-semibold'
                            : isSelected
                            ? 'bg-rose-50 border-rose-300 text-rose-900'
                            : 'bg-white border-[#E8E4DA] text-[#77756E]'
                          : isSelected
                          ? 'bg-[#EFEBE2] border-[#20201D] font-medium'
                          : 'bg-white border-[#DEDAD0] hover:bg-[#F5F3ED] text-[#20201D]'
                      }`}
                    >
                      <span>{opt.text}</span>
                      {quizSubmitted && opt.correct && (
                        <CheckCircle2 size={15} className="text-[#858875] shrink-0 ml-2" />
                      )}
                      {quizSubmitted && isSelected && !opt.correct && (
                        <XCircle size={15} className="text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {quizSubmitted && (
                <div className="p-3 rounded-xl bg-[#F5F3ED] border border-[#DEDAD0] text-[11px] text-[#77756E] leading-relaxed animate-scale-in">
                  <strong className="text-[#20201D] block mb-0.5">Verification Rationale:</strong>
                  {quizQuestion.rationale}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 text-xs">
            <span className="text-[#77756E]">Instant scoring with mistake diagnosis</span>
            <button
              onClick={() => {
                setSelectedOption(null);
                setQuizSubmitted(false);
              }}
              className="text-[#20201D] font-semibold hover:underline"
            >
              Reset question ↻
            </button>
          </div>
        </div>

        {/* Module 4: Specialized AI Research Personas */}
        <div className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover-lift transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase flex items-center gap-1.5">
                <Users2 size={13} /> SPECIALIZED AI PERSONAS
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFEBE2] text-[#20201D] border border-[#DEDAD0]">
                Debate Mode
              </span>
            </div>

            <h4 className="text-xl font-serif text-[#20201D] mb-2">
              Interrogate your topic from distinct intellectual angles.
            </h4>
            <p className="text-xs sm:text-sm text-[#77756E] leading-relaxed mb-6">
              Switch viewpoints instantly to reveal hidden assumptions, identify blindspots, or extract boardroom actions.
            </p>

            {/* Persona Switcher Tabs */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {(['socratic', 'critic', 'strategist'] as const).map((key) => {
                const isSelected = activePersona === key;
                return (
                  <button
                    key={key}
                    onClick={() => setActivePersona(key)}
                    className={`py-2 px-2.5 rounded-xl text-xs text-center transition-all ${
                      isSelected
                        ? 'bg-[#20201D] text-white font-semibold shadow-xs'
                        : 'bg-[#EFEBE2] text-[#77756E] hover:text-[#20201D] hover:bg-[#E8E4DA]'
                    }`}
                  >
                    {personas[key].name}
                  </button>
                );
              })}
            </div>

            {/* Persona Speech Box */}
            <div className="p-5 rounded-2xl bg-white border border-[#DEDAD0] mb-5 text-left">
              <div className="flex items-center justify-between mb-3 text-[10px] font-mono text-[#858875]">
                <span>MODE: {personas[activePersona].badge.toUpperCase()}</span>
                <span>GEMINI 2.5 TEMPERATURE: 0.1</span>
              </div>
              <p className="text-xs sm:text-sm font-serif italic text-[#20201D] leading-relaxed">
                {personas[activePersona].quote}
              </p>
            </div>
          </div>

          <div className="pt-6 border-t border-[#E8E4DA] mt-6 flex items-center justify-between text-xs">
            <span className="text-[#77756E]">Consensus reports synthesize where all personas agree</span>
            <Link href="/dashboard" className="font-semibold text-[#20201D] hover:underline">
              Enter Debate Mode ↗
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
