"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { GraduationCap, Building, Landmark, Factory, HeartPulse, ShieldAlert, ArrowRight } from 'lucide-react'
import { sectors } from '@/data/sectorsData'

const iconMap: Record<string, any> = {
  GraduationCap,
  Building,
  Landmark,
  Factory,
  HeartPulse,
  ShieldAlert,
}

export default function SectorExploreWidget() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight" style={{ color: 'var(--db-text-primary)' }}>Explore by Sector</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--db-text-secondary)' }}>Discover customized cyber hygiene guidelines tailored to your industry.</p>
        </div>
        <Link href="/dashboard/sectors">
          <button className="hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors" style={{ color: 'var(--db-accent)' }}>
            View All Sectors <ArrowRight className="h-4 w-4" />
          </button>
        </Link>
      </div>

      {/* Horizontal scroll container */}
      <div className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent snap-x snap-mandatory">
        {sectors.map((sector, idx) => {
          const Icon = iconMap[sector.iconType] || Building
          return (
            <Link key={sector.id} href={`/dashboard/sectors/${sector.id}`} className="snap-start shrink-0 w-[280px] group">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="h-full flex flex-col p-5 rounded-2xl relative overflow-hidden transition-all duration-300 group-hover:shadow-md"
                style={{
                  background: 'var(--db-surface)',
                  border: '1px solid var(--db-border)',
                  boxShadow: 'var(--db-shadow-sm)',
                }}
              >
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-10 h-10 rounded-lg bg-cyan-50 border border-cyan-200 flex items-center justify-center mb-4 text-cyan-600 group-hover:bg-cyan-100 group-hover:scale-110 transition-all duration-300">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: 'var(--db-text-primary)' }}>{sector.title}</h3>
                  <p className="text-xs leading-relaxed mb-4 flex-1 line-clamp-3" style={{ color: 'var(--db-text-secondary)' }}>
                    {sector.shortDesc}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0" style={{ color: 'var(--db-accent)' }}>
                    View Guidelines <ArrowRight className="h-3 w-3" />
                  </div>
                </div>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
