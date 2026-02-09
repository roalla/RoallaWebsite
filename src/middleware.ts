import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // /admin requires admin or partner role
      const roles = (token?.roles as string[] | undefined) ?? (token?.role ? [token.role as string] : [])
      return roles.includes('admin') || roles.includes('partner')
    },
  },
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: ['/admin/:path*'],
}
