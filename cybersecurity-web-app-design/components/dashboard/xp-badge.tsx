"use client"

import { useProgress } from '@/lib/progress-context'
import { Flame, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function XpBadge() {
  const { progress } = useProgress()

  return (
    <div className="flex items-center gap-2 select-none">
      {progress.streak > 0 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: 'rgba(245,158,11,0.10)',
            border: '1px solid rgba(245,158,11,0.25)',
            color: '#D97706',
          }}
          title="Daily Active Streak"
        >
          <Flame className="h-3.5 w-3.5" />
          <span>{progress.streak}d</span>
        </motion.div>
      )}

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
        style={{
          background: 'var(--db-accent-light)',
          border: '1px solid var(--db-border-strong)',
          color: 'var(--db-accent)',
        }}
      >
        <Zap className="h-3.5 w-3.5" />
        <span>{progress.xp} XP</span>
      </motion.div>
    </div>
  )
}
