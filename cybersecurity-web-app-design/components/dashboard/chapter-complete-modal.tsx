"use client"

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Trophy, ArrowRight } from 'lucide-react'
import { useProgress } from '@/lib/progress-context'
import { getChapterById } from '@/data/courseData'
import confetti from 'canvas-confetti'
import Link from 'next/link'

export default function ChapterCompleteModal() {
  const { progress, dismissUnlockNotification } = useProgress()
  const newChapterId = progress.lastUnlockedChapter
  const chapter = newChapterId ? getChapterById(newChapterId) : null

  useEffect(() => {
    if (!chapter) return
    const end = Date.now() + 3000
    const colors = ['#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B']
    const frame = () => {
      confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }
    frame()
  }, [chapter])

  return (
    <AnimatePresence>
      {chapter && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100]"
            style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissUnlockNotification}
          />

          {/* Modal — uses layoutId so the chapter card can morph into it */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none">
            <motion.div
              layoutId={`chapter-card-${chapter.id}`}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              className="pointer-events-auto relative max-w-sm w-full rounded-3xl overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.97)',
                border: '1px solid var(--db-border)',
                boxShadow: '0 24px 64px rgba(14,165,233,0.15), 0 8px 24px rgba(0,0,0,0.06)',
              }}
            >
              {/* Top accent strip */}
              <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, var(--db-accent), #8B5CF6, #10B981)' }} />

              <div className="p-7 flex flex-col items-center text-center gap-5">
                {/* Close */}
                <button
                  onClick={dismissUnlockNotification}
                  className="absolute top-4 right-4 p-1.5 rounded-lg transition-all cursor-pointer"
                  style={{ color: 'var(--db-text-muted)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--db-accent-light)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <X className="h-4 w-4" />
                </button>

                {/* Chapter icon */}
                <motion.div
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                  className="p-5 rounded-2xl text-4xl leading-none relative"
                  style={{ background: 'var(--db-accent-light)', border: '1px solid var(--db-border-strong)' }}
                >
                  {chapter.icon}
                  {/* Sparkle ring */}
                  <div className="absolute -inset-3 rounded-full animate-ping opacity-20" style={{ background: 'var(--db-accent)' }} />
                </motion.div>

                {/* Stars */}
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300 }}
                    >
                      <Sparkles className="h-5 w-5" style={{ color: '#F59E0B' }} />
                    </motion.div>
                  ))}
                </div>

                {/* Text */}
                <div>
                  <p className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] mb-1.5" style={{ color: 'var(--db-accent)' }}>
                    Chapter Unlocked!
                  </p>
                  <h2 className="text-lg font-bold leading-tight" style={{ color: 'var(--db-text-primary)' }}>
                    Chapter {chapter.id}: {chapter.title}
                  </h2>
                  <p className="text-xs leading-relaxed mt-1.5" style={{ color: 'var(--db-text-secondary)' }}>
                    {chapter.subtitle}
                  </p>
                </div>

                {/* XP reward */}
                <div
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold"
                  style={{
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.20)',
                    color: '#D97706',
                  }}
                >
                  <Trophy className="h-4 w-4" />
                  <span>+{chapter.xpReward} XP available</span>
                </div>

                {/* CTA */}
                <Link href={`/dashboard/course/${chapter.id}`} className="w-full" onClick={dismissUnlockNotification}>
                  <button
                    className="w-full py-3.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
                    style={{ background: 'linear-gradient(135deg, var(--db-accent), #8B5CF6)', boxShadow: 'var(--db-shadow-glow)' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.01)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1.0)')}
                  >
                    Start Chapter {chapter.id}
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
