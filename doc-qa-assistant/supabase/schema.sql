-- Enable the pgvector extension
create extension if not exists vector;

-- =============================================================================
-- Table: documents
-- =============================================================================
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  file_type text not null,  -- 'pdf', 'md', 'txt'
  file_size integer not null default 0,
  total_chunks integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- =============================================================================
-- Table: document_chunks
-- =============================================================================
create table if not exists document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references documents(id) on delete cascade,
  content text not null,
  chunk_index integer not null,
  token_count integer not null default 0,
  embedding vector(1536),
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists idx_document_chunks_document_id
  on document_chunks(document_id);

create index if not exists idx_document_chunks_embedding
  on document_chunks using hnsw (embedding vector_cosine_ops);

-- =============================================================================
-- Table: conversations
-- =============================================================================
create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  title text not null default 'New Conversation',
  created_at timestamp with time zone default now()
);

-- =============================================================================
-- Table: messages
-- =============================================================================
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources jsonb default '[]'::jsonb,
  created_at timestamp with time zone default now()
);

create index if not exists idx_messages_conversation_id
  on messages(conversation_id);

-- =============================================================================
-- Function: match_document_chunks
-- =============================================================================
create or replace function match_document_chunks (
  query_embedding vector(1536),
  match_threshold float default 0.5,
  match_count int default 5
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  chunk_index integer,
  token_count integer,
  metadata jsonb,
  similarity float
)
language sql stable
as $$
  select
    dc.id,
    dc.document_id,
    dc.content,
    dc.chunk_index,
    dc.token_count,
    dc.metadata,
    1 - (dc.embedding <=> query_embedding) as similarity
  from document_chunks dc
  where 1 - (dc.embedding <=> query_embedding) > match_threshold
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;
