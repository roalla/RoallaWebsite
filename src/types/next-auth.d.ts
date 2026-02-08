import 'next-auth'

declare module 'next-auth' {
  interface User {
    id?: string
    role?: string
    roles?: string[]
  }

  interface Session {
    user: {
      id?: string
      email?: string | null
      name?: string | null
      image?: string | null
      role?: string
      roles?: string[]
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string
    email?: string
    name?: string
    picture?: string
    role?: string
    roles?: string[]
  }
}
