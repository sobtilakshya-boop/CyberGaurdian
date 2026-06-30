import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase'

// ─── Middleware: verify admin bearer token ───────────────────────────────────
function verifyAdmin(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization') ?? ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim()
  const adminSecret = process.env.ADMIN_SECRET_KEY

  if (!adminSecret) {
    console.error('[admin/users] ADMIN_SECRET_KEY is not configured')
    return false
  }

  return token === adminSecret
}

// ─── GET /api/admin/users ────────────────────────────────────────────────────
// Query params: ?search=<string>&status=verified|pending&sort=newest|oldest
export async function GET(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Valid admin credentials required.' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search')?.trim() ?? ''
  const status = searchParams.get('status') ?? 'all'
  const sort = searchParams.get('sort') ?? 'newest'

  const supabase = createAdminClient()

  let query = supabase
    .from('users')
    .select('id, full_name, email, phone, created_at, is_verified')

  // Apply status filter
  if (status === 'verified') {
    query = query.eq('is_verified', true)
  } else if (status === 'pending') {
    query = query.eq('is_verified', false)
  }

  // Apply full-text search across name, email, phone
  if (search) {
    query = query.or(
      `full_name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`
    )
  }

  // Apply sort
  query = query.order('created_at', { ascending: sort === 'oldest' })

  const { data, error } = await query

  if (error) {
    console.error('[admin/users] GET error:', error.message)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users.' },
      { status: 500 }
    )
  }

  // Derive summary statistics
  const allUsers = data ?? []
  const verifiedCount = allUsers.filter((u) => u.is_verified).length
  const pendingCount = allUsers.filter((u) => !u.is_verified).length
  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayCount = allUsers.filter(
    (u) => new Date(u.created_at) >= todayStart
  ).length

  return NextResponse.json({
    success: true,
    stats: {
      total: allUsers.length,
      verified: verifiedCount,
      pending: pendingCount,
      today: todayCount,
    },
    users: allUsers,
  })
}

// ─── DELETE /api/admin/users?id=<uuid> ──────────────────────────────────────
export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Valid admin credentials required.' },
      { status: 401 }
    )
  }

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')?.trim()

  if (!id) {
    return NextResponse.json(
      { success: false, error: 'User ID is required.' },
      { status: 400 }
    )
  }

  // Basic UUID format check
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    return NextResponse.json(
      { success: false, error: 'Invalid user ID format.' },
      { status: 400 }
    )
  }

  const supabase = createAdminClient()

  const { error } = await supabase.from('users').delete().eq('id', id)

  if (error) {
    console.error('[admin/users] DELETE error:', error.message)
    return NextResponse.json(
      { success: false, error: 'Failed to delete user.' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, message: 'User deleted successfully.' })
}
