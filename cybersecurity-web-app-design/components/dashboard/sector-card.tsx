"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { GraduationCap, Building, Landmark, Factory, HeartPulse, ShieldAlert, ArrowRight, Clock, Target } from 'lucide-react'
import type { SectorData } from '@/data/sectorsData'

const iconMap: Record<string, any> = {
  GraduationCap, Building, Landmark, Factory, HeartPulse, ShieldAlert,
}

export function SectorCard({ sector, progress = 0 }: { sector: SectorData, progress?: number }) {
  const Icon = iconMap[sector.iconType] || Building
  
  return (
    <Link href={`/dashboard/sectors/${sector.id}`} className="group block h-full">
      <motion.div
        whileHover={{ y: -6, scale: 1.02 }}
        className="h-full flex flex-col p-6 rounded-2xl relative overflow-hidden transition-all duration-300"
        style={{
          background: 'var(--db-surface)',
          border: '1px solid var(--db-border)',
          boxShadow: 'var(--db-shadow-sm)'
        }}
      >
        {/* Dynamic Hover Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-0 group-hover:opacity-25 transition-opacity duration-500"
          style={{ backgroundImage: `url(${sector.heroImageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full">
          {/* Header row: Icon & Difficulty Pill */}
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-500/20 group-hover:scale-110 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
              <Icon className="h-6 w-6" />
            </div>
            {sector.difficulty && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider border border-[var(--db-border)] bg-[var(--db-surface-2)] text-[var(--db-text-secondary)] uppercase">
                {sector.difficulty}
              </span>
            )}
          </div>

          <h3 className="text-xl font-bold mb-2 tracking-wide text-[var(--db-text-primary)] group-hover:text-[var(--db-accent)] transition-colors">
            {sector.title}
          </h3>
          
          <p className="text-sm leading-relaxed mb-6 flex-1 text-[var(--db-text-secondary)] group-hover:text-[var(--db-text-primary)] transition-colors">
            {sector.shortDesc}
          </p>
          
          {/* Progress & Meta Info */}
          <div className="flex flex-col gap-3 mt-auto">
            {/* Meta Row */}
            <div className="flex items-center gap-4 text-xs font-mono text-[var(--db-text-muted)]">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" /> {sector.estimatedTime || '60 mins'}
              </div>
              <div className="flex items-center gap-1.5">
                <Target className="h-3.5 w-3.5" /> {sector.activities?.length || 0} Modules
              </div>
            </div>

            {/* Progress Bar & CTA */}
            <div className="flex items-center justify-between pt-3 border-t border-[var(--db-border)]">
              <div className="flex-1 mr-4">
                <div className="flex justify-between mb-1">
                  <span className="text-[10px] uppercase tracking-widest text-[var(--db-text-muted)] font-bold">Progress</span>
                  <span className="text-[10px] font-mono text-[var(--db-accent)]">{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-[var(--db-surface-2)] rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-[var(--db-accent)] shadow-[0_0_10px_rgba(79,70,229,0.2)]"
                  />
                </div>
              </div>
              <div className="w-8 h-8 shrink-0 rounded-full flex items-center justify-center bg-[var(--db-accent-light)] text-[var(--db-accent)] group-hover:bg-[var(--db-accent)] group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
