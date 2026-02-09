import Link from 'next/link'
import { FileSignature, Lock, Inbox } from 'lucide-react'

export default function AdminTrustPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Trust Centre</h1>
      <p className="text-gray-600 mb-8">
        Manage NDA agreement text and review gated access requests (NDA sign-off + approval).
      </p>
      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          href="/admin/trust/agreement"
          className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <FileSignature className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">NDA agreement</h2>
            <p className="text-sm text-gray-600">
              Set the agreement text that requestors must accept before requesting access to gated documents.
            </p>
          </div>
        </Link>
        <Link
          href="/admin/trust/requests"
          className="flex items-start gap-4 p-6 bg-white rounded-xl border border-gray-200 hover:border-primary hover:shadow-md transition-all"
        >
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
            <Inbox className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Gated access requests</h2>
            <p className="text-sm text-gray-600">
              Review requests that have signed the NDA. Approve to grant access and send a link; reject to deny.
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
