"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Star,
  Power,
  CreditCard,
  Globe,
  Wallet,
  Sparkles,
  X,
  Wrench,
  PercentCircle,
} from "lucide-react";
import { DashboardPageHeader } from "@/components/dashboard/DashboardPageHeader";
import { DashboardPageLoading } from "@/components/dashboard/DashboardPageLoading";

type ProviderType = "STRIPE" | "PAYPAL" | "CUSTOM" | "MOCK";

type Provider = {
  id: string;
  type: ProviderType;
  displayName: string;
  isActive: boolean;
  isDefault: boolean;
  publicConfig: Record<string, string>;
  hasSecret: boolean;
};

type HotelMeta = {
  paymentsEnabled: boolean;
  defaultCurrency: string;
};

const PROVIDER_META: Record<
  ProviderType,
  {
    label: string;
    blurb: string;
    icon: typeof CreditCard;
    publicFields: { key: string; label: string; placeholder?: string }[];
    secretFields: { key: string; label: string; placeholder?: string }[];
    badge?: string;
  }
> = {
  STRIPE: {
    label: "Stripe",
    blurb: "Cards, wallets and 3DS via Stripe Elements.",
    icon: CreditCard,
    publicFields: [
      {
        key: "publishableKey",
        label: "Publishable key",
        placeholder: "pk_test_…",
      },
    ],
    secretFields: [
      { key: "secretKey", label: "Secret key", placeholder: "sk_test_…" },
      {
        key: "webhookSecret",
        label: "Webhook secret",
        placeholder: "whsec_…",
      },
    ],
  },
  PAYPAL: {
    label: "PayPal",
    blurb: "PayPal Orders v2 — beta, ships in the next release.",
    icon: Wallet,
    badge: "beta",
    publicFields: [
      { key: "clientId", label: "Client ID", placeholder: "Axx…" },
      { key: "mode", label: "Mode (sandbox|live)", placeholder: "sandbox" },
    ],
    secretFields: [
      { key: "clientSecret", label: "Client secret", placeholder: "EH…" },
    ],
  },
  CUSTOM: {
    label: "Custom processor",
    blurb:
      "Bring your own gateway. We sign every request with HMAC; the processor doesn't need to integrate with us.",
    icon: Globe,
    publicFields: [
      {
        key: "authorizeUrl",
        label: "Authorize URL",
        placeholder: "https://api.your-gateway.com/charge",
      },
      {
        key: "confirmUrl",
        label: "Confirm URL",
        placeholder: "https://api.your-gateway.com/confirm",
      },
    ],
    secretFields: [
      {
        key: "signingSecret",
        label: "HMAC signing secret",
        placeholder: "any 32+ char string",
      },
    ],
  },
  MOCK: {
    label: "Mock (demo)",
    blurb: "Auto-confirms in 1s. Useful for demos and dev.",
    icon: Sparkles,
    publicFields: [],
    secretFields: [],
  },
};

const TYPE_ORDER: ProviderType[] = ["STRIPE", "PAYPAL", "CUSTOM", "MOCK"];

export default function PaymentsPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [hotel, setHotel] = useState<HotelMeta>({
    paymentsEnabled: false,
    defaultCurrency: "USD",
  });
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [savingHotel, setSavingHotel] = useState(false);
  const [drawerType, setDrawerType] = useState<ProviderType | null>(null);
  const [creating, setCreating] = useState(false);
  const [testing, setTesting] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<
    Record<string, { ok: boolean; message: string }>
  >({});

  const meta = useMemo(
    () => (drawerType ? PROVIDER_META[drawerType] : null),
    [drawerType]
  );

  async function load(options?: { initial?: boolean }) {
    const isInitial = options?.initial ?? false;
    if (isInitial) {
      setIsInitialLoading(true);
    }
    setLoading(true);
    try {
      const res = await fetch("/api/payments/providers", { cache: "no-store" });
      const data = await res.json();
      setProviders(data.providers ?? []);
      setHotel(
        data.hotel ?? { paymentsEnabled: false, defaultCurrency: "USD" }
      );
    } finally {
      setLoading(false);
      if (isInitial) {
        setIsInitialLoading(false);
      }
    }
  }

  useEffect(() => {
    load({ initial: true });
  }, []);

  async function saveHotel(patch: Partial<HotelMeta>) {
    setSavingHotel(true);
    const next = { ...hotel, ...patch };
    setHotel(next);
    await fetch("/api/hotel", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    setSavingHotel(false);
  }

  async function setDefault(id: string) {
    await fetch(`/api/payments/providers/${id}/default`, { method: "POST" });
    await load();
  }

  async function toggleActive(p: Provider) {
    await fetch(`/api/payments/providers/${p.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !p.isActive }),
    });
    await load();
  }

  async function deleteProvider(id: string) {
    if (!confirm("Disconnect this provider?")) return;
    await fetch(`/api/payments/providers/${id}`, { method: "DELETE" });
    await load();
  }

  async function testProvider(id: string) {
    setTesting(id);
    setTestResult((prev) => {
      const { [id]: _omit, ...rest } = prev;
      void _omit;
      return rest;
    });
    const res = await fetch(`/api/payments/providers/${id}/test`, {
      method: "POST",
    });
    const data = await res.json();
    setTestResult((prev) => ({
      ...prev,
      [id]: { ok: Boolean(data.ok), message: String(data.message ?? "") },
    }));
    setTesting(null);
  }

  return (
    <div className="space-y-8">
      {isInitialLoading ? (
        <DashboardPageLoading variant="form" />
      ) : (
        <>
      <DashboardPageHeader
        eyebrow="Hotel · payments"
        title="Payments"
        description="Connect any processor — Stripe, PayPal, or your own gateway. Guests pay before the request lands in the ops queue."
      />

      {/* 0% promo banner */}
      <div className="relative overflow-hidden rounded-xl border border-amber-brand/25 bg-amber-soft/60">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-amber-brand/15 blur-2xl pointer-events-none" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5">
          <span className="inline-flex h-10 w-10 rounded-lg bg-amber-brand text-white items-center justify-center shrink-0">
            <PercentCircle className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="leading-tight flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-medium text-ink text-[15px]">
                0% transaction fees{" "}
                <span className="display-italic text-amber-brand">— launch promo.</span>
              </p>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-amber-brand bg-white/60 px-1.5 py-0.5 rounded-full border border-amber-brand/20">
                limited time
              </span>
            </div>
            <p className="text-xs text-foreground/65 mt-1">
              We don&apos;t take a cut of your guests&apos; spend. You pay only
              your processor&apos;s standard rate (e.g. Stripe ~2.9% + 30¢) —
              HotelX adds nothing on top.
            </p>
          </div>
        </div>
      </div>

      {/* Global toggle */}
      <section className="card-elev p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="eyebrow">Status</p>
            <h3 className="font-display text-xl text-ink mt-1">
              Accept payments
            </h3>
            <p className="text-sm text-foreground/60 mt-1 max-w-md">
              Master switch. When off, every service is treated as free —
              guests can request without a card.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={hotel.defaultCurrency}
              onChange={(e) => saveHotel({ defaultCurrency: e.target.value })}
              className="h-9 rounded-md border border-[color:var(--border)] bg-background px-3 text-sm text-ink"
              disabled={savingHotel}
            >
              {["USD", "EUR", "GBP", "ILS"].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <Toggle
              checked={hotel.paymentsEnabled}
              onChange={(v) => saveHotel({ paymentsEnabled: v })}
              disabled={savingHotel}
            />
          </div>
        </div>
      </section>

      {/* Providers list */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="eyebrow">Connected providers</p>
          <span className="font-mono text-[10px] text-foreground/40">
            {providers.length} / 4
          </span>
        </div>

        {loading ? (
          <div className="card-surface p-6 flex items-center justify-center text-foreground/60">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Loading…
          </div>
        ) : providers.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[color:var(--border)] p-8 text-center">
            <CreditCard className="h-7 w-7 mx-auto text-foreground/40" />
            <p className="mt-3 text-sm text-foreground/60">
              No providers yet. Add one below to start collecting payments.
            </p>
          </div>
        ) : (
          <ul className="space-y-2.5">
            {providers.map((p) => {
              const m = PROVIDER_META[p.type];
              const Icon = m.icon;
              const last = testResult[p.id];
              return (
                <li
                  key={p.id}
                  className="card-surface p-4 flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <span
                    className={`inline-flex h-10 w-10 rounded-lg items-center justify-center shrink-0 ${
                      p.isDefault
                        ? "bg-primary text-primary-foreground"
                        : "bg-surface text-foreground/70"
                    }`}
                  >
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </span>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-ink truncate">
                        {p.displayName}
                      </p>
                      <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/50">
                        {m.label}
                      </span>
                      {p.isDefault ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-mono text-[9px] uppercase tracking-[0.16em]">
                          <Star className="h-2.5 w-2.5" />
                          default
                        </span>
                      ) : null}
                      {!p.isActive ? (
                        <span className="px-1.5 py-0.5 rounded-full bg-foreground/10 text-foreground/55 font-mono text-[9px] uppercase tracking-[0.16em]">
                          off
                        </span>
                      ) : null}
                    </div>
                    {last ? (
                      <p
                        className={`mt-1 inline-flex items-center gap-1.5 text-[11px] ${
                          last.ok ? "text-emerald-brand" : "text-clay"
                        }`}
                      >
                        {last.ok ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <AlertTriangle className="h-3 w-3" />
                        )}
                        {last.message}
                      </p>
                    ) : (
                      <p className="text-[11px] text-foreground/45 mt-1">
                        {m.blurb}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => testProvider(p.id)}
                      disabled={testing === p.id}
                      className="h-8 px-3 rounded-md border border-[color:var(--border)] text-xs text-ink hover:bg-surface inline-flex items-center gap-1.5 disabled:opacity-50"
                    >
                      {testing === p.id ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : (
                        <Wrench className="h-3 w-3" />
                      )}
                      Test
                    </button>
                    {!p.isDefault ? (
                      <button
                        type="button"
                        onClick={() => setDefault(p.id)}
                        className="h-8 px-3 rounded-md text-xs text-primary hover:bg-primary/10 inline-flex items-center gap-1.5"
                      >
                        <Star className="h-3 w-3" />
                        Set default
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => toggleActive(p)}
                      title={p.isActive ? "Disable" : "Enable"}
                      className="h-8 w-8 rounded-md text-foreground/60 hover:bg-surface flex items-center justify-center"
                    >
                      <Power className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteProvider(p.id)}
                      title="Disconnect"
                      className="h-8 w-8 rounded-md text-clay hover:bg-clay/10 flex items-center justify-center"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* Add provider grid */}
      <section className="space-y-3">
        <p className="eyebrow">Add a provider</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {TYPE_ORDER.map((type) => {
            const m = PROVIDER_META[type];
            const Icon = m.icon;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setDrawerType(type)}
                className="card-surface p-4 text-left hover:border-primary/40 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex h-9 w-9 rounded-lg bg-surface text-foreground/70 items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                    <Icon className="h-4 w-4" strokeWidth={2} />
                  </span>
                  <Plus className="h-4 w-4 text-foreground/40 group-hover:text-primary transition-colors" />
                </div>
                <p className="mt-3 font-medium text-ink">
                  {m.label}
                  {m.badge ? (
                    <span className="ml-2 font-mono text-[9px] uppercase tracking-[0.16em] text-amber-brand">
                      {m.badge}
                    </span>
                  ) : null}
                </p>
                <p className="text-[11px] text-foreground/55 mt-1 leading-snug">
                  {m.blurb}
                </p>
              </button>
            );
          })}
        </div>
      </section>

      {drawerType && meta ? (
        <ProviderDrawer
          type={drawerType}
          meta={meta}
          creating={creating}
          onClose={() => setDrawerType(null)}
          onSubmit={async (form) => {
            setCreating(true);
            await fetch("/api/payments/providers", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...form, type: drawerType }),
            });
            setCreating(false);
            setDrawerType(null);
            await load();
          }}
        />
      ) : null}
        </>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors disabled:opacity-50 ${
        checked ? "bg-primary" : "bg-foreground/20"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

function ProviderDrawer({
  type,
  meta,
  creating,
  onClose,
  onSubmit,
}: {
  type: ProviderType;
  meta: (typeof PROVIDER_META)[ProviderType];
  creating: boolean;
  onClose: () => void;
  onSubmit: (form: {
    displayName: string;
    isDefault: boolean;
    publicConfig: Record<string, string>;
    secretConfig: Record<string, string>;
  }) => void;
}) {
  const [displayName, setDisplayName] = useState(meta.label);
  const [isDefault, setIsDefault] = useState(false);
  const [publicConfig, setPublicConfig] = useState<Record<string, string>>({});
  const [secretConfig, setSecretConfig] = useState<Record<string, string>>({});

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto h-full w-full max-w-md bg-background border-l border-[color:var(--border)] shadow-2xl flex flex-col">
        <div className="px-5 h-14 border-b border-[color:var(--border)] flex items-center justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-foreground/55">
              Connect provider
            </p>
            <p className="text-sm font-medium text-ink">{meta.label}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-9 w-9 rounded-md hover:bg-surface flex items-center justify-center text-foreground/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
          <p className="text-xs text-foreground/60 leading-relaxed">
            {meta.blurb}
          </p>

          <Field
            label="Display name"
            value={displayName}
            onChange={setDisplayName}
            placeholder={meta.label}
          />

          {meta.publicFields.length > 0 ? (
            <fieldset className="space-y-3">
              <legend className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                Public configuration
              </legend>
              {meta.publicFields.map((f) => (
                <Field
                  key={f.key}
                  label={f.label}
                  placeholder={f.placeholder}
                  value={publicConfig[f.key] ?? ""}
                  onChange={(v) =>
                    setPublicConfig((prev) => ({ ...prev, [f.key]: v }))
                  }
                />
              ))}
            </fieldset>
          ) : null}

          {meta.secretFields.length > 0 ? (
            <fieldset className="space-y-3">
              <legend className="font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55">
                Secrets · encrypted at rest
              </legend>
              {meta.secretFields.map((f) => (
                <Field
                  key={f.key}
                  label={f.label}
                  placeholder={f.placeholder}
                  type="password"
                  value={secretConfig[f.key] ?? ""}
                  onChange={(v) =>
                    setSecretConfig((prev) => ({ ...prev, [f.key]: v }))
                  }
                />
              ))}
            </fieldset>
          ) : null}

          <label className="flex items-center gap-2 text-sm text-ink select-none cursor-pointer">
            <input
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              className="h-4 w-4 rounded border-[color:var(--border)] accent-[color:var(--primary)]"
            />
            Set as default provider
          </label>

          {type === "MOCK" ? (
            <p className="rounded-lg bg-amber-soft/50 border border-amber-brand/20 p-3 text-[11px] text-amber-brand leading-snug">
              Mock provider auto-confirms payments. Use for demos only.
            </p>
          ) : null}

          {type === "PAYPAL" ? (
            <p className="rounded-lg bg-amber-soft/50 border border-amber-brand/20 p-3 text-[11px] text-amber-brand leading-snug">
              Beta — PayPal flow ships in the next release. The provider will
              be saved and listed but checkout returns a friendly error.
            </p>
          ) : null}
        </div>

        <div className="px-5 py-4 border-t border-[color:var(--border)] flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-9 px-4 rounded-md text-sm text-ink hover:bg-surface"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={creating || !displayName.trim()}
            onClick={() =>
              onSubmit({
                displayName: displayName.trim(),
                isDefault,
                publicConfig,
                secretConfig,
              })
            }
            className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Save provider
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 mb-1.5">
        {label}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-10 px-3 rounded-md bg-surface border border-[color:var(--border)] text-ink text-sm placeholder:text-foreground/40 focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
      />
    </label>
  );
}
