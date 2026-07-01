"use client"

import { useProgress } from '@/lib/progress-context'
import { Flame, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

export default function XpBadge() {
  const { progress } = useProgress()

  return (
    <div className="flex items-center gap-3.5 select-none">
      {/* Streak Badge */}
      {progress.streak > 0 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-orange-500/25 bg-orange-500/10 text-orange-400 font-mono text-xs font-bold"
          title="Daily Active Streak"
        >
          <Flame className="h-4 w-4 fill-orange-500/10 animate-bounce" />
          <span>{progress.streak} Day{progress.streak > 1 ? 's' : ''}</span>
        </motion.div>
      )}

      {/* XP Points */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-yellow-500/25 bg-yellow-500/10 text-yellow-400 font-mono text-xs font-bold"
      >
        <Trophy className="h-4 w-4 text-yellow-400" />
        <span>{progress.xp} XP</span>
      </motion.div>
    </div>
  )
}
