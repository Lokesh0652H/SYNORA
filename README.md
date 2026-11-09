# SYNORA

Synora is a sovereign, deterministic AI research workspace and document synthesis studio. Organize reading in private notebooks, index PDF, DOCX, and text sources, ask Gemini questions with cryptographically grounded chunk citations, and generate persistent study artifacts.

## Design Architecture & Inspirations

The Synora interface is built on a high-craft editorial design system uniting four key design paradigms:

1. **Editorial Template & Layout**: Inspired by Alim Joldaspayev's QED system.
   - Clean `#F9F9F7` paper canvas with fine dashed grid dividers.
   - Hand-crafted stippled pen-and-ink illustrations (surveyor tripod, triangulation milestone, summit cairn, cliffside cottage, and edge-to-edge panoramic mountain footer).
   - Monospace capability terminal displaying live deterministic replay and audit verification.
   - Editorial typography with high-contrast serif and sans pairings.

2. **Dashboard & Motion**: Inspired by Stacked's ASCII Shark Animation demo.
   - Cinematic multi-creature ASCII motion backdrop (`AsciiSharkMotion`) featuring 3 distinct marine creatures (Tiger shark, Hammerhead, and agile Pilot fish) with multi-segment spine kinematics and traveling sinusoidal tail waves.
   - Minimalist "what’s on your mind?" editorial prompt hero.
   - Glassmorphic floating prompt bar (`backdrop-filter: blur(16px)`) with direct PDF/document attachment (`+`), voice dictation, shortcut hints (`↵ send`, `⇧↵ newline`), and instant execution.
   - Floating "History ⌵" pill menu for quick workspace switching.

3. **Fluid Shader Cards**: Inspired by Ashish Gogula's "Shader Flood from Planes".
   - 24px squircle cards (`ShaderCard`) with clean subtle borders and top icon badges.
   - Interactive organic fluid shader / smoke liquid flood that expands radially from the exact cursor coordinate on hover.
   - Multi-spectrum fluid palettes (Deep Ocean Blue, Royal Purple Smoke, Emerald Wave, Solar Amber, Crimson Liquid, Slate).
   - Dynamic text inversion to crisp high-contrast white with silky smooth transitions.

4. **Thinking Period & Loading State**: Inspired by Sucodeee's Bluma Design.
   - Floating pill capsule (`ThinkingPill`) with diffused drop shadow and inner border.
   - 4x4 micro dot-matrix radar scanning animation cycling smoothly across diagonal wavefronts.
   - Multi-stage state machine transitions ("Reading docs...", "Extracting pages & text...", "Analysing sources...", "Synthesizing answer...").
   - Morphing green completion capsule with checkmark ("✓ Done").

---

## Features & Capabilities

- **Source-Grounded Chat**: Ingest PDFs, Word documents, Markdown, and text files. Queries retrieve top vector matches and return cited quotes with clickable page markers.
- **Deterministic Replay & Telemetry**: Track model seed, prompt hashes, and citation bounds for reproducible outputs.
- **Studio Synthesis Suite**: Instant generation of Study Guides, Flashcards, Self-Assessment Quizzes, FAQs, Concept Maps, Timelines, and Source Comparisons.
- **Spoken Audio Briefings**: Browser-native speech synthesis reads out executive research summaries hands-free with transcript persistence.
- **Private Data Perimeter**: Full Row Level Security (RLS) via Supabase Postgres and private storage buckets; Gemini API keys are isolated exclusively to server-side route handlers.

---

## Technology Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **UI & Motion**: React 19, Tailwind CSS v4, Lucide Icons, Canvas 2D Kinematics
- **AI & Embeddings**: Google Gemini API (`@google/genai`)
- **Backend & Database**: Supabase Auth, Postgres with `pgvector`, Private Storage
- **Parsing**: `pdf-parse`, `mammoth` (DOCX)
- **Testing & Quality**: Vitest, TypeScript (strict mode), ESLint

---

## Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Run development server
npm run dev

# Typecheck and test
npm run typecheck
npm run test

# Production build
npm run build
```

---

## Environment Configuration

Configure the following variables in `.env.local`:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase publishable/anon key |
| `GEMINI_API_KEY` | Google AI Studio API key |
| `GEMINI_CHAT_MODEL` | Optional: defaults to `gemini-2.5-flash` |
| `GEMINI_EMBEDDING_MODEL` | Optional: defaults to `gemini-embedding-001` |
| `NEXT_PUBLIC_APP_URL` | Application root URL (`http://localhost:3000`) |

---

## License

ISC License. Built for researchers, engineers, and intelligence analysts.
