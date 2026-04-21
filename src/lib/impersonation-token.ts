import { createHmac, timingSafeEqual } from "crypto";

const TTL_SECONDS = 120;

function superAdminEmails(): string[] {
  return (process.env.SUPER_ADMIN_EMAILS ?? "yogev@itadmit.co.il")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

function secret(): string {
  return process.env.NEXTAUTH_SECRET ?? "";
}

function base64UrlEncode(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(s: string): Buffer {
  const pad = 4 - (s.length % 4);
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + (pad < 4 ? "=".repeat(pad) : "");
  return Buffer.from(b64, "base64");
}

export type ImpersonationPayload = {
  targetUserId: string;
  adminEmail: string;
  exp: number;
};

export function createImpersonationToken(
  adminEmail: string,
  targetUserId: string
): string | null {
  const key = secret();
  if (!key) return null;

  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  const payload: ImpersonationPayload = {
    targetUserId,
    adminEmail: adminEmail.toLowerCase(),
    exp,
  };
  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(Buffer.from(payloadJson, "utf8"));
  const sig = createHmac("sha256", key).update(payloadB64).digest();
  const sigB64 = base64UrlEncode(sig);
  return `${payloadB64}.${sigB64}`;
}

export function verifyImpersonationToken(
  token: string
): ImpersonationPayload | null {
  const key = secret();
  if (!key || !token.includes(".")) return null;

  const [payloadB64, sigB64] = token.split(".", 2);
  if (!payloadB64 || !sigB64) return null;

  const expectedSig = createHmac("sha256", key).update(payloadB64).digest();
  let providedSig: Buffer;
  try {
    providedSig = base64UrlDecode(sigB64);
  } catch {
    return null;
  }

  if (
    expectedSig.length !== providedSig.length ||
    !timingSafeEqual(expectedSig, providedSig)
  ) {
    return null;
  }

  let payload: ImpersonationPayload;
  try {
    payload = JSON.parse(
      base64UrlDecode(payloadB64).toString("utf8")
    ) as ImpersonationPayload;
  } catch {
    return null;
  }

  if (
    typeof payload.targetUserId !== "string" ||
    typeof payload.adminEmail !== "string" ||
    typeof payload.exp !== "number"
  ) {
    return null;
  }

  if (Math.floor(Date.now() / 1000) > payload.exp) return null;

  if (!superAdminEmails().includes(payload.adminEmail.toLowerCase())) {
    return null;
  }

  return payload;
}
