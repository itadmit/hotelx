import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          position: "relative",
        }}
      >
        {/* The square */}
        <div
          style={{
            width: 54,
            height: 54,
            borderRadius: 14,
            background: "#0e5240",
            color: "#fbf8f1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 38,
            fontFamily: "serif",
            fontWeight: 500,
            letterSpacing: "-0.04em",
          }}
        >
          H
        </div>
        {/* Online dot — bottom-right, with a halo */}
        <div
          style={{
            position: "absolute",
            bottom: 4,
            right: 4,
            width: 14,
            height: 14,
            borderRadius: 999,
            background: "#0e5240",
            border: "2px solid #f7f3ec",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
