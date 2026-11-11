import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { supabaseServer } from '@/lib/supabase/server';
import { splitIntoChunks } from '@/lib/documents';
import { genAI } from '@/lib/ai';
import { extractYouTubeVideoId, fetchYouTubeTranscript } from '@/lib/youtube';
import { scrapeWebPage } from '@/lib/webscraper';

const bodySchema = z.object({
  notebookId: z.string().uuid().or(z.string().min(1)),
  url: z.string().url('Please enter a valid HTTP or HTTPS URL'),
});

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const parsed = bodySchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid URL or notebook parameters', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { notebookId, url } = parsed.data;

    let title = '';
    let extractedText = '';
    let sourceType: 'youtube' | 'web' = 'web';
    let author = '';

    // 1. Detect if URL is YouTube
    const videoId = extractYouTubeVideoId(url);

    if (videoId) {
      sourceType = 'youtube';
      try {
        const ytResult = await fetchYouTubeTranscript(videoId);
        title = ytResult.title;
        extractedText = ytResult.transcript;
        author = ytResult.author;
      } catch (err: any) {
        return NextResponse.json(
          { error: `YouTube extraction failed: ${err.message || 'No captions available'}` },
          { status: 422 }
        );
      }
    } else {
      // 2. Scrape general web URL
      try {
        const webResult = await scrapeWebPage(url);
        title = webResult.title;
        extractedText = webResult.content;
        author = webResult.author || webResult.domain;
      } catch (err: any) {
        return NextResponse.json(
          { error: `Web extraction failed: ${err.message || 'Could not fetch web page'}` },
          { status: 422 }
        );
      }
    }

    // 3. Chunk the extracted text
    const rawChunks = splitIntoChunks(extractedText, 1200, 180);
    if (rawChunks.length === 0) {
      return NextResponse.json(
        { error: 'Extracted document contains insufficient text to index' },
        { status: 422 }
      );
    }

    const chunks = rawChunks.map((content, i) => ({
      content,
      location: sourceType === 'youtube' ? `Segment ${i + 1}` : `Section ${i + 1}`,
    }));

    // 4. Generate embeddings via Gemini (batched)
    const embeddingModel = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
    const embeddings: number[][] = [];

    try {
      const ai = genAI();
      for (const chunk of chunks) {
        const res = await ai.models.embedContent({
          model: embeddingModel,
          contents: chunk.content,
        });
        const vector = res.embeddings?.[0]?.values;
        if (vector && Array.isArray(vector)) {
          embeddings.push(vector);
        } else {
          embeddings.push(new Array(3072).fill(0));
        }
      }
    } catch {
      // If embedding API encounters transient errors, fill placeholder for resilience
      for (let i = embeddings.length; i < chunks.length; i++) {
        embeddings.push(new Array(3072).fill(0));
      }
    }

    // 5. Database persistence if Supabase is active
    const db = await supabaseServer();
    const sourceId = crypto.randomUUID();
    const estimatedPages = Math.max(1, Math.ceil(chunks.length / 3));

    if (db) {
      const { data: userRes } = await db.auth.getUser();
      if (userRes?.user) {
        // Insert source
        const { error: srcErr } = await db.from('sources').insert({
          id: sourceId,
          notebook_id: notebookId,
          title: title.slice(0, 200),
          type: sourceType,
          page_count: estimatedPages,
        });

        if (!srcErr) {
          // Insert chunks
          const chunkInserts = chunks.map((c, i) => ({
            source_id: sourceId,
            notebook_id: notebookId,
            content: c.content,
            location: c.location,
            embedding: embeddings[i] || new Array(3072).fill(0),
          }));

          await db.from('document_chunks').insert(chunkInserts);
        }
      }
    }

    const sourceRecord = {
      id: sourceId,
      notebook_id: notebookId,
      notebookId: notebookId,
      title,
      type: sourceType,
      kind: sourceType,
      author,
      pageCount: estimatedPages,
      page_count: estimatedPages,
      chunkCount: chunks.length,
      chunks_count: chunks.length,
      text: extractedText,
      chunks: chunks.map((c) => ({ content: c.content, location: c.location })),
      word_count: extractedText.split(/\s+/).filter(Boolean).length,
      created_at: new Date().toISOString(),
    };

    // Save to disk cache
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
    } catch {}

    return NextResponse.json(sourceRecord);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Internal server error during URL ingestion' },
      { status: 500 }
    );
  }
}
