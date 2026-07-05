import toast from 'react-hot-toast'

export async function hubFetchJson<T>(
  input: RequestInfo,
  init?: RequestInit,
  messages?: { success?: string; error?: string },
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const res = await fetch(input, init)
    const body = (await res.json().catch(() => ({}))) as T & { error?: string }
    if (!res.ok) {
      const error = (body as { error?: string }).error || messages?.error || 'Something went wrong.'
      toast.error(error)
      return { ok: false, error }
    }
    if (messages?.success) toast.success(messages.success)
    return { ok: true, data: body }
  } catch {
    const error = messages?.error || 'Network error.'
    toast.error(error)
    return { ok: false, error }
  }
}
