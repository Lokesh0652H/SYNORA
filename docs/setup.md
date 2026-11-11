# SYNORA Local Setup & Deployment Guide

This guide provides step-by-step instructions for provisioning, configuring, and launching SYNORA in local development and production environments.

---

## Prerequisites

Before beginning, ensure your local workstation meets the following minimum requirements:

- **Node.js**: `v20.x` or higher (`v22.x` recommended).
- **Package Manager**: `npm` (`v10.x`+), `pnpm`, or `yarn`.
- **Git**: Installed and configured.
- **Supabase Account**: A free or paid Supabase project with PostgreSQL and `pgvector` enabled.
- **Google AI Studio Key**: API key with access to Gemini 2.5 Flash and Gemini Embeddings.

---

## 1. Clone the Repository

```bash
git clone https://github.com/Lokesh0652H/SYNORA.git
cd SYNORA
```

---

## 2. Install Project Dependencies

SYNORA relies on Next.js 16 with Turbopack, React 19, Supabase SSR, and Google Gen AI:

```bash
npm install
```

---

## 3. Configure Supabase Database & Migrations

SYNORA requires the `vector` extension and 7 core relational tables with Row-Level Security (RLS).

1. Log in to your [Supabase Dashboard](https://database.new) and create a new project.
2. Navigate to **SQL Editor**.
3. Open `supabase/migrations/0001_synora.sql` from this repository.
4. Paste the entire SQL script into the SQL Editor and click **Run**.

This migration script will:
- Enable the `vector` extension (`CREATE EXTENSION IF NOT EXISTS vector`).
- Provision tables: `notebooks`, `sources`, `document_chunks`, `messages`, `notes`, `study_materials`, `shares`.
- Configure HNSW cosine index `document_chunks_embedding_idx`.
- Install the deterministic vector match function `match_document_chunks`.
- Enable strict Row-Level Security (RLS) policies scoped to `auth.uid()`.

---

## 4. Configure Environment Variables

Create your local environment file by copying `.env.example`:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# Supabase Configuration (Settings -> API in Supabase Dashboard)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Google AI Studio Configuration (https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Model Selection (Optional - defaults shown)
GEMINI_CHAT_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001

# Public Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!IMPORTANT]
> Never commit `.env.local` to version control. The `.gitignore` file is pre-configured to exclude all `.env*` files except `.env.example`.

---

## 5. Launch the Local Development Server

Run the development server with Next.js Turbopack:

```bash
npm run dev
```

Open your browser and navigate to:
```
http://localhost:3000
```

---

## 6. Verification and Testing

Verify code quality, TypeScript types, and test suites prior to pushing changes:

```bash
# Typecheck TypeScript codebase
npm run typecheck

# Run test suites (Vitest)
npm run test

# Validate production build compilation
npm run build
```

---

## 7. Production Deployment

SYNORA is optimized for deployment on Vercel, Railway, or containerized Docker platforms:

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com) (or your preferred host).
3. Under **Environment Variables**, supply all variables specified in `.env.example`.
4. Deploy. Next.js App Router will handle server-side rendering, static page optimization, and API route execution automatically.
