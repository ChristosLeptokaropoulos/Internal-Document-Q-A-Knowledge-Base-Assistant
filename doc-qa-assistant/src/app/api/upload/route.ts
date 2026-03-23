import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { chunkText } from "@/lib/chunker";
import { generateEmbeddings } from "@/lib/embeddings";
import { extractTextFromPDF } from "@/lib/pdf-parser";
import { v4 as uuidv4 } from "uuid";

const ALLOWED_TYPES = ["application/pdf", "text/markdown", "text/plain"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const maxDuration = 60; // Allow up to 60s for large file processing

function getFileType(mimeType: string, fileName: string): string {
  if (mimeType === "application/pdf") return "pdf";
  if (fileName.endsWith(".md")) return "md";
  return "txt";
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const fileName = file.name;
    const mimeType = file.type;
    const fileType = getFileType(mimeType, fileName);

    if (
      !ALLOWED_TYPES.includes(mimeType) &&
      !fileName.endsWith(".md") &&
      !fileName.endsWith(".txt")
    ) {
      return NextResponse.json(
        { error: "Only PDF, Markdown, and Text files are supported" },
        { status: 400 }
      );
    }

    // Extract text
    const buffer = Buffer.from(await file.arrayBuffer());
    let text: string;

    if (fileType === "pdf") {
      text = await extractTextFromPDF(buffer);
    } else {
      text = buffer.toString("utf-8");
    }

    if (!text.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from file" },
        { status: 400 }
      );
    }

    // Chunk the text
    const chunks = chunkText(text);

    // Generate embeddings for all chunks
    const chunkTexts = chunks.map((c) => c.content);
    const embeddings = await generateEmbeddings(chunkTexts);

    // Create document record
    const documentId = uuidv4();
    const title = fileName.replace(/\.[^/.]+$/, "");

    const supabase = getSupabase();
    const { error: docError } = await supabase.from("documents").insert({
      id: documentId,
      title,
      file_type: fileType,
      file_size: file.size,
      total_chunks: chunks.length,
    });

    if (docError) {
      return NextResponse.json(
        { error: "Failed to save document: " + docError.message },
        { status: 500 }
      );
    }

    // Insert chunks in batches of 50
    const BATCH_SIZE = 50;
    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE).map((chunk, idx) => ({
        document_id: documentId,
        content: chunk.content,
        chunk_index: chunk.chunkIndex,
        token_count: chunk.tokenCount,
        embedding: JSON.stringify(embeddings[i + idx]),
        metadata: { source: fileName, chunkIndex: chunk.chunkIndex },
      }));

      const { error: chunkError } = await supabase
        .from("document_chunks")
        .insert(batch);

      if (chunkError) {
        // Clean up the document if chunk insertion fails
        await supabase.from("documents").delete().eq("id", documentId);
        return NextResponse.json(
          { error: "Failed to save chunks: " + chunkError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      document: {
        id: documentId,
        title,
        file_type: fileType,
        file_size: file.size,
        total_chunks: chunks.length,
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
