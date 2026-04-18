"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, MessageSquareText, Send, AlertCircle } from "lucide-react";

type Props = {
  hotelSlug: string;
  roomCode: string;
  serviceId: string;
  servicePriceLabel: string;
};

export default function ServiceRequestForm({
  hotelSlug,
  roomCode,
  serviceId,
  servicePriceLabel,
}: Props) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function submitRequest() {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/public/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelSlug, roomCode, serviceId, notes }),
      });
      const data = await response.json();

      if (data?.request?.id) {
        router.push(`/g/${hotelSlug}/${roomCode}/request/${data.request.id}`);
        return;
      }

      setError(data?.error ?? "Failed to send your request. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-5">
      {/* Notes */}
      <label className="block">
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 mb-2">
          <MessageSquareText className="h-3 w-3 text-emerald-brand" />
          Special instructions
        </span>
        <textarea
          rows={3}
          placeholder="E.g. extra ice, no nuts, knock gently…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-3.5 py-3 rounded-xl bg-card border border-[color:var(--border)] text-ink text-sm placeholder:text-foreground/40 focus:outline-none focus:border-emerald-brand/40 focus:ring-2 focus:ring-emerald-brand/15 transition-all resize-none"
        />
      </label>

      {/* Error */}
      {error ? (
        <div className="flex items-start gap-2 rounded-xl border border-clay/30 bg-clay/5 p-3 text-clay">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <p className="text-xs leading-snug">{error}</p>
        </div>
      ) : null}

      {/* Submit */}
      <button
        type="button"
        disabled={submitting}
        onClick={submitRequest}
        className="group w-full inline-flex items-center justify-between gap-3 h-14 px-5 rounded-2xl bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className="flex items-center gap-2">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              Confirm request
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </span>
        <span className="numeral text-lg leading-none">
          {servicePriceLabel}
        </span>
      </button>

      <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
        Charged to your room · cancel before staff confirms
      </p>
    </div>
  );
}
