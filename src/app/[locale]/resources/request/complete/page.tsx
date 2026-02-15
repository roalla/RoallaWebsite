import { redirect } from 'next/navigation'
import { getLocale } from 'next-intl/server'

/** Redirect to unified request page - social sign-in and completion form are now merged. */
export default async function RequestCompletePage() {
  const locale = await getLocale()
  redirect(`/${locale}/resources/request`)
}
