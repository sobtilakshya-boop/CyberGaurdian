"use client"

import { motion } from 'framer-motion'

interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
}

export default function ProgressRing({
  percent,
  size = 120,
  strokeWidth = 8,
  label,
  sublabel,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference
  const cx = size / 2
  const cy = size / 2

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="rgba(14,165,233,0.12)"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={cx} cy={cy} r={radius}
          fill="none"
          stroke="url(#pgGrad)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: 'easeOut', delay: 0.2 }}
        />
        <defs>
          <linearGradient id="pgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <motion.span
          className="font-mono font-bold leading-none"
          style={{ fontSize: size > 80 ? '1.25rem' : '0.875rem', color: 'var(--db-text-primary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {percent}%
        </motion.span>
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-wider mt-0.5" style={{ color: 'var(--db-text-muted)' }}>
            {label}
          </span>
        )}
        {sublabel && (
          <span className="font-mono text-[8px] tracking-wide" style={{ color: 'var(--db-accent)' }}>
            {sublabel}
          </span>
        )}
      </div>
    </div>
  )
}
