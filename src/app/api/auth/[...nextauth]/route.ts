import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"
import { IMPERSONATE_LOGIN_EMAIL } from "@/lib/impersonation-constants"
import { verifyImpersonationToken } from "@/lib/impersonation-token"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const emailRaw = String(credentials.email).toLowerCase()
          const password = credentials.password as string

          if (emailRaw === IMPERSONATE_LOGIN_EMAIL.toLowerCase()) {
            const payload = verifyImpersonationToken(password)
            if (!payload) return null

            const user = await prisma.user.findUnique({
              where: { id: payload.targetUserId },
              include: { hotel: true },
            })

            if (!user?.hotelId) return null

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role,
              hotelId: user.hotelId,
              hotelSlug: user.hotel?.slug ?? null,
              impersonatorEmail: payload.adminEmail,
            }
          }

          const headers = (request as Request | undefined)?.headers
          const forwardedFor = headers?.get("x-forwarded-for")
          const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown"
          const email = emailRaw
          const rate = checkRateLimit(`login:${ip}:${email}`, RATE_LIMITS.login)

          if (!rate.allowed) {
            return null
          }

          const user = await prisma.user.findUnique({
            where: {
              email
            },
            include: {
              hotel: true
            }
          })

          if (!user || !user.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            hotelId: user.hotelId,
            hotelSlug: user.hotel?.slug ?? null,
            impersonatorEmail: null,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.hotelId = user.hotelId ?? null
        token.hotelSlug = user.hotelSlug ?? null
        token.impersonatorEmail =
          (user as { impersonatorEmail?: string | null }).impersonatorEmail ??
          null
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.hotelId = (token.hotelId as string | null) ?? null
        session.user.hotelSlug = (token.hotelSlug as string | null) ?? null
        session.user.impersonatorEmail =
          (token.impersonatorEmail as string | null) ?? null
      }
      return session
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: {
    strategy: "jwt"
  },
  secret: process.env.NEXTAUTH_SECRET
})

export const { GET, POST } = handlers

