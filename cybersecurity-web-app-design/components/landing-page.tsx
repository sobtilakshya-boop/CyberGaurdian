"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Shield, LockKeyhole, Radar, ScanEye, Terminal, Activity, Globe, Cpu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

type LandingPageProps = {
  onAuth: (mode: "login" | "register") => void
}

export function LandingPage({ onAuth }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroCardRef = useRef<HTMLDivElement>(null)
  const aboutCardRef = useRef<HTMLDivElement>(null)
  
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [heroTilt, setHeroTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [aboutTilt, setAboutTilt] = useState({ rotateX: 0, rotateY: 0 })

  // Mouse move handler for parallax and card tilt
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })

      // Calculate tilt for Hero Shield Area
      if (heroCardRef.current) {
        const rect = heroCardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const tiltX = (e.clientY - centerY) / (window.innerHeight / 2)
        const tiltY = (e.clientX - centerX) / (window.innerWidth / 2)
        setHeroTilt({
          rotateX: -tiltX * 12,
          rotateY: tiltY * 12
        })
      }

      // Calculate tilt for About Card
      if (aboutCardRef.current) {
        const rect = aboutCardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const tiltX = (e.clientY - centerY) / (window.innerHeight / 2)
        const tiltY = (e.clientX - centerX) / (window.innerWidth / 2)
        setAboutTilt({
          rotateX: -tiltX * 8,
          rotateY: tiltY * 8
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // ─── Upgraded Canvas: SEM/Microscopy-inspired render loop ───────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    let time = 0

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    // ── Particle nodes ────────────────────────────────────────────────────────
    interface Node {
      x: number
      y: number
      ox: number
      oy: number
      radius: number
      glowRadius: number
      vx: number
      vy: number
      angle: number
      speed: number
      color: string
      alpha: number
    }

    const nodes: Node[] = []
    const nodeCount = Math.min(70, Math.floor((width * height) / 20000))

    const nodeColors = [
      "6, 182, 212",   // Electric Cyan
      "56, 189, 248",  // Sky Blue
      "59, 130, 246",  // Azure Blue
      "99, 102, 241",  // Indigo
    ]

    for (let i = 0; i < nodeCount; i++) {
      const rx = Math.random() * width
      const ry = Math.random() * height
      nodes.push({
        x: rx,
        y: ry,
        ox: rx,
        oy: ry,
        radius: Math.random() * 1.8 + 0.6,
        glowRadius: Math.random() * 6 + 3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.015 + 0.005,
        color: nodeColors[i % nodeColors.length],
        alpha: Math.random() * 0.4 + 0.15,
      })
    }

    // ── SEM sweep rings config (drawn in canvas, deep z) ─────────────────────
    const rings = [
      { r: 120, opacity: 0.018, width: 0.5 },
      { r: 220, opacity: 0.013, width: 0.4 },
      { r: 340, opacity: 0.008, width: 0.3 },
      { r: 480, opacity: 0.005, width: 0.3 },
      { r: 650, opacity: 0.003, width: 0.25 },
    ]

    const render = () => {
      time += 1
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height * 0.42

      // ── 1. Fine hex-like dot matrix grid (SEM microscopy aesthetic) ──────────
      const dotSpacing = 36
      const dotRadius = 0.55
      for (let gx = 0; gx < width; gx += dotSpacing) {
        for (let gy = 0; gy < height; gy += dotSpacing) {
          const offset = (Math.floor(gy / dotSpacing) % 2) * (dotSpacing / 2)
          const dotX = gx + offset
          const distFromCenter = Math.sqrt((dotX - cx) ** 2 + (gy - cy) ** 2)
          const falloff = Math.max(0, 1 - distFromCenter / (width * 0.75))
          const pulse = 0.5 + 0.5 * Math.sin(time * 0.008 + distFromCenter * 0.008)
          ctx.beginPath()
          ctx.arc(dotX, gy, dotRadius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(6, 182, 212, ${0.025 * falloff * pulse})`
          ctx.fill()
        }
      }

      // ── 2. Fine scanning line grid (subtle, supporting the hex dots) ─────────
      ctx.lineWidth = 0.4
      const gridSize = 72
      for (let x = 0; x < width; x += gridSize) {
        const distX = Math.abs(x - cx) / width
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.015 * (1 - distX)})`
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        const distY = Math.abs(y - cy) / height
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.012 * (1 - distY)})`
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
      }

      // ── 3. SEM sweep rings — pulsing animated concentric circles ────────────
      for (const ring of rings) {
        const pulse = 0.6 + 0.4 * Math.sin(time * 0.006 + ring.r * 0.01)
        ctx.beginPath()
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(6, 182, 212, ${ring.opacity * pulse})`
        ctx.lineWidth = ring.width
        ctx.stroke()
      }

      // ── 4. Rotating arc sweep (radar arm) ─────────────────────────────────
      const sweepAngle = (time * 0.003) % (Math.PI * 2)
      const sweepGrad = ctx.createConicalGradient
        ? null  // only use if supported
        : null
      // Manual arc sweep
      for (let arc = 0; arc < 5; arc++) {
        const arcAngle = sweepAngle - arc * 0.12
        const arcOpacity = Math.max(0, (0.022 - arc * 0.004))
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, 480, arcAngle, arcAngle + 0.12)
        ctx.closePath()
        ctx.fillStyle = `rgba(6, 182, 212, ${arcOpacity})`
        ctx.fill()
      }

      // ── 5. Particle nodes with bloom glow halos ──────────────────────────────
      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i]

        // Drift
        p1.angle += p1.speed
        p1.x += p1.vx + Math.sin(p1.angle) * 0.12
        p1.y += p1.vy + Math.cos(p1.angle) * 0.12

        // Boundary
        if (p1.x < 0 || p1.x > width) p1.vx *= -1
        if (p1.y < 0 || p1.y > height) p1.vy *= -1

        // Mouse-repulsion scatter
        const dxMouse = mousePos.x - p1.x
        const dyMouse = mousePos.y - p1.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

        let offsetX = 0
        let offsetY = 0
        if (distMouse < 200) {
          const force = (200 - distMouse) / 200
          // Repel outward instead of attract
          offsetX = -dxMouse * force * 0.08
          offsetY = -dyMouse * force * 0.08
        }

        const renderX = p1.x + offsetX
        const renderY = p1.y + offsetY

        // Pulse alpha
        const alphaPulse = p1.alpha * (0.7 + 0.3 * Math.sin(time * 0.02 + i))

        // Bloom glow halo (soft outer ring)
        const glow = ctx.createRadialGradient(renderX, renderY, 0, renderX, renderY, p1.glowRadius * 2.5)
        glow.addColorStop(0, `rgba(${p1.color}, ${alphaPulse * 0.6})`)
        glow.addColorStop(0.4, `rgba(${p1.color}, ${alphaPulse * 0.15})`)
        glow.addColorStop(1, `rgba(${p1.color}, 0)`)
        ctx.beginPath()
        ctx.arc(renderX, renderY, p1.glowRadius * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Solid node core
        ctx.beginPath()
        ctx.arc(renderX, renderY, p1.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p1.color}, ${alphaPulse})`
        ctx.fill()

        // Connection lines
        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j]

          const dxMouse2 = mousePos.x - p2.x
          const dyMouse2 = mousePos.y - p2.y
          const distMouse2 = Math.sqrt(dxMouse2 * dxMouse2 + dyMouse2 * dyMouse2)

          let offsetX2 = 0
          let offsetY2 = 0
          if (distMouse2 < 200) {
            const force2 = (200 - distMouse2) / 200
            offsetX2 = -dxMouse2 * force2 * 0.08
            offsetY2 = -dyMouse2 * force2 * 0.08
          }

          const renderX2 = p2.x + offsetX2
          const renderY2 = p2.y + offsetY2

          const dx = renderX - renderX2
          const dy = renderY - renderY2
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.07
            const lineGrad = ctx.createLinearGradient(renderX, renderY, renderX2, renderY2)
            lineGrad.addColorStop(0, `rgba(${p1.color}, ${alpha})`)
            lineGrad.addColorStop(1, `rgba(${p2.color}, ${alpha * 0.5})`)
            ctx.beginPath()
            ctx.moveTo(renderX, renderY)
            ctx.lineTo(renderX2, renderY2)
            ctx.strokeStyle = lineGrad
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      // ── 6. Central focal glow (depth-of-field center bloom) ──────────────────
      const focalGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 320)
      focalGlow.addColorStop(0, `rgba(6, 182, 212, ${0.04 + 0.015 * Math.sin(time * 0.01)})`)
      focalGlow.addColorStop(0.5, `rgba(56, 189, 248, 0.015)`)
      focalGlow.addColorStop(1, "rgba(6, 182, 212, 0)")
      ctx.beginPath()
      ctx.arc(cx, cy, 320, 0, Math.PI * 2)
      ctx.fillStyle = focalGlow
      ctx.fill()

      animationId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, [mousePos])

  // Framer Motion entry animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } }
  }

  return (
    <div
      className="relative min-h-screen flex flex-col overflow-hidden text-slate-100"
      style={{
        background: "radial-gradient(ellipse 120% 80% at 50% 0%, #020d1a 0%, #000d1f 35%, #010810 60%, #000508 100%)"
      }}
    >

      {/* ── BACKGROUND LAYER 0: Dynamic interactive canvas (z-0) ─────────────── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
      />

      {/* ── BACKGROUND LAYER 1: Film-grain noise texture overlay ─────────────── */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          opacity: 0.028,
          mixBlendMode: "overlay"
        }}
      />

      {/* ── BACKGROUND LAYER 2: Deep bokeh orbs (volumetric ambient light) ────── */}

      {/* Primary bokeh — top-center electric cyan */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none z-[2] transition-transform duration-1000 ease-out"
        style={{
          width: "800px", height: "700px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.55) 0%, rgba(6,182,212,0.08) 45%, transparent 70%)",
          filter: "blur(130px)",
          opacity: 0.10,
          top: "-15%",
          left: "20%",
          transform: `translate(${mousePos.x * 0.018}px, ${mousePos.y * 0.014}px)`
        }}
      />

      {/* Secondary bokeh — right side azure blue */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none z-[2] transition-transform duration-1200 ease-out"
        style={{
          width: "620px", height: "620px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56,189,248,0.65) 0%, rgba(59,130,246,0.12) 40%, transparent 70%)",
          filter: "blur(150px)",
          opacity: 0.09,
          top: "10%",
          right: "-5%",
          transform: `translate(${-mousePos.x * 0.012}px, ${mousePos.y * 0.01}px)`
        }}
      />

      {/* Tertiary bokeh — bottom-left deep cobalt */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none z-[2] transition-transform duration-1400 ease-out"
        style={{
          width: "700px", height: "600px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,64,175,0.7) 0%, rgba(59,130,246,0.08) 45%, transparent 70%)",
          filter: "blur(170px)",
          opacity: 0.10,
          bottom: "5%",
          left: "-8%",
          transform: `translate(${mousePos.x * 0.008}px, ${-mousePos.y * 0.01}px)`
        }}
      />

      {/* Micro-bokeh 1 — small near-field cyan (creates depth illusion) */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none z-[2] transition-transform duration-800 ease-out"
        style={{
          width: "280px", height: "280px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(6,182,212,0.9) 0%, transparent 70%)",
          filter: "blur(90px)",
          opacity: 0.07,
          top: "30%",
          left: "38%",
          transform: `translate(${mousePos.x * 0.025}px, ${mousePos.y * 0.02}px)`
        }}
      />

      {/* Micro-bokeh 2 — small near-field blue accent */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none z-[2] transition-transform duration-600 ease-out"
        style={{
          width: "200px", height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(99,102,241,0.8) 0%, transparent 70%)",
          filter: "blur(80px)",
          opacity: 0.08,
          top: "20%",
          right: "30%",
          transform: `translate(${-mousePos.x * 0.02}px, ${mousePos.y * 0.016}px)`
        }}
      />

      {/* ── BACKGROUND LAYER 3: Chromatic ambient overlay ─────────────────────── */}
      {/* Full-screen radial giving volumetric "glow field" sensation */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[3]"
        style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 35%, rgba(6,182,212,0.032) 0%, rgba(56,189,248,0.018) 40%, transparent 75%)"
        }}
      />

      {/* ── BACKGROUND LAYER 4: Depth-of-field edge vignette (bokeh blur edges) ─ */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none z-[4]"
        style={{
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 30%, rgba(0,5,10,0.55) 75%, rgba(0,2,6,0.88) 100%)"
        }}
      />

      {/* ── BACKGROUND LAYER 5: Text protection vignette (behind content) ──────── */}
      {/* Darker radial behind the hero center — preserves text contrast */}
      <div
        aria-hidden="true"
        className="absolute pointer-events-none z-[5]"
        style={{
          width: "900px", height: "700px",
          top: "50%", left: "50%",
          transform: "translate(-50%, -52%)",
          background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,3,8,0.72) 0%, rgba(0,3,8,0.35) 55%, transparent 80%)"
        }}
      />

      {/* ── FOREGROUND: Header (z-20) ─────────────────────────────────────────── */}
      <header className="relative w-full z-20 flex w-full items-center justify-end px-4 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg font-semibold tracking-tight text-foreground">
            CyberPeace
          </span>
          <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/40 bg-white p-1">
            <Image
              src="/images/cyberpeace-logo.webp"
              alt="CyberPeace logo"
              width={44}
              height={44}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </div>
      </header>

      {/* ── FOREGROUND: Main Content — Hero (z-10) ───────────────────────────── */}
      <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-12 text-center z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col items-center max-w-4xl w-full"
        >
          {/* Eyebrow Status Badge */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-2 mb-8 bg-slate-900/60 border border-cyan-500/20 px-3.5 py-1.5 rounded-full backdrop-blur-md text-[10px] tracking-[0.25em] font-mono text-cyan-400 uppercase shadow-[0_0_15px_rgba(6,182,212,0.08)]"
          >
            <Activity className="h-3 w-3 animate-pulse text-cyan-400" />
            <span>[ SYSTEM PORTAL GATEWAY ONLINE ]</span>
          </motion.div>

          {/* Holographic 3D Hero Core Shield */}
          <motion.div
            variants={itemVariants}
            ref={heroCardRef}
            style={{
              transform: `perspective(1000px) rotateX(${heroTilt.rotateX}deg) rotateY(${heroTilt.rotateY}deg)`,
              transformStyle: "preserve-3d"
            }}
            className="relative mb-10 flex h-36 w-36 items-center justify-center transition-transform duration-300 ease-out cursor-pointer group"
          >
            {/* Ambient Back Glows */}
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-2xl opacity-60 group-hover:opacity-85 transition-opacity duration-300" />

            {/* Concentric Pinging Waves */}
            <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/10" style={{ animationDuration: "3s" }} />
            <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/5" style={{ animationDuration: "2s", animationDelay: "1s" }} />

            {/* Rotating Circular Grid Borders */}
            <div className="absolute inset-1 rounded-full border border-cyan-500/20 border-dashed animate-spin" style={{ animationDuration: "15s" }} />
            <div className="absolute inset-4 rounded-full border border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors duration-300" />
            <div className="absolute inset-6 rounded-full border border-blue-500/20 border-dotted animate-spin" style={{ animationDuration: "10s", animationDirection: "reverse" }} />

            {/* Animated Radar Sweep */}
            <Radar
              className="absolute h-32 w-32 animate-spin text-cyan-400/40 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]"
              style={{ animationDuration: "5s" }}
              aria-hidden="true"
            />

            {/* Pulsing Shield core */}
            <div
              className="relative flex items-center justify-center transition-transform duration-300"
              style={{ transform: "translateZ(25px)" }}
            >
              <Shield
                className="h-16 w-16 text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.75)]"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          </motion.div>

          {/* Large Title */}
          <motion.h1
            variants={itemVariants}
            className="font-mono text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-none"
          >
            <span>CYBER</span>
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.3)] pl-2">
              GUARDIAN
            </span>
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            variants={itemVariants}
            className="mt-6 max-w-xl text-slate-400 font-mono text-xs sm:text-sm tracking-wide leading-relaxed text-pretty"
          >
            Next-generation cyber hygiene and digital defense. Stay protected,
            stay vigilant, stay at peace.
          </motion.p>

          {/* CTA Glass Buttons */}
          <motion.div
            variants={itemVariants}
            className="mt-10 flex w-full max-w-md flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <button
              onClick={() => onAuth("login")}
              className="group relative w-full sm:w-auto min-w-[170px] py-3.5 px-6 rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.45)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
            >
              <LockKeyhole className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
              <span>Login Portal</span>
            </button>

            <button
              onClick={() => onAuth("register")}
              className="group relative w-full sm:w-auto min-w-[170px] py-3.5 px-6 rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-slate-200 bg-slate-900/40 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.03)]"
            >
              <ScanEye className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
              <span>New Operator</span>
            </button>
          </motion.div>
        </motion.div>
      </main>

      {/* ── FOREGROUND: About Us (Glassmorphic Card Panel) — z-10 ────────────── */}
      <section className="relative px-6 py-20 z-10 bg-gradient-to-b from-transparent to-slate-950">
        <motion.div
          ref={aboutCardRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
          style={{
            transform: `perspective(1000px) rotateX(${aboutTilt.rotateX}deg) rotateY(${aboutTilt.rotateY}deg)`,
            transformStyle: "preserve-3d",
            background: "linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(6,182,212,0.05) 50%, rgba(6,182,212,0.2) 100%)"
          }}
          className="mx-auto max-w-3xl relative rounded-2xl p-[1px] shadow-[0_0_50px_rgba(6,182,212,0.05)] hover:shadow-[0_0_60px_rgba(6,182,212,0.12)] transition-all duration-300 ease-out"
        >
          <div
            className="rounded-2xl bg-slate-950/80 backdrop-blur-3xl p-8 sm:p-12 border border-slate-900/80 flex flex-col items-center text-center gap-6"
            style={{ transform: "translateZ(25px)" }}
          >
            {/* Eyebrow */}
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
              <Globe className="h-3.5 w-3.5 text-cyan-500/80" />
              <span>[ Platform Mission Overview ]</span>
            </div>

            <h2 className="font-mono text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-white">
              <span className="text-cyan-400">{"// "}</span>About Us
            </h2>

            <div className="h-px w-28 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

            <p className="leading-relaxed text-slate-400 font-mono text-xs sm:text-sm tracking-wide text-pretty mt-2">
              CyberPeace Foundation endeavors to make the internet a more secure,
              stable, trustworthy and inclusive place for all netizens across the
              globe. As a non-partisan collective, we unite expertise,
              experiences, capacity and intent across a broad spectrum of
              institutions, disciplines and cultures in order to combat the common
              threat of cybercrime.
            </p>
          </div>
        </motion.div>
      </section>

      {/* ── FOREGROUND: Footer Diagnostic Panel — z-10 ───────────────────────── */}
      <footer className="relative z-10 border-t border-slate-900 bg-slate-950/80 px-6 py-8 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-500 uppercase tracking-widest sm:px-12">
        <div className="flex items-center gap-2">
          <Cpu className="h-3 w-3 text-cyan-500/60" />
          <span>CYBERPEACE &middot; CYBERGUARDIAN CORE</span>
        </div>
        <div className="flex items-center gap-4">
          <span>PORT: 3000</span>
          <span>SECURITY LEVEL: STAGE 1</span>
        </div>
      </footer>
    </div>
  )
}
