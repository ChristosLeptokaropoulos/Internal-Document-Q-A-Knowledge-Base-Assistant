"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, User, Bot, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Source } from "@/types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
}

const SUGGESTED_QUESTIONS = [
  "What is the MLR review timeline for campaign launches?",
  "What AI tools are approved for enterprise use?",
  "How does the vendor onboarding security assessment work?",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const askQuestion = async (question: string) => {
    if (!question.trim() || isStreaming) return;

    const userMessage: ChatMessage = { role: "user", content: question };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    const assistantMessage: ChatMessage = {
      role: "assistant",
      content: "",
      sources: [],
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const response = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, conversationId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content: `Error: ${errorData.error || "Something went wrong"}`,
          };
          return updated;
        });
        setIsStreaming(false);
        return;
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setIsStreaming(false);
        return;
      }

      let buffer = "";
      let streamCompleted = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.type === "done") {
              streamCompleted = true;
            } else if (data.type === "sources") {
              setConversationId(data.conversationId);
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  sources: data.sources,
                };
                return updated;
              });
            } else if (data.type === "token") {
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  ...updated[updated.length - 1],
                  content: updated[updated.length - 1].content + data.content,
                };
                return updated;
              });
            }
          } catch {
            // Skip malformed JSON
          }
        }
      }

      if (!streamCompleted) {
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          updated[updated.length - 1] = {
            ...last,
            content:
              last.content +
              "\n\n---\n*⚠️ Response may be incomplete — the connection was interrupted.*",
          };
          return updated;
        });
      }
    } catch (error) {
      console.error("Ask error:", error);
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        };
        return updated;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion(input);
    }
  };

  const startNewChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  // Empty state
  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
          <div className="flex flex-col items-center gap-3">
            <div className="rounded-full bg-primary/10 p-4">
              <Sparkles className="size-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Knowledge Base Assistant</h2>
            <p className="max-w-md text-center text-sm text-muted-foreground">
              Ask questions about your internal documents. Answers are generated
              from uploaded content with source citations.
            </p>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-md">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                onClick={() => askQuestion(q)}
                className="rounded-lg border bg-card p-3 text-left text-sm transition-colors hover:bg-muted"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
        <div className="border-t p-4">
          <div className="mx-auto flex max-w-2xl gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your documents..."
              className="min-h-[44px] max-h-32 resize-none"
              rows={1}
            />
            <Button
              onClick={() => askQuestion(input)}
              disabled={!input.trim() || isStreaming}
              size="icon"
            >
              <Send className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Chat view
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <p className="text-sm text-muted-foreground">
          {messages.filter((m) => m.role === "user").length} questions asked
        </p>
        <Button variant="ghost" size="sm" onClick={startNewChat}>
          New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.map((msg, i) => (
            <div key={i}>
              <div
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="mt-1 rounded-full bg-primary/10 p-1.5 h-fit">
                    <Bot className="size-3.5 text-primary" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2.5 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm dark:prose-invert max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content || (isStreaming && i === messages.length - 1 ? "Thinking..." : "")}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{msg.content}</p>
                  )}
                </div>
                {msg.role === "user" && (
                  <div className="mt-1 rounded-full bg-secondary p-1.5 h-fit">
                    <User className="size-3.5" />
                  </div>
                )}
              </div>
              {/* Source citations */}
              {msg.role === "assistant" &&
                msg.sources &&
                msg.sources.length > 0 && (
                  <div className="ml-9 mt-2 flex flex-wrap gap-1.5">
                    {msg.sources.map((source, si) => (
                      <Badge
                        key={si}
                        variant="outline"
                        className="text-xs cursor-help"
                        title={source.content.substring(0, 200)}
                      >
                        <FileText className="size-3 mr-1" />
                        {source.document_title} ·{" "}
                        {Math.round(source.similarity * 100)}%
                      </Badge>
                    ))}
                  </div>
                )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="border-t p-4">
        <div className="mx-auto flex max-w-2xl gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a follow-up question..."
            className="min-h-[44px] max-h-32 resize-none"
            rows={1}
          />
          <Button
            onClick={() => askQuestion(input)}
            disabled={!input.trim() || isStreaming}
            size="icon"
          >
            {isStreaming ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
