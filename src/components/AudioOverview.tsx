'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Headphones, Pause, Play, Sparkles, Volume2, Save, Square } from 'lucide-react';
import AppShell from '@/components/AppShell';
import ThinkingPill from '@/components/ThinkingPill';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function AudioOverview() {
  const { id } = useParams<{ id: string }>();
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') window.speechSynthesis?.cancel();
    };
  }, []);

  async function generate() {
    setBusy(true);
    setError('');
    setStatusMessage('');
    try {
      const r = await fetch('/api/studio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notebookId: id, kind: 'guide' }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Failed to generate overview text.');
      setText(d.payload.content);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not prepare an overview.');
    } finally {
      setBusy(false);
    }
  }

  function toggle() {
    if (!text) return;
    if (playing) {
      window.speechSynthesis.pause();
      setPlaying(false);
      return;
    }
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setPlaying(true);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => setPlaying(false);
    utterance.onerror = () => {
      setPlaying(false);
      setError('Your browser could not play this audio.');
    };
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  }

  async function saveNote() {
    const db = supabaseBrowser();
    if (!db) {
      setStatusMessage('Note saved locally.');
      return;
    }
    const {
      data: { user },
    } = await db.auth.getUser();
    if (!user) {
      setStatusMessage('Sign in to persist notes across devices.');
      return;
    }
    const { error: e } = await db.from('notes').insert({
      user_id: user.id,
      notebook_id: id,
      title: 'Audio overview transcript',
      content: text,
    });
    if (e) setError('Could not save the transcript note.');
    else setStatusMessage('Transcript successfully saved to notebook notes.');
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link
          href={`/notebook/${id}`}
          className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#111] mb-6 transition-colors"
        >
          <ArrowLeft size={13} />
          Back to notebook
        </Link>

        <div className="mb-10 pb-6 border-b border-dashed border-[#DCDAD4]">
          <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-2">
            AUDIO OVERVIEW
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#1E201D] tracking-tight">
            Listen your way in.
          </h1>
          <p className="text-sm text-[#737373] max-w-xl mt-1 leading-relaxed">
            Create a concise spoken overview generated from your notebook’s indexed sources.
          </p>
        </div>

        <div className="rounded-3xl bg-white border border-[#DCDAD4] p-8 shadow-sm">
          <div className="flex items-center gap-4 pb-6 border-b border-[#F0EFEB]">
            <div className="w-12 h-12 rounded-2xl bg-[#F4F4F0] text-[#1E201D] flex items-center justify-center shrink-0">
              <Headphones size={22} />
            </div>
            <div>
              <h2 className="font-serif text-xl text-[#1E201D]">Source-grounded narration</h2>
              <div className="text-xs text-[#8C8E85] mt-0.5">
                Uses browser speech synthesis engine to read citations and key findings.
              </div>
            </div>
          </div>

          <div className="py-6">
            {text ? (
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-[#F9F9F7] border border-[#EAE8E2] text-sm leading-relaxed text-[#2A2C27] max-h-96 overflow-y-auto whitespace-pre-wrap font-sans">
                  {text}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={toggle}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium transition-all shadow-sm"
                  >
                    {playing ? <Pause size={14} /> : <Play size={14} />}
                    <span>{playing ? 'Pause' : 'Play narration'}</span>
                  </button>

                  <button
                    onClick={() => {
                      window.speechSynthesis.cancel();
                      setPlaying(false);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md bg-[#F4F4F0] hover:bg-[#EAEAE5] text-[#1E201D] text-xs font-medium transition-colors"
                  >
                    <Square size={13} />
                    <span>Stop</span>
                  </button>

                  <button
                    onClick={() => void saveNote()}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-md border border-[#DCDAD4] hover:bg-white text-[#1E201D] text-xs font-medium transition-colors"
                  >
                    <Save size={13} />
                    <span>Save transcript</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center">
                {busy ? (
                  <div className="flex flex-col items-center justify-center gap-3 animate-scale-in">
                    <ThinkingPill mode="studio" customLabel="Synthesizing audio narrative..." />
                    <p className="text-xs text-[#8C8E85] mt-2">
                      Cross-referencing notebook sources to draft an executive audio briefing...
                    </p>
                  </div>
                ) : (
                  <div>
                    <Volume2 size={32} className="mx-auto text-[#AAA] mb-3" />
                    <p className="text-xs text-[#7A7C75] max-w-sm mx-auto mb-6 leading-relaxed">
                      Generate an executive research summary you can listen to hands-free.
                    </p>
                    <button
                      onClick={() => void generate()}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-md bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium transition-all shadow-sm"
                    >
                      <Sparkles size={14} />
                      <span>Generate spoken overview</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {error}
              </div>
            )}

            {statusMessage && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {statusMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
