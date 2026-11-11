# Contributing to SYNORA

Thank you for your interest in contributing to **SYNORA** — an AI-powered research, knowledge management, and learning intelligence platform. We welcome contributions from researchers, software engineers, and designers committed to building rigorous, verifiable knowledge tools.

---

## 1. Code of Conduct

We are committed to providing a welcoming, collegiate, and professional environment. All contributors are expected to:
- Communicate with respect, clarity, and intellectual rigor.
- Prioritize truthful technical claims over hyperbole.
- Respect data sovereignty and security boundaries.
- Adhere to the established engineering guidelines.

---

## 2. Development Workflow

### 2.1 Branching Strategy

All development branches should be cut from `main`:
- `feature/<feature-name>` for new capabilities.
- `fix/<bug-description>` for bug resolutions.
- `docs/<doc-update>` for documentation and architectural updates.
- `perf/<optimization>` for performance improvements.

### 2.2 Local Setup

1. Fork the repository on GitHub.
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/SYNORA.git
   cd SYNORA
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```
5. Configure your Gemini API key and Supabase project credentials in `.env.local`.
6. Start the development server:
   ```bash
   npm run dev
   ```

---

## 3. Engineering & Style Standards

### 3.1 TypeScript & Type Safety
- The project enforces strict TypeScript checking (`tsconfig.json`).
- Always run `npm run typecheck` before committing.
- Do not use `any` unless strictly interfacing with dynamic legacy payloads. Define explicit Zod schemas or TypeScript types for all API inputs and outputs.

### 3.2 Styling & Aesthetics
- All UI components use Tailwind CSS following the **Swiss editorial / warm ivory** design system (`#F5F3ED`, `#EFEBE2`, `#FBFAF6`, `#20201D`, `#DEDAD0`).
- Do not introduce random neon colors, cyber-gradients, or heavy drop shadows.
- Isolate landing-page styling from workspace layout rules to prevent unintentional regressions.

### 3.3 Workspace Integrity
- **Do not modify or remove the workspace layout, sidebar, or animated 2D aquatic motion (`AsciiSharkMotion.tsx`) without explicit prior discussion.**
- Ensure that the zero-scroll layout constraint (`h-[calc(100vh-64px)] max-h-[calc(100vh-64px)] overflow-hidden`) on notebook workspaces is preserved.

---

## 4. Testing Requirements

We use **Vitest** for unit and integration testing:
```bash
npm run test
```
- Write unit tests for all text normalization, parsing, chunking, and mathematical transformations in `src/lib/`.
- Ensure all existing tests pass before submitting a pull request.

---

## 5. Submitting a Pull Request (PR)

1. Ensure your code passes all quality checks:
   ```bash
   npm run typecheck
   npm run test
   npm run build
   ```
2. Write concise, atomic commit messages following conventional commits:
   - `feat: implement interactive concept graph filter`
   - `fix: correct token overlap boundary in pdf parser`
   - `docs: update API schema for studio endpoints`
3. Push your branch to your GitHub fork and open a Pull Request against `main`.
4. Provide a clear PR description detailing:
   - What problem was solved or what capability was added.
   - Verification steps taken.
   - Any architectural considerations.

---

## 6. Reporting Issues & Proposing Features

- **Bug Reports**: Open an issue detailing the exact steps to reproduce, expected vs. actual behavior, browser environment, and relevant console logs.
- **Feature Requests**: Propose substantive enhancements aligned with SYNORA's core philosophy: *"Knowledge is not the destination. Understanding is."*
