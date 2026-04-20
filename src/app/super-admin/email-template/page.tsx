"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Save,
  RotateCcw,
  Eye,
  EyeOff,
  Loader2,
  Send,
  Trash2,
  CheckCircle,
} from "lucide-react";

type TemplateData = {
  subject: string;
  heading: string;
  body: string;
  ctaLabel: string;
  ctaUrl: string;
};

export default function EmailTemplatePage() {
  const [tpl, setTpl] = useState<TemplateData>({
    subject: "",
    heading: "",
    body: "",
    ctaLabel: "",
    ctaUrl: "",
  });
  const [previewHtml, setPreviewHtml] = useState("");
  const [hasOverride, setHasOverride] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [sendingTest, setSendingTest] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/super-admin/email-template");
    if (!res.ok) return;
    const data = await res.json();
    setTpl(data.template);
    setPreviewHtml(data.previewHtml);
    setHasOverride(data.hasOverride);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/super-admin/email-template", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tpl),
      });
      if (res.ok) {
        const data = await res.json();
        setPreviewHtml(data.previewHtml);
        setHasOverride(true);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleReset() {
    setDeleting(true);
    try {
      const res = await fetch("/api/super-admin/email-template", {
        method: "DELETE",
      });
      if (res.ok) {
        setHasOverride(false);
        await load();
      }
    } finally {
      setDeleting(false);
    }
  }

  async function handleSendTest() {
    setSendingTest(true);
    setTestSent(false);
    try {
      const res = await fetch("/api/super-admin/send-welcome", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "__test__" }),
      });
      if (!res.ok) {
        const usersRes = await fetch("/api/super-admin/users");
        if (usersRes.ok) {
          const users = await usersRes.json();
          const me = users.find(
            (u: { email: string }) =>
              u.email === "yogev@itadmit.co.il"
          );
          if (me) {
            const retry = await fetch("/api/super-admin/send-welcome", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ userId: me.id }),
            });
            if (retry.ok) setTestSent(true);
          }
        }
      } else {
        setTestSent(true);
      }
      setTimeout(() => setTestSent(false), 4000);
    } finally {
      setSendingTest(false);
    }
  }

  function updateField(field: keyof TemplateData, value: string) {
    setTpl((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  const fieldStyle =
    "w-full px-3 py-2.5 rounded-xl border border-[color:var(--border)] bg-card text-ink text-sm focus:outline-none focus:ring-2 focus:ring-emerald-brand/30 transition-shadow";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl tracking-tight text-ink">
            Welcome Email Template
          </h1>
          <p className="mt-1 text-sm text-foreground/60">
            Edit the email new users receive after signing up.
            {hasOverride && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-amber-soft text-amber-brand font-mono text-[10px] uppercase tracking-widest">
                Custom override active
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSendTest}
            disabled={sendingTest}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[color:var(--border)] bg-card text-ink text-xs font-medium hover:bg-surface transition-colors disabled:opacity-50"
          >
            {sendingTest ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : testSent ? (
              <CheckCircle className="h-3 w-3 text-emerald-brand" />
            ) : (
              <Send className="h-3 w-3" />
            )}
            {testSent ? "Sent!" : "Send test"}
          </button>
          {hasOverride && (
            <button
              onClick={handleReset}
              disabled={deleting}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[color:var(--border)] bg-card text-clay text-xs font-medium hover:bg-surface transition-colors disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3" />
              )}
              Reset to default
            </button>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-brand text-primary-foreground text-xs font-medium hover:bg-ink transition-colors disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : saved ? (
              <CheckCircle className="h-3 w-3" />
            ) : (
              <Save className="h-3 w-3" />
            )}
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-foreground/50 mb-1.5">
              Subject
            </label>
            <input
              type="text"
              value={tpl.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              className={fieldStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-foreground/50 mb-1.5">
              Heading
            </label>
            <input
              type="text"
              value={tpl.heading}
              onChange={(e) => updateField("heading", e.target.value)}
              className={fieldStyle}
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-foreground/50 mb-1.5">
              Body
            </label>
            <textarea
              rows={12}
              value={tpl.body}
              onChange={(e) => updateField("body", e.target.value)}
              className={`${fieldStyle} resize-y`}
            />
            <p className="mt-1 text-[11px] text-foreground/40">
              Use {"{{guestName}}"}, {"{{hotelName}}"}, {"{{email}}"},{" "}
              {"{{dashboardUrl}}"} as variables. Separate paragraphs with blank
              lines.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/50 mb-1.5">
                CTA Label
              </label>
              <input
                type="text"
                value={tpl.ctaLabel}
                onChange={(e) => updateField("ctaLabel", e.target.value)}
                className={fieldStyle}
              />
            </div>
            <div>
              <label className="block text-xs font-mono uppercase tracking-widest text-foreground/50 mb-1.5">
                CTA URL
              </label>
              <input
                type="text"
                value={tpl.ctaUrl}
                onChange={(e) => updateField("ctaUrl", e.target.value)}
                className={fieldStyle}
              />
            </div>
          </div>
        </div>

        {/* Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono uppercase tracking-widest text-foreground/50">
              Preview
            </span>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="inline-flex items-center gap-1 text-xs text-foreground/50 hover:text-ink transition-colors"
            >
              {showPreview ? (
                <EyeOff className="h-3 w-3" />
              ) : (
                <Eye className="h-3 w-3" />
              )}
              {showPreview ? "Hide" : "Show"}
            </button>
            <button
              onClick={() => {
                handleSave();
              }}
              className="inline-flex items-center gap-1 text-xs text-foreground/50 hover:text-ink transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              Refresh
            </button>
          </div>
          {showPreview && previewHtml ? (
            <div className="rounded-xl border border-[color:var(--border)] overflow-hidden bg-[#f7f3ec]">
              <iframe
                srcDoc={previewHtml}
                title="Email preview"
                className="w-full border-0"
                style={{ height: 620 }}
              />
            </div>
          ) : (
            <div className="rounded-xl border border-[color:var(--border)] bg-card flex items-center justify-center h-[620px] text-foreground/30 text-sm">
              Preview hidden
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
