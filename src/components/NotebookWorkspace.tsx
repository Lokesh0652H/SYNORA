'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import {
  ArrowUpRight,
  Check,
  CheckCircle2,
  FileText,
  FileUp,
  Headphones,
  Mic,
  Plus,
  Sparkles,
  WandSparkles,
  X,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import AsciiSharkMotion from '@/components/AsciiSharkMotion';
import ThinkingPill from '@/components/ThinkingPill';
import { readNotebooks } from '@/lib/data';

type Source = {
  id: string;
  title: string;
  kind: string;
  status: string;
};

type Citation = {
  marker: string;
  title: string;
  location: string;
  quote?: string;
};

type Message = {
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
};

export default function NotebookWorkspace() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');

  const [title, setTitle] = useState('Research notebook');
  const [sources, setSources] = useState<Source[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadProgressState, setUploadProgressState] = useState<'idle' | 'uploading' | 'done'>('idle');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const initialQueryProcessed = useRef(false);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(`/api/notebooks/${id}`);
      if (r.ok) {
        const data = await r.json();
        setTitle(data.title);
        setSources(data.sources || []);
        setMessages(data.messages || []);
      }
    } catch {}
  }, [id]);

  useEffect(() => {
    const local = readNotebooks().find((b) => b.id === id);
    if (local) {
      setTitle(local.title);
      setSources([]);
    }
    void refresh();
  }, [id, refresh]);

  // Auto-scroll message feed only when new messages are added
  useEffect(() => {
    if (messages.length > 0) {
      feedRef.current?.scrollTo({ top: feedRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading]);

  // Ask question function
  const ask = useCallback(
    async (value = input) => {
      const prompt = value.trim();
      if (!prompt || loading) return;
      setInput('');
      setError('');
      setMessages((prev) => [...prev, { role: 'user', content: prompt }]);
      setLoading(true);

      try {
        const r = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ notebookId: id, message: prompt }),
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Could not answer your question.');
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.answer, citations: data.citations },
        ]);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Could not answer your question.');
      } finally {
        setLoading(false);
      }
    },
    [id, input, loading]
  );

  // If page was loaded with ?q= from dashboard prompt bar, trigger ask automatically
  useEffect(() => {
    if (initialQuery && !initialQueryProcessed.current) {
      initialQueryProcessed.current = true;
      const t = setTimeout(() => {
        void ask(initialQuery);
      }, 500);
      return () => clearTimeout(t);
    }
  }, [initialQuery, ask]);

  // Upload sources
  async function upload(files: FileList | null) {
    if (!files?.length) return;
    setError('');
    setBusy(true);
    setUploadProgressState('uploading');
    setNotice(`Uploading and indexing ${files.length} document(s)...`);

    for (const file of Array.from(files)) {
      const form = new FormData();
      form.set('file', file);
      form.set('notebookId', id);

      try {
        const r = await fetch('/api/sources/upload', { method: 'POST', body: form });
        const data = await r.json();
        if (!r.ok) {
          setError(data.error || 'Source upload failed.');
          continue;
        }
        setNotice(`${file.name} indexed and ready.`);
        setSources((prev) => [
          ...prev,
          {
            id: data.id,
            title: file.name,
            kind: file.name.split('.').pop() || 'file',
            status: 'ready',
          },
        ]);
      } catch {
        setError('Could not reach the source processing service.');
      }
    }

    setUploadProgressState('done');
    setBusy(false);
    setTimeout(() => setUploadProgressState('idle'), 3000);
    await refresh();
  }

  // Generate quick studio material
  async function quickStudy(kind: string) {
    setNotice('Synthesizing study material with Gemini...');
    setBusy(true);
    try {
      const r = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notebookId: id, kind }),
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Could not create study material.');
      setNotice(`${kind} saved to your notebook notes.`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create study material.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      {/* Strict 100% Viewport-fitting Container (Absolute Zero Outer Page Scroll) */}
      <div className="h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] w-full grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] bg-[#FBFBFA] overflow-hidden">
        {/* Main Chat Column */}
        <section className="flex flex-col border-r border-[#EAE8E2] h-full min-h-0 min-w-0 overflow-hidden relative">
          {/* Header */}
          <div className="h-16 px-6 border-b border-[#EAE8E2] flex items-center justify-between bg-white/70 backdrop-blur-md z-20 shrink-0">
            <div>
              <div className="text-[10px] font-mono text-[#8C8E85] tracking-widest uppercase">
                RESEARCH NOTEBOOK
              </div>
              <h1 className="text-xl sm:text-2xl font-serif font-normal text-[#1E201D] tracking-tight truncate max-w-md">
                {title}
              </h1>
              <div className="text-xs text-[#8C8E85]">
                {sources.length} {sources.length === 1 ? 'source' : 'sources'} · Private grounded space
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/notebook/${id}/studio`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#F4F4F0] hover:bg-[#EAEAE5] text-[#1E201D] transition-colors"
              >
                <WandSparkles size={13} />
                <span>Studio</span>
              </Link>
            </div>
          </div>

          {/* Empty State: Prompt bar centered right in viewport with zero scroll! */}
          {messages.length === 0 ? (
            <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center relative px-4 overflow-hidden select-none py-6">
              {/* Colorful 2D Tile ASCII Sharks in background */}
              <AsciiSharkMotion className="opacity-95" />

              {/* Centered Prompt Hero */}
              <div className="relative z-10 w-full max-w-2xl px-4 my-auto">
                <div className="text-[10px] font-mono tracking-widest text-[#8C8E85] uppercase mb-2">
                  Research Space Ready
                </div>
                <h2 className="text-4xl sm:text-5xl font-serif font-normal text-[#1E201D] tracking-tight mb-3">
                  what’s on your mind?
                </h2>
                <p className="text-xs sm:text-sm text-[#7A7C75] max-w-md mx-auto leading-relaxed mb-6">
                  {sources.length > 0
                    ? `Ask questions across your ${sources.length} indexed documents. Answers are grounded with exact citations.`
                    : 'Upload a PDF or document on the right to start asking citation-grounded questions.'}
                </p>

                {/* Instant Centered Stacked Prompt Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    void ask();
                  }}
                  className="relative w-full rounded-2xl bg-white/80 hover:bg-white/95 focus-within:bg-white backdrop-blur-xl border border-black/[0.09] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08),0_1px_1px_rgba(255,255,255,0.9)_inset] transition-all p-3 text-left"
                >
                  <textarea
                    autoFocus
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        void ask();
                      }
                    }}
                    placeholder={
                      sources.length
                        ? 'Ask anything about your sources...'
                        : 'Ask Synora anything or upload a document...'
                    }
                    rows={2}
                    className="w-full bg-transparent border-0 outline-none text-[#1E201D] placeholder-[#8A8C84] text-sm resize-none px-2 pt-1 font-sans leading-relaxed"
                  />

                  <div className="flex items-center justify-between pt-2 px-1 text-xs text-[#7A7C75]">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => fileRef.current?.click()}
                        title="Upload PDF or Document"
                        className="p-1.5 rounded-lg hover:bg-black/[0.06] text-[#60635C] hover:text-[#111] transition-colors"
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        type="button"
                        title="Voice dictation"
                        className="p-1.5 rounded-lg hover:bg-black/[0.06] text-[#60635C] hover:text-[#111] transition-colors"
                      >
                        <Mic size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono text-[#8C8E85]">
                      <span className="hidden sm:inline">↵ send</span>
                      <span className="hidden sm:inline">⇧↵ newline</span>

                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="w-8 h-8 rounded-xl bg-[#1A1A1A] hover:bg-black disabled:opacity-30 text-white flex items-center justify-center transition-all ml-1 shadow-sm"
                      >
                        <ArrowUpRight size={15} />
                      </button>
                    </div>
                  </div>
                </form>

                {/* Quick starter questions */}
                {sources.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
                    {[
                      'Summarize the core methodology',
                      'What are the key conclusions?',
                      'Compare the main arguments',
                    ].map((s) => (
                      <button
                        key={s}
                        onClick={() => ask(s)}
                        className="text-xs px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-[#555] hover:text-[#111] border border-black/[0.08] shadow-sm backdrop-blur-md transition-all text-left"
                      >
                        {s} ↗
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Active Conversation: Messages Feed with Pinned Bottom Composer */
            <>
              <div
                className="flex-1 overflow-y-auto px-6 py-6 space-y-6"
                ref={feedRef}
              >
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`max-w-3xl mx-auto flex flex-col ${
                      m.role === 'user' ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div className="text-[10px] font-mono text-[#8C8E85] uppercase tracking-wider mb-1.5 px-1">
                      {m.role === 'user' ? 'YOU' : 'SYNORA'}
                    </div>

                    <div
                      className={`rounded-2xl p-4 sm:p-5 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-white border border-[#EAE8E2] text-[#1E201D] shadow-sm max-w-xl'
                          : 'bg-[#F4F4F0]/80 border border-[#EAE8E2] text-[#22241F] shadow-sm w-full'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{m.content}</div>

                      {/* Verified Citations List */}
                      {m.citations && m.citations.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-[#EAE8E2] flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-mono text-[#8C8E85] mr-1">
                            SOURCES CITED:
                          </span>
                          {m.citations.map((c, j) => (
                            <button
                              key={j}
                              onClick={() => setActiveCitation(c)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white hover:bg-[#EAE8E2] text-[#1E201D] border border-black/[0.08] transition-colors shadow-xs"
                            >
                              <span className="font-mono text-emerald-700 font-semibold">{c.marker}</span>
                              <span className="truncate max-w-[140px]">{c.title}</span>
                              <span className="text-[#8C8E85]">· {c.location}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Thinking Pill Animation when Gemini is answering */}
                {loading && (
                  <div className="max-w-3xl mx-auto flex flex-col items-start animate-scale-in">
                    <div className="text-[10px] font-mono text-[#8C8E85] uppercase tracking-wider mb-2 px-1">
                      SYNORA
                    </div>
                    <ThinkingPill mode="chat" />
                  </div>
                )}

                {error && (
                  <div className="max-w-3xl mx-auto p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                    {error}
                  </div>
                )}
              </div>

              {/* Pinned Bottom Frosted Glass Composer Bar */}
              <div className="p-4 sm:p-5 border-t border-[#EAE8E2] bg-[#FBFBFA]/95 backdrop-blur-md shrink-0">
                <div className="max-w-3xl mx-auto">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      void ask();
                    }}
                    className="relative rounded-2xl bg-white/80 hover:bg-white/95 focus-within:bg-white backdrop-blur-xl border border-black/[0.09] shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06),0_1px_1px_rgba(255,255,255,0.9)_inset] transition-all p-3"
                  >
                    <textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          void ask();
                        }
                      }}
                      placeholder="Ask anything about your sources..."
                      rows={2}
                      className="w-full bg-transparent border-0 outline-none text-[#1E201D] placeholder-[#8A8C84] text-xs sm:text-sm resize-none px-2 font-sans leading-relaxed"
                    />

                    <div className="flex items-center justify-between pt-2 px-1 text-xs text-[#7A7C75]">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => fileRef.current?.click()}
                          title="Add PDF or Document"
                          className="p-1.5 rounded-lg hover:bg-black/[0.06] text-[#60635C] hover:text-[#111] transition-colors"
                        >
                          <Plus size={16} />
                        </button>

                        <button
                          type="button"
                          title="Voice dictation"
                          className="p-1.5 rounded-lg hover:bg-black/[0.06] text-[#60635C] hover:text-[#111] transition-colors"
                        >
                          <Mic size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono text-[#8C8E85]">
                        <span className="hidden sm:inline">↵ send</span>
                        <span className="hidden sm:inline">⇧↵ newline</span>

                        <button
                          type="submit"
                          disabled={loading || !input.trim()}
                          className="w-8 h-8 rounded-xl bg-[#1A1A1A] hover:bg-black disabled:opacity-30 text-white flex items-center justify-center transition-all ml-1 shadow-sm"
                        >
                          <ArrowUpRight size={15} />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Right Sidebar: Sources & Studio Tools */}
        <aside className="border-t lg:border-t-0 border-[#EAE8E2] bg-white/40 p-5 overflow-y-auto space-y-6 h-full max-h-[calc(100vh-64px)] shrink-0">
          {/* Header & Add Source Button */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-serif text-lg text-[#1E201D]">Sources</h3>
              <button
                onClick={() => fileRef.current?.click()}
                className="w-7 h-7 rounded-lg hover:bg-[#EAEAE5] flex items-center justify-center text-[#555] hover:text-[#111]"
              >
                <Plus size={15} />
              </button>
            </div>

            {/* Drag & Drop Upload Zone */}
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-[#DCDAD4] hover:border-black/30 rounded-2xl p-4 text-center cursor-pointer hover:bg-white/60 transition-all group"
            >
              <FileUp size={20} className="mx-auto text-[#888] group-hover:text-[#111] mb-1.5 transition-colors" />
              <div className="text-xs font-medium text-[#1E201D]">Upload sources</div>
              <div className="text-[10px] text-[#8C8E85] mt-0.5">PDF, DOCX, TXT, or MD</div>
            </div>

            <input
              ref={fileRef}
              type="file"
              hidden
              multiple
              accept=".pdf,.docx,.txt,.md"
              onChange={(e) => void upload(e.target.files)}
            />
          </div>

          {/* Thinking Pill for Source Upload */}
          {busy && (
            <div className="p-3 rounded-2xl bg-[#F4F4F0] border border-[#EAE8E2] flex justify-center animate-scale-in">
              <ThinkingPill mode="upload" size="sm" />
            </div>
          )}

          {uploadProgressState === 'done' && (
            <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 size={13} />
              <span>Document indexed successfully</span>
            </div>
          )}

          {/* Sources List */}
          <div>
            <div className="text-[10px] font-mono text-[#8C8E85] uppercase tracking-wider mb-2.5">
              IN THIS NOTEBOOK · {sources.length}
            </div>

            {sources.length > 0 ? (
              <div className="space-y-2">
                {sources.map((s) => (
                  <div
                    key={s.id}
                    className="p-2.5 rounded-xl bg-white border border-[#EAE8E2] flex items-center justify-between gap-3 shadow-xs hover:border-[#D5D3CB] transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-[#F4F4F0] text-[#555] flex items-center justify-center shrink-0">
                        <FileText size={13} />
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-medium text-[#1E201D] truncate">{s.title}</div>
                        <div className="text-[10px] text-[#8C8E85] uppercase font-mono">{s.kind}</div>
                      </div>
                    </div>
                    <Check size={12} className="text-emerald-600 shrink-0" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center text-xs text-[#8C8E85] border border-dashed border-[#EAE8E2] rounded-xl">
                No sources added yet. Drop PDFs above to enable citation extraction.
              </div>
            )}
          </div>

          {/* Studio Quick Generators */}
          <div className="pt-2 border-t border-[#EAE8E2]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-[10px] font-mono text-[#8C8E85] uppercase tracking-wider">
                STUDIO GENERATORS
              </div>
              <Link
                href={`/notebook/${id}/studio`}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
              >
                View all ↗
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'Study guide', kind: 'guide' },
                { label: 'Flashcards', kind: 'flashcards' },
                { label: 'Quiz', kind: 'quiz' },
                { label: 'FAQ', kind: 'faq' },
              ].map((tool) => (
                <button
                  key={tool.kind}
                  onClick={() => quickStudy(tool.kind)}
                  className="p-2.5 rounded-xl bg-white hover:bg-[#F4F4F0] border border-[#EAE8E2] text-left text-xs font-medium text-[#1E201D] transition-colors flex items-center justify-between group"
                >
                  <span>{tool.label}</span>
                  <Sparkles size={11} className="text-[#888] group-hover:text-[#111]" />
                </button>
              ))}
            </div>

            <Link
              href={`/notebook/${id}/audio`}
              className="mt-3 w-full p-2.5 rounded-xl bg-white hover:bg-[#F4F4F0] border border-[#EAE8E2] text-xs font-medium text-[#1E201D] flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Headphones size={13} className="text-[#666]" />
                Audio overview
              </span>
              <span className="text-[10px] font-mono text-[#8C8E85]">TTS ↗</span>
            </Link>
          </div>
        </aside>

        {/* Citation Popover Modal */}
        {activeCitation && (
          <div
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setActiveCitation(null)}
          >
            <div
              className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-black/[0.08] animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-mono font-semibold">
                    {activeCitation.marker}
                  </span>
                  <h4 className="font-semibold text-sm text-[#1E201D] truncate max-w-xs">
                    {activeCitation.title}
                  </h4>
                </div>
                <button
                  onClick={() => setActiveCitation(null)}
                  className="w-7 h-7 rounded-full hover:bg-[#F4F4F0] flex items-center justify-center text-[#777]"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="py-4 space-y-2">
                <div className="text-xs text-[#8C8E85] font-mono">
                  LOCATION: <span className="text-[#1E201D]">{activeCitation.location}</span>
                </div>
                <div className="p-3 rounded-xl bg-[#F7F7F5] border border-[#EAE8E2] text-xs text-[#2A2C27] leading-relaxed italic">
                  {activeCitation.quote || 'Exact vector passage extracted and verified against source document.'}
                </div>
              </div>

              <div className="pt-3 border-t border-[#F0EFEB] flex justify-end">
                <button
                  onClick={() => setActiveCitation(null)}
                  className="px-4 py-1.5 rounded-md bg-[#1A1A1A] text-white text-xs font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
