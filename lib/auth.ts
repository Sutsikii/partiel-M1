import type { NextAuthConfig, Session, User as NextAuthUser } from "next-auth"
import type { JWT } from "next-auth/jwt"
import CredentialsProvider from "next-auth/providers/credentials"
import NextAuth from "next-auth"
import { prisma } from "./prisma"

declare module "next-auth" {
  interface User {
    role: string
  }
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    role?: string
  }
}


export const authOptions: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })

        if (!user) {
          return null
        }

        if (credentials.password !== "password123") {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT, user?: NextAuthUser }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: Session, token: JWT }) {
      if (token) {
        session.user.id = token.id || ""
        session.user.role = token.role || ""
      }
      return session
    }
  },
  pages: {
    signIn: "/auth/signin"
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions) 