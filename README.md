# Internal Document Q&A — Knowledge Base Assistant

> **AI-powered internal document search and Q&A tool.** Upload company documents (PDF, Markdown, Text), automatically chunk and embed them, then ask natural-language questions answered strictly from your uploaded knowledge base — with source citations, confidence signals, and streaming responses.

---

## Business Value

Internal teams waste significant time searching through SOPs, compliance guides, onboarding docs, and policy manuals. This tool centralizes document knowledge into a single conversational interface — employees ask a question in plain English and get an accurate, source-cited answer in seconds instead of digging through folders and SharePoint sites.

**Before:** Finding answers to internal process questions required manually searching through document repositories, opening multiple files, scanning pages, and cross-referencing information. Estimated 10–15 minutes per question for experienced employees; longer for new hires unfamiliar with where documents live.

**After:** Upload documents once, ask questions instantly. The tool retrieves relevant passages via vector similarity search and synthesizes answers using GPT-4o — with direct source citations. Estimated to reduce information retrieval time from 10–15 minutes to under 30 seconds. Designed to improve onboarding consistency and reduce dependency on tribal knowledge.

---

## Who Would Use This

- **Operations teams** looking up SOPs and process documentation
- **New hires** onboarding who need fast answers about internal procedures
- **Compliance / regulatory staff** verifying policy details across documents
- **IT / engineering teams** answering questions about approved vendor lists and security policies
- **Anyone** who wastes time searching through internal document repositories

---

## What Problem This Solves

| Pain Point | How This Tool Addresses It |
|---|---|
| Documents scattered across drives, wikis, and email | Centralized upload + searchable knowledge base |
| Keyword search misses semantically relevant content | Vector similarity search understands meaning, not just keywords |
| Reading entire documents to find one answer | AI extracts and synthesizes the specific answer with source citations |
| New employees don't know where to look | Single conversational interface — just ask the question |
| No audit trail of what was asked | Conversation history persisted in database |

---

## Screenshots

> _Screenshots to be added after deployment. Include:_
> 1. _Empty state with suggested questions_
> 2. _Document sidebar with uploaded files_
> 3. _Chat conversation with source citations_
> 4. _Document upload dialog with progress_
> 5. _Mobile responsive view_

<!-- ![Empty State](screenshots/empty-state.png) -->
<!-- ![Chat with Sources](screenshots/chat-sources.png) -->
<!-- ![Document Upload](screenshots/upload-dialog.png) -->

---

## Live Demo

**[Live Demo →](https://internal-document-q-a-knowledge-bas.vercel.app/)**

---

## Demo Video

> _Short Loom-style walkthrough to be recorded. Should cover:_
> 1. _Uploading a document (PDF + Markdown)_
> 2. _Asking a question and receiving a streamed answer_
> 3. _Viewing source citations_
> 4. _Deleting a document_
> 5. _Seeding sample data_

<!-- **[Watch Demo Video →](https://loom.com/share/...)** -->

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Full-stack React with API routes |
| **Language** | TypeScript (strict mode) | Type safety across frontend and backend |
| **Styling** | Tailwind CSS v4 + shadcn/ui | Utility-first CSS with accessible component library |
| **Database** | Supabase (PostgreSQL + pgvector) | Document storage + vector similarity search |
| **AI — Embeddings** | OpenAI `text-embedding-3-small` | 1536-dimension vector embeddings for semantic search |
| **AI — Chat** | OpenAI `GPT-4o` | Answer generation with streaming (SSE) |
| **Tokenizer** | tiktoken (WASM) | Accurate token counting for chunking |
| **PDF Parsing** | pdf-parse v2 | Server-side PDF text extraction |
| **Markdown** | react-markdown + remark-gfm | Rendered markdown in chat responses |
| **Icons** | Lucide React | Consistent icon set |
| **Deployment** | Vercel (recommended) | Serverless deployment with edge functions |

---

## AI Model Used

| Model | Purpose | Configuration |
|---|---|---|
| `text-embedding-3-small` | Converts document chunks and user queries into 1536-dimensional vectors for semantic similarity matching | Batch size: 100 texts per API call |
| `gpt-4o` | Generates answers from retrieved context with conversation history | Temperature: 0.3, Max tokens: 1500, Streaming: enabled |

The system uses **Retrieval-Augmented Generation (RAG)**: user questions are embedded, matched against document chunks via cosine similarity (threshold: 0.5, top 5 results), then the matched context is sent to GPT-4o with a strict system prompt that prevents fabrication.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Frontend                         │
│                                                             │
│   ChatInterface          DocumentSidebar    DocumentUpload  │
│   (SSE streaming)        (file list)        (drag & drop)   │
└──────────┬──────────────────────┬───────────────────────────┘
           │                     │
  ┌────────▼────────┐  ┌────────▼─────────┐  ┌──────────────┐
  │  /api/ask       │  │  /api/upload     │  │ /api/documents│
  │  POST           │  │  POST            │  │ GET / DELETE  │
  │  - Embed query  │  │  - Parse PDF     │  │ - List docs   │
  │  - Vector search│  │  - Chunk text    │  │ - Delete doc  │
  │  - Stream GPT-4o│  │  - Embed chunks  │  │               │
  └────────┬────────┘  └────────┬─────────┘  └──────┬───────┘
           │                    │                    │
  ┌────────▼────────────────────▼────────────────────▼───────┐
  │                     OpenAI API                           │
  │  • text-embedding-3-small (embeddings)                   │
  │  • gpt-4o (chat completions, streaming)                  │
  └──────────────────────┬───────────────────────────────────┘
                         │
  ┌──────────────────────▼───────────────────────────────────┐
  │              Supabase (PostgreSQL + pgvector)            │
  │                                                          │
  │  documents ──< document_chunks (1536-dim vectors)        │
  │  conversations ──< messages (with source JSON)           │
  │                                                          │
  │  RPC: match_document_chunks() — cosine similarity search │
  └──────────────────────────────────────────────────────────┘
```

---

## Key Features

- **Multi-format upload** — PDF, Markdown (.md), and plain text (.txt) up to 10 MB
- **Intelligent chunking** — 512-token chunks with 50-token overlap to preserve context across boundaries
- **Semantic search** — pgvector HNSW index for fast cosine similarity matching
- **Streaming answers** — Token-by-token Server-Sent Events for real-time response display
- **Source citations** — Every answer includes clickable source badges showing document name, chunk index, and similarity percentage
- **Conversation memory** — Last 6 messages included in context for follow-up questions
- **Document management** — Upload, list, and delete documents with cascade cleanup
- **Sample data seeding** — One-click seed with pharma/enterprise domain sample documents
- **Drag-and-drop upload** — File validation, progress tracking, and status feedback
- **Responsive UI** — Works on desktop and mobile

---

## Setup Instructions

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+
- **Supabase account** — [supabase.com](https://supabase.com) (free tier works)
- **OpenAI API key** — [platform.openai.com](https://platform.openai.com)

### 1. Clone the Repository

```bash
git clone https://github.com/ChristosLeptokaropoulos/Internal-Document-Q-A-Knowledge-Base-Assistant.git
cd Internal-Document-Q-A-Knowledge-Base-Assistant/doc-qa-assistant
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new Supabase project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** and run the contents of [`supabase/schema.sql`](doc-qa-assistant/supabase/schema.sql) — this creates all tables, the pgvector extension, indexes, and the `match_document_chunks` RPC function
3. Copy your project URL and anon key from **Settings → API**

### 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=sk-your-openai-api-key
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Seed Sample Data (Optional)

Click **"Seed Sample Documents"** in the sidebar, or send a POST request:

```bash
curl -X POST http://localhost:3000/api/seed
```

This loads 4 sample enterprise documents (pharma domain SOPs) to demonstrate the system immediately.

### 7. Deploy to Vercel (Optional)

```bash
npx vercel --prod
```

Set the same environment variables in Vercel's project settings. Set the **Root Directory** to `doc-qa-assistant`.

---

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/upload` | POST | Upload a document (FormData with `file` field). Returns document metadata with chunk count. Max 60s. |
| `/api/ask` | POST | Ask a question (`{ question, conversationId? }`). Returns SSE stream with sources, tokens, and done signal. Max 30s. |
| `/api/documents` | GET | List all documents ordered by creation date (newest first). |
| `/api/documents` | DELETE | Delete a document by ID (`{ id }`). Cascades to chunks. |
| `/api/seed` | POST | Seed sample documents. Idempotent — skips existing documents. |

---

## Responsible AI

### Human Review

- The system is designed as an **assistant, not a decision-maker**. All AI-generated answers should be reviewed by the user before being acted upon, especially for compliance-sensitive or regulatory content.
- Source citations are provided with every answer so users can **verify claims against the original document text**. Each source badge shows the document title, chunk index, and similarity score — enabling quick fact-checking.
- The tool does **not** automate any downstream actions (no auto-approvals, no auto-publishing). It only surfaces information for human consumption.

### Hallucination Risk

- GPT-4o can generate plausible-sounding but incorrect information. This system mitigates hallucination risk through:
  - **Strict system prompt**: The model is instructed to answer **only** from the provided document context, never from general knowledge.
  - **"I don't know" behavior**: If the retrieved context does not contain relevant information, the model is instructed to say so explicitly rather than guess.
  - **Source grounding**: Every answer is tied to specific retrieved chunks. Users can hover over source badges to preview the original text (first 200 characters).
  - **Low temperature (0.3)**: Reduces creative/speculative output in favor of deterministic, factual responses.
- **Despite these safeguards, hallucination cannot be fully eliminated.** Users should always verify critical information against the source documents.

### Confidence Threshold and Fallback Behavior

- Vector similarity search uses a **cosine similarity threshold of 0.5** — chunks below this threshold are excluded from results. If no chunks meet the threshold, the model receives no context and is expected to respond that it cannot find relevant information.
- The system returns the **top 5 most relevant chunks** to balance answer quality with context window limits.
- Each source badge displays the **similarity percentage** so users can gauge how closely the retrieved content matches their question.
- The system prompt instructs the model to **express confidence honestly** — distinguishing between well-supported answers and less certain ones.

### Data Privacy

- **All documents and conversations are stored in your own Supabase instance** — no data is shared with other users or stored by the application outside your database.
- Document content is sent to the **OpenAI API** for embedding generation and answer synthesis. Review [OpenAI's data usage policy](https://openai.com/policies/api-data-usage-policies) — API data is not used for model training by default.
- **No telemetry, analytics, or third-party tracking** is included in this application.
- Environment variables (API keys) are stored in `.env.local` which is excluded from version control via `.gitignore`.
- **Recommendation**: For production use with sensitive internal documents, use OpenAI's enterprise API tier or Azure OpenAI Service for additional data processing agreements and compliance certifications.

### Logging and Audit Trail

- **Conversation persistence**: All questions and answers are stored in the `messages` table with timestamps, enabling a full audit trail of what was asked and what was answered.
- **Source tracking**: Each assistant message stores the retrieved sources (document ID, chunk index, similarity score) as structured JSON — providing traceability from answer back to source document.
- **Document lifecycle**: `created_at` and `updated_at` timestamps on all documents track when content entered the knowledge base.
- **Recommendation for production**: Add structured server-side logging (e.g., request IDs, user identification, latency metrics) and integrate with a centralized logging platform for monitoring and compliance reporting.

### Limitations and Honest Framing

- This is a **prototype / portfolio demonstration**, not a production-deployed enterprise system.
- The sample documents are synthetic pharma-domain SOPs created for demonstration purposes — they do not contain real company data.
- Estimated performance characteristics are based on design intent and testing, not production usage metrics.
- The system does not include authentication, role-based access control, or rate limiting — these would be required for any production deployment.

---

## Project Checklist

| Requirement | Status |
|---|---|
| Live demo | ✅ [Live Demo](https://internal-document-q-a-knowledge-bas.vercel.app/) |
| GitHub repo | ✅ [Repository](https://github.com/ChristosLeptokaropoulos/Internal-Document-Q-A-Knowledge-Base-Assistant) |
| README | ✅ This document |
| Screenshots | 🔲 _Capture after deployment_ |
| Demo video | 🔲 _Record Loom walkthrough_ |
| Business value paragraph | ✅ See top of README |

---

## License

MIT