import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Try local cache
  try {
    const cacheFile = path.join(process.cwd(), '.synora_cache', 'sources', `${id}.json`);
    if (fs.existsSync(cacheFile)) {
      const data = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      return NextResponse.json(data);
    }
  } catch {}

  // 2. Try Supabase
  try {
    const db = await supabaseServer();
    if (db) {
      const { data: source } = await db.from('sources').select('*').eq('id', id).single();
      if (source) {
        const { data: chunks } = await db
          .from('document_chunks')
          .select('*')
          .eq('source_id', id)
          .order('chunk_index', { ascending: true });
        return NextResponse.json({
          ...source,
          chunks: chunks || [],
          text: (chunks || []).map((c: any) => c.content).join('\n\n'),
        });
      }
    }
  } catch {}

  return NextResponse.json({ id, title: 'Document', status: 'ready', text: '', chunks: [] });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const cacheFile = path.join(process.cwd(), '.synora_cache', 'sources', `${id}.json`);
    if (fs.existsSync(cacheFile)) {
      fs.unlinkSync(cacheFile);
    }
  } catch {}

  try {
    const db = await supabaseServer();
    if (db) {
      await db.from('sources').delete().eq('id', id);
    }
  } catch {}

  return new NextResponse(null, { status: 204 });
}
