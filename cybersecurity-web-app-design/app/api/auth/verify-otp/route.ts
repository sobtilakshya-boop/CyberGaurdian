import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import twilio from 'twilio'
import { parse, serialize } from 'cookie'
import { createAdminClient } from '@/lib/supabase'

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
        {
          success: false,
          error: 'Invalid OTP format',
          details: parsed.error.flatten().fieldErrors,
        },
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

    // Check Twilio credentials
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID

    if (!accountSid || !authToken || !serviceSid) {
      console.error('[verify-otp] Missing Twilio environment variables')
      return NextResponse.json(
        { success: false, error: 'Verification service is not configured. Contact support.' },
        { status: 503 }
      )
    }

    // Verify OTP with Twilio
    const client = twilio(accountSid, authToken)
    let verificationStatus: string
    try {
      const check = await client.verify.v2
        .services(serviceSid)
        .verificationChecks.create({ to: intent.phone, code: otp })

      verificationStatus = check.status
    } catch (twilioError: unknown) {
      const err = twilioError as { code?: number; message?: string; status?: number }
      console.error('[verify-otp] Twilio error:', err.code, err.message)

      if (err.code === 20429 || err.status === 429) {
        return NextResponse.json(
          { success: false, error: 'Too many verification attempts. Please wait and try again.' },
          { status: 429 }
        )
      }
      // OTP already consumed / expired
      if (err.code === 60202) {
        return NextResponse.json(
          { success: false, error: 'Maximum OTP check attempts exceeded. Please request a new OTP.' },
          { status: 400 }
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

    const { error: insertError } = await supabase.from('users').insert({
      full_name: intent.name,
      email: intent.email,
      phone: intent.phone,
      is_verified: true,
      created_at: new Date().toISOString(),
    })

    if (insertError) {
      console.error('[verify-otp] Supabase insert error:', insertError.message)
      // Handle unique constraint violations gracefully
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

    // Clear the registration_intent cookie
    const clearCookie = serialize('registration_intent', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 0,
    })

    return NextResponse.json(
      { success: true, message: 'Account verified and created successfully.' },
      {
        status: 201,
        headers: { 'Set-Cookie': clearCookie },
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
