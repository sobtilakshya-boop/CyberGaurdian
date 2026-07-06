"use client"

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Users, AlertOctagon, Activity, Info, FlaskConical, Award } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number
  suffix?: string
  subtext: string
  iconType: 'shield' | 'users' | 'alert' | 'activity' | 'award'
  tooltipText?: string
  isDemo?: boolean
  accentColor?: string
}

const iconMap = {
  shield: ShieldCheck,
  users: Users,
  alert: AlertOctagon,
  activity: Activity,
  award: Award,
}

const colorMap = {
  shield: { accent: 'var(--db-accent)', bg: 'var(--db-accent-light)', border: 'var(--db-border-strong)' },
  users:  { accent: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.2)' },
  alert:  { accent: '#EF4444', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.2)' },
  activity: { accent: '#F59E0B', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.2)' },
  award:  { accent: '#10B981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.2)' },
}

export default function StatCard({
  title,
  value,
  suffix = '',
  subtext,
  iconType,
  tooltipText,
  isDemo = false,
}: StatCardProps) {
  const [count, setCount] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const Icon = iconMap[iconType]
  const colors = colorMap[iconType]

  // Smooth counter animation
  useEffect(() => {
    if (value === 0) { setCount(0); return }
    let start = 0
    const increment = Math.ceil(value / 60)
    const timer = setInterval(() => {
      start += increment
      if (start >= value) { clearInterval(timer); setCount(value) }
      else setCount(start)
    }, 20)
    return () => clearInterval(timer)
  }, [value])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      transition={{ duration: 0.4 }}
      className="relative overflow-visible rounded-2xl p-5"
      style={{
        background: 'var(--db-surface)',
        border: '1px solid var(--db-border)',
        boxShadow: 'var(--db-shadow-sm)',
        zIndex: showTooltip ? 50 : 1,
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4 relative">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: 'var(--db-text-secondary)' }}>
            {title}
          </span>

          {/* Info tooltip trigger */}
          {tooltipText && (
            <div className="relative">
              <button
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onFocus={() => setShowTooltip(true)}
                onBlur={() => setShowTooltip(false)}
                className="cursor-pointer"
                style={{ color: 'var(--db-text-muted)' }}
                aria-label={`Info about ${title}`}
              >
                <Info className="h-3.5 w-3.5" />
              </button>

              <AnimatePresence>
                {showTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 4, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 4, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-6 z-50 w-56 p-3 rounded-xl text-xs leading-relaxed pointer-events-none"
                    style={{
                      background: 'var(--db-surface-2)',
                      border: '1px solid var(--db-border-strong)',
                      boxShadow: 'var(--db-shadow-lg)',
                      color: 'var(--db-text-secondary)',
                      backdropFilter: 'blur(12px)',
                    }}
                  >
                    {tooltipText}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Icon */}
        <div
          className="p-2.5 rounded-xl shrink-0"
          style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
        >
          <Icon className="h-4 w-4" style={{ color: colors.accent }} />
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-1 mb-1 relative">
        <span className="text-3xl font-bold font-mono tracking-tight" style={{ color: 'var(--db-text-primary)' }}>
          {count.toLocaleString()}
        </span>
        {suffix && (
          <span className="text-lg font-bold font-mono" style={{ color: colors.accent }}>
            {suffix}
          </span>
        )}
      </div>

      {/* Subtext */}
      <p className="text-xs relative" style={{ color: 'var(--db-text-muted)' }}>{subtext}</p>

      {/* Demo data badge */}
      {isDemo && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold uppercase tracking-wider"
          style={{
            background: 'rgba(245,158,11,0.10)',
            border: '1px solid rgba(245,158,11,0.25)',
            color: '#D97706',
          }}
          title="This metric is using demonstration data"
        >
          <FlaskConical className="h-2.5 w-2.5" />
          Demo
        </div>
      )}
    </motion.div>
  )
}
