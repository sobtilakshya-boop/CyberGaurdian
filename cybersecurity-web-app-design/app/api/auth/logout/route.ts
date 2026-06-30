import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { sessionCookieOptions } from '@/lib/session'

// ─── POST /api/auth/logout ───────────────────────────────────────────────────
export async function POST() {
  const cookieStore = await cookies()
  cookieStore.delete(sessionCookieOptions.name)

  return NextResponse.json(
    { success: true, message: 'Logged out successfully.' },
    { status: 200 }
  )
}
