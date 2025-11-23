import "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      hotelId: string | null
      hotelSlug: string | null
    }
  }

  interface User {
    id: string
    email: string
    name: string | null
    role: string
    hotelId: string | null
    hotelSlug: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    hotelId: string | null
    hotelSlug: string | null
  }
}

