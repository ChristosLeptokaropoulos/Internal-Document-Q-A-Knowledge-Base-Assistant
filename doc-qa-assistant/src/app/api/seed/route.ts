import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { chunkText } from "@/lib/chunker";
import { generateEmbeddings } from "@/lib/embeddings";
import { sampleDocuments } from "@/data/sample-documents";
import { v4 as uuidv4 } from "uuid";

export const maxDuration = 60;

export async function POST() {
  try {
    const supabase = getSupabase();

    // Check if sample docs already exist
    const { data: existing } = await supabase
      .from("documents")
      .select("title")
      .in(
        "title",
        sampleDocuments.map((d) => d.title)
      );

    const existingTitles = new Set(existing?.map((d) => d.title) || []);
    const docsToSeed = sampleDocuments.filter(
      (d) => !existingTitles.has(d.title)
    );

    if (docsToSeed.length === 0) {
      return NextResponse.json({
        message: "All sample documents already exist",
        seeded: 0,
      });
    }

    const results = [];

    for (const doc of docsToSeed) {
      const chunks = chunkText(doc.content);
      const chunkTexts = chunks.map((c) => c.content);
      const embeddings = await generateEmbeddings(chunkTexts);

      const documentId = uuidv4();

      await supabase.from("documents").insert({
        id: documentId,
        title: doc.title,
        file_type: doc.fileType,
        file_size: new TextEncoder().encode(doc.content).length,
        total_chunks: chunks.length,
      });

      const BATCH_SIZE = 50;
      for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
        const batch = chunks.slice(i, i + BATCH_SIZE).map((chunk, idx) => ({
          document_id: documentId,
          content: chunk.content,
          chunk_index: chunk.chunkIndex,
          token_count: chunk.tokenCount,
          embedding: JSON.stringify(embeddings[i + idx]),
          metadata: { source: doc.title, chunkIndex: chunk.chunkIndex },
        }));

        await supabase.from("document_chunks").insert(batch);
      }

      results.push({ title: doc.title, chunks: chunks.length });
    }

    return NextResponse.json({
      message: `Seeded ${results.length} documents`,
      seeded: results.length,
      documents: results,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed documents" },
      { status: 500 }
    );
  }
}
