import { betterAuth } from 'better-auth'
import { pool } from './db.js'
import 'dotenv/config'

const baseURL =
  process.env.BETTER_AUTH_URL ?? 'http://localhost:5173'

const productionOrigin = 'https://shop.sooziva.com'

export const adminEmails = (process.env.ADMIN_EMAILS ?? 'admin@shopziva.com')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

export const auth = betterAuth({
  database: pool,
  baseURL,
  // Fallback avoids cold-start crash if the env var is missing on Vercel.
  secret:
    process.env.BETTER_AUTH_SECRET ??
    'dev-only-change-me-shopziva-better-auth-secret',
  trustedOrigins: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    productionOrigin,
    baseURL,
  ],
  emailAndPassword: {
    enabled: true,
    // Seed script creates the first admin. Re-run with
    // ALLOW_ADMIN_SIGNUP=true if you need another account.
    disableSignUp: process.env.ALLOW_ADMIN_SIGNUP !== 'true',
  },
})

export function isAdminEmail(email: string | null | undefined) {
  if (!email) return false
  return adminEmails.includes(email.trim().toLowerCase())
}
