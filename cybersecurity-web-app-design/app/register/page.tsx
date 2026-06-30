"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Shield, User, Mail, Phone, Lock, Eye, EyeOff, Loader,
  XCircle, ChevronLeft, CheckCircle2, ScanEye
} from "lucide-react"
import Link from "next/link"

interface FieldErrors {
  name?: string[]
  email?: string[]
  phone?: string[]
  password?: string[]
  confirmPassword?: string[]
  _form?: string
}

function passwordStrength(pw: string): { score: number; label: string; color: string } {
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[a-z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const labels = ["", "Very Weak", "Weak", "Fair", "Strong", "Very Strong"]
  const colors = ["", "#ef4444", "#f97316", "#eab308", "#22c55e", "#06b6d4"]
  return { score, label: labels[score] ?? "", color: colors[score] ?? "" }
}

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})

  const strength = passwordStrength(password)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    const form = e.currentTarget
    const formData = new FormData(form)
    const name = (formData.get("name") as string ?? "").trim()
    const email = (formData.get("email") as string ?? "").trim()
    const phone = (formData.get("phone") as string ?? "").trim()
    const pw = (formData.get("password") as string ?? "")
    const confirm = (formData.get("confirmPassword") as string ?? "")

    setSubmitting(true)
    try {
      const res = await fetch("/api/auth/register-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password: pw, confirmPassword: confirm }),
      })
      const data = await res.json()
      if (data.success) {
        sessionStorage.setItem("cg_pending_phone", phone)
        sessionStorage.setItem("cg_pending_name", name)
        sessionStorage.setItem("cg_pending_email", email)
        router.push("/register/verify")
      } else if (data.details) {
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
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden"
      style={{ background: "oklch(0.10 0.02 240)" }}>
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
      <div aria-hidden="true" className="pointer-events-none fixed inset-0"
        style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.07) 0%, transparent 70%)" }} />

      <div className="relative w-full max-w-md">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-mono text-slate-400 hover:text-cyan-400 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="flex flex-col items-center mb-6">
          <div className="relative mb-3">
            <div className="absolute inset-0 rounded-full blur-xl opacity-50" style={{ background: "rgba(6,182,212,0.4)" }} />
            <Shield className="relative h-12 w-12 text-cyan-400" strokeWidth={1.5}
              style={{ filter: "drop-shadow(0 0 12px rgba(6,182,212,0.8))" }} />
          </div>
          <h1 className="font-mono text-2xl font-bold tracking-wider text-white uppercase">Create Account</h1>
          <p className="mt-1 text-sm text-slate-400 font-mono">Join the CyberGuardian network</p>
        </div>

        <div className="relative rounded-2xl p-[1px] overflow-hidden"
          style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.5) 0%, rgba(6,182,212,0.1) 50%, rgba(6,182,212,0.4) 100%)" }}>
          <div className="rounded-2xl bg-slate-900/95 backdrop-blur-xl p-7">
            {errors._form && (
              <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
                <XCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm font-mono text-red-300">{errors._form}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <Field id="name" label="Full Name" type="text" placeholder="Jane Doe" icon={<User className="h-4 w-4" />} autoComplete="name" error={errors.name?.[0]} />
              <Field id="email" label="Gmail Address" type="email" placeholder="you@gmail.com" icon={<Mail className="h-4 w-4" />} autoComplete="email" error={errors.email?.[0]} />
              <Field id="phone" label="Phone (E.164 format)" type="tel" placeholder="+91XXXXXXXXXX" icon={<Phone className="h-4 w-4" />} autoComplete="tel" error={errors.phone?.[0]}
                hint="Include country code, e.g. +919876543210" />

              {/* Password with strength meter */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-300 font-mono">Set Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input id="password" name="password" type={showPassword ? "text" : "password"} required value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 chars, A-z, 0-9, symbol"
                    className={`w-full rounded-xl border bg-slate-800/70 py-3 pl-10 pr-10 text-white outline-none transition-all font-mono placeholder:text-slate-600 text-sm ${errors.password ? "border-red-500/60" : "border-slate-700 focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.15)]"}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength indicator */}
                {password && (
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex gap-1 h-1">
                      {[1,2,3,4,5].map((i) => (
                        <div key={i} className="flex-1 rounded-full transition-all duration-300"
                          style={{ background: i <= strength.score ? strength.color : "rgb(51,65,85)" }} />
                      ))}
                    </div>
                    <span className="text-xs font-mono" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
                {errors.password?.[0] && <p className="text-xs text-red-400 font-mono flex items-center gap-1"><XCircle className="h-3 w-3" />{errors.password[0]}</p>}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-slate-300 font-mono">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} required
                    placeholder="Re-enter password"
                    className={`w-full rounded-xl border bg-slate-800/70 py-3 pl-10 pr-10 text-white outline-none transition-all font-mono placeholder:text-slate-600 text-sm ${errors.confirmPassword ? "border-red-500/60" : "border-slate-700 focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.15)]"}`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors">
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword?.[0] && <p className="text-xs text-red-400 font-mono flex items-center gap-1"><XCircle className="h-3 w-3" />{errors.confirmPassword[0]}</p>}
              </div>

              {/* Password rules hint */}
              <div className="rounded-xl border border-slate-700/60 bg-slate-800/40 px-4 py-3 flex flex-col gap-1">
                {[
                  { rule: /[A-Z]/.test(password), label: "Uppercase letter" },
                  { rule: /[a-z]/.test(password), label: "Lowercase letter" },
                  { rule: /[0-9]/.test(password), label: "Number" },
                  { rule: /[^A-Za-z0-9]/.test(password), label: "Special character (!@#$...)" },
                  { rule: password.length >= 8, label: "At least 8 characters" },
                ].map(({ rule, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <CheckCircle2 className={`h-3.5 w-3.5 transition-colors ${rule ? "text-cyan-400" : "text-slate-600"}`} />
                    <span className={`text-xs font-mono transition-colors ${rule ? "text-slate-300" : "text-slate-600"}`}>{label}</span>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-3.5 rounded-xl font-mono font-semibold text-sm uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
                style={{ boxShadow: "0 0 24px rgba(6,182,212,0.4)" }}>
                {submitting ? <><Loader className="h-4 w-4 animate-spin" />Sending OTP…</> : <><ScanEye className="h-4 w-4" />Register & Send OTP</>}
              </button>

              <p className="text-center text-sm font-mono text-slate-500">
                Already have an account?{" "}
                <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors">Sign in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

function Field({ id, label, type, placeholder, icon, autoComplete, error, hint }: {
  id: string; label: string; type: string; placeholder: string
  icon: React.ReactNode; autoComplete?: string; error?: string; hint?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium text-slate-300 font-mono">{label}</label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</span>
        <input id={id} name={id} type={type} required autoComplete={autoComplete} placeholder={placeholder}
          aria-invalid={!!error}
          className={`w-full rounded-xl border bg-slate-800/70 py-3 pl-10 pr-3 text-white outline-none transition-all font-mono placeholder:text-slate-600 text-sm ${error ? "border-red-500/60 focus:border-red-400" : "border-slate-700 focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.15)]"}`} />
      </div>
      {hint && !error && <p className="text-xs text-slate-600 font-mono">{hint}</p>}
      {error && <p className="text-xs text-red-400 font-mono flex items-center gap-1"><XCircle className="h-3 w-3" />{error}</p>}
    </div>
  )
}
