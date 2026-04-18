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
