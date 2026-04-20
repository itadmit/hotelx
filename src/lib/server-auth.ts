import { auth } from "@/app/api/auth/[...nextauth]/route"

export class ApiAuthError extends Error {
  constructor(message = "Unauthorized") {
    super(message)
    this.name = "ApiAuthError"
  }
}

export async function requireSessionUser() {
  const session = await auth()

  if (!session?.user?.id) {
    throw new ApiAuthError("Unauthorized")
  }

  if (!session.user.hotelId) {
    throw new ApiAuthError("User is not connected to a hotel")
  }

  return session.user
}

const SUPER_ADMIN_EMAILS = (
  process.env.SUPER_ADMIN_EMAILS ?? "yogev@itadmit.co.il"
)
  .split(",")
  .map((e) => e.trim().toLowerCase())

export async function requireSuperAdmin() {
  const session = await auth()

  if (!session?.user?.id || !session.user.email) {
    throw new ApiAuthError("Unauthorized")
  }

  if (!SUPER_ADMIN_EMAILS.includes(session.user.email.toLowerCase())) {
    throw new ApiAuthError("Forbidden")
  }

  return session.user
}

export function isSuperAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  return SUPER_ADMIN_EMAILS.includes(email.toLowerCase())
}
