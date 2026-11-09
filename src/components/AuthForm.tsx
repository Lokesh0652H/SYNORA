'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, BookOpen, Shield, ArrowRight } from 'lucide-react';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    const db = supabaseBrowser();
    if (!db) {
      setError(
        'Authentication needs Supabase. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local, then restart.'
      );
      return;
    }
    setBusy(true);
    try {
      const result =
        mode === 'signup'
          ? await db.auth.signUp({
              email,
              password,
              options: {
                data: { display_name: name },
                emailRedirectTo: `${location.origin}/auth/callback?next=/dashboard`,
              },
            })
          : await db.auth.signInWithPassword({ email, password });
      if (result.error) throw result.error;
      if (mode === 'signup' && !result.data.session) {
        setMessage('Check your email to confirm your account, then return here to sign in.');
      } else {
        location.href = '/dashboard';
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not authenticate.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F9F9F7] text-[#1A1A1A] font-sans selection:bg-[#1A1A1A] selection:text-white">
      {/* Left: Auth Form Column */}
      <section className="p-8 sm:p-12 flex flex-col justify-between">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <span className="w-5 h-5 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold rounded-sm">
            ■
          </span>
          <span className="font-bold tracking-tight text-base text-[#1A1A1A]">SYNORA</span>
        </Link>

        <div className="max-w-sm w-full mx-auto my-12">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#737373] hover:text-[#111] mb-6 transition-colors"
          >
            <ArrowLeft size={13} /> Back to overview
          </Link>

          <h1 className="text-3xl sm:text-4xl font-serif font-normal tracking-tight mb-2 text-[#1A1A1A]">
            {mode === 'signup' ? 'Make room for your research.' : 'Welcome back.'}
          </h1>
          <p className="text-xs sm:text-sm text-[#737373] mb-8 leading-relaxed">
            {mode === 'signup'
              ? 'Create a private research workspace with verifiable citations.'
              : 'Pick up where your thinking and source synthesis left off.'}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider mb-1.5">
                  Your name
                </label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="e.g. Dr. Eleanor Vance"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD4] focus:border-black/50 text-xs sm:text-sm outline-none bg-white text-[#1A1A1A]"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider mb-1.5">
                Email address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
                autoComplete="email"
                placeholder="name@institution.edu"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD4] focus:border-black/50 text-xs sm:text-sm outline-none bg-white text-[#1A1A1A]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                required
                minLength={8}
                autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#DCDAD4] focus:border-black/50 text-xs sm:text-sm outline-none bg-white text-[#1A1A1A]"
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
                {message}
              </div>
            )}

            <button
              disabled={busy}
              type="submit"
              className="w-full py-3 rounded-xl bg-[#1A1A1A] hover:bg-black disabled:opacity-50 text-white text-xs sm:text-sm font-medium transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>{busy ? 'Verifying...' : mode === 'signup' ? 'Create research account' : 'Sign in to workspace'}</span>
              <ArrowRight size={14} />
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-[#737373]">
            {mode === 'signup' ? 'Already have an account?' : 'New to Synora?'}{' '}
            <Link
              href={mode === 'signup' ? '/login' : '/signup'}
              className="text-[#1A1A1A] font-semibold underline underline-offset-4"
            >
              {mode === 'signup' ? 'Sign in' : 'Create an account'}
            </Link>
          </div>
        </div>

        <div className="text-[11px] text-[#8C8E85] font-mono">
          © 2026 SYNORA Labs, Inc. · Sovereign AI Architecture
        </div>
      </section>

      {/* Right: Editorial Quote & Philosophy */}
      <aside className="hidden lg:flex flex-col justify-between p-16 bg-[#F2F2ED] border-l border-dashed border-[#DCDAD4]">
        <div className="w-10 h-10 rounded-2xl bg-[#E8E8E2] text-[#1A1A1A] flex items-center justify-center shadow-xs">
          <BookOpen size={20} />
        </div>

        <div className="max-w-md my-auto">
          <div className="text-[10px] font-mono text-[#8C8E85] tracking-widest uppercase mb-4">
            PROVENANCE & CITATION
          </div>
          <blockquote className="text-2xl sm:text-3xl font-serif font-normal text-[#1A1A1A] leading-snug mb-6">
            “The first step toward clarity is giving your ideas a place to meet — grounded in the exact text.”
          </blockquote>
          <p className="text-xs text-[#737373] leading-relaxed">
            Every document is split with chunk overlap, converted to Gemini vector embeddings, and indexed with exact page coordinates for verifiable inquiry.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-[#8C8E85]">
          <Shield size={12} />
          <span>ZERO RETENTION IN THIRD-PARTY PROMPT CACHES</span>
        </div>
      </aside>
    </main>
  );
}
