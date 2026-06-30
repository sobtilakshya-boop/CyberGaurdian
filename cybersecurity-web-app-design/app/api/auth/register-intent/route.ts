import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import twilio from 'twilio'
import { serialize } from 'cookie'
import bcrypt from 'bcryptjs'

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
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
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

    const { name, email, phone, password } = parsed.data

    // Hash password before storing in cookie
    const rounds = parseInt(process.env.BCRYPT_ROUNDS ?? '12', 10)
    const passwordHash = await bcrypt.hash(password, rounds)

    // Check Twilio credentials are configured and not placeholders
    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const serviceSid = process.env.TWILIO_VERIFY_SERVICE_SID

    const isPlaceholder = (v?: string) =>
      !v || v.includes('your_') || v.includes('_here') || v.trim() === ''

    if (isPlaceholder(accountSid) || isPlaceholder(authToken) || isPlaceholder(serviceSid)) {
      console.error('[register-intent] Twilio credentials are missing or still set to placeholder values')
      return NextResponse.json(
        { success: false, error: 'OTP service is not configured. Please contact support.' },
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
      const err = twilioError as { code?: number; message?: string; status?: number; moreInfo?: string }
      console.error('[register-intent] Twilio error — code:', err.code, '| status:', err.status, '| message:', err.message)
      if (err.moreInfo) console.error('[register-intent] More info:', err.moreInfo)

      // Authentication failure — wrong Account SID or Auth Token
      if (err.code === 20003) {
        console.error('[register-intent] ⚠ Twilio authentication failed. Check TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN.')
        return NextResponse.json(
          { success: false, error: 'OTP service authentication failed. Please contact support.' },
          { status: 503 }
        )
      }
      // Twilio rate limit
      if (err.code === 20429 || err.status === 429) {
        return NextResponse.json(
          { success: false, error: 'Too many OTP requests. Please wait a few minutes and try again.' },
          { status: 429 }
        )
      }
      // Invalid or unverified phone number
      if (err.code === 60200 || err.code === 21211 || err.code === 60203) {
        return NextResponse.json(
          { success: false, error: 'The phone number is invalid or cannot receive SMS. Ensure it includes the country code (e.g. +91XXXXXXXXXX).' },
          { status: 400 }
        )
      }
      // Verify service SID is wrong
      if (err.code === 20404) {
        console.error('[register-intent] ⚠ Twilio Verify Service not found. Check TWILIO_VERIFY_SERVICE_SID.')
        return NextResponse.json(
          { success: false, error: 'OTP service is misconfigured. Please contact support.' },
          { status: 503 }
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
      JSON.stringify({ name, email, phone, passwordHash, issuedAt: Date.now() })
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
