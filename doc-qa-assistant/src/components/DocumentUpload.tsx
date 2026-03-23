"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const ACCEPTED_TYPES = [
  "application/pdf",
  "text/markdown",
  "text/plain",
  "text/x-markdown",
];
const ACCEPTED_EXTENSIONS = [".pdf", ".md", ".txt"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

interface DocumentUploadProps {
  onSuccess: () => void;
}

type UploadState = "idle" | "uploading" | "success" | "error";

export function DocumentUpload({ onSuccess }: DocumentUploadProps) {
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [result, setResult] = useState<{
    title: string;
    total_chunks: number;
  } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFile = (file: File): boolean => {
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    return (
      (ACCEPTED_TYPES.includes(file.type) ||
        ACCEPTED_EXTENSIONS.includes(ext)) &&
      file.size <= MAX_SIZE
    );
  };

  const uploadFile = useCallback(
    async (file: File) => {
      if (!isValidFile(file)) {
        setState("error");
        if (file.size > MAX_SIZE) {
          setError("File exceeds 10MB limit");
        } else {
          setError("Only PDF, Markdown, and Text files are supported");
        }
        return;
      }

      setState("uploading");
      setProgress(10);

      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress stages
      const progressTimer = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 80) {
            clearInterval(progressTimer);
            return 80;
          }
          return prev + 10;
        });
      }, 500);

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        clearInterval(progressTimer);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || "Upload failed");
        }

        setProgress(100);
        const data = await response.json();
        setResult(data.document);
        setState("success");

        setTimeout(() => onSuccess(), 1500);
      } catch (err) {
        clearInterval(progressTimer);
        setState("error");
        setError(err instanceof Error ? err.message : "Upload failed");
      }
    },
    [onSuccess]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) uploadFile(file);
    },
    [uploadFile]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
  };

  const reset = () => {
    setState("idle");
    setProgress(0);
    setError("");
    setResult(null);
  };

  if (state === "success" && result) {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <CheckCircle className="size-12 text-green-500" />
        <div className="text-center">
          <p className="font-medium">{result.title}</p>
          <p className="text-sm text-muted-foreground">
            Successfully processed into {result.total_chunks} chunks
          </p>
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="flex flex-col items-center gap-3 py-8">
        <AlertCircle className="size-12 text-destructive" />
        <p className="text-sm text-destructive">{error}</p>
        <Button variant="outline" size="sm" onClick={reset}>
          Try Again
        </Button>
      </div>
    );
  }

  if (state === "uploading") {
    return (
      <div className="flex flex-col items-center gap-4 py-8">
        <FileText className="size-12 text-muted-foreground animate-pulse" />
        <div className="w-full max-w-xs">
          <Progress value={progress} className="h-2" />
        </div>
        <p className="text-sm text-muted-foreground">
          {progress < 30
            ? "Uploading file..."
            : progress < 80
              ? "Extracting and chunking text..."
              : "Generating embeddings..."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col items-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-muted-foreground/25 hover:border-muted-foreground/50"
      }`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <Upload className="size-10 text-muted-foreground" />
      <div className="text-center">
        <p className="text-sm font-medium">
          Drag & drop your document here, or
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          PDF, Markdown, or Text files up to 10MB
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
      >
        Browse Files
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.md,.txt"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
