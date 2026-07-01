import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import twilio from 'twilio'
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

    // Read registration context from cookie — try both cookie header and cookies() API
    let rawIntent = ""
    
    try {
      const cookieStore = await cookies()
      rawIntent = cookieStore.get('registration_intent')?.value ?? ""
    } catch {
      // Fallback to header parsing if cookies() fails
      const cookieHeader = request.headers.get('cookie') ?? ''
      const parsedCookies = parse(cookieHeader)
      rawIntent = parsedCookies['registration_intent'] ?? ""
    }

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

    // Check Twilio credentials — also reject placeholder values
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID

    const isPlaceholder = (v?: string) =>
      !v || v.includes('your_') || v.includes('_here') || v.trim() === ''

    if (isPlaceholder(accountSid) || isPlaceholder(authToken) || isPlaceholder(serviceSid)) {
      console.error('[verify-otp] Twilio credentials are missing or still set to placeholder values')
      return NextResponse.json(
        { success: false, error: 'Verification service is not configured. Please contact support.' },
        { status: 503 }
      )
    }

    // Verify OTP with Twilio
    const client = twilio(accountSid, authToken)
    let verificationStatus: string
    try {
      const check = await client.verify.v2
        .services(serviceSid!)
        .verificationChecks.create({ to: intent.phone, code: otp })
      verificationStatus = check.status
    } catch (twilioError: unknown) {
      const err = twilioError as { code?: number; message?: string; status?: number; moreInfo?: string }
      console.error('[verify-otp] Twilio error — code:', err.code, '| status:', err.status, '| message:', err.message)
      if (err.moreInfo) console.error('[verify-otp] More info:', err.moreInfo)

      if (err.code === 20003) {
        return NextResponse.json(
          { success: false, error: 'Verification service authentication failed. Please contact support.' },
          { status: 503 }
        )
      }
      if (err.code === 20429 || err.status === 429) {
        return NextResponse.json(
          { success: false, error: 'Too many verification attempts. Please wait and try again.' },
          { status: 429 }
        )
      }
      if (err.code === 60202) {
        return NextResponse.json(
          { success: false, error: 'Maximum OTP check attempts exceeded. Please request a new OTP.' },
          { status: 400 }
        )
      }
      if (err.code === 20404) {
        return NextResponse.json(
          { success: false, error: 'Verification service is misconfigured. Please contact support.' },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { success: false, error: 'Verification failed. Please try again.' },
        { status: 502 }
      )
    }

    if (verificationStatus !== 'approved') {
      return NextResponse.json(
        { success: false, error: 'Incorrect OTP. Please check the code and try again.' },
        { status: 400 }
      )
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

    // Clear registration cookie + set session cookie
    const cookieStore = await cookies()
    cookieStore.delete('registration_intent')
    cookieStore.set(
      sessionCookieOptions.name,
      sessionToken,
      sessionCookieOptions.options
    )

    return NextResponse.json(
      { success: true, message: 'Account verified and created successfully.' },
      { 
        status: 201,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
        }
      }
    )
  } catch (error) {
    console.error('[verify-otp] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
