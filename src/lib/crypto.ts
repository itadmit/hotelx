import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "crypto";

const ALGO = "aes-256-gcm";
const IV_LEN = 12;
const TAG_LEN = 16;

function getKey(): Buffer {
  const raw = process.env.PAYMENT_SECRET_KEY;
  if (raw && raw.length >= 16) {
    if (/^[A-Za-z0-9+/=]+$/.test(raw) && raw.length >= 44) {
      try {
        const decoded = Buffer.from(raw, "base64");
        if (decoded.length === 32) return decoded;
      } catch {
        /* fall through */
      }
    }
    return createHash("sha256").update(raw).digest();
  }
  // Dev fallback: derive from NEXTAUTH_SECRET so encrypted blobs are stable
  // across restarts in local dev. NEVER rely on this in production — set
  // PAYMENT_SECRET_KEY to a real 32-byte base64 key.
  const fallback = process.env.NEXTAUTH_SECRET ?? "hotelx-dev-fallback-key";
  return createHash("sha256").update(fallback).digest();
}

export function encryptSecret(plaintext: string): string {
  if (!plaintext) return "";
  const key = getKey();
  const iv = randomBytes(IV_LEN);
  const cipher = createCipheriv(ALGO, key, iv);
  const ciphertext = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

export function decryptSecret(payload: string): string {
  if (!payload) return "";
  try {
    const buf = Buffer.from(payload, "base64");
    if (buf.length < IV_LEN + TAG_LEN) return "";
    const iv = buf.subarray(0, IV_LEN);
    const tag = buf.subarray(IV_LEN, IV_LEN + TAG_LEN);
    const ciphertext = buf.subarray(IV_LEN + TAG_LEN);
    const key = getKey();
    const decipher = createDecipheriv(ALGO, key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([
      decipher.update(ciphertext),
      decipher.final(),
    ]);
    return plaintext.toString("utf8");
  } catch {
    return "";
  }
}

export function encryptJson(value: unknown): string {
  return encryptSecret(JSON.stringify(value ?? {}));
}

export function decryptJson<T = Record<string, unknown>>(payload: string): T {
  const text = decryptSecret(payload);
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export function maskSecret(value: string | null | undefined): string {
  if (!value) return "";
  if (value.length <= 8) return "•".repeat(value.length);
  return `${value.slice(0, 4)}${"•".repeat(value.length - 8)}${value.slice(-4)}`;
}
