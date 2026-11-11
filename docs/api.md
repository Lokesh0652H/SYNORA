# SYNORA API Reference

This document provides technical documentation for the HTTP REST endpoints implemented in SYNORA. All endpoints are hosted within the Next.js App Router under the `/api/` prefix.

---

## Global Standards

- **Base URL**: `http://localhost:3000` (development) or configured production origin.
- **Content Type**: `application/json` for standard requests; `multipart/form-data` for file uploads.
- **Authentication**: Endpoints enforce user authentication via Supabase session cookies handled by `@supabase/ssr`. Unauthenticated requests return `401 Unauthorized`.
- **Validation**: Request payloads are strictly validated using [Zod](https://zod.dev). Malformed requests return `400 Bad Request` with structured error details.

---

## 1. Chat & Research Grounding

### `POST /api/chat`
Submits a research query against the indexed sources of a specific notebook. Performs vector similarity retrieval via `pgvector` and streams back a synthesized answer with citation attributions.

#### Request Body
```json
{
  "notebookId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "message": "What were the primary methodologies used in the 2024 trial?"
}
```

#### Validation Schema (Zod)
- `notebookId`: `z.string().uuid()` (Required)
- `message`: `z.string().trim().min(1).max(4000)` (Required)

#### Success Response (`200 OK`)
```json
{
  "reply": "According to the trial protocol [^1], the research team utilized a randomized double-blind procedure...",
  "citations": [
    {
      "id": "e4b10492-7ef8-4bfb-88a2-211a7751cbb4",
      "sourceId": "8f37b98d-a417-4d1e-84d7-013fa092cb2e",
      "sourceTitle": "Clinical_Trial_Protocol_2024.pdf",
      "pageNumber": 14,
      "snippet": "Participants were randomized in a 1:1 ratio using computer-generated permuted blocks...",
      "similarity": 0.884
    }
  ]
}
```

#### Error Responses
- `400 Bad Request`: Invalid UUID format or message length outside bounds.
- `401 Unauthorized`: No active user session.
- `500 Internal Server Error`: Vector search failure or model generation timeout.

---

## 2. Document & Source Ingestion

### `POST /api/sources/upload`
Uploads and indexes an unstructured document into a target research notebook. Extracts text, chunks the content using a sliding window, vectorizes chunks using Google Gemini embeddings, and records records in PostgreSQL.

#### Request Headers
- `Content-Type`: `multipart/form-data`

#### Form Data Fields
- `notebookId`: Target notebook UUID (string)
- `file`: Document binary payload (`.pdf`, `.docx`, `.txt`, `.md`). Maximum size: **20 MB**.

#### Success Response (`200 OK`)
```json
{
  "id": "8f37b98d-a417-4d1e-84d7-013fa092cb2e",
  "title": "Quantum_Algorithms_Review.pdf",
  "type": "pdf",
  "pageCount": 38,
  "chunkCount": 114
}
```

#### Error Responses
- `400 Bad Request`: Missing file, unsupported MIME type, or file exceeding 20 MB.
- `401 Unauthorized`: Session missing or expired.
- `404 Not Found`: Target notebook does not exist or does not belong to the user.

---

## 3. Research Studio Synthesis

### `POST /api/studio`
Generates structured research artifacts (briefings, active recall flashcards, diagnostic quizzes, FAQs, mind maps, timelines, and contradiction analyses) grounded in notebook sources.

#### Request Body
```json
{
  "notebookId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "kind": "flashcards"
}
```

#### Supported `kind` Values
- `guide`: Comprehensive executive study guide and synthesis.
- `flashcards`: Array of question-and-answer pairs with topical tags.
- `quiz`: Multiple-choice assessment questions with correct answers and explanations.
- `faq`: Core frequently asked questions with source-grounded answers.
- `mindmap`: Conceptual topic hierarchy for visual rendering.
- `timeline`: Chronological sequencing of historical or experimental milestones.
- `compare`: Comparative matrix contrasting competing viewpoints or methodologies.
- `contradiction`: Discrepancy detector identifying conflicting claims across sources.
- `perspectives`: Multi-angle analytical critique.
- `action_report`: Operational findings report with prioritized action items.
- `action_roadmap`: Phased implementation roadmap with milestones.

#### Success Response (`200 OK`)
```json
{
  "kind": "flashcards",
  "data": [
    {
      "front": "What defines the quantum decoherence timescale?",
      "back": "The characteristic duration over which quantum superpositions degrade into classical states through environmental interaction.",
      "tag": "Quantum Mechanics"
    }
  ]
}
```

---

## 4. Notebooks Management

### `GET /api/notebooks`
Lists all research notebooks created by the authenticated user, ordered by most recently updated.

#### Success Response (`200 OK`)
```json
[
  {
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "title": "Autonomous Robotics Research",
    "description": "Exploration of reinforcement learning in locomotion",
    "created_at": "2026-03-10T12:00:00Z",
    "updated_at": "2026-03-14T15:30:00Z",
    "source_count": 5
  }
]
```

### `POST /api/notebooks`
Creates a new isolated research notebook.

#### Request Body
```json
{
  "title": "Neuromorphic Computing Systems",
  "description": "Hardware and algorithmic architectures"
}
```

#### Success Response (`201 Created`)
```json
{
  "id": "eb8ba476-89d1-429c-9ffa-d55abf7f4136",
  "title": "Neuromorphic Computing Systems",
  "description": "Hardware and algorithmic architectures",
  "created_at": "2026-03-14T16:00:00Z"
}
```

### `GET /api/notebooks/[id]`
Retrieves full details of a specific notebook, including linked sources, recent messages, notes, and generated study materials.

### `DELETE /api/notebooks/[id]`
Permanently deletes a notebook and all associated sources, chunks, notes, and study materials via PostgreSQL `ON DELETE CASCADE`.

---

## 5. Research Notes

### `GET /api/notes?notebookId=<uuid>`
Retrieves all user-created or AI-extracted notes associated with a given notebook.

### `POST /api/notes`
Saves a new research note or insight to the notebook.

#### Request Body
```json
{
  "notebookId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "Key Takeaway from Chapter 3",
  "content": "Attention mechanisms exhibit quadratic complexity with sequence length without sparse approximations."
}
```

#### Success Response (`201 Created`)
```json
{
  "id": "7b0b14c3-16a7-47b2-9df7-bb1b6727282b",
  "notebook_id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
  "title": "Key Takeaway from Chapter 3",
  "content": "Attention mechanisms exhibit quadratic complexity with sequence length without sparse approximations.",
  "created_at": "2026-03-14T16:20:00Z"
}
```

---

## 6. Authentication Callback

### `GET /auth/callback?code=<code>`
Handles OAuth and email magic link verification callbacks from Supabase Auth. Exchanges the authorization code for a session cookie and redirects the user to `/dashboard`.
