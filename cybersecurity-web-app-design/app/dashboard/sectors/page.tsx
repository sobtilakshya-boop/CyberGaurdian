import { Metadata } from 'next'
import { Shield } from 'lucide-react'
import { SectorCard } from '@/components/dashboard/sector-card'
import { sectors } from '@/data/sectorsData'

export const metadata: Metadata = {
  title: 'Sector-Wise Learning | CyberGuardian',
  description: 'Immersive cybersecurity modules tailored by industry sector.',
}

export default function SectorsPage() {
  return (
    <div className="flex flex-col max-w-7xl mx-auto gap-8 pb-12 px-4 md:px-8 pt-6">
      {/* Immersive Header */}
      <div className="relative rounded-3xl overflow-hidden p-8 md:p-12 border border-slate-700/50"
           style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.8) 100%)', backdropFilter: 'blur(20px)' }}>
        
        {/* Decorative background blur */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-4 max-w-3xl">
          <div className="flex items-center gap-3 text-cyan-400 mb-2">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <Shield className="h-6 w-6" />
            </div>
            <span className="text-sm font-mono font-bold tracking-widest uppercase">Global Defense Network</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white drop-shadow-sm">
            Sector Simulators
          </h1>
          <p className="text-lg leading-relaxed mt-2 text-slate-300 font-medium">
            Enter specialized threat environments. Analyze industry-specific attack vectors, complete interactive simulations, and earn your certification badges.
          </p>
        </div>
      </div>

      {/* Grid of Sector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-4">
        {sectors.map((sector) => (
          <SectorCard key={sector.id} sector={sector} progress={0} /> 
        ))}
      </div>
    </div>
  )
}
