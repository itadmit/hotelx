"use client";

import { QRCodeSVG } from "qrcode.react";

export function RoomQRCode({ url }: { url: string }) {
  return (
    <div className="bg-white p-2 rounded-xl">
      <QRCodeSVG value={url} size={128} />
    </div>
  );
}

