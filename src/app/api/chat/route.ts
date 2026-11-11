import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { z } from 'zod';
import { genAI, chatModel } from '@/lib/ai';
import { supabaseServer } from '@/lib/supabase/server';
import { splitIntoChunks } from '@/lib/documents';

const schema = z.object({
  notebookId: z.string().min(1),
  message: z.string().trim().min(1).max(4000),
  sources: z
    .array(
      z.object({
        id: z.string().optional(),
        title: z.string().optional(),
        kind: z.string().optional(),
        content: z.string().optional(),
        chunks: z
          .array(
            z.object({
              content: z.string(),
              location: z.string().optional(),
            })
          )
          .optional(),
      })
    )
    .optional(),
});

interface RetrievedChunk {
  sourceId?: string;
  title: string;
  location: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Your question could not be read.', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { notebookId, message, sources: incomingSources } = parsed.data;

    // 1. Check Supabase connection and user session (best-effort)
    let db: any = null;
    let user: any = null;
    try {
      db = await supabaseServer();
      if (db) {
        const { data: userRes } = await db.auth.getUser();
        user = userRes?.user;
      }
    } catch {}

    // Auto-upsert notebook in Supabase if user is signed in and table exists
    if (db && user) {
      try {
        await db.from('notebooks').upsert(
          {
            id: notebookId,
            user_id: user.id,
            title: 'Research notebook',
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        );
      } catch {}
    }

    let gatheredChunks: RetrievedChunk[] = [];

    // 2. Try Supabase vector search if database and user are available
    if (db && user) {
      try {
        const embeddingModel = process.env.GEMINI_EMBEDDING_MODEL || 'gemini-embedding-001';
        const ai = genAI();
        const embedded = await ai.models.embedContent({
          model: embeddingModel,
          contents: message,
        });
        const queryVector = embedded.embeddings?.[0]?.values;

        if (queryVector && queryVector.length) {
          const { data: matches } = await db.rpc('match_document_chunks', {
            query_embedding: queryVector,
            match_notebook: notebookId,
            match_count: 8,
          });

          if (matches && matches.length > 0) {
            const ids = [...new Set(matches.map((c: any) => c.source_id))];
            const { data: dbSources } = await db.from('sources').select('id,title').in('id', ids);
            const sourceNames = new Map<string, string>(
              (dbSources || []).map((s: any) => [String(s.id), String(s.title || '')])
            );

            for (const m of matches) {
              if (m.content) {
                gatheredChunks.push({
                  sourceId: m.source_id,
                  title: sourceNames.get(String(m.source_id)) || 'Source Document',
                  location: m.location || 'Section',
                  content: m.content,
                });
              }
            }
          }
        }
      } catch (vecErr) {
        // Fallback to local and body chunks if RPC/table is unmigrated
        console.warn('Vector search bypassed for local/hybrid retrieval:', vecErr);
      }
    }

    // 3. Fallback: Gather chunks from incoming sources & server disk cache
    if (gatheredChunks.length === 0) {
      const candidateSources: Array<{
        id?: string;
        title?: string;
        content?: string;
        chunks?: Array<{ content: string; location?: string }>;
      }> = [];

      // Add sources from client request body
      if (Array.isArray(incomingSources)) {
        for (const s of incomingSources) {
          if (s) candidateSources.push(s);
        }
      }

      // Check server disk cache
      try {
        const cacheDir = path.join(process.cwd(), '.synora_cache', 'sources');
        if (fs.existsSync(cacheDir)) {
          const files = fs.readdirSync(cacheDir);
          for (const f of files) {
            if (f.endsWith('.json')) {
              try {
                const cached = JSON.parse(fs.readFileSync(path.join(cacheDir, f), 'utf8'));
                if (cached.notebook_id === notebookId || cached.notebookId === notebookId) {
                  if (!candidateSources.some((s) => s.id === cached.id)) {
                    candidateSources.push(cached);
                  }
                }
              } catch {}
            }
          }
        }
      } catch {}

      // Convert candidates into chunks
      for (const src of candidateSources) {
        const srcTitle = src.title || 'Document';
        if (Array.isArray(src.chunks) && src.chunks.length > 0) {
          for (const ch of src.chunks) {
            if (ch.content) {
              gatheredChunks.push({
                sourceId: src.id,
                title: srcTitle,
                location: ch.location || 'Excerpt',
                content: ch.content,
              });
            }
          }
        } else if (src.content && src.content.trim()) {
          const pieces = splitIntoChunks(src.content, 1200, 150);
          pieces.forEach((piece, idx) => {
            gatheredChunks.push({
              sourceId: src.id,
              title: srcTitle,
              location: `Section ${idx + 1}`,
              content: piece,
            });
          });
        }
      }

      // Rank chunks by relevance to query terms if we have many
      const queryTerms = message
        .toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter((w) => w.length > 2);

      if (gatheredChunks.length > 8 && queryTerms.length > 0) {
        gatheredChunks.sort((a, b) => {
          const aText = (a.title + ' ' + a.content).toLowerCase();
          const bText = (b.title + ' ' + b.content).toLowerCase();
          const scoreA = queryTerms.reduce((acc, t) => acc + (aText.includes(t) ? 2 : 0), 0);
          const scoreB = queryTerms.reduce((acc, t) => acc + (bText.includes(t) ? 2 : 0), 0);
          return scoreB - scoreA;
        });
        gatheredChunks = gatheredChunks.slice(0, 10);
      } else if (gatheredChunks.length > 10) {
        gatheredChunks = gatheredChunks.slice(0, 10);
      }
    }

    // 4. Generate grounded response with Gemini
    let answer = '';
    let citations: Array<{ marker: string; title: string; location: string; sourceId?: string }> = [];

    const ai = genAI();
    const model = chatModel();

    if (gatheredChunks.length > 0) {
      const context = gatheredChunks
        .map((c, i) => `[${i + 1}] ${c.title} (${c.location}): ${c.content}`)
        .join('\n\n');

      citations = gatheredChunks.map((c, i) => ({
        marker: `[${i + 1}]`,
        title: c.title,
        location: c.location,
        sourceId: c.sourceId,
      }));

      const systemPrompt = `You are SYNORA, an advanced AI research and learning intelligence platform.
Answer the user's question clearly, thoroughly, and objectively using the provided source excerpts.

Rules:
1. Ground your answer in the provided source excerpts.
2. Cite supported facts, questions, and insights using [n] citation markers corresponding to the numbered excerpts (e.g. [1], [2]).
3. If the user asks for PYQs (Previous Year Questions), exam questions, or practice problems, extract and organize all of them neatly with markdown headings, question numbers, topics, and citation markers.
4. If the sources do not contain all the details requested, state what is covered and supplement with helpful context while distinguishing verified source facts from general knowledge.`;

      const response = await ai.models.generateContent({
        model,
        contents: `${systemPrompt}\n\nSOURCES:\n${context}\n\nUSER QUESTION:\n${message}`,
      });

      answer = response.text || 'I could not generate an answer from the selected sources.';
    } else {
      // Helpful fallback when no sources are indexed yet
      const response = await ai.models.generateContent({
        model,
        contents: `You are SYNORA, an intelligent AI research environment.
The user asked: "${message}".
Currently, no document sources are indexed or selected in this workspace.
1. Answer the user's question with your best scholarly, structured knowledge.
2. At the end, gently remind them that they can upload their documents (PDF, DOCX, PPTX) or add Web/YouTube URLs via the Sources panel on the right to receive grounded page-by-page citations.`,
      });

      answer =
        response.text ||
        'Please upload or select sources from the sidebar to ask questions grounded in your documents.';
    }

    // 5. Best-effort message logging to Supabase (if available)
    if (db && user) {
      try {
        await db.from('messages').insert({
          user_id: user.id,
          notebook_id: notebookId,
          role: 'user',
          content: message,
        });
        await db.from('messages').insert({
          user_id: user.id,
          notebook_id: notebookId,
          role: 'assistant',
          content: answer,
          citations: citations,
        });
      } catch {}
    }

    return NextResponse.json({ answer, citations });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    return NextResponse.json(
      { error: err.message || 'The research answer could not be generated.' },
      { status: 500 }
    );
  }
}
