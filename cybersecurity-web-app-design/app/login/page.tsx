"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Shield, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader, 
  XCircle, 
  LockKeyhole, 
  ChevronRight,
  Terminal,
  Activity,
  Cpu
} from "lucide-react"
import Link from "next/link"

interface FieldErrors {
  email?: string[]
  password?: string[]
  _form?: string
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  
  // Mouse tracking for interactive 3D card tilt & parallax (using refs to avoid React re-renders)
  const cardRef = useRef<HTMLDivElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  // Canvas particle network background
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      const mx = e.clientX
      const my = e.clientY
      mouseRef.current = { x: mx, y: my }

      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate3d(${mx * 0.03}px, ${my * 0.03}px, 0)`
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate3d(${-mx * 0.02}px, ${-my * 0.02}px, 0)`
      }

      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const cardWidth = rect.width
        const cardHeight = rect.height
        const centerX = rect.left + cardWidth / 2
        const centerY = rect.top + cardHeight / 2
        
        // Calculate tilt percentages (-1 to 1)
        const tiltX = (e.clientY - centerY) / (window.innerHeight / 2)
        const tiltY = (e.clientX - centerX) / (window.innerWidth / 2)

        // Set rotation angles directly on style (max 10 degrees tilt)
        const rx = -tiltX * 10
        const ry = tiltY * 10
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`
      }
    }

    window.addEventListener("mousemove", handleMouseMoveGlobal)
    return () => window.removeEventListener("mousemove", handleMouseMoveGlobal)
  }, [])

  // Canvas particle background rendering loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    // Particle class definition
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      alpha: number
      color: string
    }

    const particles: Particle[] = []
    const particleCount = Math.min(80, Math.floor((width * height) / 22000))

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 1.5 + 0.8,
        alpha: Math.random() * 0.5 + 0.15,
        color: i % 4 === 0 ? "103, 232, 249" : "6, 182, 212" // Cyan variations
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      
      // Draw dynamic lines
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        p1.x += p1.vx
        p1.y += p1.vy

        // Boundaries check
        if (p1.x < 0 || p1.x > width) p1.vx *= -1
        if (p1.y < 0 || p1.y > height) p1.vy *= -1

        // Draw particle node
        ctx.beginPath()
        ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p1.color}, ${p1.alpha})`
        ctx.fill()

        // Interaction with mouse (attract slightly)
        const dxMouse = mouseRef.current.x - p1.x
        const dyMouse = mouseRef.current.y - p1.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        if (distMouse < 180) {
          p1.x += dxMouse * 0.005
          p1.y += dyMouse * 0.005
        }

        // Draw lines to neighboring particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            const lineAlpha = (1 - dist / 120) * 0.12
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(6, 182, 212, ${lineAlpha})`
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setErrors({})
    const form = e.currentTarget
    const formData = new FormData(form)
    const email = (formData.get("email") as string ?? "").trim()
    const password = (formData.get("password") as string ?? "")

    setSubmitting(true)
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.success) {
        router.push("/dashboard")
        router.refresh()
      } else if (data.details) {
        setErrors(data.details as FieldErrors)
      } else {
        setErrors({ _form: data.error ?? "Authentication failed. Access denied." })
      }
    } catch {
      setErrors({ _form: "Security network link failure. Please check connection." })
    } finally {
      setSubmitting(false)
    }
  }

  // Animation variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
  }

  return (
    <main 
      className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden select-none bg-slate-950"
    >
      {/* Dynamic interactive Canvas Network particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      />

      {/* Cyber Grid Backdrop */}
      <div 
        aria-hidden="true" 
        className="pointer-events-none fixed inset-0 opacity-[0.05] z-0"
        style={{ 
          backgroundImage: "linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)", 
          backgroundSize: "60px 60px" 
        }} 
      />

      {/* Floating Ambient Glowing Orbs */}
      <div 
        ref={orb1Ref}
        className="absolute w-[450px] h-[450px] rounded-full blur-[140px] opacity-[0.08] pointer-events-none z-0 transition-transform duration-500 ease-out"
        style={{ 
          background: "radial-gradient(circle, rgba(6,182,212,0.8) 0%, transparent 70%)",
          left: "20%",
          top: "10%",
          transform: "translate3d(0px, 0px, 0)",
          willChange: "transform"
        }}
      />
      <div 
        ref={orb2Ref}
        className="absolute w-[500px] h-[500px] rounded-full blur-[150px] opacity-[0.05] pointer-events-none z-0 transition-transform duration-500 ease-out"
        style={{ 
          background: "radial-gradient(circle, rgba(147,51,234,0.6) 0%, transparent 70%)",
          right: "15%",
          bottom: "15%",
          transform: "translate3d(0px, 0px, 0)",
          willChange: "transform"
        }}
      />

      {/* Main Content Area */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative w-full max-w-lg z-10 flex flex-col items-center"
      >
        {/* Floating Header Badges */}
        <motion.div 
          variants={itemVariants}
          className="flex items-center gap-2 mb-8 bg-slate-900/60 border border-cyan-500/20 px-3 py-1.5 rounded-full backdrop-blur-md text-[10px] tracking-[0.2em] font-mono text-cyan-400 uppercase shadow-[0_0_15px_rgba(6,182,212,0.1)]"
        >
          <Terminal className="h-3 w-3 animate-pulse text-cyan-400" />
          <span>[ SECURITY GATEWAY ONLINE ]</span>
        </motion.div>

        {/* Cinematic Card Layout */}
        <motion.div
          variants={itemVariants}
          ref={cardRef}
          className="w-full relative rounded-2xl p-[1px] transition-all duration-300"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.45) 0%, rgba(6,182,212,0.08) 50%, rgba(6,182,212,0.3) 100%)",
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
            transformStyle: "preserve-3d",
            willChange: "transform"
          }}
        >
          {/* Glassmorphic Background Panel */}
          <div 
            className="rounded-2xl bg-slate-950/80 backdrop-blur-3xl p-8 sm:p-10 border border-slate-900/80 shadow-[0_0_50px_-15px_rgba(6,182,212,0.3)]"
            style={{ transform: "translateZ(30px)" }}
          >
            {/* Header Shield & Titles */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="relative mb-4 group cursor-pointer">
                <div 
                  className="absolute inset-0 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-300" 
                  style={{ background: "rgba(6,182,212,0.3)" }} 
                />
                <Shield 
                  className="relative h-16 w-16 text-cyan-400 transition-transform duration-300 group-hover:scale-110" 
                  strokeWidth={1.2}
                  style={{ filter: "drop-shadow(0 0 15px rgba(6,182,212,0.6))" }} 
                />
              </div>
              <h1 className="font-mono text-3xl font-extrabold tracking-[0.1em] text-white uppercase">
                CYBER<span className="text-cyan-400">GUARDIAN</span>
              </h1>
              <p className="mt-2 text-xs text-slate-500 font-mono tracking-wider">
                DECRYPT CREDENTIALS TO ESTABLISH SECURITY SESSION
              </p>
            </div>

            {/* Form Error Banner */}
            <AnimatePresence>
              {errors._form && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert" 
                  className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-950/20 px-4 py-3"
                >
                  <XCircle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
                  <p className="text-xs font-mono text-red-300 leading-relaxed">{errors._form}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Form Fields */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
              
              {/* Email Block */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="email" className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">
                    OPERATOR SECURE EMAIL
                  </label>
                  <span className="text-[10px] text-slate-600 font-mono">[ ADDR ]</span>
                </div>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    autoComplete="email"
                    placeholder="operator@gmail.com"
                    className={`w-full rounded-xl border bg-slate-950/40 py-3.5 pl-11 pr-4 text-white outline-none transition-all font-mono text-sm placeholder:text-slate-700 ${
                      errors.email 
                        ? "border-red-500/60 focus:border-red-400 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]" 
                        : "border-slate-800 focus:border-cyan-500 focus:bg-slate-950/80 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    }`} 
                  />
                </div>
                {errors.email?.[0] && (
                  <p className="text-[11px] text-red-400 font-mono flex items-center gap-1.5 mt-0.5">
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors.email[0]}
                  </p>
                )}
              </div>

              {/* Password Block */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-xs font-bold font-mono tracking-wider text-slate-400 uppercase">
                    OPERATOR PASSKEY
                  </label>
                  <span className="text-[10px] text-slate-600 font-mono">[ PSWD ]</span>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                  <input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    autoComplete="current-password"
                    placeholder="••••••••"
                    className={`w-full rounded-xl border bg-slate-950/40 py-3.5 pl-11 pr-11 text-white outline-none transition-all font-mono text-sm placeholder:text-slate-700 ${
                      errors.password 
                        ? "border-red-500/60 focus:border-red-400 focus:shadow-[0_0_12px_rgba(239,68,68,0.15)]" 
                        : "border-slate-800 focus:border-cyan-500 focus:bg-slate-950/80 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    }`} 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>
                {errors.password?.[0] && (
                  <p className="text-[11px] text-red-400 font-mono flex items-center gap-1.5 mt-0.5">
                    <XCircle className="h-3.5 w-3.5 shrink-0" />
                    {errors.password[0]}
                  </p>
                )}
              </div>

              {/* Controls (Remember + Forgot Link) */}
              <div className="flex items-center justify-between mt-1">
                <label className="flex items-center gap-2 cursor-pointer group select-none">
                  <div 
                    className={`relative h-4.5 w-4.5 rounded-lg border-2 transition-all flex items-center justify-center ${
                      rememberMe 
                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-400" 
                        : "border-slate-800 bg-transparent group-hover:border-cyan-500/50"
                    }`}
                    onClick={() => setRememberMe(!rememberMe)}
                  >
                    {rememberMe && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="h-1.5 w-1.5 rounded-sm bg-cyan-400" 
                      />
                    )}
                  </div>
                  <span className="text-xs font-mono text-slate-400 group-hover:text-slate-300 transition-colors">
                    Save Key Configuration
                  </span>
                </label>
                <Link 
                  href="/forgot-password" 
                  className="text-xs font-mono text-cyan-500 hover:text-cyan-400 transition-colors tracking-wide underline-offset-4 hover:underline"
                >
                  Retrieve Key?
                </Link>
              </div>

              {/* Submit Trigger */}
              <button 
                type="submit" 
                disabled={submitting}
                className="w-full py-4 rounded-xl font-mono font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-[0_0_25px_rgba(6,182,212,0.3)] hover:shadow-[0_0_35px_rgba(6,182,212,0.5)]"
              >
                {submitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    <span>Decrypting Passkey…</span>
                  </>
                ) : (
                  <>
                    <LockKeyhole className="h-4 w-4" />
                    <span>ESTABLISH SESSION</span>
                  </>
                )}
              </button>

              {/* Register Redirect Link */}
              <div className="flex justify-center items-center gap-1.5 text-xs font-mono text-slate-500 mt-2">
                <span>New Node Registration?</span>
                <Link 
                  href="/register" 
                  className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5 hover:underline"
                >
                  Create Node <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </form>

          </div>
        </motion.div>

        {/* Network telemetry diagnostic sub-bar */}
        <motion.div 
          variants={itemVariants}
          className="w-full mt-6 px-4 flex items-center justify-between font-mono text-[10px] text-slate-600 uppercase tracking-widest"
        >
          <div className="flex items-center gap-1.5">
            <Activity className="h-3 w-3 text-cyan-500/60 animate-pulse" />
            <span>Connection Secure: SSL_TLSv1.3</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3 w-3 text-purple-500/60" />
            <span>Encrypted Node Status</span>
          </div>
        </motion.div>
      </motion.div>
    </main>
  )
}
