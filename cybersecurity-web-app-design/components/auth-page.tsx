"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Shield, User, Mail, Phone, Loader, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

type AuthPageProps = {
  initialMode: "login" | "register"
  onBack: () => void
}

interface FieldErrors {
  name?: string[]
  email?: string[]
  phone?: string[]
  _form?: string
}

export function AuthPage({ initialMode, onBack }: AuthPageProps) {
  const router = useRouter()
  const [mode] = useState<"login" | "register">(initialMode)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})

    const form = e.currentTarget
    const formData = new FormData(form)
    const name = (formData.get("name") as string ?? "").trim()
    const email = (formData.get("gmail") as string ?? "").trim()
    const phone = (formData.get("phone") as string ?? "").trim()

    if (mode === "login") {
      // Login is a future feature — stub for now
      setErrors({ _form: "Login coming soon. Please register to create your account." })
      return
    }

    setSubmitting(true)

    try {
      const res = await fetch("/api/auth/register-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      })

      const data = await res.json()

      if (data.success) {
        // Persist registration data for the OTP page and resend flow
        sessionStorage.setItem("cg_pending_phone", phone)
        sessionStorage.setItem("cg_pending_name", name)
        sessionStorage.setItem("cg_pending_email", email)
        router.push("/register/verify")
      } else if (data.details) {
        // Zod field-level validation errors from the API
        setErrors(data.details as FieldErrors)
      } else {
        setErrors({ _form: data.error ?? "Registration failed. Please try again." })
      }
    } catch {
      setErrors({ _form: "Network error. Please check your connection and try again." })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Home
        </button>

        <div className="rounded-2xl border border-primary/25 bg-card p-7 shadow-[0_0_40px_-12px_var(--color-primary)] sm:p-8">
          <div className="mb-7 flex flex-col items-center text-center">
            <Shield
              className="h-12 w-12 animate-pulse text-primary drop-shadow-[0_0_14px_var(--color-primary)]"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <h1 className="mt-4 font-mono text-2xl font-bold uppercase tracking-tight text-foreground">
              {mode === "login" ? "Secure Login" : "Create Account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "login"
                ? "Access your CyberGuardian dashboard"
                : "Join the CyberGuardian network"}
            </p>
          </div>

          {/* Form-level error */}
          {errors._form && (
            <div
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3"
            >
              <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-sm font-mono text-red-300">{errors._form}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <Field
              id="name"
              label="Full Name"
              type="text"
              placeholder="Jane Doe"
              icon={<User className="h-4 w-4" aria-hidden="true" />}
              autoComplete="name"
              error={errors.name?.[0]}
            />
            <Field
              id="gmail"
              label="Gmail Address"
              type="email"
              placeholder="you@gmail.com"
              icon={<Mail className="h-4 w-4" aria-hidden="true" />}
              autoComplete="email"
              error={errors.email?.[0]}
            />
            <Field
              id="phone"
              label="Phone Number (E.164)"
              type="tel"
              placeholder="+14155551234"
              icon={<Phone className="h-4 w-4" aria-hidden="true" />}
              autoComplete="tel"
              error={errors.phone?.[0]}
            />

            <Button
              id="auth-submit-btn"
              type="submit"
              size="lg"
              disabled={submitting}
              className="mt-2 w-full font-mono font-semibold shadow-[0_0_24px_-6px_var(--color-primary)] disabled:opacity-60"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-4 w-4 animate-spin" />
                  {mode === "login" ? "Signing in…" : "Sending OTP…"}
                </span>
              ) : mode === "login" ? (
                "Login"
              ) : (
                "Register & Send OTP"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

// ─── Field Component ──────────────────────────────────────────────────────────
type FieldProps = {
  id: string
  label: string
  type: string
  placeholder: string
  icon: React.ReactNode
  autoComplete?: string
  error?: string
}

function Field({ id, label, type, placeholder, icon, autoComplete, error }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={type}
          required
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={[
            "w-full rounded-lg border bg-background/60 py-2.5 pl-10 pr-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground/60",
            error
              ? "border-red-500/60 focus:border-red-400 focus:ring-2 focus:ring-red-500/20"
              : "border-input focus:border-primary focus:ring-2 focus:ring-primary/30",
          ].join(" ")}
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-400 font-mono flex items-center gap-1.5">
          <XCircle className="h-3 w-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}
