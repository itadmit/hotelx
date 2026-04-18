"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Heart,
  HeartCrack,
  Key,
  Loader2,
  Mail,
  RefreshCcw,
  Save,
  Sparkles,
  Undo2,
  UserPlus,
} from "lucide-react";
import { DashboardPageHeader } from "./DashboardPageHeader";
import { cn } from "@/lib/utils";
import { EmailTemplatesSkeleton } from "./EmailTemplatesSkeleton";

type TemplateKind =
  | "FEEDBACK_THANKS"
  | "FEEDBACK_APOLOGY"
  | "PASSWORD_RESET"
  | "TEAM_INVITE";

type Template = {
  kind: TemplateKind;
  isOverride: boolean;
  isActive: boolean;
  subject: string;
  heading: string;
  body: string;
  ctaLabel: string | null;
  ctaUrl: string | null;
};

const KIND_META: Record<
  TemplateKind,
  { label: string; description: string; icon: typeof Mail; tone: string; vars: string[] }
> = {
  FEEDBACK_THANKS: {
    label: "Thank you (positive feedback)",
    description: "Sent automatically when a guest leaves a high rating.",
    icon: Heart,
    tone: "bg-emerald-soft text-emerald-brand",
    vars: ["guestName", "hotelName", "serviceName", "primaryReviewUrl"],
  },
  FEEDBACK_APOLOGY: {
    label: "Apology (low feedback)",
    description: "Sent when a guest leaves a low rating; pairs with a recovery task.",
    icon: HeartCrack,
    tone: "bg-amber-soft text-amber-brand",
    vars: ["guestName", "hotelName", "serviceName", "rating"],
  },
  PASSWORD_RESET: {
    label: "Password reset",
    description: "Used by the team-side password recovery flow.",
    icon: Key,
    tone: "bg-surface text-foreground/60",
    vars: ["email", "resetUrl"],
  },
  TEAM_INVITE: {
    label: "Team invite",
    description: "Sent to new staff members when added from the Team page.",
    icon: UserPlus,
    tone: "bg-surface text-foreground/60",
    vars: ["guestName", "hotelName", "tempPassword", "loginUrl"],
  },
};

export function EmailTemplatesClient() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [activeKind, setActiveKind] = useState<TemplateKind>("FEEDBACK_THANKS");
  const [draft, setDraft] = useState<Template | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  async function load(options?: { initial?: boolean }) {
    const isInitial = options?.initial ?? false;
    if (isInitial) setIsInitialLoading(true);
    setLoading(true);
    try {
      const res = await fetch("/api/email-templates", { cache: "no-store" });
      const data = await res.json();
      setTemplates(data.templates ?? []);
    } finally {
      setLoading(false);
      if (isInitial) setIsInitialLoading(false);
    }
  }

  useEffect(() => {
    load({ initial: true });
  }, []);

  useEffect(() => {
    const t = templates.find((x) => x.kind === activeKind) ?? null;
    setDraft(t ? { ...t } : null);
  }, [activeKind, templates]);

  const isDirty = useMemo(() => {
    if (!draft) return false;
    const current = templates.find((t) => t.kind === draft.kind);
    if (!current) return true;
    return (
      current.subject !== draft.subject ||
      current.heading !== draft.heading ||
      current.body !== draft.body ||
      (current.ctaLabel ?? "") !== (draft.ctaLabel ?? "") ||
      (current.ctaUrl ?? "") !== (draft.ctaUrl ?? "")
    );
  }, [draft, templates]);

  async function save() {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch("/api/email-templates", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: draft.kind,
          subject: draft.subject,
          heading: draft.heading,
          body: draft.body,
          ctaLabel: draft.ctaLabel || null,
          ctaUrl: draft.ctaUrl || null,
          isActive: true,
        }),
      });
      if (res.ok) {
        setSavedAt(Date.now());
        await load();
      }
    } finally {
      setSaving(false);
    }
  }

  async function reset() {
    if (!draft) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/email-templates/${draft.kind}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSavedAt(Date.now());
        await load();
      }
    } finally {
      setSaving(false);
    }
  }

  if (isInitialLoading) {
    return <EmailTemplatesSkeleton />;
  }

  return (
    <div className="space-y-7 pb-12">
      <DashboardPageHeader
        eyebrow="Communication · email"
        title="Email templates"
        description="Edit the messages your guests and team receive. Variables in {{double braces}} are replaced when the email is sent."
      >
        <button
          type="button"
          onClick={() => load()}
          className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-[color:var(--border)] bg-card text-xs text-ink hover:bg-surface transition-colors"
        >
          <RefreshCcw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Refresh
        </button>
      </DashboardPageHeader>

      {loading && templates.length === 0 ? (
        <div className="card-surface p-10 flex items-center justify-center text-sm text-foreground/55">
          <Loader2 className="h-4 w-4 animate-spin mr-2" /> Loading templates…
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <nav className="card-surface p-2 h-fit">
            <ul className="space-y-0.5">
              {(Object.keys(KIND_META) as TemplateKind[]).map((kind) => {
                const meta = KIND_META[kind];
                const Icon = meta.icon;
                const tpl = templates.find((t) => t.kind === kind);
                const isActive = activeKind === kind;
                return (
                  <li key={kind}>
                    <button
                      type="button"
                      onClick={() => setActiveKind(kind)}
                      className={cn(
                        "w-full text-left flex items-start gap-3 p-3 rounded-md transition-colors",
                        isActive
                          ? "bg-background text-ink"
                          : "text-foreground/70 hover:bg-background hover:text-ink"
                      )}
                    >
                      <span
                        className={cn(
                          "inline-flex h-8 w-8 items-center justify-center rounded-md shrink-0",
                          meta.tone
                        )}
                      >
                        <Icon className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium leading-tight truncate">
                          {meta.label}
                        </span>
                        <span className="block text-[11px] text-foreground/50 mt-0.5">
                          {tpl?.isOverride ? "Custom" : "Default"}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {draft ? (
            <Editor
              draft={draft}
              setDraft={setDraft}
              save={save}
              reset={reset}
              isDirty={isDirty}
              saving={saving}
              savedAt={savedAt}
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

function Editor({
  draft,
  setDraft,
  save,
  reset,
  isDirty,
  saving,
  savedAt,
}: {
  draft: Template;
  setDraft: (next: Template) => void;
  save: () => void;
  reset: () => void;
  isDirty: boolean;
  saving: boolean;
  savedAt: number | null;
}) {
  const meta = KIND_META[draft.kind];
  const Icon = meta.icon;

  function patch(p: Partial<Template>) {
    setDraft({ ...draft, ...p });
  }

  return (
    <div className="space-y-5">
      <div className="card-surface p-5">
        <div className="flex items-start gap-3">
          <span
            className={cn(
              "inline-flex h-10 w-10 items-center justify-center rounded-lg shrink-0",
              meta.tone
            )}
          >
            <Icon className="h-5 w-5" strokeWidth={2} />
          </span>
          <div className="min-w-0">
            <h2 className="font-display text-lg text-ink leading-tight">
              {meta.label}
            </h2>
            <p className="text-sm text-foreground/60 mt-0.5">{meta.description}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {meta.vars.map((v) => (
                <code
                  key={v}
                  className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface border border-[color:var(--border)] text-foreground/70"
                >
                  {`{{${v}}}`}
                </code>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="card-surface p-5 space-y-4">
          <Field label="Subject">
            <input
              type="text"
              value={draft.subject}
              onChange={(e) => patch({ subject: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-[color:var(--border)] bg-surface text-sm text-ink focus:outline-none focus:border-emerald-brand/40"
            />
          </Field>
          <Field label="Heading">
            <input
              type="text"
              value={draft.heading}
              onChange={(e) => patch({ heading: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-[color:var(--border)] bg-surface text-sm text-ink focus:outline-none focus:border-emerald-brand/40"
            />
          </Field>
          <Field label="Body">
            <textarea
              value={draft.body}
              onChange={(e) => patch({ body: e.target.value })}
              rows={9}
              className="w-full px-3 py-2.5 rounded-md border border-[color:var(--border)] bg-surface text-sm text-ink resize-y focus:outline-none focus:border-emerald-brand/40 font-mono leading-relaxed"
            />
          </Field>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Button label (optional)">
              <input
                type="text"
                value={draft.ctaLabel ?? ""}
                onChange={(e) => patch({ ctaLabel: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[color:var(--border)] bg-surface text-sm text-ink focus:outline-none focus:border-emerald-brand/40"
              />
            </Field>
            <Field label="Button URL (optional)">
              <input
                type="text"
                value={draft.ctaUrl ?? ""}
                onChange={(e) => patch({ ctaUrl: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[color:var(--border)] bg-surface text-sm text-ink font-mono focus:outline-none focus:border-emerald-brand/40"
              />
            </Field>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <button
              type="button"
              onClick={save}
              disabled={!isDirty || saving}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-ink transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
              {saving ? "Saving…" : "Save changes"}
            </button>
            {draft.isOverride ? (
              <button
                type="button"
                onClick={reset}
                disabled={saving}
                className="inline-flex items-center gap-2 h-9 px-3 rounded-md border border-[color:var(--border)] bg-card text-xs text-foreground/70 hover:bg-surface hover:text-ink transition-colors disabled:opacity-60"
              >
                <Undo2 className="h-3.5 w-3.5" /> Reset to default
              </button>
            ) : null}
            {savedAt ? (
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-emerald-brand">
                Saved
              </span>
            ) : null}
          </div>
        </div>

        <div className="card-surface p-5">
          <div className="eyebrow flex items-center gap-1.5 mb-3">
            <Sparkles className="h-3 w-3 text-emerald-brand" />
            Live preview
          </div>
          <Preview draft={draft} />
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block font-mono text-[10px] uppercase tracking-[0.18em] text-foreground/55 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function Preview({ draft }: { draft: Template }) {
  return (
    <div className="rounded-xl border border-[color:var(--border)] bg-card overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[color:var(--border)] bg-surface/60 font-mono text-[10px] uppercase tracking-[0.16em] text-foreground/55">
        Subject · {draft.subject || "(empty)"}
      </div>
      <div className="px-5 py-5">
        <h3 className="font-display text-xl text-ink leading-tight">
          {draft.heading || "Heading"}
        </h3>
        <div className="mt-3 space-y-3 text-sm text-foreground/80 leading-relaxed">
          {(draft.body || "").split(/\n{2,}/).map((p, i) => (
            <p key={i} className="whitespace-pre-wrap">
              {p || "—"}
            </p>
          ))}
        </div>
        {draft.ctaLabel && draft.ctaUrl ? (
          <div className="mt-4">
            <span className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-emerald-brand text-primary-foreground text-sm font-medium">
              {draft.ctaLabel}
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
