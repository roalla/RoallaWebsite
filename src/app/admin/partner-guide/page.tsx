import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { canAccessAdmin, isAdmin } from '@/lib/access'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, FileStack, BookOpen, Share2, CheckCircle, ExternalLink } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function PartnerGuidePage() {
  const session = await getServerSession(authOptions)
  if (!session || !canAccessAdmin(session.user)) redirect('/login?callbackUrl=/admin')
  if (isAdmin(session.user)) redirect('/admin')

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Partner guide</h1>
      <p className="text-gray-600 mb-8">
        Get the most out of the platform: onboard your team, add content, and share your client portal.
      </p>

      <ol className="space-y-6">
        <li className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
            1
          </span>
          <div>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Add your team
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Go to <Link href="/admin/team" className="text-primary underline">Team & roles</Link> and
              add users with their email and a temporary password. You can also bulk add via CSV. Assign
              roles (Partner, Business, Member). You have a cap on how many users you can add; the
              dashboard shows how many slots remain.
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
            2
          </span>
          <div>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <FileStack className="w-4 h-4" />
              Add resources & links
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              Under <Link href="/admin/portal" className="text-primary underline">Portal</Link>, add
              downloadable resources (tiles) and links to external content or internal tools. You can only edit content you created (or
              content with no owner). Optionally restrict items to your organization so only your clients
              see them.
            </p>
          </div>
        </li>
        <li className="flex gap-4">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold">
            3
          </span>
          <div>
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Share your client portal
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              If your organization has a portal slug, share the link with clients so they see a branded
              view (global content plus your org’s content). Export your team list as CSV for reporting
              or handoffs.
            </p>
          </div>
        </li>
      </ol>

      <div className="mt-10 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          What you can do
        </h3>
        <ul className="text-sm text-gray-600 mt-2 space-y-1">
          <li>· View and manage users in your organization</li>
          <li>· Add users (within your cap) and assign roles (except Admin)</li>
          <li>· Create and edit portal resources and links (your own or unowned)</li>
          <li>· Export your team as CSV</li>
          <li>· Use a shareable portal link if your org has a slug</li>
        </ul>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/admin/team"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark"
        >
          <Users className="w-4 h-4" />
          Team & roles
        </Link>
        <Link
          href="/admin/portal"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 font-medium rounded-lg hover:border-primary/30 text-gray-700"
        >
          <BookOpen className="w-4 h-4" />
          Portal
        </Link>
        <Link
          href="/resources/portal"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 font-medium rounded-lg hover:border-primary/30 text-gray-700"
        >
          <ExternalLink className="w-4 h-4" />
          View portal
        </Link>
      </div>
    </div>
  )
}
