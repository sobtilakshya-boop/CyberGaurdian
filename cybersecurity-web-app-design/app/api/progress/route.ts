import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { isSupabaseConfigured, getMockUsers, updateMockUser } from '@/lib/mockDb'

// ─── GET: Fetch user progress ────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  try {
    if (isSupabaseConfigured()) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { data, error } = await supabase
        .from('users')
        .select('progress_data')
        .eq('id', session.userId)
        .single()

      if (error || !data) {
        return NextResponse.json({ success: false, progress: null })
      }

      return NextResponse.json({ success: true, progress: data.progress_data })
    }
  } catch {
    // Fall back to mock DB
  }

  // Mock DB fallback
  const mockUsers = getMockUsers()
  const user = mockUsers.find(u => u.id === session.userId)
  
  return NextResponse.json({ 
    success: true, 
    progress: user?.progress_data || null 
  })
}

// ─── POST: Update user progress ──────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const session = await getSession()
  
  if (!session) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
  }

  let progress: any = null

  try {
    const body = await request.json()
    progress = body.progress

    if (!progress) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 })
    }

    if (isSupabaseConfigured()) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(supabaseUrl, supabaseKey)

      const { error } = await supabase
        .from('users')
        .update({ progress_data: progress })
        .eq('id', session.userId)

      if (error) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
      }

      return NextResponse.json({ success: true })
    }
  } catch (error) {
    // Fall back to mock DB
  }

  // Mock DB fallback
  if (progress) {
    updateMockUser(session.userId, { progress_data: progress })
  }
  
  return NextResponse.json({ success: true })
}
