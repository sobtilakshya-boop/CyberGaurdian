"use client"

import { useState, useEffect, useRef, Suspense } from "react"
import Image from "next/image"
import { Shield, LockKeyhole, Radar, ScanEye, Activity, Globe, Cpu } from "lucide-react"
import { motion } from "framer-motion"
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useTexture, Text } from '@react-three/drei'
import * as THREE from 'three'

// ── Minimal Realistic Optical Glitch Cursor ─────────────────────────────────
function CyberCursor() {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // ── Inject global cursor:none so it NEVER leaks through buttons/links ──
    const styleEl = document.createElement("style")
    styleEl.textContent = "*, *::before, *::after { cursor: none !important; }"
    document.head.appendChild(styleEl)

    let rafId: number
    let mx = -300, my = -300
    let isHover = false, isClick = false

    const onMove = (e: MouseEvent) => { 
      mx = e.clientX; 
      my = e.clientY; 
      const el = e.target as HTMLElement
      isHover = !!(el.closest("button") || el.closest("a"))
    }
    const onDown = () => { isClick = true }
    const onUp = () => { isClick = false }

    window.addEventListener("mousemove", onMove, { passive: true })
    window.addEventListener("mousedown", onDown, { passive: true })
    window.addEventListener("mouseup", onUp, { passive: true })

    const tick = () => {
      // 1) Move outer container (smooth position)
      if (containerRef.current) {
        // Only update if it actually moved significantly to save DOM ops
        if (Math.abs(mx - Number(containerRef.current.dataset.lastX || 0)) > 0.5 ||
            Math.abs(my - Number(containerRef.current.dataset.lastY || 0)) > 0.5) {
          containerRef.current.style.transform = `translate3d(${mx}px,${my}px,0)`
          containerRef.current.dataset.lastX = mx.toString()
          containerRef.current.dataset.lastY = my.toString()
        }
      }

      // 2) Realistic optical glitch animation
      if (innerRef.current) {
        const glitchChance = isHover ? 0.7 : 0.95
        let gx = 0, gy = 0
        
        if (isClick) {
          // Sharp photographic tear on click
          gx = (Math.random() - 0.5) * 8
          gy = (Math.random() - 0.5) * 8
        } else if (Math.random() > glitchChance) {
          // Subtle static jitter
          gx = (Math.random() - 0.5) * 3
          gy = (Math.random() - 0.5) * 3
        }

        const size = isClick ? 10 : (isHover ? 24 : 14)
        
        innerRef.current.style.transform = `translate3d(${gx}px, ${gy}px, 0)`
        innerRef.current.style.width = `${size}px`
        innerRef.current.style.height = `${size}px`
        innerRef.current.style.marginLeft = `${-size/2}px`
        innerRef.current.style.marginTop = `${-size/2}px`
        
        if (isClick) {
            innerRef.current.style.borderRadius = "2px" // Sharpen on click
        } else {
            innerRef.current.style.borderRadius = "50%" // Smooth optical lens normally
        }
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    return () => {
      document.head.removeChild(styleEl)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mousedown", onDown)
      window.removeEventListener("mouseup", onUp)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        position: "fixed", top: 0, left: 0,
        pointerEvents: "none", zIndex: 9999,
        willChange: "transform",
        transform: "translate3d(-300px,-300px,0)",
      }}
    >
      <div
        ref={innerRef}
        style={{
          position: "absolute", top: 0, left: 0,
          width: 14, height: 14,
          marginLeft: -7, marginTop: -7,
          borderRadius: "50%",
          // Realistic frosted glass orb texture
          background: "rgba(255, 255, 255, 0.65)",
          backdropFilter: "blur(8px) saturate(150%)",
          border: "1px solid rgba(255, 255, 255, 0.9)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.15), inset 0 0 8px rgba(255,255,255,0.9)",
          transition: "width 0.15s ease, height 0.15s ease, margin 0.15s ease, transform 0.05s ease, border-radius 0.15s ease",
        }}
      />
    </div>
  )
}

// ── Cyber Hygiene Secure Shield ─────────────────────────────────────────────
function SecureShield() {
  const coreRef = useRef<THREE.Mesh>(null!)
  const shieldRef = useRef<THREE.Mesh>(null!)
  const orbitRef = useRef<THREE.Group>(null!)

  // Load real PBR Normal Map for a hyper-realistic 3D texture on the core
  const normalMap = useTexture('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/waternormals.jpg')
  normalMap.wrapS = normalMap.wrapT = THREE.RepeatWrapping
  normalMap.repeat.set(3, 3)

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.2
      coreRef.current.rotation.x = t * 0.1
      coreRef.current.position.y = Math.sin(t * 1.5) * 0.1 // Gentle hover
    }
    if (shieldRef.current) {
      shieldRef.current.rotation.y = -t * 0.1
      // Pulse the opacity for a "forcefield" breathing effect
      ;(shieldRef.current.material as THREE.MeshPhysicalMaterial).opacity = 0.3 + Math.sin(t * 2) * 0.1
    }
    if (orbitRef.current) {
      orbitRef.current.rotation.y = t * 0.3
      orbitRef.current.rotation.z = Math.sin(t * 0.5) * 0.2
    }
    // Animate the normal map to make the realistic 3D texture flow
    normalMap.offset.x -= 0.002
    normalMap.offset.y -= 0.002
  })

  // Indicators for encryption/data
  const encLabels = ["AES-256", "VERIFIED", "ENCRYPTED", "SECURE"]

  return (
    <group scale={0.7}> {/* Significantly smaller scale */}
      {/* Central Clean Data Core with Realistic 3D Texture */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[1.1, 64, 64]} />
        <meshPhysicalMaterial 
          color="#0f172a"
          metalness={1}
          roughness={0.2}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(1, 1)}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={3}
          emissive="#0ea5e9"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Protective Cyber Hygiene Forcefield */}
      <mesh ref={shieldRef}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshPhysicalMaterial 
          color="#38bdf8"
          transparent
          opacity={0.3}
          roughness={0}
          transmission={0.9} // Glass-like
          thickness={0.5}
          clearcoat={1}
        />
      </mesh>

      {/* Orbiting Secure Data Packets & Encryption Indicators */}
      <group ref={orbitRef}>
        {[0, 1, 2, 3].map((i) => {
          const angle = (i / 4) * Math.PI * 2;
          const radius = 2.2;
          return (
            <group key={i} position={[Math.cos(angle) * radius, 0, Math.sin(angle) * radius]}>
              <mesh>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial 
                  color="#22c55e" // Green for safe/hygiene
                  emissive="#22c55e"
                  emissiveIntensity={0.8}
                />
              </mesh>
              {/* Holographic Data/Encryption Indicator Text */}
              <Text
                position={[0, 0.35, 0]}
                fontSize={0.18}
                color="#38bdf8"
                anchorX="center"
                anchorY="middle"
                fillOpacity={0.9}
              >
                {encLabels[i]}
              </Text>
            </group>
          );
        })}
        {/* Protective Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.2, 0.02, 16, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.3} />
        </mesh>
      </group>
    </group>
  )
}

type LandingPageProps = {
  onAuth: (mode: "login" | "register") => void
}

export function LandingPage({ onAuth }: LandingPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const heroCardRef = useRef<HTMLDivElement>(null)
  const aboutCardRef = useRef<HTMLDivElement>(null)
  const orb1Ref = useRef<HTMLDivElement>(null)
  const orb2Ref = useRef<HTMLDivElement>(null)
  const orb3Ref = useRef<HTMLDivElement>(null)

  // Mouse handler — only for card tilt and bokeh parallax (NOT particles) (using refs to avoid React re-renders)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const mx = e.clientX
      const my = e.clientY

      if (orb1Ref.current) {
        orb1Ref.current.style.transform = `translate3d(${mx * 0.014}px, ${my * 0.01}px, 0)`
      }
      if (orb2Ref.current) {
        orb2Ref.current.style.transform = `translate3d(${-mx * 0.009}px, ${my * 0.007}px, 0)`
      }
      if (orb3Ref.current) {
        orb3Ref.current.style.transform = `translate3d(${mx * 0.006}px, ${-my * 0.007}px, 0)`
      }

      if (heroCardRef.current) {
        const rect = heroCardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const tiltX = (e.clientY - centerY) / (window.innerHeight / 2)
        const tiltY = (e.clientX - centerX) / (window.innerWidth / 2)
        const rx = -tiltX * 12
        const ry = tiltY * 12
        heroCardRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`
      }
      if (aboutCardRef.current) {
        const rect = aboutCardRef.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const tiltX = (e.clientY - centerY) / (window.innerHeight / 2)
        const tiltY = (e.clientX - centerX) / (window.innerWidth / 2)
        const rx = -tiltX * 8
        const ry = tiltY * 8
        aboutCardRef.current.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`
      }
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])



  const containerVariants: any = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  }
  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 90, damping: 18 } },
  }

  return (
    <>
      {/* Custom cursor — rendered outside main div so it's always on top */}
      <CyberCursor />

      <div
        className="relative min-h-screen flex flex-col overflow-hidden text-slate-900"
        style={{
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)",
          cursor: "none",
        }}
      >


        {/* ── BG 1: Immersive 3D Secure Shield ──────────────────────────── */}
        <div className="absolute inset-0 pointer-events-none z-[1] flex items-center justify-center opacity-80" style={{ transform: "translateY(-5%)" }}>
          <Canvas camera={{ position: [0, 0, 5] }} gl={{ alpha: true }} dpr={[1, 1.5]} performance={{ min: 0.5 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[10, 10, 10]} intensity={2.5} />
            <Environment preset="city" />
            <Suspense fallback={null}>
              <SecureShield />
            </Suspense>
          </Canvas>
        </div>

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
        <div 
          ref={orb1Ref}
          aria-hidden="true" 
          className="absolute pointer-events-none z-[4]"
          style={{
            width: "780px", height: "680px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.5) 0%, rgba(6,182,212,0.07) 45%, transparent 70%)",
            filter: "blur(130px)", opacity: 0.11,
            top: "-15%", left: "18%",
            transform: "translate3d(0px, 0px, 0)",
            transition: "transform 1.2s ease-out",
            willChange: "transform",
          }}
        />
        {/* Secondary — right azure */}
        <div 
          ref={orb2Ref}
          aria-hidden="true" 
          className="absolute pointer-events-none z-[4]"
          style={{
            width: "600px", height: "600px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.6) 0%, rgba(59,130,246,0.1) 40%, transparent 70%)",
            filter: "blur(145px)", opacity: 0.09,
            top: "8%", right: "-6%",
            transform: "translate3d(0px, 0px, 0)",
            transition: "transform 1.4s ease-out",
            willChange: "transform",
          }}
        />
        {/* Tertiary — bottom-left cobalt */}
        <div 
          ref={orb3Ref}
          aria-hidden="true" 
          className="absolute pointer-events-none z-[4]"
          style={{
            width: "680px", height: "580px", borderRadius: "50%",
            background: "radial-gradient(circle, rgba(30,64,175,0.65) 0%, rgba(59,130,246,0.07) 45%, transparent 70%)",
            filter: "blur(165px)", opacity: 0.10,
            bottom: "3%", left: "-9%",
            transform: "translate3d(0px, 0px, 0)",
            transition: "transform 1.6s ease-out",
            willChange: "transform",
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
          style={{ background: "radial-gradient(ellipse 100% 100% at 50% 50%, transparent 28%, rgba(255,255,255,0.52) 72%, rgba(255,255,255,0.86) 100%)" }}
        />

        {/* ── BG 7: Text protection vignette ───────────────────────────────── */}
        <div aria-hidden="true" className="absolute pointer-events-none z-[7]"
          style={{
            width: "900px", height: "680px",
            top: "50%", left: "50%",
            transform: "translate(-50%, -54%)",
            background: "radial-gradient(ellipse 70% 70% at 50% 50%, rgba(255,255,255,0.68) 0%, rgba(255,255,255,0.3) 55%, transparent 80%)",
          }}
        />

        {/* ── HEADER z-20 ───────────────────────────────────────────────────── */}
        <header className="relative w-full z-20 flex items-center justify-end px-4 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <span className="font-sans text-xl sm:text-2xl font-black tracking-tight text-slate-900 drop-shadow-sm">CyberPeace</span>
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
              style={{ transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)", transformStyle: "preserve-3d", willChange: "transform" }}
              className="relative mb-10 flex h-36 w-36 items-center justify-center transition-transform duration-300 ease-out cursor-pointer group"
            >
              <div className="absolute inset-0 rounded-full bg-slate-900/10 blur-2xl opacity-60 group-hover:opacity-85 transition-opacity duration-300" />
              <div className="absolute inset-0 animate-ping rounded-full bg-slate-900/10" style={{ animationDuration: "3s" }} />
              <div className="absolute inset-0 animate-ping rounded-full bg-slate-900/5" style={{ animationDuration: "2s", animationDelay: "1s" }} />
              <div className="absolute inset-1 rounded-full border border-slate-900/40 border-dashed animate-spin" style={{ animationDuration: "15s" }} />
              <div className="absolute inset-4 rounded-full border border-slate-800/50 group-hover:border-slate-800/80 transition-colors duration-300" />
              <div className="absolute inset-6 rounded-full border border-blue-900/40 border-dotted animate-spin" style={{ animationDuration: "10s", animationDirection: "reverse" }} />
              <Radar className="absolute h-32 w-32 animate-spin text-slate-800/60 drop-shadow-sm" style={{ animationDuration: "5s" }} aria-hidden="true" />
              <div className="relative flex items-center justify-center" style={{ transform: "translateZ(25px)" }}>
                <Shield className="h-16 w-16 text-slate-900 drop-shadow-md" strokeWidth={1.5} aria-hidden="true" />
              </div>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={itemVariants}
              className="font-mono text-5xl sm:text-6xl md:text-7xl font-extrabold uppercase tracking-tight text-slate-900 leading-none"
            >
              <span>CYBER</span>
              <span className="bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(6,182,212,0.2)] pl-2">GUARDIAN</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={itemVariants}
              className="mt-6 max-w-xl text-slate-600 font-mono text-xs sm:text-sm tracking-wide leading-relaxed text-pretty font-medium"
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
        <section className="relative px-6 py-20 z-10 bg-gradient-to-b from-transparent to-slate-100">
          <motion.div
            ref={aboutCardRef}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 70, damping: 15 }}
            className="mx-auto max-w-3xl relative rounded-2xl p-[1px] shadow-[0_10px_50px_rgba(6,182,212,0.1)] hover:shadow-[0_10px_60px_rgba(6,182,212,0.15)] transition-all duration-300 ease-out"
            style={{
              transform: "perspective(1000px) rotateX(0deg) rotateY(0deg)",
              transformStyle: "preserve-3d",
              background: "linear-gradient(135deg, rgba(6,182,212,0.3) 0%, rgba(6,182,212,0.1) 50%, rgba(6,182,212,0.2) 100%)",
              willChange: "transform"
            }}
          >
            <div className="rounded-2xl bg-white/80 backdrop-blur-3xl p-8 sm:p-12 border border-slate-200/80 flex flex-col items-center text-center gap-6 shadow-inner" style={{ transform: "translateZ(25px)" }}>
              <div className="flex items-center gap-2 text-cyan-600 font-mono text-[10px] tracking-[0.3em] uppercase font-bold">
                <Globe className="h-3.5 w-3.5 text-cyan-500" />
                <span>[ Platform Mission Overview ]</span>
              </div>
              <h2 className="font-mono text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-slate-900">
                <span className="text-cyan-500">{"// "}</span>About Us
              </h2>
              <div className="h-px w-28 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
              <p className="leading-relaxed text-slate-600 font-mono text-xs sm:text-sm tracking-wide text-pretty mt-2 font-medium">
                CyberPeace Foundation endeavors to make the internet a more secure, stable, trustworthy and inclusive place
                for all netizens across the globe. As a non-partisan collective, we unite expertise, experiences, capacity
                and intent across a broad spectrum of institutions, disciplines and cultures in order to combat the common
                threat of cybercrime.
              </p>
            </div>
          </motion.div>
        </section>

        {/* ── FOOTER z-10 ───────────────────────────────────────────────────── */}
        <footer className="relative z-10 border-t border-slate-300 bg-white/80 px-6 py-8 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-500 uppercase tracking-widest sm:px-12">
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
