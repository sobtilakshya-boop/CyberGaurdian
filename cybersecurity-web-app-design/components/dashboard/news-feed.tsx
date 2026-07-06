"use client"

import { motion } from 'framer-motion'
import { AlertTriangle, Info, TrendingUp, ExternalLink } from 'lucide-react'
import type { Chapter } from '@/data/courseData'

interface NewsFeedProps {
  news: Chapter['newsTips']
}

const severityConfig = {
  high:   { icon: AlertTriangle, color: 'border-red-200 bg-red-50 text-red-700', badge: 'bg-red-100 border-red-200 text-red-700', label: 'HIGH' },
  medium: { icon: TrendingUp,    color: 'border-amber-200 bg-amber-50 text-amber-700', badge: 'bg-amber-100 border-amber-200 text-amber-700', label: 'MEDIUM' },
  low:    { icon: Info,           color: 'border-sky-200 bg-sky-50 text-sky-700', badge: 'bg-sky-100 border-sky-200 text-sky-700', label: 'INFO' },
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
                <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${badge}`}>
                  {label}
                </span>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">
                  {item.headline}
                </h4>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-2">
                {item.summary}
              </p>
              <p className="text-[10px] text-slate-500 flex items-center gap-1 font-medium">
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
