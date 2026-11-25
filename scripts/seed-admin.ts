process.env.ALLOW_ADMIN_SIGNUP = 'true'

async function main() {
  // Dynamic import so ALLOW_ADMIN_SIGNUP is set before auth config loads.
  const { auth, adminEmails, isAdminEmail } = await import('../server/auth')

  const email = (process.env.ADMIN_EMAIL ?? adminEmails[0] ?? 'admin@shopziva.com')
    .trim()
    .toLowerCase()
  const password = process.env.ADMIN_PASSWORD ?? 'shopziva-admin'
  const name = process.env.ADMIN_NAME ?? 'Shopziva Admin'

  if (!isAdminEmail(email)) {
    console.error(
      `Email ${email} is not in ADMIN_EMAILS (${adminEmails.join(', ')}).`,
    )
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('ADMIN_PASSWORD must be at least 8 characters.')
    process.exit(1)
  }

  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    })
    console.log(`Admin user created: ${email}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    if (/already|exists|unique/i.test(message)) {
      console.log(`Admin user already exists: ${email}`)
      return
    }
    console.error('Could not seed admin user:', message)
    process.exit(1)
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
