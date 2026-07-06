"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useProgress } from '@/lib/progress-context'
import { getChapterById } from '@/data/courseData'
import QuizEngine from '@/components/dashboard/quiz-engine'
import VideoGrid from '@/components/dashboard/video-grid'
import ComicViewer from '@/components/dashboard/comic-viewer'
import ActivityShell from '@/components/dashboard/activity-shell'
import PuzzleShell from '@/components/dashboard/puzzle-shell'
import NewsFeed from '@/components/dashboard/news-feed'
import {
  ArrowLeft, BookOpen, Video, BookMarked, Gamepad2, Puzzle,
  ClipboardCheck, CheckCircle2, Lock, ChevronRight, Zap,
  Lightbulb, AlertTriangle, Clock, Trophy
} from 'lucide-react'

type TabId = 'guide' | 'videos' | 'comics' | 'activities' | 'puzzles' | 'assessment'

interface TabConfig {
  id: TabId
  label: string
  icon: any
  gatedBy?: (cp: ReturnType<typeof useProgress>['getChapterProgress'] extends (...args: any[]) => infer R ? R : never) => boolean
}

const TABS: TabConfig[] = [
  { id: 'guide',      label: 'Guide',      icon: BookOpen },
  { id: 'videos',     label: 'Videos',     icon: Video },
  { id: 'comics',     label: 'Comics',     icon: BookMarked },
  { id: 'activities', label: 'Activities', icon: Gamepad2,    gatedBy: cp => cp.comicQuizPassed },
  { id: 'puzzles',    label: 'Puzzles',    icon: Puzzle,      gatedBy: cp => cp.comicQuizPassed },
  { id: 'assessment', label: 'Assessment', icon: ClipboardCheck, gatedBy: cp => cp.comicQuizPassed },
]

export default function CourseChapterPage() {
  const params = useParams()
  const router = useRouter()
  const {
    isChapterUnlocked, getChapterProgress,
    markReadingDone, markVideosDone, markComicQuizPassed, markChapterQuizPassed,
  } = useProgress()

  const chapterId = Number(params.chapterId)
  const chapter = getChapterById(chapterId)
  const [activeTab, setActiveTab] = useState<TabId>('guide')
  const [comicStripDone, setComicStripDone] = useState(false)

  const cp = getChapterProgress(chapterId)

  // Redirect if chapter doesn't exist
  useEffect(() => {
    if (!chapter) router.push('/dashboard/course')
  }, [chapter, router])

  if (!chapter) return null

  // Lock guard
  if (!isChapterUnlocked(chapterId)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-5 max-w-sm mx-auto">
        <div
          className="p-4 rounded-2xl"
          style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
        >
          <Lock className="h-8 w-8 mx-auto" style={{ color: '#EF4444' }} />
        </div>
        <div>
          <h2 className="text-lg font-bold" style={{ color: 'var(--db-text-primary)' }}>Module Locked</h2>
          <p className="text-sm mt-1" style={{ color: 'var(--db-text-secondary)' }}>
            Complete Chapter {chapterId - 1} to unlock this module.
          </p>
        </div>
        <Link href="/dashboard/course">
          <button
            className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all"
            style={{ background: 'var(--db-accent-light)', border: '1px solid var(--db-border-strong)', color: 'var(--db-accent)' }}
          >
            Back to Curriculum
          </button>
        </Link>
      </div>
    )
  }

  function isTabLocked(tab: TabConfig): boolean {
    return !!(tab.gatedBy && !tab.gatedBy(cp))
  }

  function handleTabClick(tabId: TabId) {
    const tab = TABS.find(t => t.id === tabId)!
    if (isTabLocked(tab)) return
    setActiveTab(tabId)
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      {/* ── Top navigation ─────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/course"
          className="flex items-center gap-1.5 text-xs font-medium transition-all"
          style={{ color: 'var(--db-text-muted)' }}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>All Chapters</span>
        </Link>
        <ChevronRight className="h-3.5 w-3.5" style={{ color: 'var(--db-text-muted)' }} />
        <span className="text-xs font-medium" style={{ color: 'var(--db-text-secondary)' }}>Chapter {chapterId}</span>
      </div>

      {/* ── Chapter hero card ───────────────────────────────────── */}
      <div
        className="rounded-2xl p-6 md:p-8 relative overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-md)' }}
      >
        {/* Background decoration */}
        <div
          className="absolute right-6 top-6 text-7xl leading-none opacity-[0.06] select-none pointer-events-none"
          aria-hidden
        >
          {chapter.icon}
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-5 relative">
          <div
            className="p-4 rounded-2xl text-3xl leading-none shrink-0 w-fit"
            style={{ background: 'var(--db-accent-light)', border: '1px solid var(--db-border-strong)' }}
          >
            {chapter.icon}
          </div>

          <div className="flex-1">
            <p className="text-[10px] font-mono font-bold uppercase tracking-[0.25em] mb-1.5" style={{ color: 'var(--db-accent)' }}>
              Chapter {chapter.id} of 9
            </p>
            <h1 className="text-xl md:text-2xl font-bold leading-tight mb-1.5" style={{ color: 'var(--db-text-primary)' }}>
              {chapter.title}
            </h1>
            <p className="text-sm" style={{ color: 'var(--db-text-secondary)' }}>{chapter.subtitle}</p>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="text-center">
              <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--db-text-muted)' }}>Time</p>
              <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: 'var(--db-text-primary)' }}>
                <Clock className="h-3.5 w-3.5" />
                {chapter.estimatedTime}
              </div>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-mono uppercase tracking-wider mb-1" style={{ color: 'var(--db-text-muted)' }}>Reward</p>
              <div className="flex items-center gap-1 text-sm font-bold" style={{ color: '#F59E0B' }}>
                <Zap className="h-3.5 w-3.5" />
                +{chapter.xpReward} XP
              </div>
            </div>
          </div>
        </div>

        {/* Chapter completion status strip */}
        {cp.chapterQuizPassed && (
          <div
            className="mt-5 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold w-fit"
            style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.20)', color: '#10B981' }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Chapter Complete — All objectives cleared
          </div>
        )}
      </div>

      {/* ── Tab Navigation ──────────────────────────────────────── */}
      <div className="flex gap-1 overflow-x-auto p-1 rounded-xl" style={{ background: 'rgba(248,250,252,0.80)', border: '1px solid var(--db-border)' }}>
        {TABS.map(tab => {
          const Icon = tab.icon
          const locked = isTabLocked(tab)
          const isActive = activeTab === tab.id
          const isDone = (
            (tab.id === 'guide' && cp.readingDone) ||
            (tab.id === 'videos' && cp.videosDone) ||
            (tab.id === 'comics' && cp.comicQuizPassed) ||
            (tab.id === 'assessment' && cp.chapterQuizPassed)
          )

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              disabled={locked}
              className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0"
              style={{
                cursor: locked ? 'not-allowed' : 'pointer',
                color: locked ? '#CBD5E1' : isActive ? 'var(--db-accent)' : 'var(--db-text-secondary)',
                background: isActive ? 'rgba(255,255,255,0.95)' : 'transparent',
                boxShadow: isActive ? 'var(--db-shadow-sm)' : 'none',
              }}
            >
              {locked ? <Lock className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
              <span>{tab.label}</span>
              {isDone && !locked && (
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: '#10B981' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* ── Tab Content ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {/* ── GUIDE TAB ─────────────────────────────────── */}
          {activeTab === 'guide' && (
            <div className="flex flex-col gap-5">
              {chapter.content.map((sec, idx) => {
                if (sec.type === 'tip') return (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl"
                    style={{ background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.18)' }}>
                    <Lightbulb className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#F59E0B' }} />
                    <div>
                      <h4 className="text-sm font-bold mb-1.5" style={{ color: '#D97706' }}>{sec.title}</h4>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--db-text-secondary)' }}>{sec.body}</p>
                    </div>
                  </div>
                )
                if (sec.type === 'warning') return (
                  <div key={idx} className="flex gap-4 p-5 rounded-2xl"
                    style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.18)' }}>
                    <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" style={{ color: '#EF4444' }} />
                    <div>
                      <h4 className="text-sm font-bold mb-1.5" style={{ color: '#EF4444' }}>{sec.title}</h4>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--db-text-secondary)' }}>{sec.body}</p>
                    </div>
                  </div>
                )
                return (
                  <div key={idx} className="p-6 rounded-2xl"
                    style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-sm)' }}>
                    <h3 className="text-sm font-bold mb-3 pb-2.5 flex items-center gap-2" style={{ color: 'var(--db-text-primary)', borderBottom: '1px solid var(--db-border)' }}>
                      <span style={{ color: 'var(--db-accent)' }}>{'// '}</span>{sec.title}
                    </h3>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--db-text-secondary)' }}>{sec.body}</p>
                  </div>
                )
              })}

              {/* Complete reading CTA */}
              <div className="flex justify-end pt-2">
                <button
                  onClick={() => { markReadingDone(chapterId); setActiveTab('videos') }}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, var(--db-accent), #8B5CF6)', boxShadow: 'var(--db-shadow-glow)' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                  {cp.readingDone ? 'Reading Complete ✓' : 'Mark as Read & Continue'}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── VIDEOS TAB ──────────────────────────────────── */}
          {activeTab === 'videos' && (
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-sm)' }}>
              <div className="mb-5">
                <h2 className="text-base font-bold" style={{ color: 'var(--db-text-primary)' }}>Video Labs</h2>
                <p className="text-xs mt-1" style={{ color: 'var(--db-text-secondary)' }}>Watch all videos to earn XP and unlock the comics section.</p>
              </div>
              <VideoGrid
                videos={chapter.videos}
                onAllWatched={() => { markVideosDone(chapterId); setActiveTab('comics') }}
              />
              <div className="flex justify-end mt-5 pt-5" style={{ borderTop: '1px solid var(--db-border)' }}>
                <button
                  onClick={() => { markVideosDone(chapterId); setActiveTab('comics') }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm cursor-pointer"
                  style={{ background: 'linear-gradient(135deg, var(--db-accent), #8B5CF6)' }}
                >
                  {cp.videosDone ? 'Videos Done ✓' : 'Mark Done & Continue'}
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── COMICS TAB ──────────────────────────────────── */}
          {activeTab === 'comics' && (
            <div className="flex flex-col gap-6">
              <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-sm)' }}>
                <h2 className="text-base font-bold mb-1" style={{ color: 'var(--db-text-primary)' }}>Cyber Intelligence Strip</h2>
                <p className="text-xs mb-5" style={{ color: 'var(--db-text-secondary)' }}>Read through all panels, then complete the strip quiz below.</p>
                <ComicViewer
                  panels={chapter.comicPanels}
                  onComplete={() => setComicStripDone(true)}
                  isComplete={comicStripDone || cp.comicQuizPassed}
                />
              </div>

              {(comicStripDone || cp.comicQuizPassed) && (
                <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-sm)' }}>
                  <h3 className="text-sm font-bold mb-1" style={{ color: 'var(--db-text-primary)' }}>Comic Quiz</h3>
                  <p className="text-xs mb-5" style={{ color: 'var(--db-text-secondary)' }}>Demonstrate understanding to unlock Activities, Puzzles, and Assessment.</p>
                  <QuizEngine
                    questions={chapter.comicQuiz}
                    onPass={(score) => { markComicQuizPassed(chapterId); setActiveTab('activities') }}
                    title="Comic Story Assessment"
                    shuffled={false}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── ACTIVITIES TAB ──────────────────────────────── */}
          {activeTab === 'activities' && (
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-sm)' }}>
              <h2 className="text-base font-bold mb-1" style={{ color: 'var(--db-text-primary)' }}>Situation Room</h2>
              <p className="text-xs mb-5" style={{ color: 'var(--db-text-secondary)' }}>Complete threat sorting, security matching, and scenario decision exercises.</p>
              <ActivityShell
                dragAndDrop={chapter.activities.dragAndDrop}
                matchFollowing={chapter.activities.matchFollowing}
                scenario={chapter.activities.scenario}
                onComplete={() => setActiveTab('puzzles')}
              />
            </div>
          )}

          {/* ── PUZZLES TAB ──────────────────────────────────── */}
          {activeTab === 'puzzles' && (
            <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-sm)' }}>
              <h2 className="text-base font-bold mb-1" style={{ color: 'var(--db-text-primary)' }}>Security Word Search</h2>
              <p className="text-xs mb-5" style={{ color: 'var(--db-text-secondary)' }}>Locate the hidden security vocabulary to reinforce chapter knowledge.</p>
              <PuzzleShell
                words={chapter.puzzleWords}
                onComplete={() => setActiveTab('assessment')}
                isComplete={cp.chapterQuizPassed}
              />
            </div>
          )}

          {/* ── ASSESSMENT TAB ──────────────────────────────── */}
          {activeTab === 'assessment' && (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-sm)' }}>
                <h2 className="text-base font-bold mb-1" style={{ color: 'var(--db-text-primary)' }}>Final Chapter Assessment</h2>
                <p className="text-xs mb-5" style={{ color: 'var(--db-text-secondary)' }}>Randomized 15-question test. Score 70%+ to complete the chapter and unlock the next.</p>
                <QuizEngine
                  questions={chapter.chapterQuiz}
                  onPass={(score) => markChapterQuizPassed(chapterId, score)}
                  title="Chapter Assessment"
                  passMark={70}
                  shuffled={true}
                />

                {cp.chapterQuizPassed && (
                  <div className="mt-6 flex items-center justify-between p-5 rounded-xl"
                    style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.20)' }}>
                    <div className="flex items-center gap-3">
                      <Trophy className="h-6 w-6" style={{ color: '#10B981' }} />
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#10B981' }}>Chapter Complete!</p>
                        <p className="text-xs" style={{ color: 'var(--db-text-secondary)' }}>Score: {cp.quizScore}% — +{chapter.xpReward} XP awarded</p>
                      </div>
                    </div>
                    <Link href="/dashboard/course">
                      <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white text-sm font-semibold cursor-pointer"
                        style={{ background: 'linear-gradient(135deg, var(--db-accent), #8B5CF6)' }}>
                        Next Chapter
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </Link>
                  </div>
                )}
              </div>

              {/* Side threat feed */}
              <div className="xl:col-span-1 flex flex-col gap-4">
                <h3 className="text-sm font-bold" style={{ color: 'var(--db-text-primary)' }}>⚠️ Threat Intel</h3>
                <NewsFeed news={chapter.newsTips} />
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
