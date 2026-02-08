import { withAuth } from 'next-auth/middleware'

export default withAuth({
  callbacks: {
    authorized: ({ token }) => {
      // /admin requires admin role
      return token?.role === 'admin'
    },
  },
  pages: {
    signIn: '/login',
  },
})

export const config = {
  matcher: ['/admin/:path*'],
}
