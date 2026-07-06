"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Shield, Loader, CheckCircle2, XCircle, RefreshCw, ChevronLeft } from "lucide-react"

// ─── Masked email display helper ──────────────────────────────────────────────
function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return "X***@XXXXX.com"
  const [localPart, domain] = email.split('@')
  const maskedLocal = localPart.length > 2 
    ? `${localPart.slice(0, 2)}***${localPart.slice(-1)}` 
    : `${localPart.slice(0, 1)}***`
  return `${maskedLocal}@${domain}`
}

// ─── OTP Verification Page ────────────────────────────────────────────────────
export default function VerifyPage() {
  const router = useRouter()
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""))
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(6).fill(null))

  // Email stored in sessionStorage by the auth page
  const [maskedEmail, setMaskedEmail] = useState("X***@XXXXX.com")
  const [isBypass, setIsBypass] = useState(false)
  useEffect(() => {
    const email = sessionStorage.getItem("cg_pending_email") ?? ""
    setMaskedEmail(maskEmail(email))
    setIsBypass(sessionStorage.getItem("cg_bypass") === "true")
  }, [])

  // ─── 60s countdown timer ────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true)
      return
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // ─── Focus first input on mount ─────────────────────────────────────────────
  useEffect(() => {
    inputRefs.current[0]?.focus()
  }, [])

  // ─── OTP input handlers ──────────────────────────────────────────────────────
  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1)
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
      } else if (index > 0) {
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
        inputRefs.current[index - 1]?.focus()
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
    if (!pasted) return
    const newOtp = [...otp]
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pasted[i] ?? ""
    }
    setOtp(newOtp)
    const nextEmpty = newOtp.findIndex((d) => !d)
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty]?.focus()
    } else {
      inputRefs.current[5]?.focus()
    }
  }

  // ─── Submit OTP ──────────────────────────────────────────────────────────────
  const handleVerify = useCallback(async () => {
    const code = otp.join("")
    if (code.length < 6) {
      setStatus("error")
      setMessage("Please enter all 6 digits of your OTP.")
      return
    }

    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp: code }),
      })
      const data = await res.json()

      if (data.success) {
        setStatus("success")
        setMessage("Identity verified. Account created successfully!")
        sessionStorage.removeItem("cg_pending_phone")
        sessionStorage.removeItem("cg_pending_name")
        sessionStorage.removeItem("cg_pending_email")
        setTimeout(() => router.push("/dashboard"), 2000)
      } else {
        setStatus("error")
        setMessage(data.error ?? "Verification failed. Please try again.")
        setOtp(Array(6).fill(""))
        inputRefs.current[0]?.focus()
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Please check your connection and try again.")
      setOtp(Array(6).fill(""))
      inputRefs.current[0]?.focus()
    }
  }, [otp, router])

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (otp.every((d) => d) && status === "idle") {
      handleVerify()
    }
  }, [otp, status, handleVerify])

  // ─── Resend OTP ──────────────────────────────────────────────────────────────
  const handleResend = async () => {
    const phone = sessionStorage.getItem("cg_pending_phone") ?? ""
    const name = sessionStorage.getItem("cg_pending_name") ?? ""
    const email = sessionStorage.getItem("cg_pending_email") ?? ""

    if (!phone) {
      setStatus("error")
      setMessage("Session data lost. Please go back and register again.")
      return
    }

    setResendLoading(true)
    setStatus("idle")
    setMessage("")

    try {
      const res = await fetch("/api/auth/register-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      })
      const data = await res.json()

      if (data.success) {
        setOtp(Array(6).fill(""))
        setCountdown(60)
        setCanResend(false)
        inputRefs.current[0]?.focus()
        setMessage("A new OTP has been sent to your phone.")
        setStatus("idle")
      } else {
        setStatus("error")
        setMessage(data.error ?? "Failed to resend OTP.")
      }
    } catch {
      setStatus("error")
      setMessage("Network error. Could not resend OTP.")
    } finally {
      setResendLoading(false)
    }
  }

  const isLoading = status === "loading"

  return (
    <main className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden bg-slate-950">
      {/* Animated grid backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      {/* Radial glow background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(6,182,212,0.08) 0%, transparent 70%)",
        }}
      />

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <button
          type="button"
          onClick={() => router.back()}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors duration-200 hover:text-cyan-400"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>

        {/* Glassmorphic card with animated cyan border */}
        <div
          className="relative rounded-2xl p-[1px] overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(6,182,212,0.6) 0%, rgba(6,182,212,0.1) 50%, rgba(6,182,212,0.5) 100%)",
            animation: "border-glow 3s ease-in-out infinite alternate",
          }}
        >
          <style>{`
            @keyframes border-glow {
              0%   { box-shadow: 0 0 12px rgba(6,182,212,0.3), inset 0 0 12px rgba(6,182,212,0.05); }
              100% { box-shadow: 0 0 30px rgba(6,182,212,0.6), inset 0 0 20px rgba(6,182,212,0.08); }
            }
            @keyframes spin-slow { to { transform: rotate(360deg); } }
            .spin-slow { animation: spin-slow 1s linear infinite; }
          `}</style>

          <div className="rounded-2xl bg-slate-900/90 backdrop-blur-xl p-8">
            {/* Header */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4">
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-60"
                  style={{ background: "rgba(6,182,212,0.4)" }}
                />
                <Shield
                  className="relative h-14 w-14 text-cyan-400"
                  strokeWidth={1.5}
                  style={{ filter: "drop-shadow(0 0 12px rgba(6,182,212,0.8))" }}
                />
              </div>
              <h1 className="font-mono text-2xl font-bold tracking-wider text-white uppercase">
                OTP Verification
              </h1>
              <p className="mt-2 text-sm text-slate-400 font-mono">
                Code sent to{" "}
                <span className="text-cyan-400 font-semibold">{maskedEmail}</span>
              </p>
            </div>

            {isBypass && (
              <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-center">
                <p className="text-sm font-mono text-amber-400">Sandbox Mode Active</p>
                <p className="text-xs font-mono text-amber-200/70 mt-1">
                  Service constraints active. Enter code <span className="font-bold text-white tracking-widest bg-amber-500/20 px-2 py-0.5 rounded">123456</span> to verify.
                </p>
              </div>
            )}

            {/* OTP Input Grid */}
            <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el }}
                  id={`otp-input-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={isLoading || status === "success"}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  aria-label={`OTP digit ${index + 1}`}
                  className={[
                    "w-12 h-14 rounded-xl text-center text-xl font-bold font-mono",
                    "bg-slate-800/80 border-2 text-white",
                    "transition-all duration-200 outline-none",
                    "focus:scale-110",
                    digit
                      ? "border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]"
                      : "border-slate-600 hover:border-slate-500",
                    status === "error"
                      ? "border-red-500/70 shadow-[0_0_8px_rgba(239,68,68,0.3)]"
                      : "",
                    status === "success"
                      ? "border-green-400/80 shadow-[0_0_12px_rgba(74,222,128,0.4)]"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                />
              ))}
            </div>

            {/* Status Banners */}
            {status === "success" && (
              <div
                role="status"
                className="mb-5 flex items-center gap-3 rounded-xl border border-green-500/40 bg-green-500/10 px-4 py-3"
                style={{ boxShadow: "0 0 20px rgba(74,222,128,0.15)" }}
              >
                <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
                <p className="text-sm text-green-300 font-mono">{message}</p>
              </div>
            )}
            {status === "error" && (
              <div
                role="alert"
                className="mb-5 flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3"
                style={{ boxShadow: "0 0 20px rgba(239,68,68,0.15)" }}
              >
                <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                <p className="text-sm text-red-300 font-mono">{message}</p>
              </div>
            )}
            {status === "idle" && message && (
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3">
                <p className="text-sm text-cyan-300 font-mono">{message}</p>
              </div>
            )}

            {/* Verify Button */}
            <button
              id="verify-otp-btn"
              type="button"
              onClick={handleVerify}
              disabled={isLoading || status === "success"}
              className={[
                "w-full py-3.5 rounded-xl font-mono font-semibold text-sm uppercase tracking-widest",
                "transition-all duration-300 flex items-center justify-center gap-2",
                isLoading || status === "success"
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-cyan-500 hover:bg-cyan-400 text-slate-900 cursor-pointer",
                !isLoading && status !== "success"
                  ? "shadow-[0_0_20px_rgba(6,182,212,0.4)] hover:shadow-[0_0_30px_rgba(6,182,212,0.6)]"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {isLoading ? (
                <>
                  <Loader className="h-4 w-4 spin-slow" />
                  Verifying…
                </>
              ) : status === "success" ? (
                <>
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  Verified
                </>
              ) : (
                "Verify OTP"
              )}
            </button>

             {/* Resend + Countdown */}
            <div className="mt-5 flex items-center justify-center gap-3">
              {canResend ? (
                <button
                  id="resend-otp-btn"
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className={[
                    "inline-flex items-center gap-2 text-sm font-mono transition-all duration-200",
                    resendLoading
                      ? "text-slate-500 cursor-not-allowed"
                      : "text-cyan-400 hover:text-cyan-300 cursor-pointer",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={
                    canResend && !resendLoading
                      ? { textShadow: "0 0 8px rgba(6,182,212,0.6)" }
                      : {}
                  }
                >
                  {resendLoading ? (
                    <Loader className="h-3.5 w-3.5 spin-slow" />
                  ) : (
                    <RefreshCw className="h-3.5 w-3.5" />
                  )}
                  Resend OTP
                </button>
              ) : (
                <p className="text-sm font-mono text-slate-500">
                  Resend available in{" "}
                  <span className="text-cyan-500 font-semibold tabular-nums">
                    0:{countdown.toString().padStart(2, "0")}
                  </span>
                </p>
              )}
            </div>


          </div>
        </div>
      </div>
    </main>
  )
}
