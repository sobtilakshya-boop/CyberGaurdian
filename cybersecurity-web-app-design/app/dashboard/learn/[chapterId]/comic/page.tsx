"use client"

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useProgress } from '@/lib/progress-context'
import { getChapterById } from '@/data/courseData'
import ComicViewer from '@/components/dashboard/comic-viewer'
import QuizEngine from '@/components/dashboard/quiz-engine'
import { ArrowLeft, BookOpen, Video, Book, Gamepad, Puzzle, FileCheck2, CheckCircle, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function ComicSectionPage() {
  const params = useParams()
  const router = useRouter()
  const { markComicQuizPassed, isChapterUnlocked, getChapterProgress } = useProgress()
  const [stripCompleted, setStripCompleted] = useState(false)

  const chapterId = Number(params.chapterId)
  const chapter = getChapterById(chapterId)

  if (!chapter) return null

  // Lock guard
  if (!isChapterUnlocked(chapterId)) {
    router.push('/dashboard/learn')
    return null
  }

  const progress = getChapterProgress(chapterId)

  const sections = [
    { name: 'Guide Material', href: `/dashboard/learn/${chapterId}`, icon: BookOpen, status: progress.readingDone },
    { name: 'Video Labs', href: `/dashboard/learn/${chapterId}/video`, icon: Video, status: progress.videosDone },
    { name: 'Comics Strip', href: `/dashboard/learn/${chapterId}/comic`, icon: Book, status: progress.comicQuizPassed },
    { name: 'Interactive Scenarios', href: `/dashboard/learn/${chapterId}/activities`, icon: Gamepad, status: progress.comicQuizPassed },
    { name: 'Security Puzzles', href: `/dashboard/learn/${chapterId}/puzzles`, icon: Puzzle, status: progress.comicQuizPassed },
    { name: 'Validation Assessment', href: `/dashboard/learn/${chapterId}/quiz`, icon: FileCheck2, status: progress.chapterQuizPassed },
  ]

  function handlePassQuiz() {
    markComicQuizPassed(chapterId)
    // Go to next subsection: Activities
    router.push(`/dashboard/learn/${chapterId}/activities`)
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Back button navigation */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/learn/${chapterId}`} className="flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-cyan-400 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to chapter guide</span>
        </Link>
      </div>

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
                const isActive = section.name === 'Comics Strip'
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

        {/* Right Side Comic Area */}
        <div className="lg:col-span-3 flex flex-col gap-8">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
              Awareness Comics Strip
            </span>
            <h2 className="font-mono text-xl font-bold text-white uppercase tracking-wider">
              {chapter.title} - Comic Story
            </h2>
            <p className="font-mono text-xs text-slate-500">
              Read the scenario comic panel strip, then solve the comic assessment questions below to unlock activities.
            </p>
          </div>

          <ComicViewer
            panels={chapter.comicPanels}
            onComplete={() => setStripCompleted(true)}
            isComplete={stripCompleted || progress.comicQuizPassed}
          />

          {(stripCompleted || progress.comicQuizPassed) && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl mt-4"
            >
              <div className="border-b border-slate-850 pb-4 mb-6">
                <h3 className="font-mono text-sm font-bold text-white uppercase tracking-wider">
                  Comic Story Assessment Quiz
                </h3>
                <p className="font-mono text-[11px] text-slate-500 mt-1">
                  Demonstrate understanding of the comic strip scenario. Clear this quiz to unlock the chapter activities.
                </p>
              </div>

              <QuizEngine
                questions={chapter.comicQuiz}
                onPass={handlePassQuiz}
                title="Comic Quiz"
                shuffled={false}
              />
            </motion.div>
          )}

          <div className="flex justify-between border-t border-slate-950 pt-6">
            <Link href={`/dashboard/learn/${chapterId}/video`}>
              <button className="px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer font-mono text-xs font-bold uppercase tracking-wider">
                Previous Section
              </button>
            </Link>
            {progress.comicQuizPassed && (
              <button
                onClick={() => router.push(`/dashboard/learn/${chapterId}/activities`)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-widest transition-all cursor-pointer"
              >
                <span>Continue to activities</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
