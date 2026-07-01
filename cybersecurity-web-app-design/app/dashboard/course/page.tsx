"use client"

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useProgress } from '@/lib/progress-context'
import { chapters } from '@/data/courseData'
import ChapterCompleteModal from '@/components/dashboard/chapter-complete-modal'
import ProgressRing from '@/components/dashboard/progress-ring'
import {
  Lock, CheckCircle2, ChevronRight, Clock, Zap, BookOpen,
  Video, BookMarked, Gamepad2, Puzzle, ClipboardCheck
} from 'lucide-react'

const colorPalette: Record<string, { bg: string; accent: string; border: string }> = {
  cyan:   { bg: 'rgba(14,165,233,0.06)',  accent: '#0EA5E9', border: 'rgba(14,165,233,0.18)' },
  blue:   { bg: 'rgba(59,130,246,0.06)',  accent: '#3B82F6', border: 'rgba(59,130,246,0.18)' },
  green:  { bg: 'rgba(16,185,129,0.06)',  accent: '#10B981', border: 'rgba(16,185,129,0.18)' },
  yellow: { bg: 'rgba(245,158,11,0.06)',  accent: '#F59E0B', border: 'rgba(245,158,11,0.18)' },
  purple: { bg: 'rgba(139,92,246,0.06)',  accent: '#8B5CF6', border: 'rgba(139,92,246,0.18)' },
  orange: { bg: 'rgba(249,115,22,0.06)',  accent: '#F97316', border: 'rgba(249,115,22,0.18)' },
  teal:   { bg: 'rgba(20,184,166,0.06)',  accent: '#14B8A6', border: 'rgba(20,184,166,0.18)' },
  red:    { bg: 'rgba(239,68,68,0.06)',   accent: '#EF4444', border: 'rgba(239,68,68,0.18)' },
  violet: { bg: 'rgba(167,139,250,0.06)', accent: '#A78BFA', border: 'rgba(167,139,250,0.18)' },
}

function getMiniProgress(cp: { readingDone: boolean; videosDone: boolean; comicQuizPassed: boolean; chapterQuizPassed: boolean }) {
  let done = 0
  if (cp.readingDone) done++
  if (cp.videosDone) done++
  if (cp.comicQuizPassed) done++
  if (cp.chapterQuizPassed) done++
  return Math.round((done / 4) * 100)
}

export default function CoursePage() {
  const { isChapterUnlocked, isChapterComplete, getChapterProgress, getOverallPercent, getCompletedCount } = useProgress()

  const overallPct = getOverallPercent()
  const completedCount = getCompletedCount()

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      <ChapterCompleteModal />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-6" style={{ borderBottom: '1px solid var(--db-border)' }}>
        <div>
          <p className="text-xs font-mono font-bold uppercase tracking-[0.25em] mb-1.5" style={{ color: 'var(--db-accent)' }}>
            Cyber Hygiene Academy
          </p>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--db-text-primary)' }}>
            Core Curriculum
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--db-text-secondary)' }}>
            9 interactive chapters covering enterprise cyber defense methodologies.
          </p>
        </div>

        <div
          className="flex items-center gap-5 p-4 rounded-2xl shrink-0"
          style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-sm)' }}
        >
          <ProgressRing percent={overallPct} size={64} strokeWidth={5} />
          <div className="text-sm">
            <p className="font-bold" style={{ color: 'var(--db-text-primary)' }}>{completedCount} / 9 Complete</p>
            <p className="text-xs" style={{ color: 'var(--db-text-muted)' }}>{overallPct}% of curriculum</p>
          </div>
        </div>
      </div>

      {/* Chapter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {chapters.map((chapter, idx) => {
          const unlocked = isChapterUnlocked(chapter.id)
          const complete = isChapterComplete(chapter.id)
          const cp = getChapterProgress(chapter.id)
          const miniPct = getMiniProgress(cp)
          const colors = colorPalette[chapter.color] ?? colorPalette.cyan

          return (
            <motion.div
              key={chapter.id}
              layoutId={`chapter-card-${chapter.id}`}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.06 }}
            >
              {unlocked ? (
                <Link href={`/dashboard/course/${chapter.id}`}>
                  <div
                    className="group relative rounded-2xl p-5 transition-all duration-300 cursor-pointer h-full flex flex-col"
                    style={{
                      background: 'rgba(255,255,255,0.90)',
                      border: `1px solid ${colors.border}`,
                      boxShadow: 'var(--db-shadow-sm)',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 8px 24px ${colors.accent}20, var(--db-shadow-md)`)}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = 'var(--db-shadow-sm)')}
                  >
                    {/* Complete badge */}
                    {complete && (
                      <div
                        className="absolute top-4 right-4 flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                        style={{ background: 'rgba(16,185,129,0.10)', border: '1px solid rgba(16,185,129,0.25)', color: '#10B981' }}
                      >
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Complete
                      </div>
                    )}

                    {/* Icon + meta */}
                    <div className="flex items-start gap-4 mb-4">
                      <div
                        className="p-3 rounded-xl text-2xl leading-none shrink-0"
                        style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
                      >
                        {chapter.icon}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] font-mono font-bold uppercase tracking-widest mb-0.5" style={{ color: 'var(--db-text-muted)' }}>
                          Chapter {chapter.id}
                        </p>
                        <h3 className="text-sm font-bold leading-tight group-hover:opacity-80 transition-opacity" style={{ color: 'var(--db-text-primary)' }}>
                          {chapter.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: 'var(--db-text-secondary)' }}>
                      {chapter.description}
                    </p>

                    {/* Section indicators */}
                    <div className="flex items-center gap-1.5 mb-4">
                      {[BookOpen, Video, BookMarked, Gamepad2, Puzzle, ClipboardCheck].map((Icon, i) => (
                        <div
                          key={i}
                          className="p-1.5 rounded-lg"
                          style={{
                            background: i < 4 && miniPct > (i * 25) ? colors.bg : 'rgba(148,163,184,0.08)',
                            border: `1px solid ${i < 4 && miniPct > (i * 25) ? colors.border : 'rgba(148,163,184,0.15)'}`,
                          }}
                        >
                          <Icon
                            className="h-2.5 w-2.5"
                            style={{ color: i < 4 && miniPct > (i * 25) ? colors.accent : '#CBD5E1' }}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Progress bar */}
                    {miniPct > 0 && !complete && (
                      <div className="mb-3">
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(148,163,184,0.15)' }}>
                          <motion.div
                            className="h-full rounded-full"
                            style={{ background: `linear-gradient(90deg, ${colors.accent}, ${colors.accent}aa)` }}
                            initial={{ width: 0 }}
                            animate={{ width: `${miniPct}%` }}
                            transition={{ duration: 0.8, delay: idx * 0.06 + 0.3 }}
                          />
                        </div>
                        <p className="text-[9px] mt-0.5" style={{ color: 'var(--db-text-muted)' }}>{miniPct}% of sections done</p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid var(--db-border)' }}>
                      <div className="flex items-center gap-3 text-[10px]" style={{ color: 'var(--db-text-muted)' }}>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{chapter.estimatedTime}</span>
                        <span className="flex items-center gap-1"><Zap className="h-3 w-3" style={{ color: '#F59E0B' }} />+{chapter.xpReward} XP</span>
                      </div>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" style={{ color: colors.accent }} />
                    </div>
                  </div>
                </Link>
              ) : (
                /* Locked card */
                <div
                  className="relative rounded-2xl p-5 h-full flex flex-col opacity-55 select-none overflow-hidden"
                  style={{ background: 'rgba(248,250,252,0.70)', border: '1px solid rgba(148,163,184,0.15)', boxShadow: 'var(--db-shadow-sm)' }}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-xl text-2xl leading-none shrink-0 grayscale" style={{ background: 'rgba(148,163,184,0.10)', border: '1px solid rgba(148,163,184,0.15)' }}>
                      {chapter.icon}
                    </div>
                    <div className="min-w-0">
                      <p className="text-[9px] font-mono font-bold uppercase tracking-widest mb-0.5" style={{ color: '#CBD5E1' }}>Chapter {chapter.id}</p>
                      <h3 className="text-sm font-bold leading-tight" style={{ color: '#94A3B8' }}>{chapter.title}</h3>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed mb-4 flex-1" style={{ color: '#CBD5E1' }}>
                    Complete Chapter {chapter.id - 1} to unlock this module.
                  </p>

                  <div className="flex items-center gap-3 text-[10px] pt-3" style={{ borderTop: '1px solid rgba(148,163,184,0.10)', color: '#CBD5E1' }}>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{chapter.estimatedTime}</span>
                    <span className="flex items-center gap-1"><Zap className="h-3 w-3" />+{chapter.xpReward} XP</span>
                  </div>

                  {/* Lock overlay */}
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ background: 'rgba(241,245,249,0.4)', backdropFilter: 'blur(2px)' }}>
                    <div
                      className="p-3 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid rgba(148,163,184,0.25)', boxShadow: 'var(--db-shadow-md)' }}
                    >
                      <Lock className="h-5 w-5" style={{ color: '#94A3B8' }} />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
