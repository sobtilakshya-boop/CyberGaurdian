"use client"

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { chapters } from '@/data/courseData'
import { AlertTriangle, Info, TrendingUp, Search, Calendar, ShieldAlert } from 'lucide-react'

const severityConfig = {
  high:   { icon: AlertTriangle, color: 'border-red-500/30 bg-gradient-to-r from-red-500/10 via-white/40 to-white/60 text-red-700', badge: 'bg-red-500/10 border-red-500/20 text-red-600', label: 'Critical Threat' },
  medium: { icon: TrendingUp,    color: 'border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-white/40 to-white/60 text-yellow-750', badge: 'bg-yellow-500/10 border-yellow-500/20 text-yellow-700', label: 'Medium Risk' },
  low:    { icon: Info,           color: 'border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 via-white/40 to-white/60 text-cyan-700', badge: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600', label: 'Awareness Advisory' },
}

export default function NewsPage() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Gather all unique news tips across chapters
  const allNews = chapters.flatMap(chapter => 
    chapter.newsTips.map(tip => ({
      ...tip,
      chapterTitle: chapter.title,
      chapterId: chapter.id
    }))
  )

  // Filter based on tab and search query
  const filteredNews = allNews.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.severity === activeFilter
    const matchesSearch = item.headline.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.source.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 pb-6 border-b border-[var(--db-border-strong)]">
        <div className="bg-gradient-to-r from-red-500 via-yellow-500 to-cyan-500 h-1.5 w-24 rounded-full mb-2" />
        <span className="font-mono text-[10px] text-[var(--db-accent)] uppercase tracking-widest font-bold">
          Global Telemetry Intel Feed
        </span>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--db-text-primary)] uppercase">
          Threat News & Awareness
        </h1>
        <p className="text-xs text-[var(--db-text-secondary)] font-mono max-w-3xl leading-relaxed">
          Real-time ingestion of global security advisories, vulnerability bulletins, and tactical threat intelligence.
        </p>
      </div>

      {/* Control Bar: Filter Tabs + Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 border border-[var(--db-border-strong)] p-1.5 rounded-xl bg-white/70 backdrop-blur-md self-start">
          {(['all', 'high', 'medium', 'low'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-lg font-mono text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                activeFilter === tab
                  ? tab === 'high' ? 'bg-red-500/20 text-red-650 border border-red-500/30'
                    : tab === 'medium' ? 'bg-yellow-500/20 text-yellow-700 border border-yellow-500/30'
                    : tab === 'low' ? 'bg-cyan-500/20 text-cyan-650 border border-cyan-500/30'
                    : 'bg-slate-200 text-slate-800 border border-slate-300'
                  : 'bg-transparent text-slate-500 hover:text-slate-700 border border-transparent'
              }`}
            >
              {tab === 'all' ? 'All Alerts' : `${tab} Risk`}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            placeholder="Filter by keyword..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[var(--db-border-strong)] bg-white/70 py-2.5 pl-10 pr-4 text-xs font-mono text-[var(--db-text-primary)] outline-none transition-all placeholder:text-slate-400 focus:border-cyan-500 focus:shadow-[0_0_0_2px_rgba(6,182,212,0.1)]"
          />
        </div>
      </div>

      {/* Feed Stream */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredNews.length > 0 ? (
            filteredNews.map((item, idx) => {
              const config = severityConfig[item.severity]
              const Icon = config.icon

              return (
                <motion.div
                  key={`${item.chapterId}-${idx}`}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className={`rounded-2xl border p-5 backdrop-blur-md flex flex-col sm:flex-row gap-4 transition-all duration-300 hover:border-slate-400 ${config.color}`}
                  style={{ boxShadow: 'var(--db-shadow-sm)' }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/90 border border-slate-200">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between gap-3">
                    <div>
                      <div className="flex items-start justify-between flex-wrap gap-2.5 mb-2">
                        <span className={`px-2 py-0.5 rounded-md border font-mono text-[9px] font-bold uppercase tracking-wider ${config.badge}`}>
                          {config.label}
                        </span>
                        <span className="font-mono text-[10px] text-[var(--db-text-muted)] flex items-center gap-1.5">
                          <Calendar className="h-3 w-3" />
                          Ingested from Chapter {item.chapterId}
                        </span>
                      </div>
                      <h4 className="font-mono text-sm font-bold text-[var(--db-text-primary)] leading-tight mb-2">
                        {item.headline}
                      </h4>
                      <p className="font-mono text-xs text-[var(--db-text-secondary)] leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-[10px] font-mono text-[var(--db-text-muted)] flex-wrap gap-2">
                      <span>Source: <strong className="text-[var(--db-text-secondary)]">{item.source}</strong></span>
                      <span className="text-[var(--db-accent)] uppercase tracking-widest text-[9px] font-bold">
                        {item.chapterTitle}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-2xl border border-dashed border-[var(--db-border-strong)] bg-white/40 p-12 text-center flex flex-col items-center justify-center gap-3 text-[var(--db-text-muted)]"
            >
              <ShieldAlert className="h-10 w-10 text-slate-400 animate-bounce" />
              <p className="font-mono text-sm">No tactical advisories match your filter criteria.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
