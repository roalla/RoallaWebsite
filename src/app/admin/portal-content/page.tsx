import { redirect } from 'next/navigation'

/** Redirect legacy /admin/portal-content to merged /admin/portal */
export default function AdminPortalContentRedirect() {
  redirect('/admin/portal')
}
