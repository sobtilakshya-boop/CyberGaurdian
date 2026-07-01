"use client"

import { motion } from 'framer-motion'
import { AlertTriangle, Info, TrendingUp, ExternalLink } from 'lucide-react'
import type { Chapter } from '@/data/courseData'

interface NewsFeedProps {
  news: Chapter['newsTips']
}

const severityConfig = {
  high:   { icon: AlertTriangle, color: 'border-red-500/25 bg-red-500/8 text-red-400', badge: 'bg-red-500/15 border-red-500/25 text-red-400', label: 'HIGH' },
  medium: { icon: TrendingUp,    color: 'border-yellow-500/25 bg-yellow-500/8 text-yellow-400', badge: 'bg-yellow-500/15 border-yellow-500/25 text-yellow-400', label: 'MEDIUM' },
  low:    { icon: Info,           color: 'border-cyan-500/25 bg-cyan-500/8 text-cyan-400', badge: 'bg-cyan-500/15 border-cyan-500/25 text-cyan-400', label: 'INFO' },
}

export default function NewsFeed({ news }: NewsFeedProps) {
  return (
    <div className="flex flex-col gap-4">
      {news.map((item, i) => {
        const { icon: Icon, color, badge, label } = severityConfig[item.severity]
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl border p-5 flex gap-4 ${color}`}
          >
            <Icon className="h-5 w-5 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-2 mb-2 flex-wrap">
                <span className={`px-2 py-0.5 rounded-full border font-mono text-[9px] font-bold uppercase tracking-wider ${badge}`}>
                  {label}
                </span>
                <h4 className="font-mono text-sm font-bold text-white leading-tight">
                  {item.headline}
                </h4>
              </div>
              <p className="font-mono text-xs text-slate-400 leading-relaxed mb-2">
                {item.summary}
              </p>
              <p className="font-mono text-[10px] text-slate-500 flex items-center gap-1">
                <ExternalLink className="h-3 w-3" />
                Source: {item.source}
              </p>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}
