'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  FolderOpen,
  LayoutDashboard,
  Settings,
  Sparkles,
  Menu,
  X,
  Shield,
  Plus,
} from 'lucide-react';
import { readNotebooks, type Notebook } from '@/lib/data';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [books, setBooks] = useState<Notebook[]>([]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setBooks(readNotebooks());
    const update = () => setBooks(readNotebooks());
    window.addEventListener('storage', update);
    window.addEventListener('synora-data', update);
    return () => {
      window.removeEventListener('storage', update);
      window.removeEventListener('synora-data', update);
    };
  }, []);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileNavOpen(false);
  }, [path]);

  const navItem = (href: string, icon: React.ReactNode, label: string) => {
    const isActive = path === href;
    return (
      <Link
        href={href}
        className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
          isActive
            ? 'bg-[#1A1A1A] text-white shadow-xs font-semibold'
            : 'text-[#61635D] hover:text-[#111] hover:bg-[#EBEBE6]'
        }`}
      >
        <span className={isActive ? 'text-white' : 'text-[#7A7C75]'}>{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex bg-[#FBFBFA] text-[#1E201D] font-sans selection:bg-[#1A1A1A] selection:text-white">
      {/* Mobile Nav Backdrop */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`w-64 bg-[#F4F4F0] border-r border-[#E8E6DF] p-5 flex flex-col fixed inset-y-0 left-0 z-50 transition-transform duration-200 ease-out md:translate-x-0 ${
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand */}
        <div className="flex items-center justify-between pb-6 mb-2 border-b border-[#E8E6DF]/80">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <span className="w-5 h-5 bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold rounded-sm tracking-tighter shadow-xs">
              ■
            </span>
            <span className="font-bold tracking-tight text-base text-[#1A1A1A]">SYNORA</span>
          </Link>
          <button
            onClick={() => setMobileNavOpen(false)}
            className="md:hidden w-7 h-7 rounded-lg hover:bg-black/5 flex items-center justify-center text-[#666]"
          >
            <X size={15} />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="space-y-6 flex-1 overflow-y-auto">
          <div>
            <div className="text-[10px] font-mono text-[#8C8E85] tracking-widest uppercase px-3 mb-2 font-semibold">
              Workspace
            </div>
            <div className="space-y-1">
              {navItem('/dashboard', <LayoutDashboard size={15} />, 'Overview')}
              {navItem('/dashboard', <FolderOpen size={15} />, 'All notebooks')}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between px-3 mb-2">
              <span className="text-[10px] font-mono text-[#8C8E85] tracking-widest uppercase font-semibold">
                Notebooks ({books.length})
              </span>
              <Link
                href="/dashboard"
                className="text-[10px] text-[#8C8E85] hover:text-[#111]"
                title="Create notebook"
              >
                <Plus size={12} />
              </Link>
            </div>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {books.slice(0, 8).map((b) => (
                <Link
                  key={b.id}
                  href={`/notebook/${b.id}`}
                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs transition-colors truncate ${
                    path.includes(b.id)
                      ? 'bg-white text-[#111] font-semibold border border-black/[0.08] shadow-xs'
                      : 'text-[#61635D] hover:text-[#111] hover:bg-[#EBEBE6]'
                  }`}
                >
                  <BookOpen size={13} className="shrink-0 text-[#8C8E85]" />
                  <span className="truncate">{b.title}</span>
                </Link>
              ))}
              {books.length === 0 && (
                <div className="text-[11px] text-[#999] px-3 py-2 italic">
                  No notebooks yet.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 mt-auto border-t border-[#E8E6DF] space-y-3">
          {navItem('/settings', <Settings size={15} />, 'Settings')}

          <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-white/70 border border-black/[0.06]">
            <div className="w-7 h-7 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center font-bold text-xs">
              S
            </div>
            <div className="truncate text-xs">
              <div className="font-semibold text-[#1E201D] truncate">Research Studio</div>
              <div className="text-[10px] text-[#8C8E85] flex items-center gap-1">
                <Shield size={9} /> Private mode
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 px-6 sm:px-8 border-b border-[#E8E6DF] bg-[#FBFBFA]/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              className="md:hidden w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center text-[#444]"
              aria-label="Toggle navigation menu"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs text-[#7A7C75]">
              <Sparkles size={13} className="text-[#8C8E85]" />
              <span className="hidden sm:inline">Synora Studio</span>
              <span>·</span>
              <span className="font-medium text-[#1E201D]">
                {path.startsWith('/notebook')
                  ? 'Notebook'
                  : path === '/settings'
                  ? 'Settings'
                  : 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F4F4F0] border border-black/[0.06] text-[10px] font-mono text-[#7A7C75]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>DETERMINISTIC RETRIEVAL</span>
            </div>

            <Link
              href="/dashboard"
              className="text-xs font-medium text-[#1E201D] hover:underline"
            >
              All Workspaces
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
