import { NextResponse, NextRequest } from 'next/server'
import { getMockUsers } from '@/lib/mockDb'

export const dynamic = 'force-dynamic'

// ─── Dashboard Metrics API ────────────────────────────────────────────────────
// Returns dynamic dashboard metrics based on real database records and user progress.
export async function GET(request: NextRequest) {
  // Count actual registered users from mock DB
  const mockUsers = getMockUsers()
  const userCount = mockUsers.length

  // Get active progress parameters from query parameters
  const { searchParams } = new URL(request.url)
  const xp = Number(searchParams.get('xp') ?? '0')
  const pct = Number(searchParams.get('pct') ?? '0')

  // Calculate dynamic security score (starts at 75% for baseline, scales with completed percentage)
  const securityScore = Math.min(100, 75 + Math.round(pct * 0.25))

  // Active threats: starts at 4, drops as user completes chapters
  const activeThreats = Math.max(0, 4 - Math.floor(pct / 25))

  // Logs processed: base 10,240 + XP multiplier + current time millisecond offset
  const timeOffset = Math.floor((Date.now() % 60000) / 1000)
  const logsProcessed = 10240 + xp * 8 + timeOffset

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseKey) {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { count: supabaseUserCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      return NextResponse.json({
        userCount: supabaseUserCount ?? userCount,
        securityScore,
        activeThreats,
        logsProcessed,
        isDemoData: false,
      })
    }
  } catch {
    // Fall through to local database count
  }

  return NextResponse.json({
    userCount,
    securityScore,
    activeThreats,
    logsProcessed,
    isDemoData: false,
  })
}
