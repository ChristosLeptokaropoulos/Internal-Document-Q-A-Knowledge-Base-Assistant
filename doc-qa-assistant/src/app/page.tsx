import { DocumentSidebar } from "@/components/DocumentSidebar";
import { ChatInterface } from "@/components/ChatInterface";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

export default function Home() {
  return (
    <div className="flex h-screen flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center size-8 rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </div>
          <div>
            <h1 className="text-base font-semibold">DocQA</h1>
            <p className="text-xs text-muted-foreground">
              Internal Knowledge Base Assistant
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          Powered by GPT-4o + pgvector
        </Badge>
      </header>

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        <DocumentSidebar />
        <main className="flex-1">
          <ChatInterface />
        </main>
      </div>
    </div>
  );
}
