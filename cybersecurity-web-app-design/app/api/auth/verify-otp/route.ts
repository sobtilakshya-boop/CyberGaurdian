import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { parse, serialize } from 'cookie'
import { cookies } from 'next/headers'
import { createAdminClient } from '@/lib/supabase'
import { createSession, sessionCookieOptions } from '@/lib/session'
import { isSupabaseConfigured, findMockUserByEmailOrPhone, saveMockUser } from '@/lib/mockDb'

// ─── Validation Schema ──────────────────────────────────────────────────────
const VerifyOtpSchema = z.object({
  otp: z
    .string()
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d{6}$/, 'OTP must contain only digits'),
})

interface RegistrationIntent {
  name: string
  email: string
  phone: string
  passwordHash: string
  issuedAt: number
  attempts: number
  bypassOtp?: boolean
}

// ─── POST /api/auth/verify-otp ───────────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate OTP payload
    const parsed = VerifyOtpSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP format', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      )
    }

    const { otp } = parsed.data

    // Read registration context from cookie
    const cookieHeader = request.headers.get('cookie') ?? ''
    const cookies = parse(cookieHeader)
    const rawIntent = cookies['registration_intent']

    if (!rawIntent) {
      return NextResponse.json(
        { success: false, error: 'Registration session expired. Please start over.' },
        { status: 401 }
      )
    }

    // Decode registration data
    let intent: RegistrationIntent
    try {
      intent = JSON.parse(Buffer.from(rawIntent, 'base64').toString('utf-8')) as RegistrationIntent
    } catch {
      return NextResponse.json(
        { success: false, error: 'Corrupted registration session. Please start over.' },
        { status: 400 }
      )
    }

    // Verify cookie is not stale (15 min max)
    if (Date.now() - intent.issuedAt > 15 * 60 * 1000) {
      return NextResponse.json(
        { success: false, error: 'Registration session expired. Please start over.' },
        { status: 401 }
      )
    }

    const currentAttempts = intent.attempts || 0

    // Lockout check
    if (currentAttempts >= 3) {
      const response = NextResponse.json(
        { success: false, error: 'Too many failed attempts. Registration session locked. Please restart.' },
        { status: 429 }
      )
      response.cookies.delete('registration_intent')
      return response
    }

    // Helper for failed attempt to update cookie & delay
    const handleFailedAttempt = async (errorMsg: string, status: number = 400) => {
      await new Promise((r) => setTimeout(r, 1000)) // 1-second artificial delay
      const nextAttempts = currentAttempts + 1

      if (nextAttempts >= 3) {
        const response = NextResponse.json(
          { success: false, error: 'Too many failed attempts. Registration session locked.' },
          { status: 429 }
        )
        response.cookies.delete('registration_intent')
        return response
      }

      const updatedPayload = Buffer.from(
        JSON.stringify({ ...intent, attempts: nextAttempts })
      ).toString('base64')

      const response = NextResponse.json({ success: false, error: errorMsg }, { status })
      response.cookies.set('registration_intent', updatedPayload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 15,
      })
      return response
    }

    // Verify OTP with Email Service
    let verificationStatus: string = 'pending'

    if (intent.bypassOtp && otp === '123456') {
      verificationStatus = 'approved'
    } else {
      try {
        const response = await fetch('https://otp-service-beta.vercel.app/api/otp/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: intent.email,
            otp: otp
          })
        })
        
        const data = await response.json()
        
        if (response.ok && data.success) {
          verificationStatus = 'approved'
        } else {
          return handleFailedAttempt(data.message || 'Invalid or expired OTP', 400)
        }
      } catch (error: unknown) {
        console.error('[verify-otp] Email verification check failed:', error)
        return handleFailedAttempt('Verification service error. Please try again later.', 500)
      }
    }

    if (verificationStatus !== 'approved') {
      return handleFailedAttempt('Incorrect OTP. Please check the code and try again.', 400)
    }

    let userId: string

    if (!isSupabaseConfigured()) {
      console.log('[verify-otp] Supabase not fully configured. Falling back to local mock storage.')
      const existingMock = findMockUserByEmailOrPhone(intent.email, intent.phone)
      if (existingMock) {
        return NextResponse.json(
          { success: false, error: 'An account with this email or phone already exists.' },
          { status: 409 }
        )
      }
      const newMockId = Math.random().toString(36).substring(2, 15)
      try {
        saveMockUser({
          id: newMockId,
          full_name: intent.name,
          email: intent.email,
          phone: intent.phone,
          password_hash: intent.passwordHash,
          is_verified: true,
          created_at: new Date().toISOString(),
        })
        userId = newMockId
      } catch {
        return NextResponse.json(
          { success: false, error: 'Failed to create account. Please try again.' },
          { status: 500 }
        )
      }
    } else {
      // OTP approved — insert user into Supabase
      const supabase = createAdminClient()

      // Check for duplicate email or phone before inserting
      const { data: existing } = await supabase
        .from('users')
        .select('id')
        .or(`email.eq.${intent.email},phone.eq.${intent.phone}`)
        .maybeSingle()

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'An account with this email or phone already exists.' },
          { status: 409 }
        )
      }

      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert({
          full_name: intent.name,
          email: intent.email,
          phone: intent.phone,
          password_hash: intent.passwordHash,
          is_verified: true,
          created_at: new Date().toISOString(),
        })
        .select('id')
        .single()

      if (insertError) {
        console.error('[verify-otp] Supabase insert error:', insertError.message)
        if (insertError.code === '23505') {
          return NextResponse.json(
            { success: false, error: 'An account with this email or phone already exists.' },
            { status: 409 }
          )
        }
        return NextResponse.json(
          { success: false, error: 'Failed to create account. Please try again.' },
          { status: 500 }
        )
      }
      userId = newUser.id
    }

    // Create authenticated session
    const sessionToken = await createSession({
      userId: userId,
      name: intent.name,
      email: intent.email,
      phone: intent.phone,
    })

    const response = NextResponse.json(
      { success: true, message: 'Account verified and created successfully.' },
      { status: 201 }
    )

    response.cookies.delete('registration_intent')
    response.cookies.set(
      sessionCookieOptions.name,
      sessionToken,
      { ...sessionCookieOptions.options, maxAge: 60 * 60 * 24 * 30 }
    )

    return response
  } catch (error) {
    console.error('[verify-otp] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
