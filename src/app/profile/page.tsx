'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login?callbackUrl=/profile')
      return
    }
    if (session?.user) {
      const u = session.user as { name?: string | null; image?: string | null }
      setName(u.name ?? '')
      setImage(u.image ?? '')
    }
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setSaving(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() || null, image: image.trim() || null }),
      })
      const data = await res.json()
      if (!res.ok) {
        setMessage({ type: 'error', text: data.error || 'Update failed' })
        setSaving(false)
        return
      }
      await update({ user: { name: data.name ?? name, image: data.image ?? image } })
      setMessage({ type: 'success', text: 'Profile updated.' })
    } catch {
      setMessage({ type: 'error', text: 'Update failed' })
    }
    setSaving(false)
  }

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-md mx-auto px-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
        <div className="bg-white rounded-2xl shadow border border-gray-100 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600 mb-6">
            Update your display name and avatar. This appears in the header when you’re signed in.
          </p>
          {message && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {message.text}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Display name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 bg-white"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Avatar image URL
              </label>
              <input
                id="image"
                type="url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-900 bg-white"
                placeholder="https://..."
              />
              <p className="text-xs text-gray-500 mt-1">Leave empty to use your initials.</p>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 px-4 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
