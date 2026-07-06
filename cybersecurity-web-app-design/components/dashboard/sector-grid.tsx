"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { GraduationCap, Building, Landmark, Factory, HeartPulse, ShieldAlert, ArrowRight } from 'lucide-react'
import type { SectorData } from '@/data/sectorsData'

const iconMap: Record<string, any> = {
  GraduationCap,
  Building,
  Landmark,
  Factory,
  HeartPulse,
  ShieldAlert,
}

export default function SectorGrid({ sectors }: { sectors: SectorData[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sectors.map((sector, idx) => {
        const Icon = iconMap[sector.iconType] || Building
        return (
          <Link key={sector.id} href={`/dashboard/sectors/${sector.id}`} className="group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              whileHover={{ y: -4, scale: 1.01 }}
              className="h-full flex flex-col p-6 rounded-2xl relative overflow-hidden transition-all duration-300 group-hover:shadow-md"
              style={{
                background: 'var(--db-surface)',
                border: '1px solid var(--db-border)',
                boxShadow: 'var(--db-shadow-sm)',
              }}
            >
              {/* Cinematic Background Hover */}
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-30 transition-opacity duration-700"
                style={{ backgroundImage: `url(${sector.heroImageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-200 flex items-center justify-center mb-5 text-cyan-600 group-hover:bg-cyan-100 group-hover:scale-110 transition-all duration-300 shadow-sm group-hover:shadow-md">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2 font-sans tracking-wide" style={{ color: 'var(--db-text-primary)' }}>{sector.title}</h3>
                <p className="text-sm leading-relaxed mb-6 flex-1" style={{ color: 'var(--db-text-secondary)' }}>
                  {sector.shortDesc}
                </p>
                
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-xs font-bold uppercase tracking-wider transition-colors" style={{ color: 'var(--db-text-muted)' }}>
                    Security Profile
                  </span>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 transform group-hover:translate-x-1" style={{ background: 'var(--db-accent-light)', color: 'var(--db-accent)' }}>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
        )
      })}
    </div>
  )
}
