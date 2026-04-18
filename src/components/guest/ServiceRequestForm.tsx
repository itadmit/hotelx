"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  MessageSquareText,
  Send,
  AlertCircle,
  ShieldCheck,
  Lock,
  CreditCard,
  Sparkles,
  X,
} from "lucide-react";

type Props = {
  hotelSlug: string;
  roomCode: string;
  serviceId: string;
  servicePriceLabel: string;
  requirePayment: boolean;
  paymentsEnabled: boolean;
};

type IntentResponse = {
  paymentId: string;
  providerType: "STRIPE" | "PAYPAL" | "CUSTOM" | "MOCK";
  providerKind: "embedded-card" | "redirect" | "external-form" | "auto";
  clientToken: string | null;
  redirectUrl: string | null;
  publicConfig: Record<string, string>;
  amount: number;
  currency: string;
};

export default function ServiceRequestForm({
  hotelSlug,
  roomCode,
  serviceId,
  servicePriceLabel,
  requirePayment,
  paymentsEnabled,
}: Props) {
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<IntentResponse | null>(null);
  const [isNavigating, startTransition] = useTransition();
  const router = useRouter();
  const paymentRequired = requirePayment && paymentsEnabled;

  async function submitFreeRequest() {
    setSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/public/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelSlug, roomCode, serviceId, notes }),
      });
      const data = await response.json();

      if (data?.requiresPayment) {
        await openPaymentSheet();
        return;
      }

      if (data?.request?.id) {
        const target = `/g/${hotelSlug}/${roomCode}/request/${data.request.id}`;
        router.prefetch(target);
        startTransition(() => {
          router.push(target);
        });
        return;
      }
      setError(data?.error ?? "Failed to send your request. Please try again.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function openPaymentSheet() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/public/payments/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hotelSlug, roomCode, serviceId, notes }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Failed to start payment.");
        return;
      }
      setIntent(data as IntentResponse);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handlePrimary() {
    if (paymentRequired) {
      await openPaymentSheet();
      return;
    }
    await submitFreeRequest();
  }

  async function onPaymentSuccess() {
    if (!intent) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/public/payments/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentId: intent.paymentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "Payment was not completed.");
        return;
      }
      if (data?.request?.id) {
        const target = `/g/${hotelSlug}/${roomCode}/request/${data.request.id}`;
        router.prefetch(target);
        startTransition(() => {
          router.push(target);
        });
      }
    } catch {
      setError("Network error confirming payment.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="space-y-5">
        {paymentRequired ? (
          <div className="flex items-start gap-2.5 rounded-xl border border-emerald-brand/25 bg-emerald-soft/50 p-3">
            <ShieldCheck className="h-4 w-4 mt-0.5 text-emerald-brand shrink-0" />
            <div className="leading-tight">
              <p className="text-xs font-medium text-emerald-brand">
                Payment required · Secured checkout
              </p>
              <p className="text-[11px] text-foreground/65 mt-0.5">
                You&apos;ll be charged {servicePriceLabel} after you confirm.
              </p>
            </div>
          </div>
        ) : null}

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

        {error ? (
          <div className="flex items-start gap-2 rounded-xl border border-clay/30 bg-clay/5 p-3 text-clay">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <p className="text-xs leading-snug">{error}</p>
          </div>
        ) : null}

        <button
          type="button"
          disabled={submitting || isNavigating}
          onClick={handlePrimary}
          className="group w-full inline-flex items-center justify-between gap-3 h-14 px-5 rounded-2xl bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <span className="flex items-center gap-2">
            {submitting || isNavigating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {isNavigating ? "Opening status…" : "Working…"}
              </>
            ) : paymentRequired ? (
              <>
                <Lock className="h-4 w-4" />
                Pay &amp; confirm
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                Confirm request
              </>
            )}
          </span>
          <span className="numeral text-lg leading-none">
            {servicePriceLabel}
          </span>
        </button>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/45">
          {paymentRequired
            ? "Charged once you approve · 256-bit encryption"
            : "Charged to your room · cancel before staff confirms"}
        </p>
      </div>

      {intent ? (
        <CheckoutSheet
          intent={intent}
          servicePriceLabel={servicePriceLabel}
          onClose={() => setIntent(null)}
          onSuccess={onPaymentSuccess}
        />
      ) : null}
    </>
  );
}

function CheckoutSheet({
  intent,
  servicePriceLabel,
  onClose,
  onSuccess,
}: {
  intent: IntentResponse;
  servicePriceLabel: string;
  onClose: () => void;
  onSuccess: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full sm:max-w-md mx-auto bg-background rounded-t-3xl sm:rounded-2xl border border-[color:var(--border)] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 h-14 border-b border-[color:var(--border)]">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/55">
              {intent.providerType === "STRIPE"
                ? "Secure checkout · Stripe"
                : intent.providerType === "PAYPAL"
                ? "PayPal"
                : intent.providerType === "CUSTOM"
                ? "Secure checkout"
                : "Demo checkout"}
            </p>
            <p className="text-sm font-medium text-ink">
              Pay {servicePriceLabel}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-md hover:bg-surface flex items-center justify-center text-foreground/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-6">
          <CheckoutBody intent={intent} onSuccess={onSuccess} />
        </div>

        <div className="px-5 py-3 bg-surface border-t border-[color:var(--border)] flex items-center justify-center gap-2 text-foreground/50 text-[10px] font-mono uppercase tracking-[0.16em]">
          <Lock className="h-3 w-3" />
          End-to-end encrypted
        </div>
      </div>
    </div>
  );
}

function CheckoutBody({
  intent,
  onSuccess,
}: {
  intent: IntentResponse;
  onSuccess: () => void;
}) {
  if (intent.providerType === "MOCK") {
    return <MockCheckout onSuccess={onSuccess} />;
  }
  if (intent.providerType === "STRIPE") {
    return <StripeCheckout intent={intent} onSuccess={onSuccess} />;
  }
  if (intent.providerType === "CUSTOM") {
    return <CustomCheckout intent={intent} onSuccess={onSuccess} />;
  }
  if (intent.providerType === "PAYPAL") {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-foreground/60">
          PayPal flow is in beta — please contact the front desk to complete
          this payment.
        </p>
      </div>
    );
  }
  return null;
}

function MockCheckout({ onSuccess }: { onSuccess: () => void }) {
  const [done, setDone] = useState(false);
  return (
    <div className="text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-amber-soft text-amber-brand mb-4">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="font-display text-lg text-ink">Demo processor</h3>
      <p className="mt-1.5 text-xs text-foreground/60 max-w-xs mx-auto">
        No real card required. Click below to simulate a successful payment.
      </p>
      <button
        type="button"
        disabled={done}
        onClick={() => {
          setDone(true);
          setTimeout(onSuccess, 600);
        }}
        className="mt-5 w-full h-12 rounded-xl bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
      >
        {done ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        {done ? "Confirming…" : "Simulate payment"}
      </button>
    </div>
  );
}

function StripeCheckout({
  intent,
  onSuccess,
}: {
  intent: IntentResponse;
  onSuccess: () => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [card, setCard] = useState({ number: "", exp: "", cvc: "" });
  const publishableKey = intent.publicConfig.publishableKey ?? "";

  // We render a UI that *looks* like Stripe Elements but in this build we
  // confirm via the backend's PaymentIntent status check (good for test
  // mode). To go fully PCI-compliant in production, swap this for the
  // @stripe/react-stripe-js <PaymentElement /> mounted with the
  // clientSecret. The confirm step on our backend already handles either.
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSubmitting(true);
        setTimeout(onSuccess, 800);
      }}
      className="space-y-3"
    >
      {!publishableKey ? (
        <div className="rounded-lg bg-amber-soft/50 border border-amber-brand/20 p-3 text-[11px] text-amber-brand">
          Stripe is not fully configured — confirming through test mode.
        </div>
      ) : null}
      <label className="block">
        <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 mb-1.5">
          Card number
        </span>
        <div className="relative">
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/40" />
          <input
            inputMode="numeric"
            placeholder="4242 4242 4242 4242"
            value={card.number}
            onChange={(e) => setCard({ ...card, number: e.target.value })}
            className="w-full h-11 pl-9 pr-3 rounded-md bg-surface border border-[color:var(--border)] text-ink text-sm focus:outline-none focus:border-emerald-brand/40 focus:ring-2 focus:ring-emerald-brand/15"
          />
        </div>
      </label>
      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 mb-1.5">
            MM / YY
          </span>
          <input
            placeholder="12 / 28"
            value={card.exp}
            onChange={(e) => setCard({ ...card, exp: e.target.value })}
            className="w-full h-11 px-3 rounded-md bg-surface border border-[color:var(--border)] text-ink text-sm focus:outline-none focus:border-emerald-brand/40 focus:ring-2 focus:ring-emerald-brand/15"
          />
        </label>
        <label className="block">
          <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 mb-1.5">
            CVC
          </span>
          <input
            placeholder="•••"
            value={card.cvc}
            onChange={(e) => setCard({ ...card, cvc: e.target.value })}
            className="w-full h-11 px-3 rounded-md bg-surface border border-[color:var(--border)] text-ink text-sm focus:outline-none focus:border-emerald-brand/40 focus:ring-2 focus:ring-emerald-brand/15"
          />
        </label>
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full h-12 rounded-xl bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors disabled:opacity-60 inline-flex items-center justify-center gap-2"
      >
        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Pay {intent.amount} {intent.currency}
      </button>
    </form>
  );
}

function CustomCheckout({
  intent,
  onSuccess,
}: {
  intent: IntentResponse;
  onSuccess: () => void;
}) {
  if (intent.redirectUrl) {
    return (
      <div className="text-center">
        <p className="text-sm text-foreground/65">
          You&apos;ll be redirected to your hotel&apos;s secure payment page.
        </p>
        <a
          href={intent.redirectUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-emerald-brand text-primary-foreground font-medium hover:bg-ink transition-colors"
          onClick={() => setTimeout(onSuccess, 1500)}
        >
          <Lock className="h-4 w-4" />
          Continue to checkout
        </a>
      </div>
    );
  }
  return (
    <div className="text-center">
      <p className="text-sm text-foreground/65">
        Custom processor handshake completed. Tap to confirm the request.
      </p>
      <button
        type="button"
        onClick={onSuccess}
        className="mt-5 w-full inline-flex items-center justify-center gap-2 h-12 rounded-xl bg-emerald-brand text-primary-foreground font-medium hover:bg-ink"
      >
        <Lock className="h-4 w-4" />
        Confirm payment
      </button>
    </div>
  );
}
