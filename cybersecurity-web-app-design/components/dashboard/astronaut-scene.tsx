"use client"

import { useRef, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useTexture, Float, OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

// ─── Astronaut body built from primitives ────────────────────────────────────
function AstronautBody({ isHovered }: { isHovered: boolean }) {
  const groupRef = useRef<THREE.Group>(null!)
  const flagRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!isHovered) {
      // Idle: gentle bobbing
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.05
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.1
    }
  })

  // Body material – white spacesuit
  const suitMat = new THREE.MeshStandardMaterial({ color: '#E8EEF8', roughness: 0.4, metalness: 0.1 })
  const helmetMat = new THREE.MeshStandardMaterial({ color: '#B8D4F0', roughness: 0.1, metalness: 0.3, transparent: true, opacity: 0.85 })
  const visorMat = new THREE.MeshStandardMaterial({ color: '#60A5FA', roughness: 0.05, metalness: 0.8, transparent: true, opacity: 0.6 })
  const detailMat = new THREE.MeshStandardMaterial({ color: '#0EA5E9', roughness: 0.5, metalness: 0.2 })
  const flagpoleMat = new THREE.MeshStandardMaterial({ color: '#C0C8D8', roughness: 0.3, metalness: 0.7 })

  return (
    <group ref={groupRef}>
      {/* Torso */}
      <mesh position={[0, 0, 0]} castShadow material={suitMat}>
        <capsuleGeometry args={[0.2, 0.35, 8, 16]} />
      </mesh>

      {/* Helmet */}
      <mesh position={[0, 0.38, 0]} castShadow material={helmetMat}>
        <sphereGeometry args={[0.22, 24, 24]} />
      </mesh>
      {/* Visor */}
      <mesh position={[0, 0.38, 0.12]} material={visorMat}>
        <sphereGeometry args={[0.14, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
      </mesh>

      {/* Backpack */}
      <mesh position={[0, 0, -0.22]} material={suitMat}>
        <boxGeometry args={[0.28, 0.32, 0.12]} />
      </mesh>

      {/* Left arm */}
      <mesh position={[-0.3, 0.05, 0]} rotation={[0, 0, -0.4]} castShadow material={suitMat}>
        <capsuleGeometry args={[0.07, 0.25, 6, 8]} />
      </mesh>
      {/* Left glove */}
      <mesh position={[-0.42, -0.12, 0]} material={detailMat}>
        <sphereGeometry args={[0.075, 10, 10]} />
      </mesh>

      {/* Right arm — holds flagpole */}
      <mesh position={[0.3, 0.05, 0]} rotation={[0, 0, 0.4]} castShadow material={suitMat}>
        <capsuleGeometry args={[0.07, 0.25, 6, 8]} />
      </mesh>
      {/* Right glove */}
      <mesh position={[0.42, -0.12, 0]} material={detailMat}>
        <sphereGeometry args={[0.075, 10, 10]} />
      </mesh>

      {/* Left leg */}
      <mesh position={[-0.12, -0.45, 0]} rotation={[0, 0, 0.05]} castShadow material={suitMat}>
        <capsuleGeometry args={[0.08, 0.3, 6, 8]} />
      </mesh>
      {/* Right leg */}
      <mesh position={[0.12, -0.45, 0]} rotation={[0, 0, -0.05]} castShadow material={suitMat}>
        <capsuleGeometry args={[0.08, 0.3, 6, 8]} />
      </mesh>

      {/* Boots */}
      <mesh position={[-0.12, -0.66, 0.04]} material={detailMat}>
        <boxGeometry args={[0.14, 0.08, 0.2]} />
      </mesh>
      <mesh position={[0.12, -0.66, 0.04]} material={detailMat}>
        <boxGeometry args={[0.14, 0.08, 0.2]} />
      </mesh>

      {/* Cyan chest detail stripe */}
      <mesh position={[0, 0.04, 0.19]} material={detailMat}>
        <boxGeometry args={[0.22, 0.04, 0.02]} />
      </mesh>

      {/* Flag assembly */}
      <group ref={flagRef} position={[0.48, -0.08, 0]}>
        {/* Flagpole */}
        <mesh material={flagpoleMat} position={[0, 0.35, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
        </mesh>
        {/* Flag panel with CyberPeace logo */}
        <FlagWithTexture position={[0.12, 0.68, 0]} />
      </group>
    </group>
  )
}

function FlagWithTexture({ position }: { position: [number, number, number] }) {
  const texture = useTexture('/images/cyberpeace-logo.webp')
  return (
    <mesh position={position}>
      <planeGeometry args={[0.28, 0.18]} />
      <meshStandardMaterial map={texture} transparent side={THREE.DoubleSide} roughness={0.6} />
    </mesh>
  )
}

// ─── Digital planet below the astronaut ──────────────────────────────────────
function DigitalPlanet() {
  const meshRef = useRef<THREE.Mesh>(null!)
  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.15
  })
  return (
    <group position={[0, -1.2, 0]}>
      {/* Planet */}
      <mesh ref={meshRef} castShadow receiveShadow>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshStandardMaterial
          color="#1E3A5F"
          roughness={0.7}
          metalness={0.2}
          wireframe={false}
        />
      </mesh>
      {/* Wireframe grid overlay on planet */}
      <mesh>
        <sphereGeometry args={[0.56, 16, 16]} />
        <meshBasicMaterial color="#0EA5E9" wireframe transparent opacity={0.12} />
      </mesh>
      {/* Orbital ring */}
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[0.8, 0.015, 8, 64]} />
        <meshStandardMaterial color="#0EA5E9" emissive="#0EA5E9" emissiveIntensity={0.4} roughness={0.3} />
      </mesh>
    </group>
  )
}

// ─── Main astronaut scene ─────────────────────────────────────────────────────
function Scene() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} castShadow />
      <pointLight position={[-3, 2, 3]} intensity={0.4} color="#60A5FA" />
      <pointLight position={[3, -1, 2]} intensity={0.3} color="#8B5CF6" />

      <Environment preset="city" />

      <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.4} floatingRange={[-0.08, 0.08]}>
        <group
          onPointerEnter={() => setIsHovered(true)}
          onPointerLeave={() => setIsHovered(false)}
        >
          <AstronautBody isHovered={isHovered} />
        </group>
      </Float>

      <DigitalPlanet />
    </>
  )
}

// ─── Exported canvas wrapper (Client Component boundary) ─────────────────────
export default function AstronautScene() {
  return (
    <div className="relative w-full" style={{ height: 380 }}>
      <Canvas
        camera={{ position: [0, 0.2, 2.8], fov: 45 }}
        shadows
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>

      {/* Hover label */}
      <div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full text-xs font-mono pointer-events-none"
        style={{
          background: 'rgba(255,255,255,0.8)',
          border: '1px solid var(--db-border)',
          color: 'var(--db-text-muted)',
          backdropFilter: 'blur(8px)',
        }}
      >
        Hover the astronaut to interact
      </div>
    </div>
  )
}
