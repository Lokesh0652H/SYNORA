'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/router';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Clock3,
  FileText,
  Plus,
  Search,
  X,
  Mic,
  ArrowUpRight,
  ChevronDown,
  Paperclip,
  Sparkles,
  FileUp,
  MoreVertical,
  Pencil,
  Trash2,
} from 'lucide-react';
import AppShell from '@/components/AppShell';
import AsciiSharkMotion from '@/components/AsciiSharkMotion';
import ShaderCard, { type ShaderTheme } from '@/components/ShaderCard';
import ThinkingPill from '@/components/ThinkingPill';
import { readNotebooks, writeNotebooks, renameNotebook, deleteNotebook, type Notebook } from '@/lib/data';

const CARD_THEMES: ShaderTheme[] = ['blue', 'purple', 'emerald', 'amber', 'magenta', 'ruby', 'slate'];

export default function Dashboard() {
  const router = useRouter();
  const [books, setBooks] = useState<Notebook[]>([]);
  const [query, setQuery] = useState('');
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  // Notebook Rename & Delete state
  const [activeMenuBookId, setActiveMenuBookId] = useState<string | null>(null);
  const [renameModalBook, setRenameModalBook] = useState<Notebook | null>(null);
  const [renameTitle, setRenameTitle] = useState('');
  const [renameDescription, setRenameDescription] = useState('');
  const [deleteModalBook, setDeleteModalBook] = useState<Notebook | null>(null);

  // Stacked Prompt Bar State
  const [promptInput, setPromptInput] = useState('');
  const [isProcessingPrompt, setIsProcessingPrompt] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setBooks(readNotebooks());
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setHistoryOpen(false);
      }
      setActiveMenuBookId(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(
    () =>
      books.filter((b) =>
        `${b.title} ${b.description}`.toLowerCase().includes(query.toLowerCase())
      ),
    [books, query]
  );

  async function handleRenameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!renameModalBook || !renameTitle.trim()) return;
    const targetId = renameModalBook.id;
    const nextTitle = renameTitle.trim();
    const nextDesc = renameDescription.trim();

    renameNotebook(targetId, nextTitle);
    setBooks((prev) =>
      prev.map((b) =>
        b.id === targetId
          ? { ...b, title: nextTitle, description: nextDesc || b.description, updatedAt: 'Just now' }
          : b
      )
    );

    try {
      await fetch(`/api/notebooks/${targetId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: nextTitle, description: nextDesc }),
      });
    } catch {}

    setRenameModalBook(null);
  }

  async function handleDeleteConfirm() {
    if (!deleteModalBook) return;
    const targetId = deleteModalBook.id;

    deleteNotebook(targetId);
    setBooks((prev) => prev.filter((b) => b.id !== targetId));

    try {
      await fetch(`/api/notebooks/${targetId}`, {
        method: 'DELETE',
      });
    } catch {}

    setDeleteModalBook(null);
  }

  // Create Notebook
  async function create(initialTitle?: string, initialPrompt?: string) {
    const notebookTitle = (initialTitle || title).trim();
    if (!notebookTitle) {
      setError('Add a name for your notebook.');
      return;
    }

    let book: Notebook = {
      id: crypto.randomUUID(),
      title: notebookTitle,
      description: (initialPrompt ? `Research question: ${initialPrompt}` : description).trim(),
      updatedAt: 'Just now',
      sources: 0,
    };

    try {
      const response = await fetch('/api/notebooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: book.title, description: book.description }),
      });
      if (response.ok) {
        const saved = await response.json();
        book = { ...book, id: saved.id };
      }
    } catch {
      // Local fallback
    }

    const next = [book, ...books];
    setBooks(next);
    writeNotebooks(next);
    window.dispatchEvent(new Event('synora-data'));

    if (initialPrompt) {
      // Pass prompt query parameter so NotebookWorkspace immediately asks
      router.push(`/notebook/${book.id}?q=${encodeURIComponent(initialPrompt)}`);
    } else {
      router.push(`/notebook/${book.id}`);
    }
  }

  // Handle direct prompt submission from Stacked glass bar
  const handlePromptSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const val = promptInput.trim();
    if (!val || isProcessingPrompt) return;

    setIsProcessingPrompt(true);
    // Derive notebook title from prompt
    const suggestedTitle = val.length > 40 ? `${val.slice(0, 36)}...` : val;
    setTimeout(async () => {
      await create(suggestedTitle, val);
    }, 700);
  };

  // Handle fast file upload directly from the + button in prompt bar
  const handleQuickUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files.length) return;
    const file = files[0];
    const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
    create(`Notebook: ${nameWithoutExt}`);
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[#FBFBFA] text-[#1E201D] pb-24">
        {/* Top Floating History Pill & Quick Jump */}
        <div className="relative pt-6 px-6 max-w-5xl mx-auto flex items-center justify-between">
          <div className="relative" ref={historyRef}>
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium bg-white/80 hover:bg-white text-[#555] hover:text-[#111] border border-black/[0.08] shadow-[0_2px_10px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all"
            >
              <Clock3 size={13} className="text-[#888]" />
              <span>History</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-200 ${historyOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* History Dropdown Menu */}
            {historyOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl p-2.5 shadow-2xl border border-black/[0.08] z-50 backdrop-blur-xl animate-scale-in">
                <div className="text-[10px] font-mono text-[#8C8E85] uppercase tracking-wider px-2 py-1.5">
                  Recent Notebooks
                </div>
                {books.length > 0 ? (
                  <div className="max-h-60 overflow-y-auto space-y-1">
                    {books.slice(0, 7).map((b) => (
                      <button
                        key={b.id}
                        onClick={() => router.push(`/notebook/${b.id}`)}
                        className="w-full text-left px-2.5 py-2 rounded-xl text-xs hover:bg-[#F4F4F0] flex items-center justify-between group transition-colors"
                      >
                        <div className="truncate pr-2">
                          <div className="font-medium text-[#1E201D] truncate">{b.title}</div>
                          <div className="text-[10px] text-[#8C8E85]">{b.sources} sources · {b.updatedAt}</div>
                        </div>
                        <ArrowUpRight size={13} className="text-[#AAA] group-hover:text-[#111] shrink-0" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-4 text-xs text-[#8C8E85] text-center">
                    No recent notebooks yet.
                  </div>
                )}
                <div className="pt-2 mt-1 border-t border-black/[0.06]">
                  <button
                    onClick={() => {
                      setHistoryOpen(false);
                      setModal(true);
                    }}
                    className="w-full text-center text-xs font-medium text-[#1E201D] py-1.5 rounded-lg hover:bg-[#F4F4F0] transition-colors"
                  >
                    + Create new notebook
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => setModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-md bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium transition-all shadow-sm hover:shadow-md active:scale-95 hover:scale-102"
          >
            <Plus size={14} />
            New notebook
          </button>
        </div>

        {/* HERO SECTION: Stacked ASCII Shark Motion Backdrop & "what's on your mind?" */}
        <section className="relative min-h-[460px] sm:min-h-[500px] flex flex-col items-center justify-center px-4 overflow-hidden">
          {/* Animated 3-creature ASCII Shark Canvas */}
          <AsciiSharkMotion className="opacity-95" />

          {/* Foreground Hero Content */}
          <div className="relative z-10 w-full max-w-2xl text-center px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-normal text-[#1E201D] tracking-tight font-serif mb-8 select-none">
              what’s on your mind?
            </h1>

            {/* Stacked Frosted Glass Prompt Input Bar */}
            <form
              onSubmit={handlePromptSubmit}
              className="relative w-full rounded-2xl bg-white/80 hover:bg-white/95 focus-within:bg-white backdrop-blur-xl border border-black/[0.09] focus-within:border-black/25 shadow-[0_16px_40px_-12px_rgba(0,0,0,0.08),0_1px_1px_rgba(255,255,255,0.9)_inset] focus-within:shadow-[0_20px_48px_-12px_rgba(0,0,0,0.12),0_0_0_2px_rgba(0,0,0,0.06)] transition-all duration-300 p-2.5 sm:p-3"
            >
              <textarea
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    void handlePromptSubmit();
                  }
                }}
                placeholder="Ask Synora anything..."
                rows={2}
                className="w-full bg-transparent border-0 outline-none text-[#1E201D] placeholder-[#8A8C84] text-sm sm:text-base resize-none px-2 pt-1 font-sans leading-relaxed"
              />

              {/* Bottom Action Row */}
              <div className="flex items-center justify-between pt-2 px-1 text-xs text-[#7A7C75]">
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* File Upload Attachment Button */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload PDF or Document"
                    className="p-1.5 rounded-lg hover:bg-black/[0.06] text-[#60635C] hover:text-[#111] hover:scale-110 active:scale-95 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    accept=".pdf,.docx,.txt,.md"
                    onChange={handleQuickUpload}
                  />

                  {/* Microphone Icon */}
                  <button
                    type="button"
                    title="Voice input"
                    className="p-1.5 rounded-lg hover:bg-black/[0.06] text-[#60635C] hover:text-[#111] hover:scale-110 active:scale-95 transition-all"
                  >
                    <Mic size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 text-[11px] font-mono text-[#8C8E85]">
                  <span className="hidden sm:inline">↵ send</span>
                  <span className="hidden sm:inline">⇧↵ newline</span>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!promptInput.trim() || isProcessingPrompt}
                    className="w-8 h-8 rounded-xl bg-[#1A1A1A] hover:bg-black disabled:opacity-30 disabled:hover:bg-[#1A1A1A] text-white flex items-center justify-center transition-all ml-1 shadow-sm hover:scale-105 active:scale-95 group/send"
                  >
                    <ArrowUpRight size={15} className="transition-transform duration-200 group-hover/send:translate-x-0.5 group-hover/send:-translate-y-0.5" />
                  </button>
                </div>
              </div>
            </form>

            {/* Thinking Pill Status when submitting from prompt bar */}
            {isProcessingPrompt && (
              <div className="mt-5 flex justify-center animate-scale-in">
                <ThinkingPill mode="chat" customLabel="Initializing research session..." />
              </div>
            )}
          </div>
        </section>

        {/* NOTEBOOKS SECTION WITH ASHISH FLUID SHADER CARDS */}
        <section className="max-w-6xl mx-auto px-6 mt-6">
          {/* Section Header & Search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-dashed border-[#DCDAD4]">
            <div>
              <h2 className="text-xl sm:text-2xl font-serif font-normal text-[#1E201D]">
                Your notebooks
              </h2>
              <p className="text-xs text-[#7A7C75] mt-0.5">
                {books.length} {books.length === 1 ? 'workspace' : 'workspaces'} with verified citations
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C8E85]" />
                <input
                  type="text"
                  placeholder="Search notebooks..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="pl-8 pr-4 py-1.5 rounded-full text-xs bg-white border border-black/[0.08] outline-none focus:border-black/30 w-52 sm:w-64 text-[#1E201D] transition-colors"
                />
              </div>

              <button
                onClick={() => setModal(true)}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-[#1A1A1A] hover:bg-black text-white flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus size={13} />
                <span>New</span>
              </button>
            </div>
          </div>

          {/* Cards Grid using Ashish Gogula fluid ShaderCards */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {filtered.map((b, idx) => {
                const theme = CARD_THEMES[idx % CARD_THEMES.length];
                const isMenuOpen = activeMenuBookId === b.id;
                return (
                  <ShaderCard
                    key={b.id}
                    title={b.title}
                    description={b.description || 'A fresh place to synthesize documents and ask grounded questions.'}
                    theme={theme}
                    href={`/notebook/${b.id}`}
                    badge={`${b.sources} ${b.sources === 1 ? 'source' : 'sources'}`}
                    actions={
                      <div className="relative" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveMenuBookId(isMenuOpen ? null : b.id);
                          }}
                          className="w-7 h-7 rounded-full hover:bg-black/10 flex items-center justify-center text-[#6E7067] hover:text-[#1E201D] transition-colors cursor-pointer"
                          title="Notebook options"
                        >
                          <MoreVertical size={14} />
                        </button>

                        {isMenuOpen && (
                          <div className="absolute right-0 mt-1 w-44 bg-white rounded-xl shadow-xl border border-[#EAE8E2] py-1 z-30 text-xs animate-scale-in">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveMenuBookId(null);
                                setRenameModalBook(b);
                                setRenameTitle(b.title);
                                setRenameDescription(b.description || '');
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-[#F7F7F4] flex items-center gap-2 text-[#1E201D] transition-colors cursor-pointer"
                            >
                              <Pencil size={13} className="text-[#8C8E85]" />
                              <span>Rename notebook</span>
                            </button>

                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setActiveMenuBookId(null);
                                setDeleteModalBook(b);
                              }}
                              className="w-full text-left px-3 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 transition-colors cursor-pointer"
                            >
                              <Trash2 size={13} className="text-red-500" />
                              <span>Delete notebook</span>
                            </button>
                          </div>
                        )}
                      </div>
                    }
                    icon={<BookOpen size={20} />}
                    meta={
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1.5">
                          <FileText size={12} />
                          {b.sources} indexed
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock3 size={12} />
                          {b.updatedAt}
                        </span>
                      </div>
                    }
                  />
                );
              })}

              {/* Blank Add Notebook ShaderCard */}
              <div
                onClick={() => setModal(true)}
                className="rounded-[24px] border-2 border-dashed border-[#DCDAD4] hover:border-black/30 p-7 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-white/80 hover-lift transition-all duration-300 min-h-[220px] group"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#EFEFEA] group-hover:bg-[#1A1A1A] text-[#666] group-hover:text-white flex items-center justify-center transition-all duration-300 group-hover:rotate-90 group-hover:scale-110 mb-3 shadow-xs">
                  <Plus size={22} />
                </div>
                <h3 className="font-semibold text-base text-[#1E201D] mb-1 group-hover:translate-y-[-1px] transition-transform">Create notebook</h3>
                <p className="text-xs text-[#8C8E85] max-w-[200px]">
                  Start with a question, paper, or set of PDFs
                </p>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center border-2 border-dashed border-[#DCDAD4] rounded-2xl mt-8 bg-white/40">
              <Search size={28} className="mx-auto text-[#AAA] mb-3" />
              <h3 className="text-lg font-serif text-[#1E201D] mb-1">
                {query ? 'No matching notebooks' : 'Your workspace is ready'}
              </h3>
              <p className="text-xs text-[#8C8E85] max-w-sm mx-auto mb-5">
                {query
                  ? 'Try searching by a different notebook name or topic.'
                  : 'Create a notebook to organize reading, PDFs, and grounded Gemini inquiries.'}
              </p>
              <button
                onClick={() => setModal(true)}
                className="px-5 py-2 rounded-md bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium inline-flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Plus size={14} /> Create your first notebook
              </button>
            </div>
          )}
        </section>

        {/* Modal: Create Notebook */}
        {modal && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModal(false)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/[0.08] animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
                <h3 className="text-xl font-serif font-normal text-[#1E201D]">
                  Create notebook
                </h3>
                <button
                  onClick={() => setModal(false)}
                  className="w-8 h-8 rounded-full hover:bg-[#F4F4F0] flex items-center justify-center text-[#777] hover:text-[#111]"
                >
                  <X size={16} />
                </button>
              </div>

              <p className="text-xs text-[#7A7C75] mt-3 leading-relaxed">
                Give your research space a title. You can drop PDFs, notes, and questions anytime.
              </p>

              <div className="mt-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider mb-1.5">
                    Notebook name
                  </label>
                  <input
                    autoFocus
                    placeholder="e.g. LLM Reasoning Benchmarks 2026"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD4] focus:border-black/50 text-sm outline-none text-[#1E201D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider mb-1.5">
                    Description <span className="normal-case text-[#AAA]">(optional)</span>
                  </label>
                  <textarea
                    placeholder="What questions are you exploring?"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    maxLength={500}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD4] focus:border-black/50 text-sm outline-none text-[#1E201D] resize-none"
                  />
                </div>

                {error && <p className="text-xs text-rose-600">{error}</p>}
              </div>

              <div className="mt-6 pt-4 border-t border-[#F0EFEB] flex items-center justify-end gap-3">
                <button
                  onClick={() => setModal(false)}
                  className="px-4 py-2 rounded-md text-xs font-medium text-[#666] hover:text-black hover:bg-[#F4F4F0] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => create()}
                  className="px-5 py-2 rounded-md bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Plus size={14} />
                  Create workspace
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Rename Notebook */}
        {renameModalBook && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setRenameModalBook(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-black/[0.08] animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#F0EFEB]">
                <div className="flex items-center gap-2">
                  <Pencil size={18} className="text-[#1E201D]" />
                  <h3 className="text-xl font-serif font-normal text-[#1E201D]">
                    Rename notebook
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setRenameModalBook(null)}
                  className="w-8 h-8 rounded-full hover:bg-[#F4F4F0] flex items-center justify-center text-[#777] hover:text-[#111] cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleRenameSubmit} className="mt-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider mb-1.5">
                    Notebook name
                  </label>
                  <input
                    autoFocus
                    required
                    value={renameTitle}
                    onChange={(e) => setRenameTitle(e.target.value)}
                    maxLength={100}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD4] focus:border-black/50 text-sm outline-none text-[#1E201D]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider mb-1.5">
                    Description <span className="normal-case text-[#AAA]">(optional)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={renameDescription}
                    onChange={(e) => setRenameDescription(e.target.value)}
                    maxLength={500}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD4] focus:border-black/50 text-sm outline-none text-[#1E201D] resize-none"
                  />
                </div>

                <div className="pt-4 border-t border-[#F0EFEB] flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setRenameModalBook(null)}
                    className="px-4 py-2 rounded-md text-xs font-medium text-[#666] hover:text-black hover:bg-[#F4F4F0] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!renameTitle.trim()}
                    className="px-5 py-2 rounded-md bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium transition-all shadow-sm cursor-pointer disabled:opacity-40"
                  >
                    Save changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Delete Confirmation */}
        {deleteModalBook && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteModalBook(null)}
          >
            <div
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-2xl border border-black/[0.08] animate-scale-in"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-4">
                <Trash2 size={22} />
              </div>

              <h3 className="text-lg font-serif font-medium text-[#1E201D] mb-2">
                Delete &ldquo;{deleteModalBook.title}&rdquo;?
              </h3>

              <p className="text-xs text-[#7A7C75] leading-relaxed mb-6">
                Are you sure you want to delete this notebook? All uploaded sources, indexed chunks, and research dialogues will be permanently removed.
              </p>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteModalBook(null)}
                  className="px-4 py-2 rounded-md text-xs font-medium text-[#666] hover:text-black hover:bg-[#F4F4F0] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 rounded-md bg-rose-600 hover:bg-rose-700 text-white text-xs font-medium transition-all shadow-sm cursor-pointer"
                >
                  Delete notebook
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
