import { z } from "zod"

const MAX_DATA_URL_CHARS = 2_000_000
const MAX_URL_CHARS = 500_000

/** Optional service cover: HTTPS/HTTP URL or browser data URL (upload). */
export const zServiceImage = z
  .union([z.string(), z.null()])
  .optional()
  .superRefine((val, ctx) => {
    if (val === undefined || val === null) return
    const s = val.trim()
    if (s === "") return
    if (s.startsWith("data:image/")) {
      if (s.length > MAX_DATA_URL_CHARS) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image file is too large after upload",
        })
      }
      return
    }
    try {
      const u = new URL(s)
      if (u.protocol !== "http:" && u.protocol !== "https:") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Image must be an http(s) URL or an uploaded image",
        })
      }
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid image URL",
      })
    }
    if (!s.startsWith("data:image/") && s.length > MAX_URL_CHARS) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Image URL is too long",
      })
    }
  })

export function normalizeServiceImage(
  val: string | null | undefined
): string | null | undefined {
  if (val === undefined) return undefined
  if (val === null) return null
  const t = val.trim()
  return t === "" ? null : t
}
