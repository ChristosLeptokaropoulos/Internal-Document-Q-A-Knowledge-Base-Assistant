export interface Document {
  id: string;
  title: string;
  file_type: string;
  file_size: number;
  total_chunks: number;
  created_at: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  chunk_index: number;
  token_count: number;
  embedding?: number[];
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  created_at: string;
}

export interface Source {
  document_title: string;
  document_id: string;
  chunk_index: number;
  content: string;
  similarity: number;
}

export interface ChunkResult {
  content: string;
  tokenCount: number;
  chunkIndex: number;
}
