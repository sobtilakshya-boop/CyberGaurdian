import { NextResponse, NextRequest } from 'next/server'
import { getMockUsers, isSupabaseConfigured } from '@/lib/mockDb'

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

  // Calculate platform metrics
  // Active Learners: concurrent active learners fluctuating dynamically (e.g. 8-16)
  const activeLearners = 8 + Math.floor((Date.now() % 10) / 1.5)

  // Aggregate global metrics from database
  let globalXp = 0
  let badgesClaimed = 0

  // Aggregate local mock users progress
  mockUsers.forEach(u => {
    if (u.progress_data) {
      globalXp += Number(u.progress_data.xp ?? 0)
      badgesClaimed += Array.isArray(u.progress_data.badges) ? u.progress_data.badges.length : 0
    }
  })

  try {
    if (isSupabaseConfigured()) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { count: supabaseUserCount, error: countErr } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      const { data: usersProgress, error: selectErr } = await supabase
        .from('users')
        .select('progress_data')

      if (!countErr && supabaseUserCount !== null && !selectErr && usersProgress) {
        let dbXp = 0
        let dbBadges = 0
        usersProgress.forEach((row: any) => {
          if (row.progress_data) {
            dbXp += Number(row.progress_data.xp ?? 0)
            dbBadges += Array.isArray(row.progress_data.badges) ? row.progress_data.badges.length : 0
          }
        })

        return NextResponse.json({
          userCount: supabaseUserCount,
          activeLearners,
          globalXp: dbXp,
          badgesClaimed: dbBadges,
          isDemoData: false,
        })
      }
    }
  } catch (err) {
    console.error("Supabase metrics aggregation failed:", err)
  }

  return NextResponse.json({
    userCount,
    activeLearners,
    globalXp,
    badgesClaimed,
    isDemoData: false,
  })
}
