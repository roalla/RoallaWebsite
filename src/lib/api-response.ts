import { NextResponse } from 'next/server'

/** Consistent error shape for API routes: { error: string } */
export function jsonError(message: string, status: number = 400) {
  return NextResponse.json({ error: message }, { status })
}
