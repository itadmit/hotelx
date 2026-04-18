/**
 * Render a Maison-styled HTML email from a template.
 *
 * Variables in the template body use the {{var}} syntax. Unknown
 * variables are replaced with an empty string.
 */
export type EmailTemplate = {
  subject: string;
  heading: string;
  body: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
};

export type EmailVariables = Record<string, string | number | null | undefined>;

function fill(template: string, vars: EmailVariables): string {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, key) => {
    const value = vars[key as string];
    if (value === undefined || value === null) return "";
    return String(value);
  });
}

export function renderTemplate(
  template: EmailTemplate,
  vars: EmailVariables
): { subject: string; html: string; text: string } {
  const subject = fill(template.subject, vars);
  const heading = fill(template.heading, vars);
  const body = fill(template.body, vars);
  const ctaLabel = template.ctaLabel ? fill(template.ctaLabel, vars) : null;
  const ctaUrl = template.ctaUrl ? fill(template.ctaUrl, vars) : null;

  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="margin:0 0 16px 0;font-family:'Manrope',-apple-system,system-ui,sans-serif;font-size:15px;line-height:1.6;color:#15201c;">${escapeHtml(
          p
        ).replace(/\n/g, "<br />")}</p>`
    )
    .join("");

  const cta =
    ctaLabel && ctaUrl
      ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px 0;">
          <tr><td style="border-radius:9999px;background:#0e5240;">
            <a href="${escapeAttr(ctaUrl)}"
               style="display:inline-block;padding:13px 26px;border-radius:9999px;
                      font-family:'Manrope',-apple-system,system-ui,sans-serif;
                      font-size:14px;font-weight:600;color:#f7f3ec;text-decoration:none;">
              ${escapeHtml(ctaLabel)}
            </a>
          </td></tr>
        </table>`
      : "";

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#f7f3ec;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f3ec;">
      <tr>
        <td align="center" style="padding:36px 16px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"
                 style="max-width:560px;background:#fbf8f1;border:1px solid rgba(12,23,21,0.08);
                        border-radius:18px;overflow:hidden;">
            <tr>
              <td style="padding:22px 28px 0 28px;">
                <span style="display:inline-flex;align-items:center;gap:8px;
                             font-family:'JetBrains Mono',ui-monospace,monospace;
                             font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
                             color:rgba(21,32,28,0.55);">
                  <span style="display:inline-block;width:18px;height:18px;border-radius:5px;
                               background:#0e5240;color:#f7f3ec;text-align:center;
                               font-family:Georgia,serif;font-size:12px;line-height:18px;">H</span>
                  HotelX
                </span>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 0 28px;">
                <h1 style="margin:0;font-family:Georgia,'Fraunces',serif;font-weight:500;
                           font-size:28px;line-height:1.15;letter-spacing:-0.01em;color:#0c1715;">
                  ${escapeHtml(heading)}
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 8px 28px;">
                ${paragraphs}
                ${cta}
              </td>
            </tr>
            <tr>
              <td style="padding:18px 28px 28px 28px;border-top:1px solid rgba(12,23,21,0.08);">
                <p style="margin:0;font-family:'JetBrains Mono',ui-monospace,monospace;
                          font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
                          color:rgba(21,32,28,0.45);">
                  Sent by HotelX · Concierge OS
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = `${heading}\n\n${body}${
    ctaLabel && ctaUrl ? `\n\n${ctaLabel}: ${ctaUrl}` : ""
  }`;

  return { subject, html, text };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttr(value: string): string {
  return escapeHtml(value);
}
