import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { createAdminClient } from '@/lib/supabase'
import { createSession, sessionCookieOptions } from '@/lib/session'
import { serialize } from 'cookie'
import { cookies } from 'next/headers'
import { isSupabaseConfigured, findMockUserByEmail, updateMockUser } from '@/lib/mockDb'

const LoginSchema = z.object({
  email: z.string().email('Must be a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

// ─── POST /api/auth/login ────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = LoginSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { email, password, rememberMe } = parsed.data

    let user: { id: string; full_name: string; email: string; phone: string; password_hash: string } | null = null

    if (!isSupabaseConfigured()) {
      console.log('[login] Supabase not fully configured. Using local mock storage lookup.')
      const mockUser = findMockUserByEmail(email)
      if (mockUser) {
        user = {
          id: mockUser.id,
          full_name: mockUser.full_name,
          email: mockUser.email,
          phone: mockUser.phone,
          password_hash: mockUser.password_hash,
        }
      }
    } else {
      // Fetch user from Supabase
      const supabase = createAdminClient()
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, phone, password_hash')
        .eq('email', email)
        .maybeSingle()

      if (error) {
        console.error('[login] Supabase error:', error.message)
        return NextResponse.json(
          { success: false, error: 'An error occurred. Please try again.' },
          { status: 500 }
        )
      }
      user = data
    }

    // Non-revealing error message for invalid credentials
    if (!user || !user.password_hash) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    // Compare password with bcrypt hash
    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      )
    }

    // Update login tracking
    if (isSupabaseConfigured()) {
      const supabase = createAdminClient()
      const currentLoginCount = (user as any).login_count ? ((user as any).login_count + 1) : 1
      await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          login_count: currentLoginCount,
        })
        .eq('id', user.id)
    } else {
      const mockUser = findMockUserByEmail(email)
      if (mockUser) {
        const currentLoginCount = mockUser.login_count ? (mockUser.login_count + 1) : 1
        updateMockUser(user.id, {
          last_login: new Date().toISOString(),
          login_count: currentLoginCount,
        })
      }
    }

    // Create session
    const sessionToken = await createSession({
      userId: user.id,
      name: user.full_name,
      email: user.email,
      phone: user.phone,
    })

    const response = NextResponse.json(
      { success: true, message: 'Login successful.' },
      { status: 200 }
    )

    const cookieOptions = { ...sessionCookieOptions.options }
    if (rememberMe) {
      cookieOptions.maxAge = 60 * 60 * 24 * 30 // 30 days
    } else {
      // If not remember me, we can remove maxAge to make it a session cookie (expires on browser close)
      delete (cookieOptions as any).maxAge
    }

    response.cookies.set(
      sessionCookieOptions.name,
      sessionToken,
      cookieOptions
    )

    return response
  } catch (err) {
    console.error('[login] Unexpected error:', err)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred.' },
      { status: 500 }
    )
  }
}
