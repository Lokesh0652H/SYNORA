'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowUpRight, ShieldCheck, FileCheck, Layers, GitCompare } from 'lucide-react';

type SolutionItem = {
  num: string;
  title: string;
  subtitle: string;
  workflow: string;
  deliverable: string;
  verificationMethod: string;
};

const SOLUTIONS: SolutionItem[] = [
  {
    num: '01',
    title: 'Cross-Disciplinary Academic Research',
    subtitle: 'Connecting disparate papers across machine learning, neuroscience, and mathematics.',
    workflow:
      'Ingest dozens of arXiv preprints, thesis chapters, and conference proceedings into a single unified knowledge graph. The graph links conceptual abstractions to mathematical definitions across distinct author nomenclatures.',
    deliverable: 'Comprehensive Literature Review Synthesis with verified bibliography and citation markers.',
    verificationMethod: 'Topological semantic clustering with SHA-256 chunk coordinates.',
  },
  {
    num: '02',
    title: 'Competitive & Strategic Intelligence',
    subtitle: 'Extracting market shifts, quarterly 10-K filings, and product roadmap teardowns.',
    workflow:
      'Analyze competitor SEC filings, earnings call transcripts, patents, and technical blog announcements simultaneously. Contradiction detection isolates discrepancies between executive press statements and audited financial notes.',
    deliverable: 'Board-Ready Strategic Threat Assessment & Executive Comparison Brief.',
    verificationMethod: 'Timeline chronology verification with cross-source discrepancy alerts.',
  },
  {
    num: '03',
    title: 'Systematic Literature Reviews',
    subtitle: 'Rigorous PRISMA-compliant multi-paper aggregation and meta-analysis synthesis.',
    workflow:
      'Process hundreds of abstract excerpts, inclusion/exclusion criteria, and experimental findings. SYNORA flags conflicting sample sizes, p-value discrepancies, and methodology variations across clinical trials.',
    deliverable: 'Structured Evidence Matrix with empirical effect size summaries and gap analyses.',
    verificationMethod: 'Claim-level citations attached to individual empirical findings.',
  },
  {
    num: '04',
    title: 'Clinical & Life Sciences Inquiry',
    subtitle: 'Biomedical research, trial protocols, and molecular pharmacology papers.',
    workflow:
      'Synthesize peer-reviewed publications with primary trial protocols. Every asserted mechanism of action, biomarker correlation, and adverse event incidence is pinned directly to exact page and table references.',
    deliverable: 'Pre-Clinical Dossier Outline & Mechanism of Action Synthesis.',
    verificationMethod: 'Strict non-hallucination constraint with deterministic source grounding.',
  },
  {
    num: '05',
    title: 'Legal & Regulatory Discovery',
    subtitle: 'Dissecting complex contractual provisions, statutory codes, and compliance audits.',
    workflow:
      'Compare vendor master services agreements against evolving regulatory standards (e.g. EU AI Act, HIPAA, GDPR). Identify conflicting indemnity thresholds, termination clauses, and non-conforming covenants.',
    deliverable: 'Clause-by-Clause Compliance Matrix with redlined risk exposures.',
    verificationMethod: 'Tamper-evident audit logging with immutable Ed25519 hash signatures.',
  },
  {
    num: '06',
    title: 'Technical Systems & Architecture Documentation',
    subtitle: 'Translating legacy RFCs, distributed microservice schemas, and API telemetry.',
    workflow:
      'Ingest monorepo documentation, engineering architecture decisions (ADRs), and cloud infrastructure diagrams. Explain cascading failure modes and architectural invariants across microservice boundaries.',
    deliverable: 'Living Engineering Knowledge Graph & Incident Post-Mortem Synthesis.',
    verificationMethod: 'Bi-directional entity relationship mapping across system components.',
  },
  {
    num: '07',
    title: 'Complex Examination & Board Preparation',
    subtitle: 'Medical boards, bar exams, and CFA professional certifications.',
    workflow:
      'Transform thousands of pages of foundational textbooks and syllabus guidelines into active recall flashcards, timed conceptual simulations, and Socratic interrogation dialogues.',
    deliverable: 'Targeted Knowledge Mastery Roadmap with weak-area diagnostics.',
    verificationMethod: 'Adaptive spaced repetition tied directly to conceptual difficulty.',
  },
];

export default function SolutionsAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="w-full max-w-[1140px] mx-auto divide-y divide-[#DEDAD0] border-y border-[#DEDAD0]">
      {SOLUTIONS.map((sol, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={sol.num}
            className={`transition-colors duration-200 ${
              isOpen ? 'bg-[#FBFAF6]' : 'bg-transparent hover:bg-[#FBFAF6]/60'
            }`}
          >
            {/* Header Row */}
            <button
              onClick={() => toggle(idx)}
              className="w-full py-6 sm:py-7 px-4 sm:px-8 flex items-center justify-between text-left group cursor-pointer"
            >
              <div className="flex items-center gap-4 sm:gap-8 min-w-0 pr-4">
                <span className="font-mono text-xs sm:text-sm text-[#858875] group-hover:text-[#20201D] transition-colors shrink-0">
                  {sol.num}
                </span>
                <div className="min-w-0">
                  <h3 className="text-lg sm:text-2xl font-serif font-normal text-[#20201D] tracking-tight group-hover:translate-x-0.5 transition-transform duration-200">
                    {sol.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#77756E] mt-0.5 truncate">
                    {sol.subtitle}
                  </p>
                </div>
              </div>

              <div
                className={`w-8 h-8 rounded-full border border-[#DEDAD0] flex items-center justify-center shrink-0 transition-transform duration-300 ${
                  isOpen ? 'rotate-180 bg-[#20201D] text-white border-transparent' : 'bg-white text-[#77756E]'
                }`}
              >
                <ChevronDown size={15} />
              </div>
            </button>

            {/* Expandable Accordion Body */}
            {isOpen && (
              <div className="px-4 sm:px-8 pb-8 pt-1 animate-scale-in text-xs sm:text-sm text-[#20201D]">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl bg-[#F5F3ED] border border-[#DEDAD0]">
                  {/* Workflow column */}
                  <div className="md:col-span-6 space-y-2">
                    <span className="text-[10px] font-mono text-[#858875] uppercase tracking-wider block font-semibold">
                      Research Investigation Workflow
                    </span>
                    <p className="text-xs sm:text-sm text-[#77756E] leading-relaxed">
                      {sol.workflow}
                    </p>
                  </div>

                  {/* Deliverables column */}
                  <div className="md:col-span-6 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[10px] font-mono text-[#858875] uppercase tracking-wider block font-semibold mb-1">
                        Verified Output Deliverable
                      </span>
                      <div className="p-3 rounded-xl bg-white border border-[#DEDAD0] font-medium text-xs text-[#20201D] flex items-center gap-2">
                        <FileCheck size={15} className="text-[#858875] shrink-0" />
                        <span>{sol.deliverable}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-[#E8E4DA] text-[11px] text-[#77756E]">
                      <span className="flex items-center gap-1.5 font-mono text-[10px]">
                        <ShieldCheck size={13} className="text-[#858875]" /> {sol.verificationMethod}
                      </span>
                      <Link
                        href="/dashboard"
                        className="text-[#20201D] font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Apply workflow ↗
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
