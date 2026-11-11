'use client';

import React, { useState, useMemo } from 'react';
import {
  X,
  FileText,
  Copy,
  Check,
  Search,
  Download,
  Trash2,
  Sparkles,
  Layers,
  BookOpen,
  ArrowRight,
  Upload,
  RefreshCw,
  ExternalLink,
  HelpCircle,
  Brain,
  ListOrdered,
} from 'lucide-react';

export interface SourceChunk {
  content: string;
  location?: string;
}

export interface InspectorSource {
  id: string;
  title: string;
  kind: string;
  status: string;
  content?: string;
  chunks?: SourceChunk[];
  pageCount?: number;
  wordCount?: number;
  createdAt?: string;
}

interface SourceInspectorProps {
  source: InspectorSource;
  onClose: () => void;
  onAskAboutSource: (prompt: string) => void;
  onDeleteSource: (sourceId: string) => void;
  onUpdateSource?: (updated: InspectorSource) => void;
}

export default function SourceInspector({
  source,
  onClose,
  onAskAboutSource,
  onDeleteSource,
  onUpdateSource,
}: SourceInspectorProps) {
  const [activeTab, setActiveTab] = useState<'content' | 'chunks' | 'actions'>('content');
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);
  const [reuploading, setReuploading] = useState(false);
  const [pastedText, setPastedText] = useState('');
  const [showPasteBox, setShowPasteBox] = useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Compute text
  const fullText = useMemo(() => {
    if (source.content && source.content.trim()) return source.content;
    if (source.chunks && source.chunks.length > 0) {
      return source.chunks.map((c) => c.content).join('\n\n');
    }
    return '';
  }, [source.content, source.chunks]);

  const words = useMemo(() => {
    if (source.wordCount) return source.wordCount;
    if (!fullText) return 0;
    return fullText.split(/\s+/).filter(Boolean).length;
  }, [source.wordCount, fullText]);

  const chunksCount = source.chunks?.length || (fullText ? Math.ceil(fullText.length / 1000) : 0);
  const pagesCount = source.pageCount || (chunksCount ? Math.max(1, Math.ceil(chunksCount / 3)) : 1);

  // Copy text to clipboard
  const handleCopy = async () => {
    if (!fullText) return;
    try {
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  // Download text file
  const handleDownload = () => {
    if (!fullText) return;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${source.title.replace(/\.[^/.]+$/, '')}-extracted.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Re-upload document to re-extract and populate reader
  const handleReupload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setReuploading(true);

    try {
      const form = new FormData();
      form.set('file', file);
      form.set('notebookId', 'current');
      const res = await fetch('/api/sources/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.id) {
        const updated: InspectorSource = {
          ...source,
          title: file.name,
          content: data.text || '',
          chunks: data.chunks || [],
          pageCount: data.page_count,
          wordCount: data.word_count,
          status: 'ready',
        };
        onUpdateSource?.(updated);
      }
    } catch {}
    setReuploading(false);
  };

  // Save manual pasted text
  const handleSavePastedText = () => {
    if (!pastedText.trim()) return;
    const updated: InspectorSource = {
      ...source,
      content: pastedText.trim(),
      wordCount: pastedText.trim().split(/\s+/).filter(Boolean).length,
      chunks: [
        {
          location: 'Document body',
          content: pastedText.trim(),
        },
      ],
      status: 'ready',
    };
    onUpdateSource?.(updated);
    setShowPasteBox(false);
  };

  // Highlight search matches in text
  const filteredParagraphs = useMemo(() => {
    if (!fullText) return [];
    const paragraphs = fullText.split(/\n\s*\n/).filter((p) => p.trim());
    if (!searchQuery.trim()) return paragraphs;
    const q = searchQuery.toLowerCase();
    return paragraphs.filter((p) => p.toLowerCase().includes(q));
  }, [fullText, searchQuery]);

  // Color badges
  const ext = source.kind?.toLowerCase() || source.title.split('.').pop()?.toLowerCase() || 'doc';
  const getBadgeStyle = () => {
    switch (ext) {
      case 'pdf':
        return { bg: 'bg-rose-50 text-rose-700 border-rose-200', label: 'PDF' };
      case 'pptx':
      case 'ppt':
        return { bg: 'bg-amber-50 text-amber-700 border-amber-200', label: 'PPTX' };
      case 'docx':
      case 'doc':
        return { bg: 'bg-blue-50 text-blue-700 border-blue-200', label: 'DOCX' };
      case 'youtube':
        return { bg: 'bg-red-50 text-red-700 border-red-200', label: 'YOUTUBE' };
      case 'web':
        return { bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'WEB' };
      case 'note':
        return { bg: 'bg-teal-50 text-teal-700 border-teal-200', label: 'NOTE' };
      default:
        return { bg: 'bg-stone-50 text-stone-700 border-stone-200', label: ext.toUpperCase() };
    }
  };

  const badge = getBadgeStyle();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-[#FBFAF6] border border-[#DEDAD0] rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8E4D8] bg-[#F7F5EE]/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs font-mono border ${badge.bg}`}
            >
              {badge.label}
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="font-serif text-base sm:text-lg font-medium text-[#1E201D] truncate">
                  {source.title}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-100/70 text-emerald-800 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                  Indexed & Grounded
                </span>
              </div>
              <p className="text-[11px] text-[#78756E] font-sans truncate">
                Source Inspector · {pagesCount} {pagesCount === 1 ? 'page' : 'pages'} · {words.toLocaleString()} words · {chunksCount} {chunksCount === 1 ? 'chunk' : 'chunks'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {fullText && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-xl border border-[#D5D0C5] bg-white hover:bg-[#F2EFE8] text-xs font-medium text-[#333] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Copy full document text"
                >
                  {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 rounded-xl border border-[#D5D0C5] bg-white hover:bg-[#F2EFE8] text-xs font-medium text-[#333] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="Download extracted text"
                >
                  <Download size={13} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                onDeleteSource(source.id);
                onClose();
              }}
              className="p-2 rounded-xl text-[#78756E] hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              title="Delete source"
            >
              <Trash2 size={15} />
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-[#78756E] hover:text-[#1E201D] hover:bg-[#ECE8DC] transition-colors cursor-pointer"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 pt-2 border-b border-[#E8E4D8] bg-[#F7F5EE]/40 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'content'
                  ? 'border-[#1E201D] text-[#1E201D] font-semibold'
                  : 'border-transparent text-[#78756E] hover:text-[#1E201D]'
              }`}
            >
              <BookOpen size={13} />
              <span>Extracted Reader</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('chunks')}
              className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'chunks'
                  ? 'border-[#1E201D] text-[#1E201D] font-semibold'
                  : 'border-transparent text-[#78756E] hover:text-[#1E201D]'
              }`}
            >
              <Layers size={13} />
              <span>Indexed Chunks ({chunksCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('actions')}
              className={`px-3.5 py-2 text-xs font-medium border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'actions'
                  ? 'border-[#1E201D] text-[#1E201D] font-semibold'
                  : 'border-transparent text-[#78756E] hover:text-[#1E201D]'
              }`}
            >
              <Sparkles size={13} className="text-amber-600" />
              <span>AI Research Prompts</span>
            </button>
          </div>

          {activeTab === 'content' && fullText && (
            <div className="relative mb-2">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#8C8E85]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Find in document..."
                className="pl-7 pr-3 py-1 rounded-lg bg-white border border-[#DEDAD0] text-xs text-[#1E201D] placeholder-[#9E9B93] outline-none focus:border-[#1E201D] w-36 sm:w-52 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-[#8C8E85] hover:text-[#1E201D]"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </div>

        {/* Tab Body Content */}
        <div className="flex-1 overflow-y-auto p-5 min-h-[300px]">
          {/* TAB 1: EXTRACTED READER */}
          {activeTab === 'content' && (
            <div>
              {fullText ? (
                <div className="space-y-4">
                  {searchQuery && (
                    <div className="text-xs text-[#78756E] bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between">
                      <span>Showing sections matching &ldquo;{searchQuery}&rdquo;</span>
                      <span className="font-mono text-[11px] font-semibold">
                        {filteredParagraphs.length} section(s)
                      </span>
                    </div>
                  )}

                  {filteredParagraphs.length > 0 ? (
                    filteredParagraphs.map((para, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-[#EAE6DC] text-xs sm:text-sm text-[#2D2E2B] leading-relaxed font-sans shadow-2xs hover:border-[#D5D0C5] transition-colors"
                      >
                        <div className="text-[10px] font-mono text-[#8C8E85] mb-1.5 flex items-center justify-between">
                          <span>Section {idx + 1}</span>
                          <span>{para.split(/\s+/).filter(Boolean).length} words</span>
                        </div>
                        <div className="whitespace-pre-wrap">{para}</div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-[#78756E] text-xs">
                      No matching text found for &ldquo;{searchQuery}&rdquo;.
                    </div>
                  )}
                </div>
              ) : (
                /* Empty state when text wasn't cached */
                <div className="py-8 px-4 text-center max-w-md mx-auto space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#EFECE4] text-[#60635C] mx-auto flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-base font-medium text-[#1E201D]">
                      Document Registered in Workspace
                    </h3>
                    <p className="text-xs text-[#78756E] mt-1 leading-relaxed">
                      &ldquo;{source.title}&rdquo; is linked to this notebook. Re-uploading the file or pasting its text refreshes the high-fidelity reader cache instantly.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      hidden
                      accept=".pdf,.docx,.pptx,.txt,.md,.png,.jpg,.jpeg,.webp"
                      onChange={handleReupload}
                    />
                    <button
                      type="button"
                      disabled={reuploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#1E201D] text-white hover:bg-black text-xs font-medium flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                    >
                      {reuploading ? <RefreshCw size={13} className="animate-spin" /> : <Upload size={13} />}
                      <span>{reuploading ? 'Extracting text...' : 'Re-upload to View Text'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowPasteBox(!showPasteBox)}
                      className="w-full sm:w-auto px-4 py-2 rounded-xl border border-[#D5D0C5] bg-white hover:bg-[#F2EFE8] text-xs font-medium text-[#333] transition-colors cursor-pointer"
                    >
                      {showPasteBox ? 'Hide Paste Box' : 'Paste Document Text'}
                    </button>
                  </div>

                  {showPasteBox && (
                    <div className="mt-4 p-3 rounded-2xl bg-white border border-[#DEDAD0] text-left space-y-2">
                      <div className="text-xs font-medium text-[#1E201D]">Paste source content:</div>
                      <textarea
                        value={pastedText}
                        onChange={(e) => setPastedText(e.target.value)}
                        placeholder="Paste text from PYQ or notes here..."
                        rows={6}
                        className="w-full text-xs p-2.5 rounded-xl border border-[#E0DDD5] outline-none font-sans"
                      />
                      <button
                        type="button"
                        onClick={handleSavePastedText}
                        className="px-4 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 transition-colors"
                      >
                        Save & Preview
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: INDEXED CHUNKS */}
          {activeTab === 'chunks' && (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-[#F4F1E8] border border-[#E5E1D5] text-xs text-[#636159] leading-relaxed">
                SYNORA partitions each document into deterministic retrieval chunks with vector embeddings. Each chunk provides page-accurate citation grounding for Gemini.
              </div>

              {source.chunks && source.chunks.length > 0 ? (
                source.chunks.map((ch, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white border border-[#EAE6DC] text-xs text-[#333] shadow-2xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#8C8E85]">
                      <span className="font-semibold text-[#1E201D]">
                        Chunk {idx + 1} · {ch.location || `Segment ${idx + 1}`}
                      </span>
                      <span>{ch.content.length} chars</span>
                    </div>
                    <div className="font-sans leading-relaxed text-[#4A4740] whitespace-pre-wrap bg-[#FBFAF6] p-2.5 rounded-xl border border-black/[0.04]">
                      {ch.content}
                    </div>
                  </div>
                ))
              ) : fullText ? (
                <div className="p-4 rounded-2xl bg-white border border-[#EAE6DC] text-xs text-[#555] leading-relaxed">
                  <div className="font-mono text-[11px] text-[#8C8E85] mb-2">Chunk 1 · Full Document</div>
                  {fullText.slice(0, 1200)}...
                </div>
              ) : (
                <div className="text-center py-12 text-[#78756E] text-xs">
                  No chunks indexed yet for this source.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: AI RESEARCH PROMPTS */}
          {activeTab === 'actions' && (
            <div className="space-y-3">
              <div className="text-xs text-[#78756E] mb-2">
                Click any AI prompt to immediately query this document in the chat:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    onAskAboutSource(`Please give me a comprehensive summary of "${source.title}", highlighting its main thesis, core arguments, and conclusions with citations.`);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-white border border-[#DEDAD0] hover:border-[#1E201D] hover:bg-[#FAF9F6] text-left transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#1E201D] flex items-center gap-1.5">
                      <BookOpen size={14} className="text-emerald-700" />
                      Comprehensive Summary
                    </span>
                    <ArrowRight size={13} className="text-[#8C8E85] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-[#78756E] leading-relaxed">
                    Extract the core topics, themes, and key takeaways with cited page references.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onAskAboutSource(`Extract and list all Previous Year Questions (PYQ) or practice questions from "${source.title}", organized by topic and mark weights.`);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-white border border-[#DEDAD0] hover:border-[#1E201D] hover:bg-[#FAF9F6] text-left transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#1E201D] flex items-center gap-1.5">
                      <ListOrdered size={14} className="text-amber-700" />
                      Extract Questions (PYQ)
                    </span>
                    <ArrowRight size={13} className="text-[#8C8E85] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-[#78756E] leading-relaxed">
                    Find and organize all PYQs, numericals, and test questions found in this document.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onAskAboutSource(`Generate 5 detailed study flashcards based on the material in "${source.title}", with a question on the front and a verified explanation on the back.`);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-white border border-[#DEDAD0] hover:border-[#1E201D] hover:bg-[#FAF9F6] text-left transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#1E201D] flex items-center gap-1.5">
                      <Brain size={14} className="text-blue-700" />
                      Generate Study Flashcards
                    </span>
                    <ArrowRight size={13} className="text-[#8C8E85] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-[#78756E] leading-relaxed">
                    Turn key concepts into question-and-answer revision pairs for fast memorization.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onAskAboutSource(`List all technical definitions, formulas, and critical concepts mentioned in "${source.title}" with short explanations.`);
                    onClose();
                  }}
                  className="p-3.5 rounded-2xl bg-white border border-[#DEDAD0] hover:border-[#1E201D] hover:bg-[#FAF9F6] text-left transition-all shadow-2xs group cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-[#1E201D] flex items-center gap-1.5">
                      <HelpCircle size={14} className="text-purple-700" />
                      Definitions & Key Terms
                    </span>
                    <ArrowRight size={13} className="text-[#8C8E85] group-hover:translate-x-1 transition-transform" />
                  </div>
                  <p className="text-[11px] text-[#78756E] leading-relaxed">
                    Compile a handy glossary of technical terminology found in this document.
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-5 border-t border-[#E8E4D8] bg-[#F7F5EE]/80 flex items-center justify-between text-xs text-[#78756E] shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Ready for Grounded RAG Chat</span>
          </div>

          <button
            type="button"
            onClick={() => {
              onAskAboutSource(`Analyze "${source.title}" and explain its key insights.`);
              onClose();
            }}
            className="px-4 py-1.5 rounded-xl bg-[#1E201D] hover:bg-black text-white text-xs font-medium flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
          >
            <Sparkles size={12} className="text-amber-300" />
            <span>Ask SYNORA about this source →</span>
          </button>
        </div>
      </div>
    </div>
  );
}
