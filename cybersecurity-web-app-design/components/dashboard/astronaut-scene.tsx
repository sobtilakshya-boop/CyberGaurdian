"use client"

import { useRef, Suspense, useMemo, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const GLOBE_RADIUS = 0.76

// Global threat intelligence station nodes
const CITIES = [
  { name: 'New York', lat: 40.7128, lon: -74.0060, color: '#ef4444' },
  { name: 'London', lat: 51.5074, lon: -0.1278, color: '#3b82f6' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, color: '#a855f7' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, color: '#10b981' },
  { name: 'Bangalore', lat: 12.9716, lon: 77.5946, color: '#f59e0b' }
]

// Convert Lat/Lon to spherical Vector3 coordinates
function getSphericalCoords(lat: number, lon: number, r: number) {
  const theta = (lon * Math.PI) / 180
  const phi = ((90 - lat) * Math.PI) / 180
  
  const x = r * Math.sin(phi) * Math.cos(theta)
  const y = r * Math.cos(phi)
  const z = r * Math.sin(phi) * Math.sin(theta)
  return new THREE.Vector3(x, y, z)
}

// ─── Glowing Plasma Comet Threat Trail ─────────────────────────────────────────
function ActiveAttack({ 
  fromNode, 
  toNode, 
  onComplete
}: { 
  fromNode: THREE.Vector3
  toNode: THREE.Vector3
  onComplete: () => void
}) {
  const headRef = useRef<THREE.Mesh>(null!)
  const tail1Ref = useRef<THREE.Mesh>(null!)
  const tail2Ref = useRef<THREE.Mesh>(null!)
  const tail3Ref = useRef<THREE.Mesh>(null!)
  const ringRef = useRef<THREE.Mesh>(null!)
  
  const [stage, setStage] = useState<'flying' | 'impact' | 'done'>('flying')
  const progressRef = useRef(0)
  const [opacity, setOpacity] = useState(1.0)
  const [ringScale, setRingScale] = useState(1.0)

  // Bezier curve path arching outwards
  const { curve, floatArray } = useMemo(() => {
    const midPoint = new THREE.Vector3()
      .addVectors(fromNode, toNode)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(GLOBE_RADIUS * 1.36) // Bezier height arch
      
    const c = new THREE.QuadraticBezierCurve3(fromNode, midPoint, toNode)
    const points = c.getPoints(24)
    const posArr = new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))
    return { curve: c, floatArray: posArr }
  }, [fromNode, toNode])

  // Normal vector pointing straight out from the sphere at the landing node
  const normal = useMemo(() => toNode.clone().normalize(), [toNode])
  
  // Align flat ring flat on sphere surface using quaternions
  const ringQuaternion = useMemo(() => {
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    return q
  }, [normal])

  useFrame((state, delta) => {
    if (stage === 'flying') {
      progressRef.current += delta * 0.95 // speed of flight
      if (progressRef.current >= 1.0) {
        progressRef.current = 1.0
        setStage('impact')
        progressRef.current = 0 // reuse for shockwave timer
      } else {
        const t = progressRef.current
        
        // Position Head
        const pHead = curve.getPointAt(t)
        if (headRef.current) headRef.current.position.copy(pHead)
        
        // Position Tail 1 (slight delay)
        const pTail1 = curve.getPointAt(Math.max(0, t - 0.035))
        if (tail1Ref.current) tail1Ref.current.position.copy(pTail1)
        
        // Position Tail 2 (moderate delay)
        const pTail2 = curve.getPointAt(Math.max(0, t - 0.07))
        if (tail2Ref.current) tail2Ref.current.position.copy(pTail2)

        // Position Tail 3 (long delay)
        const pTail3 = curve.getPointAt(Math.max(0, t - 0.105))
        if (tail3Ref.current) tail3Ref.current.position.copy(pTail3)
      }
    } else if (stage === 'impact') {
      progressRef.current += delta * 1.6 // speed of ring expansion
      if (progressRef.current >= 1.0) {
        setStage('done')
        onComplete()
      } else {
        setRingScale(1 + progressRef.current * 4.5)
        setOpacity(Math.max(0, 1 - progressRef.current))
      }
    }
  })

  if (stage === 'done') return null

  return (
    <group>
      {/* Curved attack stream path line */}
      {stage === 'flying' && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[floatArray, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#ef4444" transparent opacity={0.3} linewidth={1.5} />
        </line>
      )}

      {/* Flight packets: Multi-Node Glowing Plasma Comet Trail */}
      {stage === 'flying' && (
        <group>
          {/* 1. Main Head (Bright Red) */}
          <mesh ref={headRef}>
            <sphereGeometry args={[0.024, 10, 10]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          
          {/* 2. Tail Node 1 (Orange, slightly smaller, slight transparency) */}
          <mesh ref={tail1Ref}>
            <sphereGeometry args={[0.018, 8, 8]} />
            <meshBasicMaterial color="#f97316" transparent opacity={0.8} />
          </mesh>

          {/* 3. Tail Node 2 (Amber, smaller, moderate transparency) */}
          <mesh ref={tail2Ref}>
            <sphereGeometry args={[0.013, 8, 8]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={0.5} />
          </mesh>

          {/* 4. Tail Node 3 (Yellow, smallest, high transparency) */}
          <mesh ref={tail3Ref}>
            <sphereGeometry args={[0.008, 6, 6]} />
            <meshBasicMaterial color="#eab308" transparent opacity={0.25} />
          </mesh>
        </group>
      )}

      {/* Impact Ring / Expanding Shockwave lying flat on the sphere surface */}
      {stage === 'impact' && (
        <mesh position={toNode} quaternion={ringQuaternion} ref={ringRef}>
          <ringGeometry args={[0.005, 0.05, 32]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={opacity} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

// ─── Real-Time Attack Coordinator ────────────────────────────────────────────
interface AttackData {
  id: number
  fromNode: THREE.Vector3
  toNode: THREE.Vector3
}

function AttackManager({ cityVectors }: { cityVectors: THREE.Vector3[] }) {
  const [attacks, setAttacks] = useState<AttackData[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    const spawnAttack = () => {
      const fromIdx = Math.floor(Math.random() * cityVectors.length)
      let toIdx = Math.floor(Math.random() * cityVectors.length)
      while (toIdx === fromIdx) {
        toIdx = Math.floor(Math.random() * cityVectors.length)
      }

      const newAttack: AttackData = {
        id: nextId.current++,
        fromNode: cityVectors[fromIdx],
        toNode: cityVectors[toIdx]
      }

      setAttacks(prev => [...prev.slice(-3), newAttack])
    }

    // Spawn first attack immediately
    spawnAttack()
    const timer = setInterval(spawnAttack, 1800)
    return () => clearInterval(timer)
  }, [cityVectors])

  return (
    <group>
      {attacks.map(attack => (
        <ActiveAttack
          key={attack.id}
          fromNode={attack.fromNode}
          toNode={attack.toNode}
          onComplete={() => {
            setAttacks(prev => prev.filter(a => a.id !== attack.id))
          }}
        />
      ))}
    </group>
  )
}

// ─── Realistic Globe Core (HD Textures) ───────────────────────────────────────
function GlobeCore() {
  // Load detailed Earth textures from highly stable public CDN (Wildcard CORS-enabled unpkg.com)
  const [earthTexture, bumpMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png'
  ])

  return (
    <mesh>
      <sphereGeometry args={[GLOBE_RADIUS, 40, 40]} />
      <meshStandardMaterial
        map={earthTexture}
        bumpMap={bumpMap}
        bumpScale={0.038}
        roughness={0.4}
        metalness={0.15}
      />
    </mesh>
  )
}

// ─── Space Telemetry Particles ───────────────────────────────────────────────
function TelemetryCloud() {
  const cloudRef = useRef<THREE.Points>(null!)

  const [positions] = useMemo(() => {
    const count = 160
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)
      const dist = GLOBE_RADIUS * 1.15 + Math.random() * 0.9
      pos[i * 3] = dist * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = dist * Math.cos(phi)
    }
    return [pos]
  }, [])

  useFrame((state) => {
    cloudRef.current.rotation.y = state.clock.elapsedTime * 0.02
  })

  return (
    <points ref={cloudRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#0ea5e9"
        size={0.03}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  )
}

// ─── Dual Counter-Phased Scanning Lasers ─────────────────────────────────────
function DualScanningLasers() {
  const laser1Ref = useRef<THREE.Mesh>(null!)
  const laser2Ref = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const maxVal = GLOBE_RADIUS * 0.96
    const timeVal = state.clock.elapsedTime * 1.6
    
    // Laser 1 moves up and down
    laser1Ref.current.position.y = Math.sin(timeVal) * maxVal
    
    // Laser 2 moves in counter-phase
    laser2Ref.current.position.y = -Math.sin(timeVal) * maxVal
  })

  return (
    <group>
      {/* Laser 1 Ring */}
      <mesh ref={laser1Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[GLOBE_RADIUS * 0.98, GLOBE_RADIUS * 1.01, 32]} />
        <meshBasicMaterial color="#06b6d4" side={THREE.DoubleSide} transparent opacity={0.5} />
      </mesh>
      {/* Laser 2 Ring */}
      <mesh ref={laser2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[GLOBE_RADIUS * 0.98, GLOBE_RADIUS * 1.01, 32]} />
        <meshBasicMaterial color="#8b5cf6" side={THREE.DoubleSide} transparent opacity={0.45} />
      </mesh>
    </group>
  )
}

// ─── Main Security Globe Setup ────────────────────────────────────────────────
function GlobeContainer() {
  const cityVectors = useMemo(() => {
    return CITIES.map(c => getSphericalCoords(c.lat, c.lon, GLOBE_RADIUS))
  }, [])

  return (
    <group>
      {/* Shaded Photo-Realistic Earth Core */}
      <GlobeCore />

      {/* Grid Wireframe outer shell */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.004, 24, 24]} />
        <meshBasicMaterial
          color="#06b6d4"
          wireframe
          transparent
          opacity={0.12}
        />
      </mesh>

      {/* Atmospheric Glow Outer Shell */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS + 0.02, 32, 32]} />
        <meshBasicMaterial
          color="#06b6d4"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* City nodes */}
      {cityVectors.map((v, i) => (
        <group key={CITIES[i].name}>
          {/* Inner solid node */}
          <mesh position={v}>
            <sphereGeometry args={[0.022, 10, 10]} />
            <meshBasicMaterial color={CITIES[i].color} />
          </mesh>
          {/* Glowing node halo */}
          <mesh position={v} scale={1.8}>
            <sphereGeometry args={[0.022, 8, 8]} />
            <meshBasicMaterial color={CITIES[i].color} transparent opacity={0.22} />
          </mesh>
        </group>
      ))}

      {/* Live threat attacks streams */}
      <AttackManager cityVectors={cityVectors} />

      {/* Telemetry points */}
      <TelemetryCloud />

      {/* Dual counter-phased scanning lasers */}
      <DualScanningLasers />
    </group>
  )
}

export default function AstronautScene() {
  return (
    <div className="relative w-full h-[380px] select-none cursor-grab active:cursor-grabbing">
      <Canvas
        camera={{ position: [0, 0, 2.3], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={1.3} />
        {/* Main bright directional light */}
        <directionalLight position={[5, 4, 5]} intensity={2.4} />
        {/* Soft fill tracking light from camera side */}
        <directionalLight position={[-5, -3, 4]} intensity={1.2} color="#06b6d4" />
        
        <Suspense fallback={null}>
          <GlobeContainer />
        </Suspense>

        {/* OrbitControls: allows drag to rotate, prevents zoom/pan, rotates automatically when idle */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={true}
          autoRotateSpeed={0.5}
        />
      </Canvas>
    </div>
  )
}
