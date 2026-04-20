import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const NOTIFY_EMAILS = [
  "itadmit@gmail.com",
  "hotelxapp@gmail.com",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hotelName, contactPerson, email, phone, country, city, rooms } =
      body as Record<string, string>;

    if (!hotelName || !contactPerson || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const details = [
      ["Hotel", hotelName],
      ["Contact", contactPerson],
      ["Email", email],
      phone ? ["Phone", phone] : null,
      country ? ["Country", country] : null,
      city ? ["City", city] : null,
      rooms ? ["Rooms", rooms] : null,
    ].filter(Boolean) as [string, string][];

    const rows = details
      .map(
        ([k, v]) =>
          `<tr><td style="padding:8px 12px;font-weight:600;color:#0e5240;white-space:nowrap;vertical-align:top;">${k}</td><td style="padding:8px 12px;">${v}</td></tr>`
      )
      .join("");

    const html = `<div style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;font-size:15px;line-height:1.6;">
<h2 style="margin:0 0 20px;font-size:22px;color:#0e5240;">New Demo Request</h2>
<table style="width:100%;border-collapse:collapse;background:#f7f3ec;border-radius:12px;overflow:hidden;">
${rows}
</table>
<p style="margin-top:20px;font-size:13px;color:#888;">Reply directly to this email to respond to ${contactPerson} at ${email}</p>
</div>`;

    const text = details.map(([k, v]) => `${k}: ${v}`).join("\n");

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const resend = new Resend(apiKey);
      const from =
        process.env.EMAIL_FROM || "HotelX <hello@hotelx.app>";

      for (const to of NOTIFY_EMAILS) {
        await resend.emails.send({
          from,
          to,
          subject: `🏨 Demo Request — ${hotelName} (${contactPerson})`,
          html,
          text: `New Demo Request\n\n${text}`,
          replyTo: email,
        });
      }
    } else {
      console.log("[SIMULATED] Demo request:", text);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
