type RateLimitConfig = {
  windowMs: number
  max: number
}

type Entry = {
  count: number
  resetAt: number
}

const memoryStore = new Map<string, Entry>()

function getNow() {
  return Date.now()
}

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; retryAfterSeconds: number } {
  const now = getNow()
  const current = memoryStore.get(key)

  if (!current || current.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + config.windowMs })
    return { allowed: true, retryAfterSeconds: 0 }
  }

  if (current.count >= config.max) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((current.resetAt - now) / 1000),
    }
  }

  current.count += 1
  memoryStore.set(key, current)
  return { allowed: true, retryAfterSeconds: 0 }
}

export const RATE_LIMITS = {
  register: { windowMs: 15 * 60 * 1000, max: 5 },
  login: { windowMs: 15 * 60 * 1000, max: 10 },
} as const
