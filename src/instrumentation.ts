/** Logs DATABASE_URL presence at container start (Railway deploy logs — no secret values). */
export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return

  let length = 0
  for (const key of Object.keys(process.env)) {
    if (key.toLowerCase() === 'database_url') {
      length = process.env[key]?.length ?? 0
      break
    }
  }

  console.log(`[roalla] DATABASE_URL at startup — length=${length}`)
}
