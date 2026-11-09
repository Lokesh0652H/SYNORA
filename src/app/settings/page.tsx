'use client';

import { useState } from 'react';
import { Shield, Key, Database, LogOut, CheckCircle2 } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { supabaseBrowser } from '@/lib/supabase/browser';

export default function SettingsPage() {
  const [message, setMessage] = useState('');

  async function logout() {
    const db = supabaseBrowser();
    if (db) await db.auth.signOut();
    location.href = '/';
  }

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-10 pb-6 border-b border-dashed border-[#DCDAD4]">
          <span className="text-[11px] font-mono text-[#8C8E85] uppercase tracking-wider block mb-2">
            PREFERENCES
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-normal text-[#1E201D] tracking-tight">
            Settings & Connectivity
          </h1>
          <p className="text-sm text-[#737373] max-w-xl mt-1 leading-relaxed">
            Manage your research perimeter, vector database connections, and session status.
          </p>
        </div>

        <div className="space-y-8">
          {/* Workspace Privacy & Infrastructure */}
          <div className="rounded-3xl bg-white border border-[#DCDAD4] p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0EFEB] mb-6">
              <span className="w-9 h-9 rounded-xl bg-[#F4F4F0] text-[#1E201D] flex items-center justify-center">
                <Shield size={18} />
              </span>
              <div>
                <h3 className="font-serif text-lg text-[#1E201D]">Data Perimeter & Keys</h3>
                <div className="text-xs text-[#8C8E85]">Private user data governance</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mb-6">
              SYNORA stores notebooks, files, and vector chunks in your isolated Supabase instance with Row Level Security (RLS). Gemini API keys run only in server route environments and are never sent to client browsers.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 rounded-2xl bg-[#F9F9F7] border border-[#EAE8E2] flex items-center justify-between">
                <div>
                  <div className="text-[#8C8E85] text-[10px] uppercase">Supabase Postgres</div>
                  <div className="font-medium text-[#1E201D] mt-0.5">
                    {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Connected · RLS active' : 'Local dev mode'}
                  </div>
                </div>
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>

              <div className="p-4 rounded-2xl bg-[#F9F9F7] border border-[#EAE8E2] flex items-center justify-between">
                <div>
                  <div className="text-[#8C8E85] text-[10px] uppercase">Gemini Embedding & Flash</div>
                  <div className="font-medium text-[#1E201D] mt-0.5">
                    Server environment
                  </div>
                </div>
                <CheckCircle2 size={16} className="text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Account Authentication */}
          <div className="rounded-3xl bg-white border border-[#DCDAD4] p-8 shadow-sm">
            <div className="flex items-center gap-3 pb-4 border-b border-[#F0EFEB] mb-6">
              <span className="w-9 h-9 rounded-xl bg-[#F4F4F0] text-[#1E201D] flex items-center justify-center">
                <Key size={18} />
              </span>
              <div>
                <h3 className="font-serif text-lg text-[#1E201D]">Authentication</h3>
                <div className="text-xs text-[#8C8E85]">Device session management</div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#666666] leading-relaxed mb-6">
              Sign out of your active workspace session on this browser.
            </p>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1A1A1A] hover:bg-black text-white text-xs font-medium transition-all shadow-sm"
            >
              <LogOut size={14} />
              <span>Sign out</span>
            </button>

            {message && <p className="text-xs text-[#666] mt-3">{message}</p>}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
