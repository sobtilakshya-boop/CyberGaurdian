"use client"

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Lock, CheckCircle2, ChevronRight, Clock, Zap } from 'lucide-react'
import type { Chapter } from '@/data/courseData'
import type { ChapterProgress } from '@/lib/progress-context'

interface ChapterCardProps {
  chapter: Chapter
  isUnlocked: boolean
  isComplete: boolean
  progress: ChapterProgress
  index: number
}

const colorMap: Record<string, string> = {
  cyan:   'from-cyan-500/15 to-cyan-500/5 border-cyan-500/20 hover:border-cyan-500/40',
  blue:   'from-blue-500/15 to-blue-500/5 border-blue-500/20 hover:border-blue-500/40',
  green:  'from-green-500/15 to-green-500/5 border-green-500/20 hover:border-green-500/40',
  yellow: 'from-yellow-500/15 to-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40',
  purple: 'from-purple-500/15 to-purple-500/5 border-purple-500/20 hover:border-purple-500/40',
  orange: 'from-orange-500/15 to-orange-500/5 border-orange-500/20 hover:border-orange-500/40',
  teal:   'from-teal-500/15 to-teal-500/5 border-teal-500/20 hover:border-teal-500/40',
  red:    'from-red-500/15 to-red-500/5 border-red-500/20 hover:border-red-500/40',
  violet: 'from-violet-500/15 to-violet-500/5 border-violet-500/20 hover:border-violet-500/40',
}

const iconBgMap: Record<string, string> = {
  cyan:   'bg-cyan-500/15 border-cyan-500/25',
  blue:   'bg-blue-500/15 border-blue-500/25',
  green:  'bg-green-500/15 border-green-500/25',
  yellow: 'bg-yellow-500/15 border-yellow-500/25',
  purple: 'bg-purple-500/15 border-purple-500/25',
  orange: 'bg-orange-500/15 border-orange-500/25',
  teal:   'bg-teal-500/15 border-teal-500/25',
  red:    'bg-red-500/15 border-red-500/25',
  violet: 'bg-violet-500/15 border-violet-500/25',
}

function getMiniProgress(cp: ChapterProgress): number {
  let done = 0
  if (cp.readingDone) done++
  if (cp.videosDone) done++
  if (cp.comicQuizPassed) done++
  if (cp.chapterQuizPassed) done++
  return Math.round((done / 4) * 100)
}

export default function ChapterCard({ chapter, isUnlocked, isComplete, progress, index }: ChapterCardProps) {
  const colorClass = colorMap[chapter.color] ?? colorMap.cyan
  const iconBg = iconBgMap[chapter.color] ?? iconBgMap.cyan
  const miniPct = getMiniProgress(progress)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
    >
      {isUnlocked ? (
        <Link href={`/dashboard/learn/${chapter.id}`}>
          <div className={`group relative rounded-2xl border bg-gradient-to-br backdrop-blur-xl p-5 transition-all duration-300 cursor-pointer ${colorClass} hover:shadow-[0_0_25px_rgba(6,182,212,0.08)] hover:-translate-y-0.5`}>
            {/* Complete badge */}
            {isComplete && (
              <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-400 font-mono text-[9px] uppercase tracking-wider">
                <CheckCircle2 className="h-3 w-3" />
                <span>Complete</span>
              </div>
            )}

            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`p-3 rounded-xl border ${iconBg} text-2xl leading-none shrink-0`}>
                {chapter.icon}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                    Chapter {chapter.id}
                  </span>
                </div>
                <h3 className="font-mono text-sm font-bold text-white leading-tight mb-1 group-hover:text-cyan-300 transition-colors">
                  {chapter.title}
                </h3>
                <p className="font-mono text-[11px] text-slate-500 leading-relaxed line-clamp-2 mb-3">
                  {chapter.description}
                </p>

                {/* Progress mini bar */}
                {miniPct > 0 && !isComplete && (
                  <div className="mb-3">
                    <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                        initial={{ width: 0 }}
                        animate={{ width: `${miniPct}%` }}
                        transition={{ duration: 0.8, delay: index * 0.07 + 0.3 }}
                      />
                    </div>
                    <p className="font-mono text-[9px] text-slate-500 mt-0.5">{miniPct}% complete</p>
                  </div>
                )}

                {/* Meta row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 font-mono text-[10px] text-slate-500">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{chapter.estimatedTime}</span>
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3 text-yellow-400" />+{chapter.xpReward} XP</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      ) : (
        /* Locked State */
        <div className="relative rounded-2xl border border-slate-800/60 bg-slate-900/20 backdrop-blur-xl p-5 opacity-60 select-none">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl border border-slate-700/40 bg-slate-800/30 text-2xl leading-none shrink-0 grayscale">
              {chapter.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest">
                  Chapter {chapter.id}
                </span>
                <Lock className="h-3 w-3 text-slate-600" />
              </div>
              <h3 className="font-mono text-sm font-bold text-slate-500 leading-tight mb-1">
                {chapter.title}
              </h3>
              <p className="font-mono text-[11px] text-slate-600 leading-relaxed line-clamp-2 mb-3">
                Complete Chapter {chapter.id - 1} to unlock
              </p>
              <div className="flex items-center gap-3 font-mono text-[10px] text-slate-600">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{chapter.estimatedTime}</span>
                <span className="flex items-center gap-1"><Zap className="h-3 w-3" />+{chapter.xpReward} XP</span>
              </div>
            </div>
          </div>
          {/* Lock overlay shimmer */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900/40 to-slate-950/60 pointer-events-none" />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="p-3 rounded-full bg-slate-900/80 border border-slate-700/50 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <Lock className="h-6 w-6 text-slate-500" />
            </div>
          </div>
        </div>
      )}
    </motion.div>
  )
}
