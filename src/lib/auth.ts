import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

const secret = process.env.NEXTAUTH_SECRET
if (process.env.NODE_ENV === 'production' && !secret) {
  console.error(
    '❌ NEXTAUTH_SECRET is not set. Set it in Railway (or your host) to fix /api/auth/session 500 errors. See ADMIN_SETUP.md.'
  )
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days (Credentials works best with JWT)
  secret: secret || (process.env.NODE_ENV === 'production' ? undefined : 'dev-secret-change-in-production'),
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user?.passwordHash) return null
        const ok = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!ok) return null
        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session: updateSession }) {
      if (user) {
        token.id = user.id
        token.role = (user as { role?: string }).role
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }
      if (trigger === 'update' && updateSession?.user) {
        token.name = updateSession.user.name ?? token.name
        token.picture = updateSession.user.image ?? token.picture
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
        (session.user as { role?: string }).role = token.role as string
        session.user.name = (token.name as string) ?? null
        session.user.email = (token.email as string) ?? null
        session.user.image = (token.picture as string) ?? null
      }
      return session
    },
  },
}
