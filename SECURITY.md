# Security Policy

SYNORA treats the privacy and confidentiality of user research, ingested documents, and analytical queries as critical operational priorities. This document describes the security model of SYNORA, supported versions, vulnerability reporting procedures, and our technical perimeter boundaries.

---

## Supported Versions

Security updates and patches are actively maintained for the following versions:

| Version | Supported | Status |
| :--- | :---: | :--- |
| `0.1.x` | :white_check_mark: | Current active release branch (`main`) |
| `< 0.1.0` | :x: | Unsupported prototype builds |

---

## Reporting a Vulnerability

If you discover a security vulnerability or suspect an unintended exposure within SYNORA, please do **not** open a public issue on GitHub. Instead, report it responsibly via our coordinated disclosure channel:

- **Security Contact**: Open a confidential security advisory through [GitHub Security Advisories](https://github.com/Lokesh0652H/SYNORA/security/advisories) or email `security@synora.internal`.
- **Response Commitment**:
  - **Initial Acknowledgment**: Within 48 hours of receipt.
  - **Severity Triage & Verification**: Within 5 business days.
  - **Remediation & Patch Release**: Critical issues are patched and deployed within 7 business days following verification.

When filing a report, please include:
1. Description of the vulnerability and attack vector.
2. Steps to reproduce the issue (including sample payload, cURL commands, or reproduction scripts).
3. The affected component (`/api/chat`, `/api/sources/upload`, `/api/studio`, database RLS policies, etc.).
4. Potential impact on confidentiality, integrity, or availability.

---

## Architectural Security Model

SYNORA is engineered around a defense-in-depth architecture designed for zero-leakage multi-tenant research environments:

### 1. Multi-Tenant Database Isolation (PostgreSQL Row-Level Security)
All database interactions run against PostgreSQL managed by Supabase. Every table within the schema enforces strict PostgreSQL **Row-Level Security (RLS)**:
- `public.notebooks`: Users can only `SELECT`, `INSERT`, `UPDATE`, `DELETE` rows where `auth.uid() = user_id`.
- `public.sources`: Scoped via foreign key relationship to notebooks owned by the authenticated caller.
- `public.document_chunks`: Scoped to the notebook owner.
- `public.messages`: Scoped to user conversations within authenticated notebooks.
- `public.notes` & `public.study_materials`: Enforce strict tenant ownership.

### 2. Isolated Vector Retrieval
Vector similarity searches execute via the PostgreSQL function:
```sql
public.match_document_chunks(
    query_embedding vector(3072),
    match_notebook uuid,
    match_count int
)
```
This routine enforces an explicit `WHERE notebook_id = match_notebook` predicate joined with notebook ownership validation before conducting HNSW cosine distance calculations (`<=>`). Cross-tenant chunk leakage across notebooks is blocked at the database engine level.

### 3. Server-Only Secret Boundary
All third-party AI keys (`GEMINI_API_KEY`) and elevated Supabase credentials remain exclusively within the Node.js server environment:
- No private API keys are prefixed with `NEXT_PUBLIC_`.
- The frontend client communicates exclusively with authenticated Next.js App Router endpoints (`/api/chat`, `/api/sources/upload`, `/api/studio`, `/api/notebooks`, `/api/notes`).
- Browser requests carry secure HTTP session cookies verified via `@supabase/ssr`.

### 4. File Ingestion & Parsing Isolation
File uploads (`application/pdf`, `.docx`, `.txt`, `.md`) are processed server-side:
- Payloads are validated against size constraints and supported MIME types before passing to parsers (`pdf-parse`, `mammoth`).
- Ingestion occurs in isolated memory buffers; unsanitized user files are never executed directly on the host filesystem.

### 5. AI API Privacy & Non-Training Assurances
SYNORA interfaces with Google Gemini through developer and enterprise API endpoints. Under standard API terms of service, customer prompts and embeddings sent through paid API endpoints are not utilized to train foundation models.

---

## Security Best Practices for Self-Hosting

When deploying SYNORA in production environments:
1. **Rotate Keys Regularly**: Periodically cycle your `GEMINI_API_KEY` and Supabase service keys.
2. **Enforce HTTPS**: Always run behind an SSL/TLS reverse proxy (e.g., Vercel, Cloudflare, or Nginx) with HSTS enabled.
3. **Configure CORS**: Ensure `NEXT_PUBLIC_APP_URL` strictly reflects your production domain to prevent unauthorized cross-origin requests.
4. **Environment Isolation**: Never commit `.env.local` or any file containing plaintext credentials to version control. Always verify `.gitignore` contains `.env*` entries.
