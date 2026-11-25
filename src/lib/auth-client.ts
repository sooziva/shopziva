import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
  // Vite proxies /api → :8787, so same-origin cookies work on :5173
  baseURL: typeof window !== 'undefined' ? window.location.origin : undefined,
})

export const { useSession, signIn, signOut } = authClient
