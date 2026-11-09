'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  BookOpenCheck,
  Brain,
  CheckCircle2,
  CircleHelp,
  GitCompareArrows,
  Network,
  Sparkles,
  Timer,
  Copy,
  Check,
  GitCompare,
  Users2,
  FileSpreadsheet,
  Milestone,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import ShaderCard, { type ShaderTheme } from '@/components/ShaderCard';
import ThinkingPill from '@/components/ThinkingPill';

const STUDIO_TOOLS: {
  kind: string;
  title: string;
  description: string;
  icon: any;
  theme: ShaderTheme;
  badge: string;
}[] = [
  {
    kind: 'mindmap',
    title: 'Knowledge Graph & Concepts',
    description: 'Map core concepts, entities, and latent semantic relationships across all notebook sources.',
    icon: Network,
    theme: 'blue',
    badge: 'GraphRAG',
  },
  {
    kind: 'contradiction',
    title: 'Contradiction & Claim Verifier',
    description: 'Identify conflicting statements, methodology clashes, or unsupported conclusions across documents.',
    icon: GitCompare,
    theme: 'ruby',
    badge: 'Verification',
  },
  {
    kind: 'perspectives',
    title: 'Multiple AI Perspectives',
    description: 'Analyze findings from 5 angles: Researcher, Critical Thinker, Analyst, Teacher, and Strategist.',
    icon: Users2,
    theme: 'purple',
    badge: 'Debate Mode',
  },
  {
    kind: 'action_report',
    title: 'Research-to-Report',
    description: 'Transform verified research into an executive decision-ready brief with cited recommendations.',
    icon: FileSpreadsheet,
    theme: 'amber',
    badge: 'Action',
  },
  {
    kind: 'action_roadmap',
    title: 'Research-to-Roadmap',
    description: 'Convert technical knowledge into a step-by-step phased execution roadmap with milestones.',
    icon: Milestone,
    theme: 'emerald',
    badge: 'Roadmap',
  },
  {
    kind: 'guide',
    title: 'Comprehensive Study Guide',
    description: 'A structured syllabus of foundational principles, empirical evidence, and key takeaways.',
    icon: BookOpenCheck,
    theme: 'slate',
    badge: 'Overview',
  },
  {
    kind: 'flashcards',
    title: 'Dynamic Recall Flashcards',
    description: 'Active recall cards with concise prompts and source-grounded answers for mastery.',
    icon: Brain,
    theme: 'magenta',
    badge: 'Recall',
  },
  {
    kind: 'quiz',
    title: 'Adaptive Assessment Quiz',
    description: 'Test your understanding with rigorous, citation-backed multiple choice and conceptual queries.',
    icon: CircleHelp,
    theme: 'blue',
    badge: 'Evaluation',
  },
  {
    kind: 'faq',
    title: 'Authoritative Research FAQ',
    description: 'Clear, concise answers to the most crucial and anticipated questions in the material.',
    icon: Sparkles,
    theme: 'amber',
    badge: 'Synthesis',
  },
  {
    kind: 'compare',
    title: 'Cross-Source Comparison',
    description: 'Cross-analyze conflicting viewpoints, methodologies, and complementary findings.',
    icon: GitCompareArrows,
    theme: 'purple',
    badge: 'Compare',
  },
];

export default function Studio() {
  const { id } = useParams<{ id: string }>();
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);

  async function generate(kind: string) {
    setBusy(kind);
    setError('');
    setResult('');
    try {
      const r = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notebookId: id, kind }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Failed to generate synthesis artifact.');
      setResult(data.payload.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not generate synthesis artifact.');
    } finally {
      setBusy('');
    }
  }

  const copyResult = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link
          href={`/notebook/${id}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#111] mb-6 transition-colors"
        >
          <ArrowLeft size={13} />
          Back to notebook
        </Link>

        <div className="mb-10 pb-6 border-b border-dashed border-[#DCDAD4]">
          <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-2">
            RESEARCH STUDIO · INTELLIGENCE ARTIFACTS
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#1E201D] tracking-tight">
            Make knowledge actionable.
          </h1>
          <p className="text-sm text-[#737373] max-w-2xl mt-1 leading-relaxed">
            Generate knowledge graphs, detect contradictions, engage multiple research perspectives, and transform sources into execution roadmaps using Gemini.
          </p>
        </div>

        {/* Loading Thinking Pill Banner */}
        {busy && (
          <div className="mb-8 p-6 rounded-2xl bg-white border border-[#DCDAD4] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 animate-scale-in">
            <div>
              <h4 className="text-sm font-semibold text-[#1E201D] mb-1">
                Synthesizing {STUDIO_TOOLS.find((t) => t.kind === busy)?.title || 'artifact'}
              </h4>
              <p className="text-xs text-[#7A7C75]">
                Gemini is cross-referencing all source chunks, graphs, and citations in this notebook.
              </p>
            </div>
            <ThinkingPill mode="studio" />
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        {/* Generated Result Artifact Card */}
        {result && (
          <div className="mb-12 rounded-3xl bg-white border border-[#DCDAD4] p-8 shadow-sm animate-scale-in">
            <div className="flex items-center justify-between pb-4 border-b border-[#F0EFEB] mb-6">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </span>
                <div>
                  <h3 className="font-serif text-lg text-[#1E201D]">Generated Synthesis</h3>
                  <div className="text-[11px] text-[#8C8E85]">Grounded in notebook sources · Saved to database</div>
                </div>
              </div>

              <button
                onClick={copyResult}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-[#F4F4F0] hover:bg-[#EAEAE5] text-[#1E201D] transition-colors"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy markdown'}</span>
              </button>
            </div>

            <div className="prose prose-sm max-w-none text-[#2A2C27] font-sans leading-relaxed whitespace-pre-wrap">
              {result}
            </div>
          </div>
        )}

        {/* Grid of Studio Tools with Ashish Gogula fluid ShaderCards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {STUDIO_TOOLS.map((tool) => {
            const Icon = tool.icon;
            return (
              <ShaderCard
                key={tool.kind}
                title={tool.title}
                description={tool.description}
                theme={tool.theme}
                badge={tool.badge}
                icon={<Icon size={20} />}
                onClick={() => !busy && generate(tool.kind)}
                meta={
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1 font-medium">
                      <Sparkles size={11} /> Generate
                    </span>
                    <span>Gemini 2.5 ↗</span>
                  </div>
                }
              />
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
