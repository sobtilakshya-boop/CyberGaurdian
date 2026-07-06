import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
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
    .min(10, 'Phone must be a valid number'),
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

    // Dispatch OTP via Email Service
    try {
      const response = await fetch('https://otp-service-beta.vercel.app/api/otp/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          type: 'numeric',
          organization: 'CyberGuardian',
          subject: 'CyberGuardian OTP Verification'
        })
      })
      
      if (!response.ok) {
        throw new Error('Email service returned an error')
      }
    } catch (error: unknown) {
      console.error('[register-intent] Email verification dispatch failed:', error)
      const registrationPayload = Buffer.from(
        JSON.stringify({ name, email, phone, passwordHash, issuedAt: Date.now(), attempts: 0, bypassOtp: true })
      ).toString('base64')

      const cookieHeader = serialize('registration_intent', registrationPayload, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 15, // 15 minutes — enough to complete OTP flow
      })

      return NextResponse.json(
        { success: true, message: 'OTP bypassed due to service constraint.', isBypass: true },
        {
          status: 200,
          headers: { 'Set-Cookie': cookieHeader },
        }
      )
    }

    const registrationPayload = Buffer.from(
      JSON.stringify({ name, email, phone, passwordHash, issuedAt: Date.now(), attempts: 0 })
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
