"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Sparkles } from 'lucide-react'
import { useProgress } from '@/lib/progress-context'
import { getChapterById } from '@/data/courseData'
import { useEffect } from 'react'
import confetti from 'canvas-confetti'

export default function ChapterCompleteModal() {
  const { progress, dismissUnlockNotification } = useProgress()
  const newChapterId = progress.lastUnlockedChapter
  const chapter = newChapterId ? getChapterById(newChapterId) : null

  // Fire confetti when modal appears
  useEffect(() => {
    if (!chapter) return
    const duration = 3000
    const end = Date.now() + duration
    const colors = ['#06b6d4', '#818cf8', '#38bdf8', '#a78bfa']
    const frame = () => {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors })
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
            className="fixed inset-0 z-[100] bg-slate-950/75 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismissUnlockNotification}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center p-6 pointer-events-none"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 10 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          >
            <div
              className="pointer-events-auto relative max-w-sm w-full rounded-2xl border border-cyan-500/30 bg-slate-950/95 backdrop-blur-xl p-8 shadow-[0_0_60px_rgba(6,182,212,0.2)] flex flex-col items-center text-center gap-5"
              onClick={e => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={dismissUnlockNotification}
                className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Icon glow */}
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl scale-150" />
                <div className="relative p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 text-4xl">
                  {chapter.icon}
                </div>
              </div>

              {/* Stars */}
              <div className="flex items-center gap-1 text-yellow-400">
                {[...Array(3)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0, rotate: -30 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300 }}
                  >
                    <Sparkles className="h-5 w-5" />
                  </motion.div>
                ))}
              </div>

              <div>
                <p className="font-mono text-[10px] text-cyan-400 uppercase tracking-[0.3em] mb-2">
                  Chapter Unlocked!
                </p>
                <h2 className="font-mono text-lg font-bold text-white leading-tight">
                  Chapter {chapter.id}: {chapter.title}
                </h2>
                <p className="font-mono text-xs text-slate-400 leading-relaxed mt-2">
                  {chapter.subtitle}
                </p>
              </div>

              {/* XP reward */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 font-mono text-sm text-yellow-400 font-bold">
                ⚡ {chapter.xpReward} XP available in this chapter
              </div>

              <button
                onClick={dismissUnlockNotification}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-sm font-bold uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)]"
              >
                Start Chapter {chapter.id} →
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
