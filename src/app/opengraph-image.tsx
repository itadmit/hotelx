import { ImageResponse } from "next/og";

export const alt = "HotelX — Concierge OS for hotels";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#f7f3ec",
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(14,82,64,0.10), transparent 55%), radial-gradient(circle at 85% 80%, rgba(185,107,42,0.10), transparent 55%)",
          padding: 80,
          fontFamily: "serif",
          color: "#0c1715",
          position: "relative",
        }}
      >
        {/* Subtle hairline frame */}
        <div
          style={{
            position: "absolute",
            inset: 24,
            border: "1px solid rgba(12,23,21,0.08)",
            borderRadius: 24,
          }}
        />

        {/* Logo lockup — same as the navbar */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 16,
              background: "#0e5240",
              color: "#fbf8f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
              fontWeight: 500,
              letterSpacing: "-0.04em",
              position: "relative",
            }}
          >
            H
            {/* online dot */}
            <div
              style={{
                position: "absolute",
                bottom: -5,
                right: -5,
                width: 18,
                height: 18,
                borderRadius: 999,
                background: "#10b981",
                border: "4px solid #f7f3ec",
                display: "flex",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              fontSize: 40,
              letterSpacing: "-0.02em",
              color: "#0c1715",
            }}
          >
            <span>Hotel</span>
            <span style={{ color: "#0e5240" }}>X</span>
          </div>
          <div
            style={{
              marginLeft: 8,
              fontFamily: "monospace",
              fontSize: 14,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(12,23,21,0.55)",
            }}
          >
            / Concierge OS
          </div>
        </div>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <div
            style={{
              fontSize: 88,
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#0c1715",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Turn every room into a</span>
            <span style={{ fontStyle: "italic", color: "#0e5240" }}>
              revenue channel.
            </span>
          </div>
          <div
            style={{
              fontFamily: "sans-serif",
              fontSize: 26,
              lineHeight: 1.4,
              color: "rgba(12,23,21,0.65)",
              maxWidth: 880,
            }}
          >
            QR concierge for hotels — lift in-room spend, raise your Booking
            score, cut calls to reception. Live in 48 hours.
          </div>
        </div>

        {/* Bottom strip — chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 40,
            fontFamily: "monospace",
            fontSize: 14,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 18px",
              borderRadius: 999,
              background: "#d4e3d9",
              color: "#0e5240",
            }}
          >
            14 languages
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 18px",
              borderRadius: 999,
              background: "#f0d9b8",
              color: "#b96b2a",
            }}
          >
            0% commission
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 18px",
              borderRadius: 999,
              background: "#fbf8f1",
              border: "1px solid rgba(12,23,21,0.10)",
              color: "rgba(12,23,21,0.65)",
            }}
          >
            Live in 48h
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
