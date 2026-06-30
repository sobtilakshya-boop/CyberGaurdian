import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import twilio from 'twilio'
import { serialize } from 'cookie'

// ─── Validation Schema ──────────────────────────────────────────────────────
const RegisterIntentSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name may only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .email('Must be a valid email address')
    .regex(/@gmail\.com$/i, 'Only Gmail addresses are accepted'),
  phone: z
    .string()
    .regex(/^\+[1-9]\d{6,14}$/, 'Phone must be in E.164 format (e.g. +14155551234)'),
})

// ─── POST /api/auth/register-intent ─────────────────────────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate input
    const parsed = RegisterIntentSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: parsed.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { name, email, phone } = parsed.data

    // Check Twilio credentials are configured
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID

    if (!accountSid || !authToken || !serviceSid) {
      console.error('[register-intent] Missing Twilio environment variables')
      return NextResponse.json(
        { success: false, error: 'OTP service is not configured. Contact support.' },
        { status: 503 }
      )
    }

    // Dispatch OTP via Twilio Verify
    const client = twilio(accountSid, authToken)
    try {
      await client.verify.v2.services(serviceSid).verifications.create({
        to: phone,
        channel: 'sms',
      })
    } catch (twilioError: unknown) {
      const err = twilioError as { code?: number; message?: string; status?: number }
      console.error('[register-intent] Twilio error:', err.code, err.message)

      // Twilio rate limit
      if (err.code === 20429 || err.status === 429) {
        return NextResponse.json(
          { success: false, error: 'Too many OTP requests. Please wait a few minutes and try again.' },
          { status: 429 }
        )
      }
      // Invalid phone number
      if (err.code === 60200 || err.code === 21211) {
        return NextResponse.json(
          { success: false, error: 'The phone number provided is invalid or cannot receive SMS.' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { success: false, error: 'Failed to send OTP. Please try again later.' },
        { status: 502 }
      )
    }

    // Store registration context in an HTTP-only cookie (base64 encoded, not encrypted 
    // to avoid runtime dependencies — rely on HttpOnly + Secure + SameSite for protection)
    const registrationPayload = Buffer.from(
      JSON.stringify({ name, email, phone, issuedAt: Date.now() })
    ).toString('base64')

    const cookieHeader = serialize('registration_intent', registrationPayload, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 15, // 15 minutes — enough to complete OTP flow
    })

    return NextResponse.json(
      { success: true, message: 'OTP sent successfully.' },
      {
        status: 200,
        headers: { 'Set-Cookie': cookieHeader },
      }
    )
  } catch (error) {
    console.error('[register-intent] Unexpected error:', error)
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    )
  }
}
