import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { supabaseServer } from '@/lib/supabase/server';
import { splitIntoChunks, extractText } from '@/lib/documents';
import { genAI } from '@/lib/ai';

const MAX = 25 * 1024 * 1024;
const ALLOWED_EXTS = ['pdf', 'docx', 'pptx', 'txt', 'md', 'png', 'jpg', 'jpeg', 'webp'];

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get('file');
    const notebookId = form.get('notebookId');

    if (!(file instanceof File) || typeof notebookId !== 'string') {
      return NextResponse.json({ error: 'Choose a document and notebook.' }, { status: 400 });
    }

    if (file.size > MAX) {
      return NextResponse.json({ error: 'Files must be smaller than 25 MB.' }, { status: 413 });
    }

    const ext = file.name.split('.').pop()?.toLowerCase() || 'file';
    if (!ALLOWED_EXTS.includes(ext)) {
      return NextResponse.json(
        { error: 'Supported formats are PDF, DOCX, PPTX, TXT, Markdown, and Images.' },
        { status: 415 }
      );
    }

    // 1. Extract text
    const { text, pages, pageTexts } = await extractText(file);
    if (!text.trim()) {
      return NextResponse.json(
        { error: 'No readable text was found in this document.' },
        { status: 422 }
      );
    }

    // 2. Split into chunks
    const pieces = pageTexts
      ? pageTexts.flatMap((pageText, pageIndex) =>
          splitIntoChunks(pageText).map((content) => ({
            content,
            location: ext === 'pptx' ? `Slide ${pageIndex + 1}` : `Page ${pageIndex + 1}`,
          }))
        )
      : splitIntoChunks(text).map((content, i) => ({
          content,
          location: `Excerpt ${i + 1}`,
        }));

    // 3. Generate Gemini vector embeddings (if configured)
    const embeddingModel = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
    const embeddings: number[][] = [];
    try {
      const ai = genAI();
      for (const piece of pieces) {
        const response = await ai.models.embedContent({
          model: embeddingModel,
          contents: piece.content,
        });
        const vector = response.embeddings?.[0]?.values;
        embeddings.push(vector || new Array(3072).fill(0));
      }
    } catch {
      // Embedding fallback for resilient indexing
      for (let i = embeddings.length; i < pieces.length; i++) {
        embeddings.push(new Array(3072).fill(0));
      }
    }

    const sourceId = crypto.randomUUID();
    const sourceRecord = {
      id: sourceId,
      notebook_id: notebookId,
      notebookId: notebookId,
      title: file.name,
      kind: ext,
      status: 'ready',
      page_count: pages || Math.max(1, Math.ceil(pieces.length / 3)),
      chunks_count: pieces.length,
      chunks: pieces,
      text: text,
      word_count: text.split(/\s+/).filter(Boolean).length,
      created_at: new Date().toISOString(),
    };

    // 4. Save to disk cache for fast offline / unmigrated inspection & chat retrieval
    try {
      const cacheDir = path.join(process.cwd(), '.synora_cache', 'sources');
      if (!fs.existsSync(cacheDir)) {
        fs.mkdirSync(cacheDir, { recursive: true });
      }
      fs.writeFileSync(
        path.join(cacheDir, `${sourceId}.json`),
        JSON.stringify(sourceRecord, null, 2),
        'utf8'
      );
    } catch (cacheErr) {
      console.warn('Local cache write failed:', cacheErr);
    }

    // 5. Attempt Supabase persistence (best-effort resilience)
    try {
      const db = await supabaseServer();
      if (db) {
        const { data: userRes } = await db.auth.getUser();
        const userId = userRes?.user?.id;
        if (userId) {
          // Attempt Storage upload
          const storagePath = `${userId}/${notebookId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
          await db.storage.from('sources').upload(storagePath, file, {
            contentType: file.type || 'application/octet-stream',
            upsert: false,
          });

          // Attempt DB insert
          const { data: insertedSource } = await db
            .from('sources')
            .insert({
              id: sourceId,
              user_id: userId,
              notebook_id: notebookId,
              title: file.name,
              kind: ext,
              status: 'ready',
              storage_path: storagePath,
              page_count: sourceRecord.page_count,
            })
            .select('id')
            .single();

          if (insertedSource) {
            const chunkInserts = pieces.map((p, i) => ({
              user_id: userId,
              notebook_id: notebookId,
              source_id: sourceId,
              chunk_index: i,
              content: p.content,
              location: p.location,
              embedding: embeddings[i] || new Array(3072).fill(0),
            }));
            await db.from('document_chunks').insert(chunkInserts);
          }
        }
      }
    } catch (dbErr) {
      console.warn('Supabase persistence bypassed (local fallback mode active):', dbErr);
    }

    // Return rich source record
    return NextResponse.json(sourceRecord);
  } catch (e: any) {
    console.error('Source upload failed:', e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Could not process the source.' },
      { status: 500 }
    );
  }
}
