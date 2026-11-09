'use client';

import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';

export interface ThinkingPillProps {
  status?: 'idle' | 'loading' | 'done' | 'error';
  mode?: 'chat' | 'upload' | 'studio' | 'custom';
  steps?: string[];
  activeStepIndex?: number;
  customLabel?: string;
  isDone?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const DEFAULT_CHAT_STEPS = [
  'Thinking',
  'Reading docs',
  'Analysing sources',
  'Synthesizing answer',
];

const DEFAULT_UPLOAD_STEPS = [
  'Reading document',
  'Extracting text & pages',
  'Generating embeddings',
  'Indexing vector chunks',
];

const DEFAULT_STUDIO_STEPS = [
  'Scanning notebook sources',
  'Extracting core concepts',
  'Structuring study artifact',
  'Finalizing synthesis',
];

export default function ThinkingPill({
  status = 'loading',
  mode = 'chat',
  steps,
  activeStepIndex,
  customLabel,
  isDone = false,
  className = '',
  size = 'md',
}: ThinkingPillProps) {
  const stepList =
    steps ||
    (mode === 'upload'
      ? DEFAULT_UPLOAD_STEPS
      : mode === 'studio'
      ? DEFAULT_STUDIO_STEPS
      : DEFAULT_CHAT_STEPS);

  const [stepIdx, setStepIdx] = useState(0);

  // Cycle automatically through steps if activeStepIndex is not explicitly passed
  useEffect(() => {
    if (isDone || status === 'done' || status === 'idle') return;
    if (typeof activeStepIndex === 'number') {
      setStepIdx(Math.min(activeStepIndex, stepList.length - 1));
      return;
    }

    const timer = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % stepList.length);
    }, 1800);

    return () => clearInterval(timer);
  }, [isDone, status, activeStepIndex, stepList.length]);

  const currentText = customLabel || stepList[stepIdx] || 'Thinking';
  const doneState = isDone || status === 'done';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`inline-flex items-center gap-3 transition-all duration-300 ease-out select-none ${
        doneState
          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
          : 'bg-[#F2F1ED] text-[#1E201D] border border-black/[0.07] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.08),0_1px_1px_rgba(255,255,255,0.8)_inset]'
      } ${
        size === 'sm'
          ? 'px-3 py-1.5 rounded-full text-xs'
          : size === 'lg'
          ? 'px-6 py-3 rounded-full text-base font-medium'
          : 'px-4 py-2 rounded-full text-sm font-medium'
      } ${className}`}
      style={{
        backdropFilter: 'blur(8px)',
      }}
    >
      {doneState ? (
        <span className="flex items-center justify-center w-4 h-4 rounded-full bg-white/20 animate-scale-in">
          <Check size={12} strokeWidth={2.5} className="text-white" />
        </span>
      ) : (
        /* 4x4 micro dot-matrix radar scanning animation */
        <span
          className="grid grid-cols-4 gap-[2.5px] w-3.5 h-3.5 items-center justify-center shrink-0"
          aria-hidden="true"
        >
          {Array.from({ length: 16 }).map((_, i) => {
            const row = Math.floor(i / 4);
            const col = i % 4;
            // Wave delay based on diagonal distance
            const delay = (row + col) * 120;
            return (
              <span
                key={i}
                className="w-[2.5px] h-[2.5px] rounded-full bg-[#1E201D] transition-opacity duration-300"
                style={{
                  animation: `dotMatrixPulse 1.4s infinite ease-in-out`,
                  animationDelay: `${delay}ms`,
                }}
              />
            );
          })}
        </span>
      )}

      <span className="tracking-tight whitespace-nowrap font-medium transition-all duration-300">
        {doneState ? 'Done' : currentText}
      </span>
    </div>
  );
}
