import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f7f3ec",
          position: "relative",
        }}
      >
        {/* The square */}
        <div
          style={{
            width: 148,
            height: 148,
            borderRadius: 36,
            background: "#0e5240",
            color: "#fbf8f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 104,
            fontFamily: "serif",
            fontWeight: 500,
            letterSpacing: "-0.04em",
          }}
        >
          H
        </div>
        {/* Online dot */}
        <div
          style={{
            position: "absolute",
            bottom: 14,
            right: 14,
            width: 32,
            height: 32,
            borderRadius: 999,
            background: "#10b981",
            border: "5px solid #f7f3ec",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
