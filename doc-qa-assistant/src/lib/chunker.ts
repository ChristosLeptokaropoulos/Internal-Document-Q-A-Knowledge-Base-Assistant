import { encoding_for_model } from "tiktoken";
import type { ChunkResult } from "@/types";

let enc: ReturnType<typeof encoding_for_model> | null = null;

function getEncoder() {
  if (!enc) {
    enc = encoding_for_model("gpt-4o");
  }
  return enc;
}

function countTokens(text: string): number {
  return getEncoder().encode(text).length;
}

function splitBySentences(text: string): string[] {
  return text.match(/[^.!?]+[.!?]+[\s]*/g) || [text];
}

function getOverlapText(text: string, overlapTokens: number): string {
  const encoder = getEncoder();
  const tokens = encoder.encode(text);
  if (tokens.length <= overlapTokens) return text;
  const overlapSlice = tokens.slice(-overlapTokens);
  return new TextDecoder().decode(encoder.decode(overlapSlice));
}

export function chunkText(
  text: string,
  maxTokens: number = 512,
  overlapTokens: number = 50
): ChunkResult[] {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim().length > 0);
  const chunks: ChunkResult[] = [];

  let currentChunk = "";
  let currentTokens = 0;
  let overlapText = "";

  for (const paragraph of paragraphs) {
    const paragraphTokens = countTokens(paragraph);

    // If a single paragraph exceeds maxTokens, split by sentences
    if (paragraphTokens > maxTokens) {
      // Flush current chunk first
      if (currentChunk.trim()) {
        chunks.push({
          content: currentChunk.trim(),
          tokenCount: currentTokens,
          chunkIndex: chunks.length,
        });
        overlapText = getOverlapText(currentChunk.trim(), overlapTokens);
      }

      const sentences = splitBySentences(paragraph);
      let sentenceChunk = overlapText ? overlapText + " " : "";
      let sentenceTokens = overlapText ? countTokens(sentenceChunk) : 0;

      for (const sentence of sentences) {
        const sentTokens = countTokens(sentence);
        if (sentenceTokens + sentTokens > maxTokens && sentenceChunk.trim()) {
          chunks.push({
            content: sentenceChunk.trim(),
            tokenCount: sentenceTokens,
            chunkIndex: chunks.length,
          });
          overlapText = getOverlapText(sentenceChunk.trim(), overlapTokens);
          sentenceChunk = overlapText + " " + sentence;
          sentenceTokens = countTokens(sentenceChunk);
        } else {
          sentenceChunk += sentence;
          sentenceTokens += sentTokens;
        }
      }

      currentChunk = sentenceChunk;
      currentTokens = sentenceTokens;
      overlapText = "";
      continue;
    }

    if (currentTokens + paragraphTokens > maxTokens && currentChunk.trim()) {
      chunks.push({
        content: currentChunk.trim(),
        tokenCount: currentTokens,
        chunkIndex: chunks.length,
      });

      // Keep overlap from end of previous chunk
      overlapText = getOverlapText(currentChunk.trim(), overlapTokens);
      currentChunk = overlapText + "\n\n" + paragraph;
      currentTokens = countTokens(currentChunk);
    } else {
      currentChunk += (currentChunk ? "\n\n" : "") + paragraph;
      currentTokens = countTokens(currentChunk);
    }
  }

  // Flush remaining
  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      tokenCount: countTokens(currentChunk.trim()),
      chunkIndex: chunks.length,
    });
  }

  return chunks;
}
