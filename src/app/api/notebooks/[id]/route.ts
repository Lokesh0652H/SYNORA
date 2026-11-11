import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = await supabaseServer();
    if (db) {
      const { data: notebook, error } = await db
        .from('notebooks')
        .select(
          'id,title,description,updated_at,sources(id,title,kind,status,created_at),messages(id,role,content,citations,created_at)'
        )
        .eq('id', id)
        .single();
      if (!error && notebook) return NextResponse.json(notebook);
    }
  } catch {}
  return NextResponse.json({ id, title: 'Research notebook', sources: [], messages: [] });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const title = typeof body.title === 'string' ? body.title.trim().slice(0, 100) : '';
  const description = typeof body.description === 'string' ? body.description.trim().slice(0, 500) : '';

  if (!title) {
    return NextResponse.json({ error: 'Enter a notebook name.' }, { status: 400 });
  }

  try {
    const db = await supabaseServer();
    if (db) {
      const { data, error } = await db
        .from('notebooks')
        .update({ title, description, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select('id,title,description')
        .single();
      if (!error && data) return NextResponse.json(data);
    }
  } catch {}

  return NextResponse.json({ id, title, description });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const db = await supabaseServer();
    if (db) {
      await db.from('notebooks').delete().eq('id', id);
    }
  } catch {}

  return new NextResponse(null, { status: 204 });
}
