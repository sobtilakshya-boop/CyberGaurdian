"use client"

import type React from "react"
import { useState, useEffect, useRef, Suspense } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
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

// ─── Interactive Realistic 3D Globe Component ─────────────────────────────────
function LoginGlobe() {
  const globeRef = useRef<THREE.Mesh>(null!)
  const cloudsRef = useRef<THREE.Mesh>(null!)
  
  // Load actual detailed Earth textures (Blue Marble and elevation Bump Map)
  const [earthTexture, bumpMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png'
  ])

  useFrame((state) => {
    // Continuous rotation
    globeRef.current.rotation.y = state.clock.elapsedTime * 0.05
    cloudsRef.current.rotation.y = state.clock.elapsedTime * 0.065
  })

  return (
    <group scale={1.85}>
      {/* Earth Mesh */}
      <mesh ref={globeRef}>
        <sphereGeometry args={[0.8, 36, 36]} />
        <meshStandardMaterial
          map={earthTexture}
          bumpMap={bumpMap}
          bumpScale={0.03}
          roughness={0.4}
          metalness={0.12}
        />
      </mesh>

      {/* Grid Wireframe halo shell for security telemetry look */}
      <mesh>
        <sphereGeometry args={[0.806, 24, 24]} />
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.08}
        />
      </mesh>

      {/* Atmosphere outer glow */}
      <mesh ref={cloudsRef}>
        <sphereGeometry args={[0.815, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [mounted, setMounted] = useState(false)
  
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Parallax tilt on mouse hover
  useEffect(() => {
    const handleMouseMoveGlobal = (e: MouseEvent) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect()
        const cardWidth = rect.width
        const cardHeight = rect.height
        const centerX = rect.left + cardWidth / 2
        const centerY = rect.top + cardHeight / 2
        
        const tiltX = (e.clientY - centerY) / (window.innerHeight / 2)
        const tiltY = (e.clientX - centerX) / (window.innerWidth / 2)

        const rx = -tiltX * 8
        const ry = tiltY * 8
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`
      }
    }

    window.addEventListener("mousemove", handleMouseMoveGlobal)
    return () => window.removeEventListener("mousemove", handleMouseMoveGlobal)
  }, [])

  // Light-themed network particle background
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

    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }

    const count = 40
    const particles: Particle[] = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 1,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      
      // Draw grid lines
      ctx.strokeStyle = "rgba(6,182,212,0.06)"
      ctx.lineWidth = 1
      
      // Particles movement & lines
      particles.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy

        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(6,182,212,0.18)"
        ctx.fill()

        // Link close nodes
        for (let j = idx + 1; j < count; j++) {
          const p2 = particles[j]
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (dist < 150) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(6,182,212,${0.08 * (1 - dist / 150)})`
            ctx.stroke()
          }
        }
      })

      animationId = requestAnimationFrame(draw)
    }

    draw()

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
      } else if (data.details) {
        setErrors(data.details as FieldErrors)
      } else {
        setErrors({ _form: data.error ?? "Invalid login configuration. Please audit." })
      }
    } catch {
      setErrors({ _form: "Network authentication link failed. Retry." })
    } finally {
      setSubmitting(false)
    }
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.15 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <main 
      className="relative min-h-screen flex items-center justify-center px-6 py-12 overflow-hidden select-none"
      style={{ background: "linear-gradient(135deg, #F3F6FF 0%, #E8EEFF 50%, #E3E8FF 100%)" }}
    >
      {/* Light grid Canvas backdrop */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />
      
      {/* Split grid for Login Form Card + 3D Earth Globe */}
      <div className="relative w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Column: Glassmorphic light login form */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="lg:col-span-6 flex flex-col items-center lg:items-start"
        >
          {/* Online Gateway Tag */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center gap-2 mb-6 bg-white border border-blue-200/60 px-3 py-1.5 rounded-full shadow-[0_4px_12px_rgba(99,179,237,0.08)] text-[10px] tracking-[0.2em] font-mono text-cyan-600 uppercase font-bold"
          >
            <Terminal className="h-3 w-3 animate-pulse text-cyan-500" />
            <span>[ Security Gateway Online ]</span>
          </motion.div>

          {/* Login Card */}
          <motion.div
            variants={itemVariants}
            ref={cardRef}
            className="w-full relative rounded-3xl p-[1px] transition-all duration-300 shadow-[0_15px_40px_rgba(99,179,237,0.18)]"
            style={{
              background: "linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(255,255,255,0.8) 50%, rgba(139,92,246,0.15) 100%)",
              transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              transformStyle: "preserve-3d",
              willChange: "transform"
            }}
          >
            <div 
              className="rounded-3xl bg-white/90 backdrop-blur-3xl p-8 sm:p-10 border border-white/60"
              style={{ transform: "translateZ(30px)" }}
            >
              {/* Header title */}
              <div className="flex flex-col items-center text-center mb-8">
                <div className="relative mb-4 group cursor-pointer">
                  <div 
                    className="absolute inset-0 rounded-full blur-2xl opacity-40 group-hover:opacity-65 transition-opacity duration-300" 
                    style={{ background: "rgba(6,182,212,0.3)" }} 
                  />
                  <Shield 
                    className="relative h-14 w-14 text-cyan-500 transition-transform duration-300 group-hover:scale-110" 
                    strokeWidth={1.5}
                  />
                </div>
                
                <h1 className="font-mono text-3xl font-black tracking-wider text-slate-900 uppercase">
                  CYBER<span className="text-cyan-500">GUARDIAN</span>
                </h1>
                <p className="mt-2 text-xs text-slate-500 font-mono tracking-wider font-bold">
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
                    className="mb-6 flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-50 px-4 py-3"
                  >
                    <XCircle className="h-4.5 w-4.5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs font-mono text-red-650 leading-relaxed">{errors._form}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form fields */}
              <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
                
                {/* Email block */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="email" className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase">
                      OPERATOR SECURE EMAIL
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">[ ADDR ]</span>
                  </div>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                    <input 
                      id="email" 
                      name="email" 
                      type="email" 
                      required 
                      autoComplete="email"
                      placeholder="operator@gmail.com"
                      className={`w-full rounded-xl border bg-slate-50/70 py-3.5 pl-11 pr-4 text-slate-900 outline-none transition-all font-mono text-sm placeholder:text-slate-400 ${
                        errors.email 
                          ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.1)]" 
                          : "border-slate-200 focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                      }`} 
                    />
                  </div>
                  {errors.email?.[0] && (
                    <p className="text-[11px] text-red-500 font-mono flex items-center gap-1.5 mt-0.5">
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.email[0]}
                    </p>
                  )}
                </div>

                {/* Password block */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="text-xs font-bold font-mono tracking-wider text-slate-700 uppercase">
                      OPERATOR PASSKEY
                    </label>
                    <span className="text-[10px] text-slate-400 font-mono">[ PSWD ]</span>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                    <input 
                      id="password" 
                      name="password" 
                      type={showPassword ? "text" : "password"} 
                      required 
                      autoComplete="current-password"
                      placeholder="••••••••"
                      className={`w-full rounded-xl border bg-slate-50/70 py-3.5 pl-11 pr-11 text-slate-900 outline-none transition-all font-mono text-sm placeholder:text-slate-400 ${
                        errors.password 
                          ? "border-red-400 focus:border-red-500 focus:shadow-[0_0_12px_rgba(239,68,68,0.1)]" 
                          : "border-slate-200 focus:border-cyan-500 focus:bg-white focus:shadow-[0_0_15px_rgba(6,182,212,0.1)]"
                      }`} 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-cyan-500 transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                    </button>
                  </div>
                  {errors.password?.[0] && (
                    <p className="text-[11px] text-red-500 font-mono flex items-center gap-1.5 mt-0.5">
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                      {errors.password[0]}
                    </p>
                  )}
                </div>

                {/* Controls (Save + Retrieve link) */}
                <div className="flex items-center justify-between mt-1">
                  <label className="flex items-center gap-2 cursor-pointer group select-none">
                    <div 
                      className={`relative h-4.5 w-4.5 rounded-lg border-2 transition-all flex items-center justify-center ${
                        rememberMe 
                          ? "border-cyan-500 bg-cyan-500/10 text-cyan-600" 
                          : "border-slate-300 bg-transparent group-hover:border-cyan-500/50"
                      }`}
                      onClick={() => setRememberMe(!rememberMe)}
                    >
                      {rememberMe && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="h-1.5 w-1.5 rounded-sm bg-cyan-500" 
                        />
                      )}
                    </div>
                    <span className="text-xs font-mono text-slate-600 group-hover:text-slate-800 transition-colors">
                      Save Key Configuration
                    </span>
                  </label>
                  <Link 
                    href="/forgot-password" 
                    className="text-xs font-mono text-cyan-600 hover:text-cyan-700 transition-colors tracking-wide underline-offset-4 hover:underline"
                  >
                    Retrieve Key?
                  </Link>
                </div>

                {/* Submit button */}
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="w-full py-4 rounded-xl font-mono font-semibold text-xs uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2 shadow-[0_4px_12px_rgba(6,182,212,0.25)] hover:shadow-[0_4px_16px_rgba(6,182,212,0.4)]"
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

                {/* Sign up link */}
                <div className="flex justify-center items-center gap-1.5 text-xs font-mono text-slate-500 mt-2">
                  <span>New Node Registration?</span>
                  <Link 
                    href="/register" 
                    className="text-cyan-600 hover:text-cyan-700 transition-colors flex items-center gap-0.5 hover:underline font-bold"
                  >
                    Create Node <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </form>
            </div>
          </motion.div>

          {/* Sub bar diagnostics */}
          <motion.div 
            variants={itemVariants}
            className="w-full mt-6 px-4 flex items-center justify-between font-mono text-[10px] text-slate-500 uppercase tracking-widest font-bold"
          >
            <div className="flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-cyan-500 animate-pulse" />
              <span>Connection Secure: SSL_TLSv1.3</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Cpu className="h-3 w-3 text-purple-500" />
              <span>Encrypted Node Status</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Immersive interactive 3D Globe */}
        <div className="lg:col-span-6 h-[400px] lg:h-[500px] w-full flex items-center justify-center relative z-10 cursor-grab active:cursor-grabbing">
          {mounted && (
            <Canvas
              camera={{ position: [0, 0, 2.0], fov: 45 }}
              gl={{ antialias: true, alpha: true }}
              style={{ background: 'transparent' }}
            >
              <ambientLight intensity={1.5} />
              <directionalLight position={[5, 4, 5]} intensity={2.6} />
              <directionalLight position={[-5, -3, 4]} intensity={1.3} color="#06b6d4" />
              
              <Suspense fallback={null}>
                <LoginGlobe />
              </Suspense>

              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate={true}
                autoRotateSpeed={0.6}
              />
            </Canvas>
          )}
        </div>

      </div>
    </main>
  )
}
