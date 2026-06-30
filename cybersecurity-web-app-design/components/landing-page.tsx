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

    // Particle nodes definition
    interface Node {
      x: number
      y: number
      ox: number // original X
      oy: number // original Y
      radius: number
      vx: number
      vy: number
      angle: number
      speed: number
      color: string
    }

    const nodes: Node[] = []
    const nodeCount = Math.min(60, Math.floor((width * height) / 25000))

    for (let i = 0; i < nodeCount; i++) {
      const rx = Math.random() * width
      const ry = Math.random() * height
      nodes.push({
        x: rx,
        y: ry,
        ox: rx,
        oy: ry,
        radius: Math.random() * 1.5 + 0.8,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        angle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02,
        color: i % 3 === 0 ? "6, 182, 212" : i % 3 === 1 ? "59, 130, 246" : "147, 51, 234" // Cyan, Blue, Purple
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      
      // Draw grid scanning lines
      ctx.lineWidth = 0.5
      ctx.strokeStyle = "rgba(6, 182, 212, 0.03)"
      const gridSize = 60
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw and connect particles
      for (let i = 0; i < nodes.length; i++) {
        const p1 = nodes[i]
        
        // Base hover movement
        p1.angle += p1.speed
        p1.x += p1.vx + Math.sin(p1.angle) * 0.15
        p1.y += p1.vy + Math.cos(p1.angle) * 0.15

        // Boundary checks
        if (p1.x < 0 || p1.x > width) p1.vx *= -1
        if (p1.y < 0 || p1.y > height) p1.vy *= -1

        // Parallax offset relative to mouse
        const dxMouse = mousePos.x - p1.x
        const dyMouse = mousePos.y - p1.y
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        
        let offsetX = 0
        let offsetY = 0
        if (distMouse < 250) {
          const force = (250 - distMouse) / 250
          offsetX = -dxMouse * force * 0.05
          offsetY = -dyMouse * force * 0.05
        }

        const renderX = p1.x + offsetX
        const renderY = p1.y + offsetY

        // Draw node
        ctx.beginPath()
        ctx.arc(renderX, renderY, p1.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p1.color}, ${0.2 + (1 - distMouse / width) * 0.4})`
        ctx.fill()

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const p2 = nodes[j]
          
          const dxMouse2 = mousePos.x - p2.x
          const dyMouse2 = mousePos.y - p2.y
          const distMouse2 = Math.sqrt(dxMouse2 * dxMouse2 + dyMouse2 * dyMouse2)
          
          let offsetX2 = 0
          let offsetY2 = 0
          if (distMouse2 < 250) {
            const force2 = (250 - distMouse2) / 250
            offsetX2 = -dxMouse2 * force2 * 0.05
            offsetY2 = -dyMouse2 * force2 * 0.05
          }

          const renderX2 = p2.x + offsetX2
          const renderY2 = p2.y + offsetY2

          const dx = renderX - renderX2
          const dy = renderY - renderY2
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 140) {
            const alpha = (1 - dist / 140) * 0.08
            ctx.beginPath()
            ctx.moveTo(renderX, renderY)
            ctx.lineTo(renderX2, renderY2)
            ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`
            ctx.stroke()
          }
        }
      }

      // Draw subtle glowing center circles (Radar sweeps)
      const centerX = width / 2
      const centerY = height * 0.38
      ctx.beginPath()
      ctx.arc(centerX, centerY, 190, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(6, 182, 212, 0.02)"
      ctx.stroke()

      ctx.beginPath()
      ctx.arc(centerX, centerY, 320, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(6, 182, 212, 0.01)"
      ctx.stroke()

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
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-slate-950 text-slate-100">
      
      {/* Dynamic interactive Canvas Network particles */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-0" 
      />

      {/* Cinematic Glowing Mesh Orbs */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full blur-[160px] opacity-[0.09] pointer-events-none z-0 transition-transform duration-700 ease-out"
        style={{ 
          background: "radial-gradient(circle, rgba(6,182,212,0.85) 0%, transparent 70%)",
          left: "25%",
          top: "5%",
          transform: `translate(${mousePos.x * 0.02}px, ${mousePos.y * 0.02}px)`
        }}
      />
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] opacity-[0.06] pointer-events-none z-0 transition-transform duration-700 ease-out"
        style={{ 
          background: "radial-gradient(circle, rgba(147,51,234,0.6) 0%, transparent 70%)",
          right: "20%",
          bottom: "10%",
          transform: `translate(${-mousePos.x * 0.015}px, ${-mousePos.y * 0.015}px)`
        }}
      />

      {/* Header */}
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

      {/* Main Content (Hero) */}
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

      {/* About Us (Glassmorphic Card Panel) */}
      <section className="relative px-6 py-20 z-10 bg-gradient-to-b from-transparent to-slate-950">
        <motion.div 
          ref={aboutCardRef}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ type: "spring", stiffness: 70, damping: 15 }}
          style={{
            transform: `perspective(1000px) rotateX(${aboutTilt.rotateX}deg) rotateY(${aboutTilt.rotateY}deg)`,
            transformStyle: "preserve-3d"
          }}
          className="mx-auto max-w-3xl relative rounded-2xl p-[1px] shadow-[0_0_50px_rgba(6,182,212,0.05)] hover:shadow-[0_0_60px_rgba(6,182,212,0.12)] transition-all duration-300 ease-out"
          style={{
            background: "linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(6,182,212,0.05) 50%, rgba(6,182,212,0.2) 100%)"
          }}
        >
          <div 
            className="rounded-2xl bg-slate-950/80 backdrop-blur-3xl p-8 sm:p-12 border border-slate-900/80 flex flex-col items-center text-center gap-6"
            style={{ transform: "translateZ(25px)" }}
          >
            {/* Eyebrow eyebrow */}
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

      {/* Footer Diagnostic Panel */}
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
