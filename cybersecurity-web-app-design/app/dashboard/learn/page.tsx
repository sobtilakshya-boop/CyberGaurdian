"use client"

import { useProgress } from '@/lib/progress-context'
import { chapters } from '@/data/courseData'
import ChapterCard from '@/components/dashboard/chapter-card'
import ChapterCompleteModal from '@/components/dashboard/chapter-complete-modal'
import ProgressRing from '@/components/dashboard/progress-ring'
import { BookOpen } from 'lucide-react'

export default function LearnPage() {
  const { isChapterUnlocked, isChapterComplete, getChapterProgress, getOverallPercent, getCompletedCount } = useProgress()

  const overallPct = getOverallPercent()
  const completedCount = getCompletedCount()

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* Chapter Unlock Notification Celebration Modal */}
      <ChapterCompleteModal />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-900 pb-5 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-wide">
            Cyber Academy: Core Curriculum
          </h2>
          <p className="text-xs font-mono text-slate-500">
            Interactive modular training covering enterprise threat defense vectors and methodologies.
          </p>
        </div>
        <div className="flex items-center gap-4 bg-slate-900/40 border border-slate-800/80 p-3 rounded-xl backdrop-blur-md">
          <ProgressRing
            percent={overallPct}
            size={70}
            strokeWidth={5}
          />
          <div className="flex flex-col font-mono text-xs">
            <span className="font-bold text-white uppercase tracking-wider">Curriculum Progress</span>
            <span className="text-[10px] text-cyan-400 mt-0.5">{completedCount} of 9 Chapters Complete</span>
          </div>
        </div>
      </div>

      {/* Chapter Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chapters.map((chapter, idx) => (
          <ChapterCard
            key={chapter.id}
            chapter={chapter}
            isUnlocked={isChapterUnlocked(chapter.id)}
            isComplete={isChapterComplete(chapter.id)}
            progress={getChapterProgress(chapter.id)}
            index={idx}
          />
        ))}
      </div>
    </div>
  )
}
