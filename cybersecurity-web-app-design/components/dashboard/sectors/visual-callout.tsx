"use client"

import { motion } from 'framer-motion'
import { TrendingUp, ShieldAlert } from 'lucide-react'

interface CalloutItem {
  label: string
  value: string
  trend?: string
}

export function VisualCallout({ callouts }: { callouts: CalloutItem[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
      {callouts.map((item, idx) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: idx * 0.1 }}
          className="relative overflow-hidden rounded-2xl p-6 border border-[var(--db-border)] bg-[var(--db-surface)] flex flex-col justify-between shadow-sm"
        >
          {/* Subtle decoration */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[var(--db-accent-light)] rounded-full blur-xl pointer-events-none" />
          
          <div className="flex justify-between items-start mb-3">
            <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-[var(--db-text-muted)]">
              {item.label}
            </span>
            <div className="p-1.5 rounded-lg bg-[var(--db-accent-light)] text-[var(--db-accent)]">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-3xl font-black font-sans tracking-tight text-[var(--db-text-primary)]">
              {item.value}
            </span>
            {item.trend && (
              <span className="text-[10px] font-mono font-medium text-[var(--db-accent)] flex items-center gap-1">
                <ShieldAlert className="h-3 w-3" />
                {item.trend}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
