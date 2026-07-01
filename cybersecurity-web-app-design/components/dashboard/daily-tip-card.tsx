"use client"

import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import { dailyTips } from '@/data/courseData'

export default function DailyTipCard() {
  // Rotate tip by day of year
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000)
  const tip = dailyTips[dayOfYear % dailyTips.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-2xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/8 to-orange-500/5 backdrop-blur-xl p-5 flex gap-4 items-start shadow-[0_0_20px_rgba(234,179,8,0.04)]"
    >
      <div className="p-2.5 rounded-xl border border-yellow-500/25 bg-yellow-500/10 text-yellow-400 shrink-0">
        <Lightbulb className="h-5 w-5" />
      </div>
      <div>
        <p className="font-mono text-[10px] text-yellow-500/80 uppercase tracking-[0.25em] mb-1">
          Daily Cyber Hygiene Tip
        </p>
        <p className="font-mono text-sm text-slate-200 leading-relaxed">
          {tip}
        </p>
      </div>
    </motion.div>
  )
}
