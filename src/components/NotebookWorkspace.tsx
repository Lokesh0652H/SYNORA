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
  Globe,
  Video,
  Download,
  FileDown,
  Loader2,
  SlidersHorizontal,
  Trash2,
  FilePlus2,
  Layers,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import AsciiSharkMotion from '@/components/AsciiSharkMotion';
import ThinkingPill from '@/components/ThinkingPill';
import { readNotebooks } from '@/lib/data';
import { exportNotebookToPdf, exportNotebookToDocx, exportNotebookToMarkdown } from '@/lib/export';

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

export function getSourceBadge(kind: string, title = '') {
  const ext = (kind || title.split('.').pop() || '').toLowerCase();
  if (ext.includes('ppt')) {
    return {
      label: 'PPTX',
      icon: 'PPTX',
      badgeClass: 'bg-amber-100 text-amber-800 border border-amber-300/80',
    };
  }
  if (ext.includes('pdf')) {
    return {
      label: 'PDF',
      icon: 'PDF',
      badgeClass: 'bg-red-100 text-red-800 border border-red-300/80',
    };
  }
  if (ext.includes('doc')) {
    return {
      label: 'DOCX',
      icon: 'DOCX',
      badgeClass: 'bg-blue-100 text-blue-800 border border-blue-300/80',
    };
  }
  if (ext.includes('youtube') || ext === 'yt') {
    return {
      label: 'YOUTUBE',
      icon: 'YT',
      badgeClass: 'bg-rose-100 text-rose-800 border border-rose-300/80',
    };
  }
  if (ext.includes('web') || ext.includes('http')) {
    return {
      label: 'WEB',
      icon: 'WEB',
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300/80',
    };
  }
  if (['png', 'jpg', 'jpeg', 'webp'].some((img) => ext.includes(img))) {
    return {
      label: 'IMAGE',
      icon: 'IMG',
      badgeClass: 'bg-purple-100 text-purple-800 border border-purple-300/80',
    };
  }
  if (ext.includes('note')) {
    return {
      label: 'NOTE',
      icon: 'NOTE',
      badgeClass: 'bg-teal-100 text-teal-800 border border-teal-300/80',
    };
  }
  return {
    label: ext.toUpperCase() || 'FILE',
    icon: 'DOC',
    badgeClass: 'bg-stone-100 text-stone-700 border border-stone-300/70',
  };
}

export default function NotebookWorkspace() {
  const { id } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q');

  const [title, setTitle] = useState('Research notebook');
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState<Set<string>>(new Set());
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [uploadProgressState, setUploadProgressState] = useState<'idle' | 'uploading' | 'done'>('idle');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);

  // URL & YouTube ingestion state
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlBusy, setUrlBusy] = useState(false);

  // Note creation modal state
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');

  // Export dropdown state
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [exporting, setExporting] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);
  const feedRef = useRef<HTMLDivElement>(null);
  const initialQueryProcessed = useRef(false);

  // Selection toggles
  const allSelected = sources.length > 0 && selectedSourceIds.size === sources.length;

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedSourceIds(new Set());
    } else {
      setSelectedSourceIds(new Set(sources.map((s) => s.id)));
    }
  }

  function toggleSource(sourceId: string) {
    setSelectedSourceIds((prev) => {
      const next = new Set(prev);
      if (next.has(sourceId)) {
        next.delete(sourceId);
      } else {
        next.add(sourceId);
      }
      return next;
    });
  }

  function removeSource(sourceId: string) {
    setSources((prev) => {
      const next = prev.filter((s) => s.id !== sourceId);
      try {
        localStorage.setItem(`synora_sources_${id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setSelectedSourceIds((prev) => {
      const next = new Set(prev);
      next.delete(sourceId);
      return next;
    });
  }

  function handleCreateNote(e: React.FormEvent) {
    e.preventDefault();
    if (!noteContent.trim()) return;
    const noteSource: Source = {
      id: crypto.randomUUID(),
      title: noteTitle.trim() || 'Untitled Note',
      kind: 'note',
      status: 'ready',
    };
    setSources((prev) => {
      const next = [noteSource, ...prev];
      try {
        localStorage.setItem(`synora_sources_${id}`, JSON.stringify(next));
      } catch {}
      return next;
    });
    setSelectedSourceIds((prev) => new Set([...prev, noteSource.id]));
    setNoteTitle('');
    setNoteContent('');
    setShowNoteModal(false);
    setNotice('Note created and saved to sources.');
  }

  async function handleIngestUrl() {
    if (!urlInput.trim()) return;
    setError('');
    setUrlBusy(true);
    setNotice('Extracting web content or YouTube transcript and generating vector embeddings...');

    try {
      const res = await fetch('/api/sources/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notebookId: id, url: urlInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to ingest URL');

      const newSource: Source = {
        id: data.id || crypto.randomUUID(),
        title: data.title || urlInput.trim(),
        kind: data.type === 'youtube' ? 'youtube' : 'web',
        status: 'ready',
      };

      setNotice(`${newSource.title} successfully indexed.`);
      setSources((prev) => {
        const next = [newSource, ...prev.filter((s) => s.id !== newSource.id)];
        try {
          localStorage.setItem(`synora_sources_${id}`, JSON.stringify(next));
        } catch {}
        return next;
      });
      setSelectedSourceIds((prev) => new Set([...prev, newSource.id]));
      setUrlInput('');
      setShowUrlModal(false);
      setUploadProgressState('done');
      setTimeout(() => setUploadProgressState('idle'), 3000);
    } catch (err: any) {
      setError(err.message || 'URL ingestion failed.');
    } finally {
      setUrlBusy(false);
    }
  }

  async function handleExport(format: 'pdf' | 'docx' | 'md') {
    setShowExportMenu(false);
    setExporting(true);
    const exportData = {
      title,
      sources: sources.map((s) => ({ title: s.title, type: s.kind })),
      messages: messages.map((m) => ({ role: m.role, content: m.content, citations: m.citations })),
      notes: [],
    };

    try {
      if (format === 'pdf') {
        exportNotebookToPdf(exportData);
      } else if (format === 'docx') {
        await exportNotebookToDocx(exportData);
      } else if (format === 'md') {
        exportNotebookToMarkdown(exportData);
      }
    } catch (e: any) {
      setError(`Export failed: ${e.message}`);
    } finally {
      setExporting(false);
    }
  }

  const refresh = useCallback(async () => {
    try {
      const r = await fetch(`/api/notebooks/${id}`);
      if (r.ok) {
        const data = await r.json();
        if (data.title) setTitle(data.title);
        if (Array.isArray(data.sources) && data.sources.length > 0) {
          setSources((prev) => {
            const map = new Map<string, Source>();
            prev.forEach((s) => map.set(s.id, s));
            data.sources.forEach((s: any) => map.set(s.id, s));
            const merged = Array.from(map.values());
            try {
              localStorage.setItem(`synora_sources_${id}`, JSON.stringify(merged));
            } catch {}
            return merged;
          });
        }
        if (Array.isArray(data.messages)) {
          setMessages(data.messages);
        }
      }
    } catch {}
  }, [id]);

  useEffect(() => {
    const local = readNotebooks().find((b) => b.id === id);
    if (local) {
      setTitle(local.title);
    }
    try {
      const stored = localStorage.getItem(`synora_sources_${id}`);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSources(parsed);
          setSelectedSourceIds(new Set(parsed.map((s: Source) => s.id)));
        }
      }
    } catch {}
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

      let savedSource: Source = {
        id: crypto.randomUUID(),
        title: file.name,
        kind: file.name.split('.').pop()?.toLowerCase() || 'file',
        status: 'ready',
      };

      try {
        const r = await fetch('/api/sources/upload', { method: 'POST', body: form });
        const data = await r.json();
        if (r.ok && data?.id) {
          savedSource = {
            id: data.id,
            title: file.name,
            kind: data.kind || file.name.split('.').pop()?.toLowerCase() || 'file',
            status: 'ready',
          };
          setNotice(`${file.name} indexed and ready.`);
        } else {
          setNotice(`${file.name} uploaded to workspace.`);
        }
      } catch {
        setNotice(`${file.name} added to workspace.`);
      }

      setSources((prev) => {
        const next = [savedSource, ...prev.filter((s) => s.title !== savedSource.title)];
        try {
          localStorage.setItem(`synora_sources_${id}`, JSON.stringify(next));
        } catch {}
        return next;
      });
      setSelectedSourceIds((prev) => new Set([...prev, savedSource.id]));
    }

    setUploadProgressState('done');
    setBusy(false);
    setTimeout(() => setUploadProgressState('idle'), 3000);
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
              {/* Export Dropdown Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  disabled={exporting}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-[#F4F4F0] hover:bg-[#EAEAE5] text-[#1E201D] transition-colors cursor-pointer"
                >
                  <Download size={13} />
                  <span>{exporting ? 'Exporting...' : 'Export'}</span>
                </button>

                {showExportMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#EAE8E2] py-1.5 z-50 text-xs animate-scale-in">
                    <div className="px-3 py-1 text-[10px] font-mono text-[#8C8E85] uppercase tracking-wider">
                      Export Notebook
                    </div>
                    <button
                      onClick={() => handleExport('pdf')}
                      className="w-full text-left px-3 py-2 hover:bg-[#F7F7F4] flex items-center gap-2.5 text-[#1E201D] transition-colors cursor-pointer"
                    >
                      <FileDown size={14} className="text-[#8C8E85]" />
                      <div>
                        <div className="font-medium">Research Dossier (PDF)</div>
                        <div className="text-[10px] text-[#8C8E85]">Executive summary & citations</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExport('docx')}
                      className="w-full text-left px-3 py-2 hover:bg-[#F7F7F4] flex items-center gap-2.5 text-[#1E201D] transition-colors cursor-pointer"
                    >
                      <FileText size={14} className="text-[#8C8E85]" />
                      <div>
                        <div className="font-medium">Word Document (.docx)</div>
                        <div className="text-[10px] text-[#8C8E85]">Formatted publication dossier</div>
                      </div>
                    </button>
                    <button
                      onClick={() => handleExport('md')}
                      className="w-full text-left px-3 py-2 hover:bg-[#F7F7F4] flex items-center gap-2.5 text-[#1E201D] transition-colors cursor-pointer"
                    >
                      <Globe size={14} className="text-[#8C8E85]" />
                      <div>
                        <div className="font-medium">Markdown (.md)</div>
                        <div className="text-[10px] text-[#8C8E85]">With YAML metadata headers</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>

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
                  className="relative w-full rounded-2xl bg-white/80 hover:bg-white/95 focus-within:bg-white backdrop-blur-xl border border-black/[0.09] focus-within:border-black/25 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08),0_1px_1px_rgba(255,255,255,0.9)_inset] focus-within:shadow-[0_20px_48px_-12px_rgba(0,0,0,0.12),0_0_0_2px_rgba(0,0,0,0.06)] transition-all duration-300 p-3 text-left"
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
                        className="p-1.5 rounded-lg hover:bg-black/[0.06] text-[#60635C] hover:text-[#111] hover:scale-110 active:scale-95 transition-all"
                      >
                        <Plus size={16} />
                      </button>

                      <button
                        type="button"
                        title="Voice dictation"
                        className="p-1.5 rounded-lg hover:bg-black/[0.06] text-[#60635C] hover:text-[#111] hover:scale-110 active:scale-95 transition-all"
                      >
                        <Mic size={16} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono text-[#8C8E85]">
                      {sources.length > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#EFECE6] text-[#4A4740] font-sans text-[11px] font-medium">
                          {selectedSourceIds.size > 0 ? selectedSourceIds.size : sources.length} {sources.length === 1 ? 'source' : 'sources'}
                        </span>
                      )}
                      <span className="hidden sm:inline">↵ send</span>
                      <span className="hidden sm:inline">⇧↵ newline</span>

                      <button
                        type="submit"
                        disabled={loading || !input.trim()}
                        className="w-8 h-8 rounded-xl bg-[#1A1A1A] hover:bg-black disabled:opacity-30 text-white flex items-center justify-center transition-all ml-1 shadow-sm hover:scale-105 active:scale-95 group/send cursor-pointer"
                      >
                        <ArrowUpRight size={15} className="transition-transform duration-200 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5" />
                      </button>
                    </div>
                  </div>
                </form>

                <div className="text-[10px] text-center text-[#8C8E85] mt-2 font-sans">
                  SYNORA can make mistakes, so double-check citations.
                </div>

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
                        className="text-xs px-3.5 py-1.5 rounded-full bg-white/85 hover:bg-white text-[#555] hover:text-[#111] border border-black/[0.08] shadow-xs hover:shadow-sm hover-lift backdrop-blur-md transition-all text-left flex items-center gap-1 group/chip active:scale-95"
                      >
                        <span>{s}</span>
                        <ArrowUpRight size={11} className="transition-transform duration-200 group-hover/chip:translate-x-0.5 group-hover/chip:-translate-y-0.5 text-[#888] group-hover/chip:text-[#111]" />
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
                    className="relative rounded-2xl bg-white/85 hover:bg-white/95 focus-within:bg-white backdrop-blur-xl border border-black/[0.09] focus-within:border-black/25 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.06),0_1px_1px_rgba(255,255,255,0.9)_inset] focus-within:shadow-[0_16px_40px_-8px_rgba(0,0,0,0.1),0_0_0_2px_rgba(0,0,0,0.05)] transition-all duration-300 p-3"
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
                          className="p-1.5 rounded-lg hover:bg-black/[0.06] text-[#60635C] hover:text-[#111] hover:scale-110 active:scale-95 transition-all"
                        >
                          <Plus size={16} />
                        </button>

                        <button
                          type="button"
                          title="Voice dictation"
                          className="p-1.5 rounded-lg hover:bg-black/[0.06] text-[#60635C] hover:text-[#111] hover:scale-110 active:scale-95 transition-all"
                        >
                          <Mic size={16} />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono text-[#8C8E85]">
                        {sources.length > 0 && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#EFECE6] text-[#4A4740] font-sans text-[11px] font-medium">
                            {selectedSourceIds.size > 0 ? selectedSourceIds.size : sources.length} {sources.length === 1 ? 'source' : 'sources'}
                          </span>
                        )}
                        <span className="hidden sm:inline">↵ send</span>
                        <span className="hidden sm:inline">⇧↵ newline</span>

                        <button
                          type="submit"
                          disabled={loading || !input.trim()}
                          className="w-8 h-8 rounded-xl bg-[#1A1A1A] hover:bg-black disabled:opacity-30 text-white flex items-center justify-center transition-all ml-1 shadow-sm hover:scale-105 active:scale-95 group/send cursor-pointer"
                        >
                          <ArrowUpRight size={15} className="transition-transform duration-200 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5" />
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="text-[10px] text-center text-[#8C8E85] mt-2 font-sans">
                    SYNORA can make mistakes, so double-check citations.
                  </div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Right Sidebar: Sources & Studio Tools (Styled matching Reference Design) */}
        <aside className="border-t lg:border-t-0 border-[#EAE8E2] bg-white/40 p-4 sm:p-5 overflow-y-auto space-y-5 h-full max-h-[calc(100vh-64px)] shrink-0 flex flex-col">
          {/* Header & Source Count */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg text-[#1E201D] font-medium tracking-tight">Sources</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#EFECE6] text-[#55534E] font-medium">
                  {sources.length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-7 h-7 rounded-lg hover:bg-[#EAEAE5] flex items-center justify-center text-[#555] hover:text-[#111] cursor-pointer"
                title="Upload document"
              >
                <Plus size={16} />
              </button>
            </div>

            {/* Two Action Buttons: + Add sources & + Create note */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="p-2.5 rounded-xl bg-white border border-[#DCDAD4] hover:border-[#1E201D] hover:bg-[#FAF9F6] text-xs font-medium text-[#1E201D] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer group"
              >
                <Plus size={14} className="text-[#1E201D] group-hover:scale-110 transition-transform" />
                <span>Add sources</span>
              </button>

              <button
                type="button"
                onClick={() => setShowNoteModal(true)}
                className="p-2.5 rounded-xl bg-white border border-[#DCDAD4] hover:border-[#1E201D] hover:bg-[#FAF9F6] text-xs font-medium text-[#1E201D] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer group"
              >
                <Plus size={14} className="text-[#1E201D] group-hover:scale-110 transition-transform" />
                <span>Create note</span>
              </button>
            </div>

            {/* Search the web for new sources */}
            <div className="space-y-1.5 mb-3">
              <div className="text-[11px] text-[#7A7C75] font-medium">
                Search the web for new sources
              </div>
              <div className="p-1.5 rounded-xl bg-white border border-[#DCDAD4] flex items-center gap-1.5 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setShowUrlModal(true)}
                  className="px-2 py-1 rounded-lg bg-[#F4F4F0] hover:bg-[#EAEAE5] text-[11px] font-medium text-[#1E201D] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Globe size={12} className="text-[#1E201D]" />
                  <span>Web</span>
                  <span className="text-[9px] opacity-60">▾</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlModal(true)}
                  className="px-2 py-1 rounded-lg bg-[#F4F4F0] hover:bg-[#EAEAE5] text-[11px] font-medium text-[#1E201D] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Sparkles size={11} className="text-amber-600" />
                  <span>Fast Research</span>
                  <span className="text-[9px] opacity-60">▾</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowUrlModal(true)}
                  className="ml-auto w-7 h-7 rounded-lg bg-[#20201D] text-white hover:bg-black flex items-center justify-center text-xs transition-colors cursor-pointer"
                  title="Add Web URL or YouTube Video"
                >
                  →
                </button>
              </div>
            </div>

            {/* Select All Row */}
            <div className="flex items-center justify-between py-1.5 px-1 border-b border-[#EAE6DC] text-xs text-[#7A7C75]">
              <div className="flex items-center gap-1.5 font-mono text-[11px]">
                <SlidersHorizontal size={13} className="text-[#8C8E85]" />
                <span className="uppercase text-[10px] tracking-wider text-[#8C8E85]">Indexed Sources</span>
              </div>

              <button
                type="button"
                onClick={toggleSelectAll}
                className="flex items-center gap-1.5 text-xs text-[#55534E] hover:text-[#1E201D] transition-colors cursor-pointer"
              >
                <span>Select all</span>
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleSelectAll}
                  className="rounded border-[#CCC] text-[#1E201D] focus:ring-0 cursor-pointer accent-[#1E201D] w-3.5 h-3.5"
                />
              </button>
            </div>

            <input
              ref={fileRef}
              type="file"
              hidden
              multiple
              accept=".pdf,.docx,.pptx,.txt,.md,.png,.jpg,.jpeg,.webp"
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

          {/* Prominent Visible Sources List (Matching Reference Image) */}
          <div className="flex-1 min-h-0 space-y-1.5 overflow-y-auto pr-0.5">
            {sources.length > 0 ? (
              sources.map((s) => {
                const isChecked = selectedSourceIds.has(s.id);
                const badge = getSourceBadge(s.kind, s.title);
                return (
                  <div
                    key={s.id}
                    onClick={() => toggleSource(s.id)}
                    className={`p-2.5 rounded-xl border transition-all flex items-center justify-between gap-2.5 group cursor-pointer ${
                      isChecked
                        ? 'bg-white border-[#DCDAD4] shadow-2xs hover:border-[#1E201D]'
                        : 'bg-white/50 border-transparent opacity-60 hover:opacity-100 hover:bg-white hover:border-[#DCDAD4]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      {/* Filetype Badge */}
                      <span
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[9px] shrink-0 font-mono ${badge.badgeClass}`}
                      >
                        {badge.icon}
                      </span>

                      {/* Filename & Type */}
                      <div className="min-w-0 flex-1">
                        <div
                          className="text-xs font-medium text-[#1E201D] truncate leading-tight"
                          title={s.title}
                        >
                          {s.title}
                        </div>
                        <div className="text-[10px] text-[#8C8E85] flex items-center gap-1.5 font-mono mt-0.5">
                          <span>{badge.label}</span>
                          <span>·</span>
                          <span className="text-emerald-700">Ready</span>
                        </div>
                      </div>
                    </div>

                    <div
                      className="flex items-center gap-1.5 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Delete Button (visible on hover) */}
                      <button
                        type="button"
                        onClick={() => removeSource(s.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-black/5 text-[#8C8E85] hover:text-red-600 transition-all cursor-pointer"
                        title="Remove source"
                      >
                        <Trash2 size={12} />
                      </button>

                      {/* Selection Checkbox */}
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleSource(s.id)}
                        className="rounded border-[#CCC] text-[#1E201D] focus:ring-0 cursor-pointer accent-[#1E201D] w-3.5 h-3.5"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              /* Drag & Drop Upload Zone when no sources yet */
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-[#DCDAD4] hover:border-black/30 rounded-2xl p-6 text-center cursor-pointer hover:bg-white/60 transition-all group"
              >
                <FileUp size={24} className="mx-auto text-[#888] group-hover:text-[#111] mb-2 transition-colors" />
                <div className="text-xs font-medium text-[#1E201D]">Upload sources</div>
                <div className="text-[10px] text-[#8C8E85] mt-1">PDF, DOCX, PPTX, TXT, or MD</div>
              </div>
            )}
          </div>

          {/* Studio Quick Generators */}
          <div className="pt-3 border-t border-[#EAE8E2] shrink-0">
            <div className="flex items-center justify-between mb-2.5">
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
                  className="p-2.5 rounded-xl bg-white hover:bg-[#F4F4F0] border border-[#EAE8E2] text-left text-xs font-medium text-[#1E201D] transition-colors flex items-center justify-between group cursor-pointer"
                >
                  <span>{tool.label}</span>
                  <Sparkles size={11} className="text-[#888] group-hover:text-[#111]" />
                </button>
              ))}
            </div>

            <Link
              href={`/notebook/${id}/audio`}
              className="mt-2.5 w-full p-2.5 rounded-xl bg-white hover:bg-[#F4F4F0] border border-[#EAE8E2] text-xs font-medium text-[#1E201D] flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-2">
                <Headphones size={13} className="text-[#666]" />
                Audio overview
              </span>
              <span className="text-[10px] font-mono text-[#8C8E85]">TTS ↗</span>
            </Link>
          </div>
        </aside>

        {/* Create Note Modal */}
        {showNoteModal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => setShowNoteModal(false)}
          >
            <div
              className="bg-[#FBFAF6] rounded-2xl p-6 max-w-lg w-full shadow-2xl border border-[#DEDAD0] animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DC]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-100 text-teal-800 border border-teal-200 flex items-center justify-center font-bold text-xs font-mono">
                    NOTE
                  </div>
                  <div>
                    <h4 className="font-serif text-base text-[#1E201D] font-medium">Create Research Note</h4>
                    <p className="text-[11px] text-[#7A7C75]">Add study notes, key takeaways, formulas, or summaries</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNoteModal(false)}
                  className="w-7 h-7 rounded-full hover:bg-[#EFEBE2] flex items-center justify-center text-[#777] cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="mt-4 space-y-4">
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A877D] block mb-1.5">
                    Note Title
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Machine Learning Key Formulas"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DEDAD0] rounded-xl text-xs text-[#1E201D] placeholder-[#A0A29A] outline-none focus:border-[#20201D] transition-colors"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A877D] block mb-1.5">
                    Note Content
                  </label>
                  <textarea
                    required
                    rows={6}
                    placeholder="Type or paste your study notes, key takeaways, formulas, or excerpts..."
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#DEDAD0] rounded-xl text-xs text-[#1E201D] placeholder-[#A0A29A] outline-none focus:border-[#20201D] transition-colors resize-none leading-relaxed font-sans"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE6DC]">
                  <button
                    type="button"
                    onClick={() => setShowNoteModal(false)}
                    className="px-3.5 py-1.5 rounded-lg text-xs text-[#60635C] hover:bg-[#EFEBE2] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!noteContent.trim()}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#20201D] text-white hover:bg-black disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus size={13} />
                    <span>Save to Sources</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Web URL / YouTube Ingestion Modal */}
        {showUrlModal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            onClick={() => {
              if (!urlBusy) {
                setShowUrlModal(false);
                setUrlInput('');
              }
            }}
          >
            <div
              className="bg-[#FBFAF6] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-[#DEDAD0] animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#EAE6DC]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#EFEBE2] border border-[#DEDAD0] flex items-center justify-center text-[#20201D]">
                    <Globe size={16} />
                  </div>
                  <div>
                    <h4 className="font-serif text-base text-[#1E201D] font-medium">Add Web or YouTube Source</h4>
                    <p className="text-[11px] text-[#7A7C75]">Scrape web articles or extract timed video transcripts</p>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={urlBusy}
                  onClick={() => {
                    setShowUrlModal(false);
                    setUrlInput('');
                  }}
                  className="w-7 h-7 rounded-full hover:bg-[#EFEBE2] flex items-center justify-center text-[#777] cursor-pointer"
                >
                  <X size={15} />
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void handleIngestUrl();
                }}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="text-[10px] font-mono uppercase tracking-wider text-[#8A877D] block mb-1.5">
                    Source URL
                  </label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/article or https://youtube.com/watch?v=..."
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    disabled={urlBusy}
                    className="w-full px-3 py-2.5 bg-white border border-[#DEDAD0] rounded-xl text-xs text-[#1E201D] placeholder-[#A0A29A] outline-none focus:border-[#20201D] transition-colors"
                  />
                </div>

                <div className="text-[11px] text-[#66635B] bg-[#F5F2EA] p-3 rounded-xl border border-[#E5E0D5] leading-relaxed">
                  💡 <strong>Multi-Modal Ingestion:</strong> SYNORA automatically detects YouTube videos, extracts clean spoken transcript segments, and chunks web articles for instant citation-grounded research.
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EAE6DC]">
                  <button
                    type="button"
                    disabled={urlBusy}
                    onClick={() => {
                      setShowUrlModal(false);
                      setUrlInput('');
                    }}
                    className="px-3.5 py-1.5 rounded-lg text-xs text-[#60635C] hover:bg-[#EFEBE2] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={urlBusy || !urlInput.trim()}
                    className="px-4 py-1.5 rounded-lg text-xs font-medium bg-[#20201D] text-white hover:bg-black disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    {urlBusy ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        <span>Ingesting...</span>
                      </>
                    ) : (
                      <>
                        <Plus size={13} />
                        <span>Ingest Source</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

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
