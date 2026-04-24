import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { ApiAuthError, requireSessionUser } from "@/lib/server-auth";
import { getR2Client, isR2Configured, r2PublicUrl, R2_BUCKET } from "@/lib/r2";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Map<string, string>([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const ALLOWED_KINDS = new Set(["service", "logo", "amenity"]);

export async function POST(request: Request) {
  try {
    const user = await requireSessionUser();

    if (!isR2Configured()) {
      return NextResponse.json(
        { error: "Object storage is not configured on the server." },
        { status: 503 }
      );
    }

    const form = await request.formData();
    const file = form.get("file");
    const rawKind = form.get("kind");
    const kind = typeof rawKind === "string" && ALLOWED_KINDS.has(rawKind) ? rawKind : "service";

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = ALLOWED.get(file.type);
    if (!ext) {
      return NextResponse.json(
        { error: "Only JPEG, PNG, WebP, or GIF images are allowed." },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `File too large. Max ${Math.round(MAX_BYTES / 1024 / 1024)}MB.` },
        { status: 413 }
      );
    }

    const key = `${kind}/${user.hotelId}/${randomUUID()}.${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());

    await getR2Client().send(
      new PutObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
        Body: buffer,
        ContentType: file.type,
        CacheControl: "public, max-age=31536000, immutable",
      })
    );

    return NextResponse.json({ url: r2PublicUrl(key), key });
  } catch (error) {
    if (error instanceof ApiAuthError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("R2 upload failed", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
