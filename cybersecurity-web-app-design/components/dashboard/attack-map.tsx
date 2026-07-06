"use client"

import { useRef, Suspense, useMemo, useState, useEffect, useCallback } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useTexture, Html } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Shield, Zap, AlertTriangle, Globe, Activity, ChevronRight } from 'lucide-react'

// Globe radius constant
const GLOBE_R = 1.05

// Exact coordinates for historical attacks and major global targets
const CITY_COORDS: Record<string, { lat: number, lon: number }> = {
  'Washington DC': { lat: 38.90, lon: -77.03 },
  'Natanz': { lat: 33.97, lon: 51.92 },
  'Pyongyang': { lat: 39.03, lon: 125.75 },
  'London': { lat: 51.51, lon: -0.13 },
  'Madrid': { lat: 40.41, lon: -3.70 },
  'Moscow': { lat: 55.75, lon: 37.62 },
  'Kyiv': { lat: 50.45, lon: 30.52 },
  'St. Petersburg': { lat: 59.93, lon: 30.31 },
  'Manila': { lat: 14.59, lon: 120.98 },
  'New York': { lat: 40.71, lon: -74.00 },
  'Tokyo': { lat: 35.68, lon: 139.69 },
  'Houston': { lat: 29.76, lon: -95.36 },
  'Silicon Valley': { lat: 37.38, lon: -122.08 },
  'Tallinn': { lat: 59.43, lon: 24.75 },
  'Riyadh': { lat: 24.71, lon: 46.67 },
  'Sony Pictures (LA)': { lat: 34.01, lon: -118.39 },
  'Beijing': { lat: 39.91, lon: 116.39 },
  'Paris': { lat: 48.85, lon: 2.35 },
  'Sao Paulo': { lat: -23.55, lon: -46.63 },
  'Sydney': { lat: -33.87, lon: 151.21 },
  'Frankfurt': { lat: 50.11, lon: 8.68 },
  'Mumbai': { lat: 19.08, lon: 72.88 },
  'Seoul': { lat: 37.57, lon: 126.98 },
  'Taipei': { lat: 25.03, lon: 121.56 },
}

export const HISTORICAL_SCENARIOS = [
  {
    id: 'stuxnet',
    name: 'Stuxnet',
    year: 2010,
    vector: 'SCADA Sabotage',
    severity: 'CRITICAL',
    color: '#ef4444',
    description: 'A highly sophisticated computer worm believed to be a jointly built American-Israeli cyberweapon. It exploited four zero-day flaws to target Iranian SCADA systems, physically destroying up to 1,000 nuclear centrifuges in Natanz.',
    origin: 'Washington DC',
    targets: ['Natanz']
  },
  {
     id: 'wannacry',
     name: 'WannaCry',
     year: 2017,
     vector: 'Ransomware',
     severity: 'CRITICAL',
     color: '#f97316',
     description: 'A devastating global ransomware attack attributed to North Korea. Exploiting the leaked NSA "EternalBlue" vulnerability, it rapidly infected over 200,000 computers across 150 countries, crippling the UK NHS, FedEx, and Spanish telecom companies. Damages: ~$4 Billion.',
     origin: 'Pyongyang',
     targets: ['London', 'Madrid', 'Moscow', 'New York', 'Tokyo', 'Sao Paulo', 'Frankfurt', 'Beijing', 'Sydney']
  },
  {
     id: 'notpetya',
     name: 'NotPetya',
     year: 2017,
     vector: 'State-Sponsored Wiper',
     severity: 'CRITICAL',
     color: '#ef4444',
     description: 'Disguised as ransomware, NotPetya was actually a purely destructive wiper malware launched by the Russian GRU (Sandworm). Targeting Ukrainian infrastructure via a hacked tax software, it spiraled out of control globally. It is considered the most costly cyberattack in history. Damages: ~$10 Billion.',
     origin: 'Moscow',
     targets: ['Kyiv', 'London', 'New York', 'Frankfurt', 'Mumbai', 'Paris']
  },
  {
     id: 'solarwinds',
     name: 'SolarWinds',
     year: 2020,
     vector: 'Supply Chain',
     severity: 'HIGH',
     color: '#a855f7',
     description: 'Russian operatives (Cozy Bear) breached SolarWinds, injecting a backdoor (Sunburst) into their Orion network monitoring software updates. This compromised thousands of elite targets, including top US government agencies and Fortune 500 companies.',
     origin: 'St. Petersburg',
     targets: ['Washington DC', 'Silicon Valley', 'New York', 'London', 'Frankfurt']
  },
  {
     id: 'mirai',
     name: 'Mirai Botnet',
     year: 2016,
     vector: 'DDoS',
     severity: 'HIGH',
     color: '#3b82f6',
     description: 'A massive botnet assembled from hundreds of thousands of unsecured IoT devices (IP cameras, home routers). It launched a record-breaking DDoS attack against Dyn DNS, temporarily knocking major platforms like Twitter, Netflix, and Reddit offline across the US East Coast.',
     origin: 'Tokyo',
     targets: ['New York', 'Washington DC', 'London', 'Frankfurt', 'Silicon Valley', 'Taipei']
  },
  {
     id: 'sony',
     name: 'Sony Pictures Hack',
     year: 2014,
     vector: 'Data Breach / Wiper',
     severity: 'HIGH',
     color: '#ec4899',
     description: 'North Korean hackers ("Guardians of Peace") infiltrated Sony Pictures network, stealing and leaking vast amounts of confidential data, unreleased films, and emails, before deploying wiper malware to destroy Sony\'s infrastructure. The attack was in retaliation for the movie "The Interview".',
     origin: 'Pyongyang',
     targets: ['Sony Pictures (LA)', 'New York']
  },
  {
     id: 'estonia',
     name: 'Estonia Cyberattacks',
     year: 2007,
     vector: 'State DDoS',
     severity: 'MEDIUM',
     color: '#22d3ee',
     description: 'Widely considered the first recognized instance of state-sponsored cyber warfare. Amid political tensions over a Soviet monument, Russian botnets executed coordinated DDoS attacks that crippled Estonian parliament, banks, ministries, and broadcasters for weeks.',
     origin: 'Moscow',
     targets: ['Tallinn']
  },
  {
     id: 'shamoon',
     name: 'Shamoon Wiper',
     year: 2012,
     vector: 'State-Sponsored Wiper',
     severity: 'CRITICAL',
     color: '#ef4444',
     description: 'A devastating wiper malware linked to Iranian state actors. It infiltrated the network of Saudi Aramco and systematically wiped and overwrote the hard drives of over 30,000 workstations with an image of a burning American flag, crippling the oil giant\'s corporate network.',
     origin: 'Natanz',
     targets: ['Riyadh']
  },
  {
     id: 'iloveyou',
     name: 'ILOVEYOU',
     year: 2000,
     vector: 'Email Worm',
     severity: 'MEDIUM',
     color: '#eab308',
     description: 'One of the first major computer worms, created by a student in the Philippines. It attacked tens of millions of Windows computers via an email with the subject "ILOVEYOU", destroying files and propagating itself to the victim\'s entire Outlook contact list.',
     origin: 'Manila',
     targets: ['Washington DC', 'London', 'Tokyo', 'New York', 'Silicon Valley', 'Paris', 'Sydney']
  },
  {
     id: 'colonial',
     name: 'Colonial Pipeline',
     year: 2021,
     vector: 'Ransomware',
     severity: 'CRITICAL',
     color: '#f97316',
     description: 'The DarkSide ransomware gang (Russian cybercriminals) compromised the IT systems of the largest fuel pipeline in the US via a leaked VPN password. The resulting shutdown caused widespread fuel shortages and panic buying across the East Coast. Ransom paid: $4.4 million (partially recovered).',
     origin: 'St. Petersburg',
     targets: ['Houston', 'Washington DC', 'New York']
  }
]

const SEVERITIES = [
  { level: 'CRITICAL', color: '#ef4444' },
  { level: 'HIGH',     color: '#f97316' },
  { level: 'MEDIUM',   color: '#eab308' },
  { level: 'LOW',      color: '#3b82f6' },
]

function latLonToVec3(lat: number, lon: number, r: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 90) * (Math.PI / 180)
  return new THREE.Vector3(
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta)
  )
}

function weightedRandom<T extends { weight: number }>(arr: T[]): T {
  const total = arr.reduce((s, x) => s + x.weight, 0)
  let r = Math.random() * total
  for (const item of arr) { r -= item.weight; if (r <= 0) return item }
  return arr[arr.length - 1]
}

// Attack arc comet component
function AttackArc({ from, to, color, onComplete }: {
  from: THREE.Vector3; to: THREE.Vector3; color: string; onComplete: () => void
}) {
  const headRef  = useRef<THREE.Mesh>(null!)
  const tail1Ref = useRef<THREE.Mesh>(null!)
  const tail2Ref = useRef<THREE.Mesh>(null!)
  const tail3Ref = useRef<THREE.Mesh>(null!)
  const [stage, setStage] = useState<'fly' | 'impact' | 'done'>('fly')
  const progress = useRef(0)
  const [ringData, setRingData] = useState({ scale: 1, opacity: 1 })

  const { curve, lineArr } = useMemo(() => {
    const mid = new THREE.Vector3()
      .addVectors(from, to)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(GLOBE_R * 1.45)
    const c = new THREE.QuadraticBezierCurve3(from, mid, to)
    const pts = c.getPoints(32)
    return { curve: c, lineArr: new Float32Array(pts.flatMap(p => [p.x, p.y, p.z])) }
  }, [from, to])

  const normal = useMemo(() => to.clone().normalize(), [to])
  const ringQ  = useMemo(() => {
    const q = new THREE.Quaternion()
    q.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal)
    return q
  }, [normal])

  useFrame((_, dt) => {
    if (stage === 'fly') {
      progress.current += dt * 0.85
      if (progress.current >= 1) { progress.current = 0; setStage('impact'); return }
      const t = progress.current
      if (headRef.current)  headRef.current.position.copy(curve.getPointAt(t))
      if (tail1Ref.current) tail1Ref.current.position.copy(curve.getPointAt(Math.max(0, t - 0.04)))
      if (tail2Ref.current) tail2Ref.current.position.copy(curve.getPointAt(Math.max(0, t - 0.08)))
      if (tail3Ref.current) tail3Ref.current.position.copy(curve.getPointAt(Math.max(0, t - 0.12)))
    } else if (stage === 'impact') {
      progress.current += dt * 2.2
      if (progress.current >= 1) { setStage('done'); onComplete(); return }
      setRingData({ scale: 1 + progress.current * 5, opacity: Math.max(0, 1 - progress.current) })
    }
  })

  if (stage === 'done') return null

  return (
    <group>
      {stage === 'fly' && (
        <line>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[lineArr, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={0.25} />
        </line>
      )}
      {stage === 'fly' && (
        <group>
          <mesh ref={headRef}>
            <sphereGeometry args={[0.026, 10, 10]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh ref={tail1Ref}>
            <sphereGeometry args={[0.019, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.7} />
          </mesh>
          <mesh ref={tail2Ref}>
            <sphereGeometry args={[0.013, 7, 7]} />
            <meshBasicMaterial color={color} transparent opacity={0.4} />
          </mesh>
          <mesh ref={tail3Ref}>
            <sphereGeometry args={[0.008, 6, 6]} />
            <meshBasicMaterial color={color} transparent opacity={0.18} />
          </mesh>
        </group>
      )}
      {stage === 'impact' && (
        <mesh position={to} quaternion={ringQ} scale={ringData.scale}>
          <ringGeometry args={[0.005, 0.055, 32]} />
          <meshBasicMaterial color={color} transparent opacity={ringData.opacity} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  )
}

// Pulsing city node
function CityNode({ name, vec, color }: { name: string, vec: THREE.Vector3; color: string }) {
  const haRef = useRef<THREE.Mesh>(null!)
  useFrame(state => {
    if (haRef.current) {
      const s = 1.6 + Math.sin(state.clock.elapsedTime * 2.2) * 0.5
      haRef.current.scale.setScalar(s)
    }
  })
  return (
    <group position={vec}>
      <mesh>
        <sphereGeometry args={[0.022, 10, 10]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={haRef}>
        <sphereGeometry args={[0.022, 8, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.18} />
      </mesh>
      <Html distanceFactor={2.5} position={[0, 0.05, 0]} center zIndexRange={[100, 0]}>
        <div className="flex flex-col items-center pointer-events-none">
          <div className="px-1.5 py-0.5 rounded text-[7px] font-bold uppercase tracking-widest whitespace-nowrap bg-black/60 backdrop-blur-md border" style={{ color: color, borderColor: `${color}40` }}>
            {name}
          </div>
          <div className="w-px h-2 opacity-50" style={{ background: color }} />
        </div>
      </Html>
    </group>
  )
}

// Photo-realistic earth globe
function GlobeEarth() {
  const [earthMap, bumpMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg',
    'https://unpkg.com/three-globe/example/img/earth-topology.png',
  ])
  return (
    <mesh rotation={[0, -Math.PI / 2, 0]}>
      <sphereGeometry args={[GLOBE_R, 48, 48]} />
      <meshStandardMaterial map={earthMap} bumpMap={bumpMap} bumpScale={0.04} roughness={0.35} metalness={0.12} />
    </mesh>
  )
}

// Atmospheric glow and wireframe
function Atmosphere() {
  return (
    <group>
      <mesh>
        <sphereGeometry args={[GLOBE_R + 0.03, 32, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.06} side={THREE.BackSide} />
      </mesh>
      <mesh>
        <sphereGeometry args={[GLOBE_R + 0.005, 28, 28]} />
        <meshBasicMaterial color="#0ea5e9" wireframe transparent opacity={0.1} />
      </mesh>
    </group>
  )
}

// Star field particles
function ParticleCloud() {
  const ref = useRef<THREE.Points>(null!)
  const positions = useMemo(() => {
    const count = 220
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * 2 * Math.PI
      const phi   = Math.acos(2 * Math.random() - 1)
      const r     = GLOBE_R * 1.2 + Math.random() * 1.2
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      pos[i * 3 + 2] = r * Math.cos(phi)
    }
    return pos
  }, [])
  useFrame(s => { ref.current.rotation.y = s.clock.elapsedTime * 0.018 })
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#38bdf8" size={0.025} transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  )
}

// Spawns arc attacks between random cities
interface ArcData { id: number; from: THREE.Vector3; to: THREE.Vector3; color: string }

function AttackManager({ scenario, onNewAttack }: {
  scenario: typeof HISTORICAL_SCENARIOS[0]
  onNewAttack: (from: string, to: string, type: string, severity: string, color: string) => void
}) {
  const [arcs, setArcs] = useState<ArcData[]>([])
  const nextId = useRef(0)

  useEffect(() => {
    // Clear existing arcs on new scenario
    setArcs([])
    
    const fromCoords = CITY_COORDS[scenario.origin]
    if (!fromCoords) return
    const fromVec = latLonToVec3(fromCoords.lat, fromCoords.lon, GLOBE_R)

    // Burst fire to all targets
    scenario.targets.forEach((targetName, idx) => {
      // Very fast staggering to simulate a global burst/worm
      setTimeout(() => {
        const toCoords = CITY_COORDS[targetName]
        if (!toCoords) return

        const toVec = latLonToVec3(toCoords.lat, toCoords.lon, GLOBE_R)
        
        onNewAttack(scenario.origin, targetName, (scenario as any).type || scenario.vector, scenario.severity, scenario.color)
        setArcs(prev => [...prev.slice(-15), { id: nextId.current++, from: fromVec, to: toVec, color: scenario.color }])
      }, idx * 150 + Math.random() * 200) // Fast burst with slight randomness
    })
  }, [scenario, onNewAttack])

  return (
    <group>
      {arcs.map(a => (
        <AttackArc key={a.id} from={a.from} to={a.to} color={a.color}
          onComplete={() => setArcs(prev => prev.filter(x => x.id !== a.id))} />
      ))}
    </group>
  )
}

// Solar System Background Planets
// Full Solar System orbiting Earth
function SolarSystem() {
  const [marsMap, jupiterMap, venusMap, mercuryMap] = useTexture([
    '/textures/mars.jpg',
    '/textures/jupiter.jpg',
    '/textures/venus.jpg',
    '/textures/mercury.jpg'
  ])

  const planetsRef = useRef<THREE.Group>(null!)

  const planets = useMemo(() => [
    // Moon (using Mercury texture which looks very similar)
    { name: 'Moon', map: mercuryMap, color: '#e2e8f0', size: 0.08, dist: 1.25, speed: 0.5, angle: 0, y: 0.2 },
    // Venus
    { name: 'Venus', map: venusMap, color: '#fef08a', size: 0.18, dist: 1.7, speed: 0.35, angle: 2.1, y: -0.1 },
    // Mars
    { name: 'Mars', map: marsMap, color: '#ffedd5', size: 0.2, dist: 2.1, speed: 0.25, angle: 4.2, y: 0.1 },
    // Jupiter
    { name: 'Jupiter', map: jupiterMap, color: '#ffffff', size: 0.45, dist: 2.9, speed: 0.1, angle: 1.2, y: -0.3 },
    // Saturn (using Jupiter texture tinted)
    { name: 'Saturn', map: jupiterMap, color: '#fef3c7', size: 0.38, dist: 3.8, speed: 0.08, angle: 5.5, y: 0.5, hasRing: true, ringColor: '#fde68a' }
  ], [marsMap, jupiterMap, venusMap, mercuryMap])

  useFrame((state, delta) => {
    if (planetsRef.current) {
      planets.forEach((p, i) => {
        p.angle += delta * p.speed
        const group = planetsRef.current.children[i]
        group.position.x = Math.cos(p.angle) * p.dist
        group.position.z = Math.sin(p.angle) * p.dist
        group.rotation.y += delta * 0.5
      })
    }
  })

  return (
    <group ref={planetsRef}>
      {planets.map((p, i) => {
        const x = Math.cos(p.angle) * p.dist
        const z = Math.sin(p.angle) * p.dist
        return (
          <group key={p.name} position={[x, p.y, z]}>
            <mesh>
              <sphereGeometry args={[p.size, 64, 64]} />
              <meshStandardMaterial 
                map={p.map} 
                color={p.color}
                roughness={0.8} 
                metalness={0.1} 
              />
            </mesh>
            {p.hasRing && (
              <mesh rotation={[Math.PI / 2.2, 0, 0]}>
                <ringGeometry args={[p.size * 1.4, p.size * 2.2, 64]} />
                <meshStandardMaterial 
                  color={p.ringColor}
                  map={p.map}
                  side={THREE.DoubleSide} 
                  transparent 
                  opacity={0.8} 
                  roughness={0.6}
                />
              </mesh>
            )}
          </group>
        )
      })}
    </group>
  )
}

// Camera Controller to fly to attack origin
function CameraController({ activeScenario }: { activeScenario: typeof HISTORICAL_SCENARIOS[0] }) {
  const { camera } = useThree()
  const [isAnimating, setIsAnimating] = useState(false)
  const targetPos = useRef(new THREE.Vector3(0, 0, 4.2))
  
  useEffect(() => {
    const coords = CITY_COORDS[activeScenario.origin]
    if (coords) {
       const vec = latLonToVec3(coords.lat, coords.lon, GLOBE_R)
       // Position camera 4.2 units away, looking at origin
       targetPos.current = vec.clone().normalize().multiplyScalar(4.2)
       setIsAnimating(true)
       // Stop forcing camera after 2 seconds so user can pan around
       const t = setTimeout(() => setIsAnimating(false), 2000)
       return () => clearTimeout(t)
    }
  }, [activeScenario])

  useFrame((_, dt) => {
    if (isAnimating) {
      camera.position.lerp(targetPos.current, dt * 3.5)
      camera.lookAt(0, 0, 0)
    }
  })
  
  return null
}

// Full globe scene
function GlobeScene({ activeScenario, onNewAttack }: { 
  activeScenario: typeof HISTORICAL_SCENARIOS[0]
  onNewAttack: (f: string, t: string, type: string, sev: string, col: string) => void 
}) {
  // Only render nodes for the cities involved in the ACTIVE scenario!
  const activeCityVecs = useMemo(() => {
    const citiesToRender = new Set([activeScenario.origin, ...activeScenario.targets])
    return Array.from(citiesToRender).map(name => {
      const coords = CITY_COORDS[name]
      if (!coords) return null
      return {
        name,
        vec: latLonToVec3(coords.lat, coords.lon, GLOBE_R),
        color: name === activeScenario.origin ? '#ef4444' : activeScenario.color
      }
    }).filter(Boolean) as { name: string, vec: THREE.Vector3, color: string }[]
  }, [activeScenario])
  
  return (
    <group>
      <GlobeEarth />
      <Atmosphere />
      <ParticleCloud />
      <SolarSystem />
      {activeCityVecs.map((v) => <CityNode key={v.name} name={v.name} vec={v.vec} color={v.color} />)}
      <AttackManager scenario={activeScenario} onNewAttack={onNewAttack} />
    </group>
  )
}

// Log entry type
interface LogEntry { id: number; from: string; to: string; type: string; severity: string; color: string; timestamp: Date }

// Severity badge
function SeverityBadge({ level, color }: { level: string; color: string }) {
  return (
    <span
      className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded tracking-wider shrink-0"
      style={{ background: `${color}18`, color, border: `1px solid ${color}40` }}
    >
      {level}
    </span>
  )
}

// Individual log row
function LogRow({ entry }: { entry: LogEntry }) {
  const sev = SEVERITIES.find(s => s.level === entry.severity)
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg border"
      style={{ background: `${entry.color}08`, borderColor: `${entry.color}22` }}
    >
      <div className="relative shrink-0 mt-1">
        <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
        <div className="absolute inset-0 rounded-full animate-ping opacity-50" style={{ background: entry.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-1">
          <SeverityBadge level={entry.severity} color={sev?.color ?? entry.color} />
          <span className="text-[10px] font-semibold" style={{ color: entry.color }}>{entry.type}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] font-mono min-w-0">
          <span className="font-semibold truncate" style={{ color: '#e2f0ff' }}>{entry.from}</span>
          <ChevronRight className="w-3 h-3 shrink-0 opacity-60" style={{ color: entry.color }} />
          <span className="font-semibold truncate" style={{ color: '#e2f0ff' }}>{entry.to}</span>
        </div>
        <div className="text-[9px] mt-0.5 font-mono opacity-50" style={{ color: '#94a3b8' }}>
          {entry.timestamp.toLocaleTimeString()}
        </div>
      </div>
    </motion.div>
  )
}

// Main exported component
export default function AttackMap() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState(0)
  const [log, setLog] = useState<LogEntry[]>([])
  const nextId = useRef(0)

  const activeScenario = HISTORICAL_SCENARIOS[activeScenarioIdx]

  const groupedScenarios = useMemo(() => {
    const groups: Record<string, typeof HISTORICAL_SCENARIOS> = {}
    HISTORICAL_SCENARIOS.forEach(s => {
      if (!groups[s.vector]) groups[s.vector] = []
      groups[s.vector].push(s)
    })
    return groups
  }, [])

  // Clear logs when scenario changes to give it a fresh start
  useEffect(() => {
    setLog([])
  }, [activeScenarioIdx])

  const handleNewAttack = useCallback((from: string, to: string, type: string, severity: string, color: string) => {
    setLog(prev => [
      { id: nextId.current++, from, to, type, severity, color, timestamp: new Date() },
      ...prev.slice(0, 40),
    ])
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(139,92,246,0.1) 100%), rgba(2, 8, 20, 0.95)',
        border: '1px solid rgba(14,165,233,0.18)',
        boxShadow: '0 0 0 1px rgba(14,165,233,0.06), 0 20px 60px rgba(0,0,0,0.5), 0 0 80px rgba(139,92,246,0.15)',
      }}
    >
      {/* Header */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 border-b"
        style={{ borderColor: 'rgba(14,165,233,0.12)', background: 'rgba(14,165,233,0.04)' }}
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <div className="absolute inset-0 rounded-full animate-ping bg-cyan-400 opacity-60" />
          </div>
          <Globe className="h-4 w-4" style={{ color: '#0ea5e9' }} />
          <span className="text-sm font-bold tracking-wide" style={{ color: '#e2f0ff' }}>
            Historical Cyber Warfare Archives
          </span>
          <span
            className="text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded-full tracking-widest"
            style={{ background: 'rgba(14,165,233,0.15)', color: '#0ea5e9', border: '1px solid rgba(14,165,233,0.3)' }}
          >
            ARCHIVE PLAYBACK
          </span>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center">
            <span className="text-base font-bold font-mono leading-none" style={{ color: '#0ea5e9' }}>{activeScenario.year}</span>
            <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60" style={{ color: '#94a3b8' }}>Year</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base font-bold font-mono leading-none" style={{ color: '#f97316' }}>{activeScenario.name}</span>
            <span className="text-[9px] uppercase tracking-wider mt-0.5 opacity-60" style={{ color: '#94a3b8' }}>Operation</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Globe */}
        <div className="lg:col-span-3 relative" style={{ minHeight: 480 }}>
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: 'linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <Suspense fallback={
            <div className="h-full flex items-center justify-center" style={{ height: 480 }}>
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
                <span className="text-xs font-mono" style={{ color: '#22d3ee', opacity: 0.6 }}>Loading archive...</span>
              </div>
            </div>
          }>
            <Canvas
              camera={{ position: [0, 0, 4.2], fov: 42 }}
              gl={{ antialias: true, alpha: true }}
              style={{ height: 480, background: 'transparent' }}
              dpr={[1, 1.5]}
              performance={{ min: 0.5 }}
            >
              <ambientLight intensity={1.1} />
              <directionalLight position={[6, 4, 6]} intensity={2.2} />
              <directionalLight position={[-5, -3, 4]} intensity={1.1} color="#06b6d4" />
              <Suspense fallback={null}>
                <CameraController activeScenario={activeScenario} />
                <GlobeScene activeScenario={activeScenario} onNewAttack={handleNewAttack} />
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={true} enableDamping={true} dampingFactor={0.05} autoRotate={false} />
            </Canvas>
          </Suspense>
          <div className="absolute bottom-3 left-4 text-[10px] font-mono opacity-30" style={{ color: '#0ea5e9' }}>
            HISTORICAL PLAYBACK // TIMELINE SECURE
          </div>
        </div>

        {/* Info Panel */}
        <div className="lg:col-span-2 flex flex-col" style={{ borderLeft: '1px solid rgba(14,165,233,0.1)' }}>
          
          {/* Operations Menu */}
          <div className="flex flex-col border-b" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
            <div className="px-4 py-2.5 bg-cyan-950/30 flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-bold tracking-wide text-cyan-100 uppercase">Select Operation</span>
            </div>
            
            <div className="flex overflow-x-auto gap-2 px-3 py-3 scrollbar-none" style={{ maxHeight: '140px', flexWrap: 'wrap' }}>
              {HISTORICAL_SCENARIOS.map((s, idx) => {
                const isActive = activeScenarioIdx === idx;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveScenarioIdx(idx)}
                    className="flex flex-col items-start px-2.5 py-1.5 rounded-lg border text-left transition-all hover:scale-[1.02]"
                    style={{
                      borderColor: isActive ? s.color : 'rgba(14,165,233,0.15)',
                      background: isActive ? `${s.color}15` : 'rgba(0,0,0,0.3)',
                    }}
                  >
                    <span className="text-[10px] font-mono opacity-60" style={{ color: isActive ? s.color : '#94a3b8' }}>{s.year} // {s.vector}</span>
                    <span className="text-xs font-bold whitespace-nowrap" style={{ color: isActive ? '#fff' : '#cbd5e1' }}>{s.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Scenario Description */}
          <div className="px-4 py-4 border-b flex-1" style={{ borderColor: 'rgba(14,165,233,0.1)' }}>
             <h3 className="text-xl font-bold font-mono tracking-wide" style={{ color: '#e2f0ff' }}>
               {activeScenario.name} <span className="opacity-50">({activeScenario.year})</span>
             </h3>
             <div className="flex items-center gap-2 mt-2 mb-4">
               <SeverityBadge level={activeScenario.severity} color={activeScenario.color} />
               <span className="text-xs uppercase font-bold tracking-wider" style={{ color: activeScenario.color }}>{(activeScenario as any).type || activeScenario.vector}</span>
             </div>
             <p className="text-sm leading-relaxed opacity-90" style={{ color: '#cbd5e1' }}>
               {activeScenario.description}
             </p>
          </div>

          {/* Log scroll */}
          <div className="overflow-y-auto px-3 py-3 flex flex-col gap-1.5" style={{ height: 180, background: 'rgba(0,0,0,0.2)' }}>
            <AnimatePresence initial={false} mode="popLayout">
              {log.map(entry => <LogRow key={entry.id} entry={entry} />)}
            </AnimatePresence>
            {log.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full gap-2 opacity-40">
                <span className="text-xs font-mono" style={{ color: '#94a3b8' }}>Initializing payload...</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

