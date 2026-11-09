'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Compass, FolderOpen, LayoutDashboard, Settings, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { readNotebooks, type Notebook } from '@/lib/data';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const [books, setBooks] = useState<Notebook[]>([]);
  useEffect(() => { setBooks(readNotebooks()); const update = () => setBooks(readNotebooks()); window.addEventListener('storage', update); window.addEventListener('synora-data', update); return () => { window.removeEventListener('storage', update); window.removeEventListener('synora-data', update); }; }, []);
  const link = (href: string, icon: React.ReactNode, label: string) => <Link className={`navitem ${path === href ? 'active' : ''}`} href={href}>{icon}<span>{label}</span></Link>;
  return <div className="app-shell"><aside className="side"><Link className="brand" href="/dashboard"><span className="brand-mark">S</span><span className="brand-name">synora</span></Link><div className="nav-label">WORKSPACE</div>{link('/dashboard',<LayoutDashboard size={16}/>,'Overview')}{link('/dashboard',<Compass size={16}/>,'Discover')}{link('/dashboard',<FolderOpen size={16}/>,'All notebooks')}<div className="nav-label">RECENT NOTEBOOKS</div>{books.slice(0,4).map(b=><Link key={b.id} href={`/notebook/${b.id}`} className="navitem"><BookOpen size={15}/><span>{b.title}</span></Link>)}<div className="side-bottom">{link('/settings',<Settings size={16}/>,'Settings')}<div className="profile"><div className="avatar">S</div><div className="profile-info"><b>Research space</b><div style={{color:'var(--muted)',marginTop:3}}>Personal workspace</div></div></div></div></aside><main className="main"><header className="topbar"><div className="breadcrumb"><Sparkles size={14} color="#536b56"/><span>Knowledge workspace</span><span>·</span><span style={{color:'var(--ink)'}}>{path.startsWith('/notebook')?'Notebook':path==='/settings'?'Settings':'Overview'}</span></div><div className="top-actions"><span>PRIVATE WORKSPACE</span><div className="avatar" style={{width:29,height:29}}>S</div></div></header>{children}</main></div>;
}
