import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'
import crypto from 'crypto'

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
        signInToken: { label: '2FA sign-in token', type: 'text' },
      },
      async authorize(credentials) {
        const signInToken = credentials?.signInToken as string | undefined
        if (signInToken) {
          const record = await prisma.authPendingToken.findUnique({
            where: { token: signInToken },
          })
          if (!record || record.type !== '2fa_success' || record.expiresAt < new Date()) {
            return null
          }
          await prisma.authPendingToken.delete({ where: { id: record.id } })
          const user = await prisma.user.findUnique({
            where: { id: record.userId },
            include: { roles: true },
          })
          if (!user) return null
          const roles = user.roles?.length ? user.roles.map((r) => r.role) : [user.role]
          return {
            id: user.id,
            email: user.email ?? undefined,
            name: user.name ?? undefined,
            image: user.image ?? undefined,
            role: roles[0] ?? user.role,
            roles,
          }
        }

        if (!credentials?.email || !credentials?.password) return null
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { roles: true },
        })
        if (!user?.passwordHash) return null
        const ok = await bcrypt.compare(credentials.password, user.passwordHash)
        if (!ok) return null

        if (user.twoFactorEnabled && user.twoFactorSecret) {
          const token = crypto.randomBytes(32).toString('hex')
          const expiresAt = new Date()
          expiresAt.setMinutes(expiresAt.getMinutes() + 5)
          await prisma.authPendingToken.create({
            data: { token, userId: user.id, type: '2fa_pending', expiresAt },
          })
          const err = new Error(JSON.stringify({ code: 'Needs2FA', token })) as Error & { type?: string }
          err.type = 'CredentialsSignin'
          throw err
        }

        const roles = user.roles?.length ? user.roles.map((r) => r.role) : [user.role]
        return {
          id: user.id,
          email: user.email ?? undefined,
          name: user.name ?? undefined,
          image: user.image ?? undefined,
          role: roles[0] ?? user.role,
          roles,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session: updateSession }) {
      if (user) {
        token.id = user.id
        const u = user as { role?: string; roles?: string[] }
        token.role = u.role
        token.roles = u.roles ?? (u.role ? [u.role] : [])
        token.name = user.name ?? undefined
        token.email = user.email ?? undefined
        token.picture = user.image ?? undefined
      }
      if (trigger === 'update' && updateSession?.user) {
        token.name = updateSession.user.name ?? token.name ?? undefined
        token.picture = updateSession.user.image ?? token.picture ?? undefined
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string
        (session.user as { role?: string }).role = token.role as string
        (session.user as { roles?: string[] }).roles = (token.roles as string[]) ?? []
        session.user.name = (token.name as string) ?? null
        session.user.email = (token.email as string) ?? null
        session.user.image = (token.picture as string) ?? null
      }
      return session
    },
  },
}
