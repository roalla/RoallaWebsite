import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import AzureADProvider from 'next-auth/providers/azure-ad'
import AppleProvider from 'next-auth/providers/apple'
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

/** Generic OpenID Connect provider for enterprise SSO (Okta, Auth0, Keycloak, etc.) */
function createSSOProvider(): NextAuthOptions['providers'][number] | null {
  const issuer = process.env.SSO_ISSUER?.replace(/\/$/, '')
  const clientId = process.env.SSO_CLIENT_ID
  const clientSecret = process.env.SSO_CLIENT_SECRET
  const name = process.env.SSO_NAME || 'Single Sign-On'
  if (!issuer || !clientId || !clientSecret) return null
  return {
    id: 'sso',
    name,
    type: 'oauth',
    wellKnown: `${issuer}/.well-known/openid-configuration`,
    authorization: { params: { scope: 'openid email profile' } },
    client: { token_endpoint_auth_method: 'client_secret_basic' },
    profile(profile: { sub?: string; email?: string; name?: string; picture?: string }) {
      return {
        id: profile.sub,
        email: profile.email,
        name: profile.name,
        image: profile.picture,
      }
    },
    clientId,
    clientSecret,
  } as NextAuthOptions['providers'][number]
}

const ssoProvider = createSSOProvider()

const isProduction = process.env.NODE_ENV === 'production'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NEXTAUTH_DEBUG === '1',
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 }, // 30 days (Credentials works best with JWT)
  secret: secret || (isProduction ? undefined : 'dev-secret-change-in-production'),
  pages: {
    signIn: '/login',
    error: '/login',
  },
  // OAuth redirects from Apple/Google/Microsoft are cross-site; SameSite=none required so cookies
  // are sent when the IdP redirects back. Only in production (HTTPS).
  cookies: isProduction
    ? {
        pkceCodeVerifier: {
          name: '__Secure-next-auth.pkce.code_verifier',
          options: {
            httpOnly: true,
            sameSite: 'none' as const,
            path: '/',
            secure: true,
            maxAge: 60 * 15,
          },
        },
        state: {
          name: '__Secure-next-auth.state',
          options: {
            httpOnly: true,
            sameSite: 'none' as const,
            path: '/',
            secure: true,
            maxAge: 60 * 15,
          },
        },
        callbackUrl: {
          name: '__Secure-next-auth.callback-url',
          options: {
            httpOnly: true,
            sameSite: 'none' as const,
            path: '/',
            secure: true,
          },
        },
        sessionToken: {
          name: '__Secure-next-auth.session-token',
          options: {
            httpOnly: true,
            sameSite: 'none' as const,
            path: '/',
            secure: true,
          },
        },
      }
    : undefined,
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.AZURE_AD_CLIENT_ID && process.env.AZURE_AD_CLIENT_SECRET
      ? [
          AzureADProvider({
            clientId: process.env.AZURE_AD_CLIENT_ID,
            clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
            tenantId: process.env.AZURE_AD_TENANT_ID || 'common',
            name: 'Microsoft',
            authorization: {
              params: { scope: 'openid profile email User.Read' },
            },
          }),
        ]
      : []),
    ...(process.env.APPLE_ID && process.env.APPLE_SECRET
      ? [
          AppleProvider({
            clientId: process.env.APPLE_ID,
            clientSecret: process.env.APPLE_SECRET,
          }),
        ]
      : []),
    ...(ssoProvider ? [ssoProvider] : []),
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
          await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch(() => {})
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

        await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch(() => {})

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
    async signIn() {
      // lastLoginAt is updated in the credentials authorize(); for OAuth, the user may not exist in DB yet
      return true
    },
    async jwt({ token, user, account, profile, trigger, session: updateSession }) {
      if (user) {
        token.id = user.id
        // Update lastLoginAt now that the adapter has created/linked the user (runs after signIn)
        if (user.id) {
          await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } }).catch(() => {})
        }
        const u = user as { role?: string; roles?: string[] }
        token.role = u.role
        token.roles = u.roles ?? (u.role ? [u.role] : [])
        // OAuth: use profile from the provider you just signed in with (Apple vs Google), so session reflects the correct identity
        if (account?.provider && profile) {
          const p = profile as { name?: string; email?: string; picture?: string; image?: string }
          token.provider = account.provider
          token.name = p.name ?? user.name ?? undefined
          token.email = p.email ?? user.email ?? undefined
          token.picture = p.picture ?? p.image ?? user.image ?? undefined
        } else {
          token.name = user.name ?? undefined
          token.email = user.email ?? undefined
          token.picture = user.image ?? undefined
        }
      }
      if (token.id && (token.role === undefined || token.roles === undefined)) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            include: { roles: true },
          })
          if (dbUser) {
            const roles = dbUser.roles?.length ? dbUser.roles.map((r) => r.role) : [dbUser.role]
            token.role = roles[0] ?? dbUser.role
            token.roles = roles
          }
        } catch {
          // DB unreachable; leave role/roles as-is to avoid crashing the session request
        }
      }
      if (trigger === 'update' && updateSession?.user) {
        token.name = updateSession.user.name ?? token.name ?? undefined
        token.picture = updateSession.user.image ?? token.picture ?? undefined
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        const u = session.user as {
          id?: string
          role?: string
          roles?: string[]
          provider?: string
        }
        u.id = token.id as string
        u.role = token.role as string
        u.roles = (token.roles as string[]) ?? []
        u.provider = token.provider as string | undefined
        session.user.name = (token.name as string) ?? null
        session.user.email = (token.email as string) ?? null
        session.user.image = (token.picture as string) ?? null
      }
      return session
    },
  },
}
