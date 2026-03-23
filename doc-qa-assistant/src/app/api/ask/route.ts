import { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { generateSingleEmbedding, openai, CHAT_MODEL } from "@/lib/embeddings";
import type OpenAI from "openai";
import { v4 as uuidv4 } from "uuid";
import type { Source } from "@/types";

export const maxDuration = 30; // Allow up to 30s for embedding + search + streaming

export async function POST(request: NextRequest) {
  try {
    const { question, conversationId } = await request.json();

    if (!question?.trim()) {
      return new Response(
        JSON.stringify({ error: "Question is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const supabase = getSupabase();

    // Embed the question
    const queryEmbedding = await generateSingleEmbedding(question);

    // Vector similarity search
    const { data: matchedChunks, error: matchError } = await supabase.rpc(
      "match_document_chunks",
      {
        query_embedding: JSON.stringify(queryEmbedding),
        match_threshold: 0.5,
        match_count: 5,
      }
    );

    if (matchError) {
      return new Response(
        JSON.stringify({ error: "Search failed: " + matchError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Fetch document titles for matched chunks
    const documentIds = [
      ...new Set(matchedChunks?.map((c: { document_id: string }) => c.document_id) || []),
    ];
    const { data: documents } = await supabase
      .from("documents")
      .select("id, title")
      .in("id", documentIds);

    const docTitleMap = new Map(
      documents?.map((d: { id: string; title: string }) => [d.id, d.title]) || []
    );

    // Build sources
    const sources: Source[] = (matchedChunks || []).map(
      (chunk: { document_id: string; chunk_index: number; content: string; similarity: number }) => ({
        document_title: docTitleMap.get(chunk.document_id) || "Unknown",
        document_id: chunk.document_id,
        chunk_index: chunk.chunk_index,
        content: chunk.content,
        similarity: chunk.similarity,
      })
    );

    // Build context from matched chunks
    const context = sources
      .map(
        (s, i) =>
          `[Source ${i + 1}: "${s.document_title}", Chunk ${s.chunk_index}] (${Math.round(s.similarity * 100)}% match)\n${s.content}`
      )
      .join("\n\n---\n\n");

    // Get conversation history for follow-up context
    let conversationHistory: { role: string; content: string }[] = [];
    if (conversationId) {
      const { data: prevMessages } = await supabase
        .from("messages")
        .select("role, content")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true })
        .limit(6);

      conversationHistory = prevMessages || [];
    }

    // Create or reuse conversation
    let activeConversationId = conversationId;
    if (!activeConversationId) {
      activeConversationId = uuidv4();
      await supabase.from("conversations").insert({
        id: activeConversationId,
        title: question.slice(0, 100),
      });
    }

    // Save user message
    await supabase.from("messages").insert({
      conversation_id: activeConversationId,
      role: "user",
      content: question,
    });

    // Build messages for GPT-4o
    const systemMessage = `You are an intelligent document assistant for an internal knowledge base. Answer questions based ONLY on the provided context from uploaded documents.

Rules:
- Cite sources using [Source N] notation matching the context labels
- If the context doesn't contain relevant information, say so clearly
- Never fabricate information not present in the context
- Use markdown formatting for readability (headers, bold, lists, code blocks)
- Be concise but thorough
- If uncertain, express your level of confidence`;

    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: "system", content: systemMessage },
      ...conversationHistory.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
    ];

    if (sources.length > 0) {
      messages.push({
        role: "user",
        content: `Context from knowledge base:\n\n${context}\n\n---\n\nQuestion: ${question}`,
      });
    } else {
      messages.push({
        role: "user",
        content: `No relevant documents were found in the knowledge base for this question. Please let the user know.\n\nQuestion: ${question}`,
      });
    }

    // Stream GPT-4o response
    const completion = await openai.chat.completions.create({
      model: CHAT_MODEL,
      messages,
      stream: true,
      temperature: 0.3,
      max_tokens: 1500,
    });

    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();

        // Send sources first as a JSON event
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ type: "sources", sources, conversationId: activeConversationId })}\n\n`
          )
        );

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            fullResponse += content;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: "token", content })}\n\n`
              )
            );
          }
        }

        // Save assistant message
        await supabase.from("messages").insert({
          conversation_id: activeConversationId,
          role: "assistant",
          content: fullResponse,
          sources,
        });

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: "done" })}\n\n`)
        );
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Ask error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
