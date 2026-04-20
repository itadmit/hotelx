"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { trackCTAClick } from "@/lib/gtag";

export function DemoBookingForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/demo-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error || "Something went wrong");
      }

      trackCTAClick("demo_request_submitted");
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit");
    } finally {
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="card-elev p-8 sm:p-10 text-center">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-soft text-emerald-brand mb-5">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="font-display text-2xl text-ink">
          Thank you — request received.
        </h3>
        <p className="mt-3 text-foreground/65 max-w-md mx-auto">
          Our team will reach out within 24 hours to schedule your private
          walkthrough. In the meantime, feel free to keep exploring the live
          demo above.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-6 inline-flex items-center justify-center h-11 px-5 rounded-full border border-[color:var(--border)] text-ink hover:bg-surface transition-colors text-sm"
        >
          Submit another request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="card-elev p-6 sm:p-8">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Hotel name" name="hotelName" required disabled={isLoading} />
        <Field
          label="Contact person"
          name="contactPerson"
          required
          disabled={isLoading}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          disabled={isLoading}
        />
        <Field label="Phone" name="phone" type="tel" disabled={isLoading} />
        <Field label="Country" name="country" disabled={isLoading} />
        <Field label="City" name="city" disabled={isLoading} />
        <div className="sm:col-span-2">
          <Field
            label="Number of rooms"
            name="rooms"
            type="number"
            disabled={isLoading}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="mt-7 w-full inline-flex items-center justify-center gap-2 h-12 px-6 rounded-full bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Sending…
          </>
        ) : (
          <>
            Request demo
            <Send className="h-4 w-4" />
          </>
        )}
      </button>

      {error && (
        <p className="mt-3 text-sm text-clay text-center">{error}</p>
      )}

      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45 text-center">
        We&apos;ll respond within 24 hours · No card required
      </p>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  disabled,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 mb-1.5">
        {label}
        {required ? <span className="text-clay"> *</span> : null}
      </span>
      <input
        name={name}
        type={type}
        required={required}
        disabled={disabled}
        className="w-full h-11 px-3.5 rounded-lg bg-surface border border-[color:var(--border)] text-ink text-sm placeholder:text-foreground/40 focus:outline-none focus:border-emerald-brand/40 focus:ring-2 focus:ring-emerald-brand/15 transition-all disabled:opacity-60"
      />
    </label>
  );
}
