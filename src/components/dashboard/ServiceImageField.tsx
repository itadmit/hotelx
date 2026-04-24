"use client";

import { useId, useRef, useState } from "react";
import { ImagePlus, Trash2, Loader2, Link2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { fileToCompressedBlob, isAllowedServiceImageValue } from "@/lib/image-compress";

const PLACEHOLDER =
  "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=640&q=80";

type Props = {
  value: string | null;
  onChange: (next: string | null) => void;
};

export function ServiceImageField({ value, onChange }: Props) {
  const inputId = useId();
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");

  async function onPickFile(file: File | null) {
    if (!file) return;
    setError(null);
    setBusy(true);
    try {
      const blob = await fileToCompressedBlob(file);
      const form = new FormData();
      form.append("file", blob, "upload.jpg");
      form.append("kind", "service");
      const res = await fetch("/api/uploads/image", { method: "POST", body: form });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(typeof data.error === "string" ? data.error : "Upload failed");
      }
      onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function applyUrl() {
    const t = urlDraft.trim();
    setError(null);
    if (!t) {
      setError("Paste a valid URL");
      return;
    }
    if (!isAllowedServiceImageValue(t)) {
      setError("Use an http(s) image URL");
      return;
    }
    onChange(t);
    setUrlDraft("");
  }

  return (
    <div className="space-y-3">
      <Label htmlFor={inputId}>Service photo</Label>
      <p className="text-[11px] text-foreground/55 leading-relaxed -mt-1">
        Shown on the guest app service card. Upload a photo or paste an image
        URL. Square or 4:3 photos work best.
      </p>

      <div className="relative aspect-[4/3] max-h-[220px] w-full max-w-md rounded-xl overflow-hidden border border-[color:var(--border)] bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={value && value.length > 0 ? value : PLACEHOLDER}
          alt=""
          className={`absolute inset-0 h-full w-full object-cover ${value ? "" : "opacity-40"}`}
        />
        {value ? (
          <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent pointer-events-none" />
        ) : null}
        {busy ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-[2px]">
            <Loader2 className="h-8 w-8 text-emerald-brand animate-spin" strokeWidth={2} />
          </div>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs text-clay bg-amber-soft/30 border border-[color:var(--border)] rounded-lg px-3 py-2">
          {error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <input
          ref={fileRef}
          id={inputId}
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(e) => void onPickFile(e.target.files?.[0] ?? null)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="h-10 rounded-xl border-[color:var(--border)] bg-surface hover:bg-background gap-2 text-ink"
        >
          {busy ? (
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          ) : (
            <ImagePlus className="h-4 w-4 shrink-0" strokeWidth={2} />
          )}
          {value ? "Replace photo" : "Upload photo"}
        </Button>
        {value ? (
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => {
              onChange(null);
              setError(null);
            }}
            className="h-10 rounded-xl border-[color:var(--border)] bg-surface hover:bg-background gap-2 text-clay"
          >
            <Trash2 className="h-4 w-4 shrink-0" strokeWidth={2} />
            Remove
          </Button>
        ) : null}
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:items-end max-w-md">
        <div className="flex-1 grid gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-[0.14em] text-foreground/45">
            Or paste URL
          </span>
          <Input
            placeholder="https://…"
            value={urlDraft}
            onChange={(e) => setUrlDraft(e.target.value)}
            className="h-10 rounded-xl bg-surface border-[color:var(--border)]"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          disabled={busy || !urlDraft.trim()}
          onClick={applyUrl}
          className="h-10 rounded-xl border-[color:var(--border)] bg-surface shrink-0 gap-1.5"
        >
          <Link2 className="h-3.5 w-3.5" strokeWidth={2} />
          Use URL
        </Button>
      </div>
    </div>
  );
}
