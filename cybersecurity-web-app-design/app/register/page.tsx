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
        if (data.isBypass) {
          sessionStorage.setItem("cg_bypass", "true")
        } else {
          sessionStorage.removeItem("cg_bypass")
        }
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
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden select-none"
      style={{ background: "linear-gradient(135deg, #F3F6FF 0%, #E8EEFF 50%, #E3E8FF 100%)" }}>
      
      <div className="relative w-full max-w-md z-10">
        <Link href="/" className="mb-6 inline-flex items-center gap-1.5 text-xs font-mono font-bold tracking-widest uppercase text-slate-500 hover:text-cyan-600 transition-colors">
          <ChevronLeft className="h-4 w-4" /> Back to Gateway
        </Link>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="relative mb-3 group cursor-pointer">
            <div className="absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-65 transition-opacity duration-300" style={{ background: "rgba(6,182,212,0.3)" }} />
            <Shield className="relative h-12 w-12 text-cyan-500 transition-transform duration-300 group-hover:scale-110" strokeWidth={1.5} />
          </div>
          <h1 className="font-mono text-2xl font-black tracking-wider text-slate-900 uppercase">
            CREATE <span className="text-cyan-500">NODE</span>
          </h1>
          <p className="mt-1 text-xs text-slate-500 font-mono tracking-wider font-bold">JOIN THE CYBERGUARDIAN NETWORK</p>
        </div>

        <div className="relative rounded-3xl p-[1px] shadow-[0_15px_40px_rgba(99,179,237,0.18)] transition-all duration-300"
          style={{ background: "linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(255,255,255,0.8) 50%, rgba(139,92,246,0.15) 100%)" }}>
          <div className="rounded-3xl bg-white/90 backdrop-blur-3xl p-7 border border-white/60">
            {errors._form && (
              <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-50 px-4 py-3">
                <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-xs font-mono text-red-650 leading-relaxed">{errors._form}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <Field id="name" label="Full Name" type="text" placeholder="Jane Doe" icon={<User className="h-4 w-4" />} autoComplete="name" error={errors.name?.[0]} />
              <Field id="email" label="Gmail Address" type="email" placeholder="you@gmail.com" icon={<Mail className="h-4 w-4" />} autoComplete="email" error={errors.email?.[0]} />
              <Field id="phone" label="Phone Number" type="tel" placeholder="+91 98765 43210" defaultValue="+91 " icon={<Phone className="h-4 w-4" />} autoComplete="tel" error={errors.phone?.[0]}
                hint="Indian mobile number" />

              {/* Password with strength meter */}
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase">SET PASSKEY</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                  <input id="password" name="password" type={showPassword ? "text" : "password"} required value={password}
                    onChange={(e) => setPassword(e.target.value)} placeholder="Min 8 chars, A-z, 0-9, symbol"
                    className={`w-full rounded-xl border bg-slate-50/70 py-3.5 pl-11 pr-11 text-slate-900 outline-none transition-all font-mono placeholder:text-slate-400 text-sm ${errors.password ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.1)]" : "border-slate-200 focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"}`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-500 transition-colors cursor-pointer">
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {/* Strength indicator */}
                {password && (
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 flex gap-1 h-1.5">
                      {[1,2,3,4,5].map((i) => (
                        <div key={i} className="flex-1 rounded-full transition-all duration-300"
                          style={{ background: i <= strength.score ? strength.color : "#e2e8f0" }} />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-widest uppercase" style={{ color: strength.color }}>{strength.label}</span>
                  </div>
                )}
                {errors.password?.[0] && <p className="text-[11px] text-red-500 font-mono flex items-center gap-1.5 mt-0.5"><XCircle className="h-3.5 w-3.5 shrink-0" />{errors.password[0]}</p>}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-2">
                <label htmlFor="confirmPassword" className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase">CONFIRM PASSKEY</label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                  <input id="confirmPassword" name="confirmPassword" type={showConfirm ? "text" : "password"} required
                    placeholder="Re-enter passkey"
                    className={`w-full rounded-xl border bg-slate-50/70 py-3.5 pl-11 pr-11 text-slate-900 outline-none transition-all font-mono placeholder:text-slate-400 text-sm ${errors.confirmPassword ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.1)]" : "border-slate-200 focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"}`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-500 transition-colors cursor-pointer">
                    {showConfirm ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.confirmPassword?.[0] && <p className="text-[11px] text-red-500 font-mono flex items-center gap-1.5 mt-0.5"><XCircle className="h-3.5 w-3.5 shrink-0" />{errors.confirmPassword[0]}</p>}
              </div>

              {/* Password rules hint */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 flex flex-col gap-1.5 mt-1">
                {[
                  { rule: /[A-Z]/.test(password), label: "Uppercase letter" },
                  { rule: /[a-z]/.test(password), label: "Lowercase letter" },
                  { rule: /[0-9]/.test(password), label: "Number" },
                  { rule: /[^A-Za-z0-9]/.test(password), label: "Special character (!@#$...)" },
                  { rule: password.length >= 8, label: "At least 8 characters" },
                ].map(({ rule, label }) => (
                  <div key={label} className="flex items-center gap-2">
                    <CheckCircle2 className={`h-3.5 w-3.5 transition-colors ${rule ? "text-cyan-500" : "text-slate-300"}`} />
                    <span className={`text-xs font-mono transition-colors font-semibold ${rule ? "text-slate-700" : "text-slate-400"}`}>{label}</span>
                  </div>
                ))}
              </div>

              <button type="submit" disabled={submitting}
                className="w-full py-4 rounded-xl font-mono font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-3 shadow-[0_4px_12px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_16px_rgba(6,182,212,0.4)]">
                {submitting ? <><Loader className="h-4 w-4 animate-spin" />SENDING OTP…</> : <><ScanEye className="h-4 w-4" />REGISTER & SEND OTP</>}
              </button>

              <p className="text-center text-xs font-mono font-bold tracking-wider uppercase text-slate-500 mt-2">
                ALREADY A NODE?{" "}
                <Link href="/login" className="text-cyan-600 hover:text-cyan-700 transition-colors underline-offset-4 hover:underline">SIGN IN</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

function Field({ id, label, type, placeholder, defaultValue, icon, autoComplete, error, hint }: {
  id: string; label: string; type: string; placeholder: string
  defaultValue?: string; icon: React.ReactNode; autoComplete?: string; error?: string; hint?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase">{label}</label>
      </div>
      <div className="relative group">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors">{icon}</span>
        <input id={id} name={id} type={type} required autoComplete={autoComplete} placeholder={placeholder} defaultValue={defaultValue}
          aria-invalid={!!error}
          className={`w-full rounded-xl border bg-slate-50/70 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition-all font-mono placeholder:text-slate-400 text-sm ${error ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.1)]" : "border-slate-200 focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"}`} />
      </div>
      {hint && !error && <p className="text-[10px] text-slate-400 font-mono tracking-wide uppercase mt-0.5">{hint}</p>}
      {error && <p className="text-[11px] text-red-500 font-mono flex items-center gap-1.5 mt-0.5"><XCircle className="h-3.5 w-3.5 shrink-0" />{error}</p>}
    </div>
  )
}
