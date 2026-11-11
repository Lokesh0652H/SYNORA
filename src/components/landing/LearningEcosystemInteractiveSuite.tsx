'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Network,
  Share2,
  Volume2,
} from 'lucide-react';

export default function LearningEcosystemInteractiveSuite() {
  // Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(14);
  const [activeSpeaker, setActiveSpeaker] = useState<'aris' | 'elena'>('aris');

  // Flashcard State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Mind Map State
  const [selectedMindNode, setSelectedMindNode] = useState<string>('rag');

  // Quiz State
  const [quizSelected, setQuizSelected] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  // Audio timer ticker
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioSeconds((prev) => (prev >= 756 ? 14 : prev + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const flashcards = [
    {
      q: 'What governs topological protection in non-Abelian anyon systems?',
      a: 'Braiding unitaries depend solely on the topological knot invariants of worldlines, rendering quantum memory immune to local thermal fluctuations.',
      tag: 'Quantum Information',
    },
    {
      q: 'How does pgvector HNSW achieve logarithmic vector retrieval speed?',
      a: 'It builds hierarchical multi-layer proximity graphs with exponentially declining link densities, executing greedy search routing without evaluating every row.',
      tag: 'Vector Databases',
    },
    {
      q: 'Why are deterministic seeds essential for clinical AI discovery?',
      a: 'Regulatory compliance mandates exact, byte-for-byte reproducibility of evidentiary claims six months or years later under identical audit constraints.',
      tag: 'Regulatory Science',
    },
  ];

  const mindNodes: Record<string, { label: string; desc: string; children: string[] }> = {
    rag: {
      label: 'Sovereign RAG Core',
      desc: 'Orchestrates HNSW vector retrieval, context boundary assembly, and strict claim citation verification.',
      children: ['ingest', 'pgvector', 'grounding', 'studio'],
    },
    ingest: {
      label: 'Multi-Source Ingest',
      desc: 'Parses PDFs with page coordinates and DOCX files into normalized UTF-8 buffers.',
      children: ['pdf', 'mammoth'],
    },
    pgvector: {
      label: 'pgvector HNSW',
      desc: 'Cosine distance operator <=> executing within PostgreSQL RLS security perimeter.',
      children: ['hnsw', 'rls'],
    },
    grounding: {
      label: 'Citation Grounding',
      desc: 'Attaches claim-level bracket notation [^1] to exact character and page boundaries.',
      children: ['citations', 'audit'],
    },
    studio: {
      label: 'Studio Synthesizer',
      desc: 'Generates structured JSON study materials, flashcards, quizzes, and audio scripts.',
      children: ['audio', 'quiz'],
    },
  };

  const quizOptions = [
    { id: 0, text: 'It converts 3072-dimensional vectors into 8-bit compressed hashes.' },
    {
      id: 1,
      text: 'It constructs multi-layer hierarchical skip-list graphs with greedy nearest-neighbor routing.',
      correct: true,
    },
    { id: 2, text: 'It performs brute-force linear Euclidean distance calculations across all rows.' },
  ];

  const formatAudioTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
      {/* 1. AUDIO OVERVIEW WIDGET */}
      <div className="bg-[#FAF8F5] border border-[#DEDAD0] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#20201D] transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-[#858875]" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#20201D] uppercase">
              Audio Overviews
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFEBE2] text-[#20201D]">
            Two-Speaker Studio
          </span>
        </div>

        {/* Speaker Selector Pills */}
        <div className="flex gap-2 text-[10px] font-mono">
          <button
            onClick={() => setActiveSpeaker('aris')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              activeSpeaker === 'aris' ? 'bg-[#20201D] text-white' : 'bg-[#EAE6DC] text-[#55534E]'
            }`}
          >
            Dr. Aris Thorne
          </button>
          <button
            onClick={() => setActiveSpeaker('elena')}
            className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
              activeSpeaker === 'elena' ? 'bg-[#20201D] text-white' : 'bg-[#EAE6DC] text-[#55534E]'
            }`}
          >
            Elena Vance
          </button>
        </div>

        {/* Audio Player Bar */}
        <div className="p-3 rounded-xl bg-white border border-[#E5E0D5] flex items-center gap-3">
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="w-10 h-10 rounded-full bg-[#20201D] text-white flex items-center justify-center hover:bg-black transition-colors cursor-pointer shrink-0 shadow-sm"
            aria-label={isPlayingAudio ? 'Pause' : 'Play'}
          >
            {isPlayingAudio ? (
              <Pause className="w-4 h-4 fill-white" />
            ) : (
              <Play className="w-4 h-4 ml-0.5 fill-white" />
            )}
          </button>

          {/* Equalizer Waveform */}
          <div className="flex-1 flex items-center gap-0.5 h-8">
            {[14, 22, 16, 28, 12, 30, 18, 26, 14, 20, 28, 16, 24, 18, 26, 14, 22].map((h, i) => (
              <span
                key={i}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isPlayingAudio ? 'bg-[#20201D]' : 'bg-[#D5D0C5]'
                }`}
                style={{
                  height: `${isPlayingAudio ? Math.max(6, (h * (1 + (i % 3) * 0.2)) % 32) : h * 0.6}px`,
                }}
              />
            ))}
          </div>

          <span className="font-mono text-xs text-[#20201D] font-medium shrink-0">
            {formatAudioTime(audioSeconds)} / 12:36
          </span>
        </div>

        <p className="text-[11px] text-[#66635B] italic font-serif">
          {activeSpeaker === 'aris'
            ? '“Notice how the second trial contradicts the first regarding long-term cell persistence.”'
            : '“Exactly. The difference in preconditioning regimen appears to explain the 26% delta.”'}
        </p>
      </div>

      {/* 2. 3D FLIP FLASHCARDS WIDGET */}
      <div className="bg-[#FAF8F5] border border-[#DEDAD0] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4 hover:border-[#20201D] transition-colors">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold tracking-wider text-[#20201D] uppercase">
            3D Flip Flashcards
          </span>
          <span className="text-[10px] font-mono text-[#8A877D]">
            Card {cardIndex + 1} of {flashcards.length}
          </span>
        </div>

        {/* 3D Flip Card Container */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative h-28 rounded-xl bg-white border border-[#DEDAD0] p-4 cursor-pointer shadow-xs flex flex-col justify-between transition-transform hover:scale-101 select-none"
        >
          <div className="flex justify-between items-center text-[10px] font-mono text-[#8A877D]">
            <span>{flashcards[cardIndex].tag}</span>
            <span className="text-[#2D5A43] font-bold">
              {isFlipped ? 'Answer (Click to flip)' : 'Question (Click to flip)'}
            </span>
          </div>

          <p className="text-xs font-serif font-medium text-[#20201D] leading-snug line-clamp-3">
            {isFlipped ? flashcards[cardIndex].a : flashcards[cardIndex].q}
          </p>

          <div className="text-[9px] font-mono text-[#8A877D] text-right">
            Click anywhere on card to flip
          </div>
        </div>

        {/* Spaced Repetition Buttons */}
        <div className="flex gap-2">
          {['Hard', 'Good', 'Easy'].map((rating) => (
            <button
              key={rating}
              onClick={() => {
                setIsFlipped(false);
                setCardIndex((prev) => (prev + 1) % flashcards.length);
              }}
              className="flex-1 py-1.5 rounded-lg bg-[#EFEBE2] hover:bg-[#20201D] hover:text-white text-xs font-mono transition-colors cursor-pointer"
            >
              {rating}
            </button>
          ))}
        </div>
      </div>

      {/* 3. INTERACTIVE CONCEPT MIND MAP WIDGET */}
      <div className="bg-[#FAF8F5] border border-[#DEDAD0] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#20201D] transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="w-4 h-4 text-[#858875]" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#20201D] uppercase">
              Interactive Mind Map
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#EFEBE2] text-[#20201D]">
            Expandable Nodes
          </span>
        </div>

        {/* Clickable Node Tree */}
        <div className="flex flex-wrap gap-1.5 py-1">
          {Object.keys(mindNodes).map((key) => (
            <button
              key={key}
              onClick={() => setSelectedMindNode(key)}
              className={`px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                selectedMindNode === key
                  ? 'bg-[#20201D] text-white font-medium shadow-xs scale-102'
                  : 'bg-white border border-[#DEDAD0] text-[#55534E] hover:border-[#20201D]'
              }`}
            >
              {mindNodes[key].label}
            </button>
          ))}
        </div>

        {/* Selected Node Details */}
        <div className="p-3 rounded-xl bg-white border border-[#E5E0D5] text-xs space-y-1 shadow-2xs">
          <div className="font-mono text-[10px] text-[#2D5A43] font-bold">
            {mindNodes[selectedMindNode].label}
          </div>
          <p className="text-[#3A3730] text-[11px] leading-relaxed">
            {mindNodes[selectedMindNode].desc}
          </p>
        </div>
      </div>

      {/* 4. DIAGNOSTIC QUIZ WIDGET */}
      <div className="bg-[#FAF8F5] border border-[#DEDAD0] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#20201D] transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#858875]" />
            <span className="text-xs font-mono font-bold tracking-wider text-[#20201D] uppercase">
              Diagnostic Quiz
            </span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            Active Recall
          </span>
        </div>

        <p className="text-xs font-serif font-medium text-[#20201D] leading-snug">
          Why does HNSW retrieval achieve logarithmic search complexity?
        </p>

        <div className="space-y-1.5 text-xs">
          {quizOptions.map((opt) => (
            <button
              key={opt.id}
              disabled={quizSubmitted}
              onClick={() => {
                setQuizSelected(opt.id);
                setQuizSubmitted(true);
              }}
              className={`w-full p-2 rounded-lg text-left transition-all cursor-pointer text-[11px] ${
                quizSubmitted
                  ? opt.correct
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-300 font-medium'
                    : quizSelected === opt.id
                    ? 'bg-rose-50 text-rose-900 border border-rose-300'
                    : 'bg-white/60 text-[#8A877D] border border-[#EAE6DC]'
                  : quizSelected === opt.id
                  ? 'bg-[#20201D] text-white'
                  : 'bg-white hover:bg-white/90 text-[#20201D] border border-[#DEDAD0]'
              }`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {quizSubmitted && (
          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-[10px] text-emerald-900 flex items-center justify-between">
            <span>✓ Verified by Source [ArXiv:2024 pg. 12]</span>
            <button
              onClick={() => {
                setQuizSubmitted(false);
                setQuizSelected(null);
              }}
              className="font-mono text-emerald-800 underline cursor-pointer"
            >
              Reset
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
