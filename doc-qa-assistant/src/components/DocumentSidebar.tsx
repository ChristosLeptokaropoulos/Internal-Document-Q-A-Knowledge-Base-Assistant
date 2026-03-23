"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileText,
  FileType,
  Upload,
  Trash2,
  File,
  DatabaseZap,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DocumentUpload } from "@/components/DocumentUpload";
import type { Document } from "@/types";

const fileIcons: Record<string, React.ReactNode> = {
  pdf: <FileText className="size-4 text-red-500" />,
  md: <FileType className="size-4 text-blue-500" />,
  txt: <File className="size-4 text-gray-500" />,
};

export function DocumentSidebar() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const res = await fetch("/api/documents");
      const data = await res.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await fetch("/api/documents", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setDocuments((prev) => prev.filter((d) => d.id !== id));
    } catch (error) {
      console.error("Failed to delete document:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleUploadSuccess = () => {
    setDialogOpen(false);
    fetchDocuments();
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch("/api/seed", { method: "POST" });
      if (!res.ok) throw new Error("Seed failed");
      await fetchDocuments();
    } catch (error) {
      console.error("Failed to seed documents:", error);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex h-full w-72 flex-col border-r bg-muted/30">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">Documents</h2>
          <Badge variant="secondary">{documents.length}</Badge>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Upload className="size-3.5" />
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
            </DialogHeader>
            <DocumentUpload onSuccess={handleUploadSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-2">
          {loading ? (
            <p className="p-4 text-center text-sm text-muted-foreground">
              Loading...
            </p>
          ) : documents.length === 0 ? (
            <div className="p-4 text-center text-sm text-muted-foreground">
              <p>No documents yet.</p>
              <p className="mt-1">Upload a document or seed sample data.</p>
              <Button
                size="sm"
                variant="outline"
                className="mt-3"
                onClick={handleSeed}
                disabled={seeding}
              >
                {seeding ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <DatabaseZap className="size-3.5" />
                )}
                {seeding ? "Seeding..." : "Seed Sample Documents"}
              </Button>
            </div>
          ) : (
            documents.map((doc) => (
              <div
                key={doc.id}
                className="group flex items-start gap-2 rounded-md p-2 hover:bg-muted"
              >
                <div className="mt-0.5">
                  {fileIcons[doc.file_type] || fileIcons.txt}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{doc.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {doc.total_chunks} chunks · {doc.file_type.toUpperCase()}
                  </p>
                </div>
                <Button
                  size="icon-xs"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => handleDelete(doc.id)}
                  disabled={deletingId === doc.id}
                >
                  <Trash2 className="size-3 text-destructive" />
                </Button>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
