jest.mock('next/server', () => ({
  NextResponse: {
    json: (body: { error: string }, init?: { status?: number }) => ({
      status: init?.status ?? 400,
      json: () => Promise.resolve(body),
    }),
  },
}))

import { jsonError } from '@/lib/api-response'

describe('jsonError', () => {
  it('returns JSON with error message and status', async () => {
    const res = jsonError('Unauthorized', 401)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data).toEqual({ error: 'Unauthorized' })
  })

  it('defaults to status 400', async () => {
    const res = jsonError('Bad request')
    expect(res.status).toBe(400)
    const data = await res.json()
    expect(data).toEqual({ error: 'Bad request' })
  })
})
