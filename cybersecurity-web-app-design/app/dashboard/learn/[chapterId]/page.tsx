"use client"

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useProgress } from '@/lib/progress-context'
import { getChapterById } from '@/data/courseData'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  BookOpen,
  Video,
  Book,
  Gamepad,
  Puzzle,
  FileCheck2,
  Newspaper,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Play
} from 'lucide-react'

export default function ChapterDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { markReadingDone, isChapterUnlocked, getChapterProgress } = useProgress()

  const chapterId = Number(params.chapterId)
  const chapter = getChapterById(chapterId)

  if (!chapter) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center font-mono">
        <h3 className="text-lg font-bold text-red-400">Chapter Not Found</h3>
        <p className="text-xs text-slate-500 mt-2">The requested chapter route does not exist.</p>
        <Link href="/dashboard/learn" className="mt-4 text-cyan-400 hover:underline">Back to Academy</Link>
      </div>
    )
  }

  // Security Lock Guard
  if (!isChapterUnlocked(chapterId)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center font-mono gap-4 max-w-md mx-auto">
        <div className="p-4 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 animate-pulse">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-bold text-white uppercase tracking-wider">Chapter Access Denied</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          This system sector is locked. Complete Chapter {chapterId - 1} quiz and curriculum activities to authenticate access.
        </p>
        <Link href="/dashboard/learn">
          <button className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer font-bold text-xs uppercase tracking-widest">
            Back to Academy
          </button>
        </Link>
      </div>
    )
  }

  const progress = getChapterProgress(chapterId)

  // Internal Navigation Menu inside chapter
  const sections = [
    { name: 'Guide Material', href: `/dashboard/learn/${chapterId}`, icon: BookOpen, status: progress.readingDone },
    { name: 'Video Labs', href: `/dashboard/learn/${chapterId}/video`, icon: Video, status: progress.videosDone },
    { name: 'Comics Strip', href: `/dashboard/learn/${chapterId}/comic`, icon: Book, status: progress.comicQuizPassed },
    { name: 'Interactive Scenarios', href: `/dashboard/learn/${chapterId}/activities`, icon: Gamepad, status: progress.comicQuizPassed }, // unlocking depends on comic completion
    { name: 'Security Puzzles', href: `/dashboard/learn/${chapterId}/puzzles`, icon: Puzzle, status: progress.comicQuizPassed },
    { name: 'Validation Assessment', href: `/dashboard/learn/${chapterId}/quiz`, icon: FileCheck2, status: progress.chapterQuizPassed },
  ]

  function handleCompleteReading() {
    markReadingDone(chapterId)
    // Direct link to the next section inside chapter: Videos
    router.push(`/dashboard/learn/${chapterId}/video`)
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Back Button Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/learn" className="flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-cyan-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to academy</span>
        </Link>
      </div>

      {/* Main Grid: Left Side Navigation, Right Side Reading Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Side Sub-Navigation Drawer */}
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-xl flex flex-col gap-3.5">
            <h4 className="font-mono text-[10px] text-slate-500 uppercase tracking-widest px-2 mb-1">
              Chapter Navigation
            </h4>
            <div className="flex flex-col gap-1.5 font-mono text-xs">
              {sections.map(section => {
                const Icon = section.icon
                const isActive = section.name === 'Guide Material'
                return (
                  <Link
                    key={section.name}
                    href={section.href}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.05)]'
                        : 'bg-slate-950/20 border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-800'
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="truncate flex-1">{section.name}</span>
                    {section.status && <CheckCircle className="h-4 w-4 text-green-400 shrink-0" />}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Right Side Main Reading Panel */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          {/* Title Header Banner */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/20 p-6 md:p-8 backdrop-blur-xl flex flex-col gap-3 relative overflow-hidden">
            <div className="absolute right-6 top-6 text-5xl opacity-20 pointer-events-none select-none">
              {chapter.icon}
            </div>
            <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
              Chapter {chapter.id} Guide Book
            </span>
            <h2 className="font-mono text-2xl md:text-3xl font-extrabold text-white leading-tight">
              {chapter.title}
            </h2>
            <p className="font-mono text-xs text-slate-400 leading-relaxed max-w-2xl mt-1">
              {chapter.subtitle}
            </p>
          </div>

          {/* Reading Sections */}
          <div className="flex flex-col gap-6">
            {chapter.content.map((sec, idx) => {
              if (sec.type === 'tip') {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 backdrop-blur-md flex gap-4"
                  >
                    <Lightbulb className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                    <div className="font-mono text-xs">
                      <h4 className="font-bold text-yellow-400 mb-1.5 uppercase tracking-wide">{sec.title}</h4>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{sec.body}</p>
                    </div>
                  </motion.div>
                )
              }
              if (sec.type === 'warning') {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="p-5 rounded-xl border border-red-500/20 bg-red-500/5 backdrop-blur-md flex gap-4"
                  >
                    <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                    <div className="font-mono text-xs">
                      <h4 className="font-bold text-red-400 mb-1.5 uppercase tracking-wide">{sec.title}</h4>
                      <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{sec.body}</p>
                    </div>
                  </motion.div>
                )
              }
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="rounded-xl border border-slate-800 bg-slate-900/30 p-6 flex flex-col gap-3 font-mono text-xs leading-relaxed"
                >
                  <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-2 flex items-center gap-2">
                    <span className="text-cyan-400">{"// "}</span>{sec.title}
                  </h3>
                  <p className="text-slate-400 whitespace-pre-wrap leading-relaxed">{sec.body}</p>
                </motion.div>
              )
            })}
          </div>

          {/* Action Row */}
          <div className="flex justify-end border-t border-slate-950 pt-6">
            <button
              onClick={handleCompleteReading}
              className="group flex items-center gap-2 px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:shadow-[0_0_25px_rgba(6,182,212,0.4)]"
            >
              <span>Verify & Continue</span>
              <ArrowLeft className="h-4 w-4 rotate-180 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
