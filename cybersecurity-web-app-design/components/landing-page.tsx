"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Shield, LockKeyhole, Radar, ScanEye, Activity, Globe, Cpu } from "lucide-react"
import { motion } from "framer-motion"

// ── Custom Cyber Targeting Cursor ────────────────────────────────────────────
function CyberCursor() {
  const posRef = useRef({ x: -300, y: -300 })
  const [renderPos, setRenderPos] = useState({ x: -300, y: -300 })
  const [isHover, setIsHover] = useState(false)
  const [isClick, setIsClick] = useState(false)
  const [arcAngle, setArcAngle] = useState(0)
  const arcAngleRef = useRef(0)
  const rafRef = useRef<number>()

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY }
      const el = e.target as HTMLElement
      setIsHover(!!(el.closest("button") || el.closest("a")))
    }
    const onDown = () => setIsClick(true)
    const onUp = () => setIsClick(false)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mousedown", onDown)
    window.addEventListener("mouseup", onUp)

    const animate = () => {
      arcAngleRef.current += 1.8
      setArcAngle(arcAngleRef.current)
      setRenderPos({ ...posRef.current })
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const outerR = isHover ? 26 : isClick ? 14 : 18
  const svgSize = (outerR + 12) * 2
  const cx = svgSize / 2
  const cy = svgSize / 2
  const arcR = outerR + 8
  const circ = 2 * Math.PI * arcR
  const dashLen = circ * 0.22

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed z-[9999]"
      style={{ left: renderPos.x, top: renderPos.y, transform: "translate(-50%,-50%)" }}
    >
      {/* Rotating dashed outer arc */}
      <svg
        width={svgSize}
        height={svgSize}
        style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: `translate(-50%,-50%) rotate(${arcAngle}deg)`,
          transition: "width 0.15s ease, height 0.15s ease",
          overflow: "visible",
        }}
      >
        <circle
          cx={cx} cy={cy} r={arcR}
          fill="none"
          stroke="rgba(6,182,212,0.85)"
          strokeWidth="1"
          strokeDasharray={`${dashLen} ${circ - dashLen}`}
          strokeLinecap="round"
        />
        <circle
          cx={cx} cy={cy} r={arcR}
          fill="none"
          stroke="rgba(56,189,248,0.5)"
          strokeWidth="1"
          strokeDasharray={`${dashLen * 0.6} ${circ - dashLen * 0.6}`}
          strokeDashoffset={-(circ / 2)}
          strokeLinecap="round"
        />
      </svg>

      {/* Static outer targeting ring */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: outerR * 2, height: outerR * 2,
        borderRadius: "50%",
        border: `1px solid rgba(6,182,212,${isHover ? 0.9 : 0.55})`,
        transform: "translate(-50%,-50%)",
        boxShadow: `0 0 10px rgba(6,182,212,0.3), inset 0 0 8px rgba(6,182,212,0.08)`,
        transition: "all 0.15s ease",
      }} />

      {/* Corner bracket notches at 4 quadrant edges */}
      {[0, 90, 180, 270].map((deg) => (
        <div key={deg} style={{
          position: "absolute", top: "50%", left: "50%",
          width: isHover ? 9 : 7,
          height: "1px",
          background: "rgba(6,182,212,0.9)",
          boxShadow: "0 0 5px rgba(6,182,212,0.7)",
          transformOrigin: "0 50%",
          transform: `rotate(${deg}deg) translateX(${outerR + 5}px) translateY(-50%)`,
          transition: "all 0.15s ease",
        }} />
      ))}

      {/* Inner dot */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        width: isClick ? 8 : 4, height: isClick ? 8 : 4,
        borderRadius: "50%",
        background: "rgba(6,182,212,1)",
        boxShadow: "0 0 8px rgba(6,182,212,1), 0 0 16px rgba(6,182,212,0.5)",
        transform: "translate(-50%,-50%)",
        transition: "all 0.1s ease",
      }} />
    </div>
  )
}

// ── 3D Wireframe Globe ───────────────────────────────────────────────────────
function WireframeGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const SIZE = 520
    canvas.width = SIZE
    canvas.height = SIZE
    const cx = SIZE / 2
    const cy = SIZE / 2
    const RADIUS = 190
    const FOV = 520

    let rotY = 0
    let rotX = 0.22  // slight tilt for depth
    let rafId: number

    // Project a 3D unit-sphere point to 2D canvas coordinates
    const project = (x: number, y: number, z: number): { px: number; py: number; depth: number } => {
      // Rotate around X axis (tilt)
      const cosX = Math.cos(rotX)
      const sinX = Math.sin(rotX)
      const y1 = y * cosX - z * sinX
      const z1 = y * sinX + z * cosX

      // Rotate around Y axis (spin)
      const cosY = Math.cos(rotY)
      const sinY = Math.sin(rotY)
      const x2 = x * cosY + z1 * sinY
      const z2 = -x * sinY + z1 * cosY

      // Perspective divide
      const depth = z2 + 2.5
      const scale = FOV / (FOV + depth * RADIUS)
      return {
        px: cx + x2 * RADIUS * scale,
        py: cy + y1 * RADIUS * scale,
        depth: depth,
      }
    }

    const LAT_LINES = 9
    const LON_LINES = 16
    const STEPS = 96

    const render = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)
      rotY += 0.004

      // ── Latitude circles ──────────────────────────────────────────────────
      for (let li = 1; li < LAT_LINES; li++) {
        const lat = (li / LAT_LINES) * Math.PI - Math.PI / 2
        const r = Math.cos(lat)
        const yy = Math.sin(lat)

        ctx.beginPath()
        let first = true
        for (let s = 0; s <= STEPS; s++) {
          const lon = (s / STEPS) * Math.PI * 2
          const xx = r * Math.cos(lon)
          const zz = r * Math.sin(lon)
          const { px, py, depth } = project(xx, yy, zz)
          // Front-face: depth > 0 means closer, lighter
          if (first) { ctx.moveTo(px, py); first = false }
          else ctx.lineTo(px, py)
        }
        ctx.strokeStyle = `rgba(6, 182, 212, 0.14)`
        ctx.lineWidth = 0.9
        ctx.stroke()
      }

      // ── Longitude lines ────────────────────────────────────────────────────
      for (let li = 0; li < LON_LINES; li++) {
        const lon = (li / LON_LINES) * Math.PI * 2

        // Segment into front/back with opacity split
        const frontPts: { px: number; py: number; depth: number }[] = []
        const backPts: { px: number; py: number; depth: number }[] = []

        for (let s = 0; s <= STEPS; s++) {
          const lat = (s / STEPS) * Math.PI - Math.PI / 2
          const r = Math.cos(lat)
          const yy = Math.sin(lat)
          const xx = r * Math.cos(lon)
          const zz = r * Math.sin(lon)
          const pt = project(xx, yy, zz)
          if (pt.depth >= 0) frontPts.push(pt)
          else backPts.push(pt)
        }

        // Back half (dimmer)
        if (backPts.length > 1) {
          ctx.beginPath()
          backPts.forEach((p, i) => { i === 0 ? ctx.moveTo(p.px, p.py) : ctx.lineTo(p.px, p.py) })
          ctx.strokeStyle = `rgba(6, 182, 212, 0.05)`
          ctx.lineWidth = 0.6
          ctx.stroke()
        }

        // Front half (brighter)
        if (frontPts.length > 1) {
          ctx.beginPath()
          frontPts.forEach((p, i) => { i === 0 ? ctx.moveTo(p.px, p.py) : ctx.lineTo(p.px, p.py) })
          ctx.strokeStyle = `rgba(6, 182, 212, 0.28)`
          ctx.lineWidth = 1.0
          ctx.stroke()
        }
      }

      // ── Equator highlight (brighter) ───────────────────────────────────────
      ctx.beginPath()
      let firstEq = true
      for (let s = 0; s <= STEPS; s++) {
        const lon = (s / STEPS) * Math.PI * 2
        const { px, py, depth } = project(Math.cos(lon), 0, Math.sin(lon))
        if (firstEq) { ctx.moveTo(px, py); firstEq = false } else ctx.lineTo(px, py)
      }
      ctx.strokeStyle = `rgba(56, 189, 248, 0.32)`
      ctx.lineWidth = 1.2
      ctx.stroke()

      // ── Glowing poles ─────────────────────────────────────────────────────
      const northPole = project(0, 1, 0)
      const southPole = project(0, -1, 0)
      for (const pole of [northPole, southPole]) {
        const g = ctx.createRadialGradient(pole.px, pole.py, 0, pole.px, pole.py, 12)
        g.addColorStop(0, "rgba(6,182,212,0.7)")
        g.addColorStop(1, "rgba(6,182,212,0)")
        ctx.beginPath()
        ctx.arc(pole.px, pole.py, 12, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      // ── Ambient glow halo ─────────────────────────────────────────────────
      const halo = ctx.createRadialGradient(cx, cy, RADIUS * 0.7, cx, cy, RADIUS * 1.3)
      halo.addColorStop(0, "rgba(6,182,212,0.0)")
      halo.addColorStop(0.7, "rgba(6,182,212,0.04)")
      halo.addColorStop(1, "rgba(6,182,212,0.0)")
      ctx.beginPath()
      ctx.arc(cx, cy, RADIUS * 1.3, 0, Math.PI * 2)
      ctx.fillStyle = halo
      ctx.fill()

      rafId = requestAnimationFrame(render)
    }

    render()
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute z-[2]"
      style={{
        width: "520px",
        height: "520px",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -56%)",
        opacity: 0.75,
        filter: "drop-shadow(0 0 40px rgba(6,182,212,0.18))",
      }}
    />
  )
}

type LandingPageProps = {
  onAuth: (mode: "login" | "register") => void
}

export function LandingPage({ onAuth }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroCardRef = useRef<HTMLDivElement>(null)
  const aboutCardRef = useRef<HTMLDivElement>(null)

  const [heroTilt, setHeroTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [aboutTilt, setAboutTilt] = useState({ rotateX: 0, rotateY: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  // Mouse handler — only for card tilt and bokeh parallax (NOT particles)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })

      if (heroCardRef.current) {
        const rect = heroCardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const tiltX = (e.clientY - centerY) / (window.innerHeight / 2)
        const tiltY = (e.clientX - centerX) / (window.innerWidth / 2)
        setHeroTilt({ rotateX: -tiltX * 12, rotateY: tiltY * 12 })
      }
      if (aboutCardRef.current) {
        const rect = aboutCardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const tiltX = (e.clientY - centerY) / (window.innerHeight / 2)
        const tiltY = (e.clientX - centerX) / (window.innerWidth / 2)
        setAboutTilt({ rotateX: -tiltX * 8, rotateY: tiltY * 8 })
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // ── Background canvas: autonomous particles, NO mouse interaction ────────────
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

    interface Node {
      x: number; y: number
      radius: number; glowRadius: number
      vx: number; vy: number
      angle: number; speed: number
      color: string; alpha: number
    }

    const nodeColors = ["6, 182, 212", "56, 189, 248", "59, 130, 246", "99, 102, 241"]
    const nodeCount = Math.min(65, Math.floor((width * height) / 22000))
    const nodes: Node[] = []

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.6 + 0.5,
        glowRadius: Math.random() * 5 + 3,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.012 + 0.004,
        color: nodeColors[i % nodeColors.length],
        alpha: Math.random() * 0.35 + 0.12,
      })
    }

    const rings = [
      { r: 110, op: 0.016 }, { r: 210, op: 0.011 },
      { r: 330, op: 0.007 }, { r: 470, op: 0.004 }, { r: 640, op: 0.003 },
    ]

    const render = () => {
      time += 1
      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      const cy = height * 0.42

      // Hex dot matrix grid (SEM microscopy aesthetic)
      const dotSpacing = 36
      for (let gx = 0; gx < width; gx += dotSpacing) {
        for (let gy = 0; gy < height; gy += dotSpacing) {
          const offset = (Math.floor(gy / dotSpacing) % 2) * (dotSpacing / 2)
          const dotX = gx + offset
          const distFromCenter = Math.sqrt((dotX - cx) ** 2 + (gy - cy) ** 2)
          const falloff = Math.max(0, 1 - distFromCenter / (width * 0.72))
          const pulse = 0.5 + 0.5 * Math.sin(time * 0.007 + distFromCenter * 0.007)
          ctx.beginPath()
          ctx.arc(dotX, gy, 0.5, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(6, 182, 212, ${0.022 * falloff * pulse})`
          ctx.fill()
        }
      }

      // Scanning grid lines
      const gridSize = 72
      for (let x = 0; x < width; x += gridSize) {
        ctx.strokeStyle = `rgba(6, 182, 212, ${0.012 * (1 - Math.abs(x - cx) / width)})`
        ctx.lineWidth = 0.4
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.009 * (1 - Math.abs(y - cy) / height)})`
        ctx.lineWidth = 0.4
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke()
      }

      // SEM pulse rings
      for (const ring of rings) {
        const pulse = 0.55 + 0.45 * Math.sin(time * 0.005 + ring.r * 0.01)
        ctx.beginPath()
        ctx.arc(cx, cy, ring.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(6, 182, 212, ${ring.op * pulse})`
        ctx.lineWidth = 0.4
        ctx.stroke()
      }

      // Radar sweep arm (purely autonomous)
      const sweepAngle = (time * 0.0025) % (Math.PI * 2)
      for (let arc = 0; arc < 5; arc++) {
        const a = sweepAngle - arc * 0.11
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, 460, a, a + 0.11)
        ctx.closePath()
        ctx.fillStyle = `rgba(6, 182, 212, ${Math.max(0, 0.018 - arc * 0.003)})`
        ctx.fill()
      }

      // Autonomous particles — NO mouse interaction
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i]
        p.angle += p.speed
        p.x += p.vx + Math.sin(p.angle) * 0.1
        p.y += p.vy + Math.cos(p.angle) * 0.1
        if (p.x < 0 || p.x > width) p.vx *= -1
        if (p.y < 0 || p.y > height) p.vy *= -1

        const alphaPulse = p.alpha * (0.65 + 0.35 * Math.sin(time * 0.018 + i))

        // Bloom glow halo
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.glowRadius * 2.5)
        glow.addColorStop(0, `rgba(${p.color}, ${alphaPulse * 0.55})`)
        glow.addColorStop(0.45, `rgba(${p.color}, ${alphaPulse * 0.12})`)
        glow.addColorStop(1, `rgba(${p.color}, 0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.glowRadius * 2.5, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.color}, ${alphaPulse})`
        ctx.fill()

        // Connection lines (autonomous)
        for (let j = i + 1; j < nodes.length; j++) {
          const q = nodes[j]
          const dx = p.x - q.x
          const dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 155) {
            const alpha = (1 - dist / 155) * 0.065
            const lineGrad = ctx.createLinearGradient(p.x, p.y, q.x, q.y)
            lineGrad.addColorStop(0, `rgba(${p.color}, ${alpha})`)
            lineGrad.addColorStop(1, `rgba(${q.color}, ${alpha * 0.4})`)
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = lineGrad; ctx.lineWidth = 0.55; ctx.stroke()
          }
        }
      }

      // Center focal bloom
      const focalGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, 300)
      focalGlow.addColorStop(0, `rgba(6, 182, 212, ${0.035 + 0.012 * Math.sin(time * 0.008)})`)
      focalGlow.addColorStop(0.5, "rgba(56, 189, 248, 0.012)")
      focalGlow.addColorStop(1, "rgba(6, 182, 212, 0)")
      ctx.beginPath(); ctx.arc(cx, cy, 300, 0, Math.PI * 2)
      ctx.fillStyle = focalGlow; ctx.fill()

      animationId = requestAnimationFrame(render)
    }

    render()
    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationId)
    }
  }, []) // ← empty deps: NO mouse interaction at all

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  }
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
  }

  return (
    <>
      {/* Custom cursor — rendered outside main div so it's always on top */}
      <CyberCursor />

      <div
        className="relative min-h-screen flex flex-col overflow-hidden text-slate-100"
        style={{
          background: "radial-gradient(ellipse 120% 80% at 50% 0%, #020d1a 0%, #000d1f 35%, #010810 60%, #000508 100%)",
          cursor: "none",
        }}
      >
        {/* ── BG 0: Autonomous canvas particles ─────────────────────────────── */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />

        {/* ── BG 1: 3D Rotating wireframe globe ─────────────────────────────── */}
        <WireframeGlobe />

        {/* ── BG 2: Film grain noise ─────────────────────────────────────────── */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            opacity: 0.025,
            mixBlendMode: "overlay",
          }}
        />

        {/* ── BG 3: Bokeh orbs (mouse-parallax only on these) ───────────────── */}
        {/* Primary — top-center cyan */}
        <div aria-hidden="true" className="absolute pointer-events-none z-[4]"
          style={{
            width: "780px", height: "680px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.5) 0%, rgba(6,182,212,0.07) 45%, transparent 70%)",
            filter: "blur(130px)", opacity: 0.11,
            top: "-15%", left: "18%",
            transform: `translate(${mousePos.x * 0.014}px, ${mousePos.y * 0.01}px)`,
            transition: "transform 1.2s ease-out",
          }}
        />
        {/* Secondary — right azure */}
        <div aria-hidden="true" className="absolute pointer-events-none z-[4]"
          style={{
            width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.6) 0%, rgba(59,130,246,0.1) 40%, transparent 70%)",
            filter: "blur(145px)", opacity: 0.09,
            top: "8%", right: "-6%",
            transform: `translate(${-mousePos.x * 0.009}px, ${mousePos.y * 0.007}px)`,
            transition: "transform 1.4s ease-out",
          }}
        />
        {/* Tertiary — bottom-left cobalt */}
        <div aria-hidden="true" className="absolute pointer-events-none z-[4]"
          style={{
            width: "680px", height: "580px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(30,64,175,0.65) 0%, rgba(59,130,246,0.07) 45%, transparent 70%)",
            filter: "blur(165px)", opacity: 0.10,
            bottom: "3%", left: "-9%",
            transform: `translate(${mousePos.x * 0.006}px, ${-mousePos.y * 0.007}px)`,
            transition: "transform 1.6s ease-out",
          }}
        />
        {/* Micro near-field pair */}
        <div aria-hidden="true" className="absolute pointer-events-none z-[4]"
          style={{
            width: "260px", height: "260px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.85) 0%, transparent 70%)",
            filter: "blur(88px)", opacity: 0.065,
            top: "28%", left: "36%",
          }}
        />
        <div aria-hidden="true" className="absolute pointer-events-none z-[4]"
          style={{
            width: "190px", height: "190px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.75) 0%, transparent 70%)",
            filter: "blur(75px)", opacity: 0.07,
            top: "18%", right: "28%",
          }}
        />

        {/* ── BG 5: Chromatic ambient overlay ──────────────────────────────── */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-[5]"
          style={{ background: "radial-gradient(ellipse 65% 55% at 50% 35%, rgba(6,182,212,0.028) 0%, rgba(56,189,248,0.015) 40%, transparent 75%)" }}
        />

        {/* ── BG 6: DoF edge vignette ──────────────────────────────────────── */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none z-[6]"
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(0,5,10,0.52) 72%, rgba(0,2,6,0.86) 100%)" }}
        />

        {/* ── BG 7: Text protection vignette ───────────────────────────────── */}
        <div aria-hidden="true" className="absolute pointer-events-none z-[7]"
          style={{
            width: "900px", height: "680px",
            top: "50%", left: "50%",
            transform: "translate(-50%, -54%)",
            background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(0,3,8,0.68) 0%, rgba(0,3,8,0.3) 55%, transparent 80%)",
          }}
        />

        {/* ── HEADER z-20 ───────────────────────────────────────────────────── */}
        <header className="relative w-full z-20 flex items-center justify-end px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="font-mono text-lg font-semibold tracking-tight text-foreground">CyberPeace</span>
            <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-primary/40 bg-white p-1">
              <Image src="/images/cyberpeace-logo.webp" alt="CyberPeace logo" width={44} height={44} className="h-full w-full object-contain" priority />
            </div>
          </div>
        </header>

        {/* ── HERO CONTENT z-10 ─────────────────────────────────────────────── */}
        <main className="relative flex-1 flex flex-col items-center justify-center px-6 py-12 text-center z-10">
          <motion.div variants={containerVariants} initial="hidden" animate="show" className="flex flex-col items-center max-w-4xl w-full">

            {/* Status badge */}
            <motion.div variants={itemVariants}
              className="flex items-center gap-2 mb-8 bg-slate-900/60 border border-cyan-500/20 px-3.5 py-1.5 rounded-full backdrop-blur-md text-[10px] tracking-[0.25em] font-mono text-cyan-400 uppercase shadow-[0_0_15px_rgba(6,182,212,0.08)]"
            >
              <Activity className="h-3 w-3 animate-pulse text-cyan-400" />
              <span>[ SYSTEM PORTAL GATEWAY ONLINE ]</span>
            </motion.div>

            {/* 3D tilt shield */}
            <motion.div variants={itemVariants} ref={heroCardRef}
              style={{ transform: `perspective(1000px) rotateX(${heroTilt.rotateX}deg) rotateY(${heroTilt.rotateY}deg)`, transformStyle: "preserve-3d" }}
              className="relative mb-10 flex h-36 w-36 items-center justify-center transition-transform duration-300 ease-out cursor-pointer group"
            >
              <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-2xl opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
              <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/10" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/5" style={{ animationDuration: "2s", animationDelay: "1s" }} />
              <div className="absolute inset-1 rounded-full border border-cyan-500/20 border-dashed animate-spin" style={{ animationDuration: "15s" }} />
              <div className="absolute inset-4 rounded-full border border-cyan-400/30 group-hover:border-cyan-400/60 transition-colors duration-300" />
              <div className="absolute inset-6 rounded-full border border-blue-500/20 border-dotted animate-spin" style={{ animationDuration: "10s", animationDirection: "reverse" }} />
              <Radar className="absolute h-32 w-32 animate-spin text-cyan-400/40 drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" style={{ animationDuration: "5s" }} aria-hidden="true" />
              <div className="relative flex items-center justify-center" style={{ transform: "translateZ(25px)" }}>
                <Shield className="h-16 w-16 text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(6,182,212,0.75)]" strokeWidth={1.5} aria-hidden="true" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={itemVariants}
              className="font-mono text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-white leading-none"
            >
              <span>CYBER</span>
              <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(6,182,212,0.3)] pl-2">GUARDIAN</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={itemVariants}
              className="mt-6 max-w-xl text-slate-400 font-mono text-xs sm:text-sm tracking-wide leading-relaxed text-pretty"
            >
              Next-generation cyber hygiene and digital defense. Stay protected, stay vigilant, stay at peace.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={itemVariants}
              className="mt-10 flex w-full max-w-md flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <button onClick={() => onAuth("login")}
                className="group relative w-full sm:w-auto min-w-[170px] py-3.5 px-6 rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_30px_rgba(6,182,212,0.45)] transition-all duration-300 flex items-center justify-center gap-2 cursor-none"
              >
                <LockKeyhole className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:-translate-y-0.5" aria-hidden="true" />
                <span>Login Portal</span>
              </button>
              <button onClick={() => onAuth("register")}
                className="group relative w-full sm:w-auto min-w-[170px] py-3.5 px-6 rounded-xl font-mono text-xs font-bold uppercase tracking-widest text-cyan-400 hover:text-slate-200 bg-slate-900/40 hover:bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 flex items-center justify-center gap-2 cursor-none shadow-[0_0_15px_rgba(6,182,212,0.03)]"
              >
                <ScanEye className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110" aria-hidden="true" />
                <span>New Operator</span>
              </button>
            </motion.div>
          </motion.div>
        </main>

        {/* ── ABOUT US z-10 ─────────────────────────────────────────────────── */}
        <section className="relative px-6 py-20 z-10 bg-gradient-to-b from-transparent to-slate-950">
          <motion.div
            ref={aboutCardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
            className="mx-auto max-w-3xl relative rounded-2xl p-[1px] shadow-[0_0_50px_rgba(6,182,212,0.05)] hover:shadow-[0_0_60px_rgba(6,182,212,0.12)] transition-all duration-300 ease-out"
            style={{
              transform: `perspective(1000px) rotateX(${aboutTilt.rotateX}deg) rotateY(${aboutTilt.rotateY}deg)`,
              transformStyle: "preserve-3d",
              background: "linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(6,182,212,0.05) 50%, rgba(6,182,212,0.2) 100%)"
            }}
          >
            <div className="rounded-2xl bg-slate-950/80 backdrop-blur-3xl p-8 sm:p-12 border border-slate-900/80 flex flex-col items-center text-center gap-6" style={{ transform: "translateZ(25px)" }}>
              <div className="flex items-center gap-2 text-cyan-400 font-mono text-[10px] tracking-[0.3em] uppercase">
                <Globe className="h-3.5 w-3.5 text-cyan-500/80" />
                <span>[ Platform Mission Overview ]</span>
              </div>
              <h2 className="font-mono text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-white">
                <span className="text-cyan-400">{"// "}</span>About Us
              </h2>
              <div className="h-px w-28 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              <p className="leading-relaxed text-slate-400 font-mono text-xs sm:text-sm tracking-wide text-pretty mt-2">
                CyberPeace Foundation endeavors to make the internet a more secure, stable, trustworthy and inclusive place
                for all netizens across the globe. As a non-partisan collective, we unite expertise, experiences, capacity
                and intent across a broad spectrum of institutions, disciplines and cultures in order to combat the common
                threat of cybercrime.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER z-10 ───────────────────────────────────────────────────── */}
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
    </>
  )
}
