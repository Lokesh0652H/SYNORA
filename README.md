# SYNORA

Synora is a source based AI research workspace. Organize reading in private notebooks, index PDF/DOCX/text sources, ask Gemini questions with chunk citations, and generate saved study materials.

## What is implemented

- Warm, responsive landing page, notebook dashboard, search, create flow, source cards, and empty/loading/error states.
- Supabase email/password registration, sign in, session cookies, and sign out.
- Supabase notebook, source, chunk, message, notes, and study material tables with row level ownership policies.
- Private Supabase Storage uploads for PDF, DOCX, TXT, and Markdown documents (20 MB limit).
- Server side text extraction, overlap chunking, Gemini embeddings, and pgvector cosine retrieval.
- Gemini source grounded chat with reference markers and source locations, persisted conversation messages, and prompt injection guidance.
- Gemini study guide, flashcards, quiz, FAQ, mind map, timeline, and compare generation saved to the database.
- Spoken study overview via the browser's built in speech synthesis, with transcript saving to notebook notes.

Website and YouTube ingestion, DOCX slide decks, server generated audio, streaming, background ingestion workers, export, public sharing, profile management, OAuth, and production rate limiting are not implemented in this release. The dashboard's initial sample notebooks are local examples; create a notebook after configuring Supabase for persisted accounts.

## Stack and architecture

- Next.js App Router, React, TypeScript, Tailwind CSS, Lucide, and Framer Motion dependency.
- Next.js route handlers validate requests and keep the Gemini key on the server.
- Supabase Auth, Postgres, private Storage, and pgvector are configured by `supabase/migrations/0001_synora.sql`.
- `src/lib/documents.ts` extracts and chunks documents. Source chunk embeddings use `gemini-embedding-001`; retrieval is scoped to the authenticated notebook by `match_document_chunks` and RLS.

## Requirements

- Node.js 20.9 or later and npm.
- A Supabase project with email auth enabled.
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Local setup

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Set these values in `.env.local`:

| Variable | Where to get it |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Project Settings → API → publishable/anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Project Settings → API; reserved for trusted server jobs (not currently needed by app routes) |
| `GEMINI_API_KEY` | Google AI Studio API key page |
| `GEMINI_CHAT_MODEL` | Optional; defaults to `gemini-2.5-flash` |
| `GEMINI_EMBEDDING_MODEL` | Optional; defaults to `gemini-embedding-001` |
| `NEXT_PUBLIC_APP_URL` | Public app URL, or `http://localhost:3000` for local development |

## Supabase setup

1. Create a Supabase project and enable email/password under Authentication → Providers.
2. In SQL Editor, run `supabase/migrations/0001_synora.sql`.
3. Configure the Site URL and allowed redirect URL (`http://localhost:3000/auth/callback` for local use).
4. Configure email confirmation and SMTP for real user accounts.
5. Confirm the private `sources` Storage bucket and its owner policy were created by the migration.

The schema enables RLS for user-owned rows. Keep the service role key out of browser code. In this version, the interactive app requires Supabase to create persistent notebooks, sources, messages, and study materials; sample dashboard cards are illustrative local state.

## Commands

```bash
npm run dev       # local development
npm run typecheck # TypeScript validation
npm run lint      # ESLint
npm run build     # production build
npm start         # serve a production build
```

## Deployment

Deploy to Vercel by importing this GitHub repository, setting the environment variables above, and running the Supabase migration on the target project. Set `NEXT_PUBLIC_APP_URL` and the Supabase Auth site/redirect URLs to the deployed origin. Build with `npm run build`.

## Security and limits

All Gemini calls run in server routes. File extension and size are checked, notebook ownership is resolved through the authenticated Supabase session, uploads go to a private bucket, and text queries use notebook-scoped RLS. The first release runs extraction/embedding inline in the upload request; it is suitable for small documents but lacks durable background jobs, rate limiting, malware scanning, and robust partial-job retry. The current PDF location labels are approximate excerpt-to-page mapping and should not be treated as exact PDF page citations. Configure quotas and review data retention before production use.
