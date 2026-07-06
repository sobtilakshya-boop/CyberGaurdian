"use client"

import { Suspense, useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, Stars, Sparkles, useGLTF, Environment, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, HelpCircle, Trophy, MessageSquare } from 'lucide-react'
import ChatWidget from './chat-widget'

const HELMET_GLTF_URL = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb'

// ── Realistic Sci-Fi Helmet (Cyber Guardian) ─────────────────────────────────
function CyberHelmet({ isHovered }: { isHovered: boolean }) {
  const helmetRef = useRef<THREE.Group>(null!)
  const { scene } = useGLTF(HELMET_GLTF_URL)
  
  // slightly angled by default
  const targetRotationY = useRef(-Math.PI / 8) 
  const targetRotationX = useRef(0)

  useFrame((state, delta) => {
    if (helmetRef.current) {
      // Gentle bobbing at a static position
      helmetRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.08
      
      // When hovered, "look" directly at the user
      if (isHovered) {
        targetRotationY.current = THREE.MathUtils.lerp(targetRotationY.current, 0, 0.1)
        targetRotationX.current = THREE.MathUtils.lerp(targetRotationX.current, 0, 0.1)
      } else {
        // Look slightly away when idle
        targetRotationY.current = THREE.MathUtils.lerp(targetRotationY.current, -Math.PI / 8, 0.05)
        targetRotationX.current = THREE.MathUtils.lerp(targetRotationX.current, 0.1, 0.05)
      }
      
      helmetRef.current.rotation.y = targetRotationY.current
      helmetRef.current.rotation.x = targetRotationX.current
    }
  })

  // Start facing slightly right
  useEffect(() => {
    if (helmetRef.current) {
      helmetRef.current.rotation.y = -Math.PI / 8
    }
  }, [])

  return (
    <Float speed={2} rotationIntensity={0} floatIntensity={0.2}>
      {/* Positioned directly in the center so it never gets cut off */}
      <group ref={helmetRef} scale={1.4} position={[0, -0.2, 0]}>
        <primitive object={scene} />
      </group>
    </Float>
  )
}

export default function AstronautScene() {
  const [isHovered, setIsHovered] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  return (
    // No background colors - allows it to perfectly blend with the dashboard
    <div 
      className="relative w-full h-[380px] select-none rounded-2xl overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping }}
        style={{ background: 'transparent' }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 4, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-5, -3, 4]} intensity={2.5} color="#06b6d4" />
        
        <Suspense fallback={null}>
          <CyberHelmet isHovered={isHovered} />
          
          <Environment preset="city" />
          
          <Stars radius={10} depth={50} count={300} factor={4} saturation={0} fade speed={1} />
          <Sparkles count={30} scale={5} size={2} speed={0.4} opacity={0.3} color="#0ea5e9" />
          
          {/* Shadow positioned specifically under the centered helmet */}
          <ContactShadows position={[0, -1.8, 0]} opacity={0.4} scale={5} blur={2.5} far={4} color="#0ea5e9" />
        </Suspense>

        {/* OrbitControls COMPLETELY REMOVED so it cannot be dragged or rotated by the cursor */}
      </Canvas>

      {/* CyberGuardian Dialogue UI Overlay */}
      <AnimatePresence>
        {isHovered && !isChatOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -10, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            // Locked strictly to the LEFT side
            className="absolute top-1/2 -translate-y-1/2 left-6 md:left-10 max-w-[280px] z-20 pointer-events-auto"
          >
            {/* Highly colorful, vibrant gradient background */}
            <div className="bg-gradient-to-br from-indigo-600/95 via-purple-600/95 to-fuchsia-600/95 backdrop-blur-xl border border-white/20 p-5 rounded-2xl shadow-[0_10px_40px_rgba(124,58,237,0.4)] relative overflow-hidden">
              
              <div className="flex items-center gap-3 mb-3">
                <div className="h-2 w-2 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,1)]" />
                <span className="text-[10px] font-bold font-mono tracking-widest text-white uppercase">Your Cyber Guide</span>
              </div>
              
              {/* Contextually accurate conversation */}
              <p className="text-sm text-white font-medium leading-relaxed mb-5 shadow-sm">
                Ready to level up your security skills? What should we learn today?
              </p>
              
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setIsChatOpen(true)}
                  className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg bg-fuchsia-500/20 hover:bg-fuchsia-500/40 border border-fuchsia-400/30 transition-all text-xs text-white font-bold group shadow-sm mt-1"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-fuchsia-300 group-hover:text-white" />
                  Chat with CyberGuardian
                </button>
              </div>
            </div>
            
            {/* Colorful connecting line */}
            <svg className="absolute top-1/2 -right-16 w-16 h-px overflow-visible" style={{ stroke: 'rgba(255,255,255,0.4)' }}>
              <line x1="0" y1="0" x2="64" y2="0" strokeWidth="1.5" strokeDasharray="4 2" />
              <circle cx="64" cy="0" r="2.5" fill="#fff" />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      <ChatWidget isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  )
}

useGLTF.preload(HELMET_GLTF_URL)
