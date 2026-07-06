"use client"

import React, { createContext, useContext, useEffect, useReducer, useCallback } from 'react'
import { chapters, TOTAL_COURSE_XP } from '@/data/courseData'
import { sectors } from '@/data/sectorsData'

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ChapterProgress {
  readingDone: boolean
  videosDone: boolean
  comicQuizPassed: boolean
  chapterQuizPassed: boolean
  quizScore: number          // 0-100
  completedAt?: string       // ISO date
}

export interface SectorActivityProgress {
  id: string
  completed: boolean
  score?: number
}

export interface SectorProgressState {
  sectorId: string
  progressPercentage: number
  completedActivities: string[]
  isCompleted: boolean
}

export interface UserProgress {
  userId: string
  xp: number
  streak: number
  lastActiveDate: string     // ISO date YYYY-MM-DD
  badges: string[]
  chapterProgress: Record<number, ChapterProgress>
  lastUnlockedChapter: number // highest chapter that just unlocked (for animation)
  sectorProgress: Record<string, SectorProgressState>
}

interface ProgressContextValue {
  progress: UserProgress
  isChapterUnlocked: (chapterId: number) => boolean
  isChapterComplete: (chapterId: number) => boolean
  getChapterProgress: (chapterId: number) => ChapterProgress
  getOverallPercent: () => number
  getCompletedCount: () => number
  markReadingDone: (chapterId: number) => void
  markVideosDone: (chapterId: number) => void
  markComicQuizPassed: (chapterId: number) => void
  markChapterQuizPassed: (chapterId: number, score: number) => void
  dismissUnlockNotification: () => void
}

// ─── Default State ─────────────────────────────────────────────────────────────
function defaultChapterProgress(): ChapterProgress {
  return {
    readingDone: false,
    videosDone: false,
    comicQuizPassed: false,
    chapterQuizPassed: false,
    quizScore: 0,
  }
}

function createInitialProgress(userId: string): UserProgress {
  return {
    userId,
    xp: 0,
    streak: 0,
    lastActiveDate: '',
    badges: [],
    chapterProgress: {},
    lastUnlockedChapter: 0,
    sectorProgress: {},
  }
}

// ─── XP Rewards ──────────────────────────────────────────────────────────────
const XP = {
  READING_DONE:    50,
  VIDEOS_DONE:     30,
  COMIC_QUIZ_PASS: 40,
  CHAPTER_QUIZ:    100,
  PERFECT_QUIZ:    150, // replaces CHAPTER_QUIZ if 100%
  DAILY_STREAK:    25,
}

// ─── Reducer ──────────────────────────────────────────────────────────────────
type Action =
  | { type: 'LOAD'; payload: UserProgress }
  | { type: 'MARK_READING'; chapterId: number }
  | { type: 'MARK_VIDEOS'; chapterId: number }
  | { type: 'MARK_COMIC_QUIZ'; chapterId: number }
  | { type: 'MARK_CHAPTER_QUIZ'; chapterId: number; score: number }
  | { type: 'DISMISS_UNLOCK' }
  | { type: 'TOUCH_STREAK' }

function isChapterFullyComplete(cp: ChapterProgress): boolean {
  return cp.readingDone && cp.videosDone && cp.comicQuizPassed && cp.chapterQuizPassed
}

function getBadgesForState(progress: UserProgress): string[] {
  const badges: string[] = []
  const completed = Object.entries(progress.chapterProgress)
    .filter(([, cp]) => isChapterFullyComplete(cp)).length

  if (completed >= 1) badges.push('First Steps')
  if (completed >= 3) badges.push('Learner')
  if (completed >= 5) badges.push('Cyber Apprentice')
  if (completed >= 7) badges.push('Security Analyst')
  if (completed >= 9) badges.push('Cyber Guardian')
  if (progress.streak >= 7) badges.push('Week Streak')
  if (progress.streak >= 30) badges.push('Month Warrior')
  if (progress.xp >= 500) badges.push('XP Hunter')
  if (progress.xp >= 1500) badges.push('XP Master')

  // Perfect quiz badge
  const hasPerfect = Object.values(progress.chapterProgress).some(cp => cp.quizScore === 100)
  if (hasPerfect) badges.push('Perfect Score')

  return badges
}

function progressReducer(state: UserProgress, action: Action): UserProgress {
  switch (action.type) {
    case 'LOAD':
      return action.payload

    case 'TOUCH_STREAK': {
      const today = new Date().toISOString().split('T')[0]
      if (state.lastActiveDate === today) return state
      const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
      const newStreak = state.lastActiveDate === yesterday ? state.streak + 1 : 1
      const newState = {
        ...state,
        streak: newStreak,
        lastActiveDate: today,
        xp: state.xp + XP.DAILY_STREAK,
      }
      return { ...newState, badges: getBadgesForState(newState) }
    }

    case 'MARK_READING': {
      const existing = state.chapterProgress[action.chapterId] ?? defaultChapterProgress()
      if (existing.readingDone) return state
      const updated = { ...existing, readingDone: true }
      const newState: UserProgress = {
        ...state,
        xp: state.xp + XP.READING_DONE,
        chapterProgress: { ...state.chapterProgress, [action.chapterId]: updated },
      }
      newState.badges = getBadgesForState(newState)
      return checkAndUnlockNext(newState, action.chapterId)
    }

    case 'MARK_VIDEOS': {
      const existing = state.chapterProgress[action.chapterId] ?? defaultChapterProgress()
      if (existing.videosDone) return state
      const updated = { ...existing, videosDone: true }
      const newState: UserProgress = {
        ...state,
        xp: state.xp + XP.VIDEOS_DONE,
        chapterProgress: { ...state.chapterProgress, [action.chapterId]: updated },
      }
      newState.badges = getBadgesForState(newState)
      return checkAndUnlockNext(newState, action.chapterId)
    }

    case 'MARK_COMIC_QUIZ': {
      const existing = state.chapterProgress[action.chapterId] ?? defaultChapterProgress()
      if (existing.comicQuizPassed) return state
      const updated = { ...existing, comicQuizPassed: true }
      const newState: UserProgress = {
        ...state,
        xp: state.xp + XP.COMIC_QUIZ_PASS,
        chapterProgress: { ...state.chapterProgress, [action.chapterId]: updated },
      }
      newState.badges = getBadgesForState(newState)
      return checkAndUnlockNext(newState, action.chapterId)
    }

    case 'MARK_CHAPTER_QUIZ': {
      const existing = state.chapterProgress[action.chapterId] ?? defaultChapterProgress()
      if (existing.chapterQuizPassed) return state
      const xpGain = action.score === 100 ? XP.PERFECT_QUIZ : XP.CHAPTER_QUIZ
      const completedAt = new Date().toISOString()
      const updated: ChapterProgress = {
        ...existing,
        chapterQuizPassed: true,
        quizScore: action.score,
        completedAt,
      }
      const newState: UserProgress = {
        ...state,
        xp: state.xp + xpGain,
        chapterProgress: { ...state.chapterProgress, [action.chapterId]: updated },
      }
      newState.badges = getBadgesForState(newState)
      return checkAndUnlockNext(newState, action.chapterId)
    }

    case 'DISMISS_UNLOCK':
      return { ...state, lastUnlockedChapter: 0 }

    default:
      return state
  }
}

function checkAndUnlockNext(state: UserProgress, chapterId: number): UserProgress {
  const cp = state.chapterProgress[chapterId]
  if (!cp || !isChapterFullyComplete(cp)) return state

  const nextId = chapterId + 1
  if (nextId > chapters.length) return state
  if (state.chapterProgress[nextId]) return state // already unlocked/started

  // Mark next chapter as newly unlocked (empty progress = unlocked but not started)
  return {
    ...state,
    lastUnlockedChapter: nextId,
    chapterProgress: {
      ...state.chapterProgress,
      [nextId]: defaultChapterProgress(),
    },
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ProgressContext = createContext<ProgressContextValue | null>(null)

const STORAGE_PREFIX = 'cg_progress_'

export function ProgressProvider({ userId, children }: { userId: string; children: React.ReactNode }) {
  const [progress, dispatch] = useReducer(progressReducer, undefined, () => {
    // SSR-safe: start empty, hydrate in useEffect
    return createInitialProgress(userId)
  })

  // Hydrate from API and fallback to localStorage on mount
  useEffect(() => {
    let mounted = true
    const init = async () => {
      let loadedFromLocal = false
      try {
        const raw = localStorage.getItem(STORAGE_PREFIX + userId)
        if (raw) {
          const parsed = JSON.parse(raw) as UserProgress
          if (mounted) {
            dispatch({ type: 'LOAD', payload: parsed })
            loadedFromLocal = true
          }
        }
      } catch {
        // local storage error
      }

      try {
        const res = await fetch('/api/progress')
        const data = await res.json()
        if (data.success && data.progress && mounted) {
          dispatch({ type: 'LOAD', payload: data.progress })
        }
      } catch {
        // API error, stick with local or default
      }
      
      if (mounted) {
        dispatch({ type: 'TOUCH_STREAK' })
      }
    }
    init()
    return () => { mounted = false }
  }, [userId])

  // Persist to localStorage and API on every state change
  useEffect(() => {
    // 1. Instant local persistence
    try {
      localStorage.setItem(STORAGE_PREFIX + userId, JSON.stringify(progress))
    } catch {
      // Fail silently
    }

    // 2. Debounced API persistence (so rapid clicks don't spam the DB)
    const timer = setTimeout(() => {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progress })
      }).catch(() => {}) // Fail silently in background
    }, 1500)

    return () => clearTimeout(timer)
  }, [progress, userId])

  // ── Computed helpers ──────────────────────────────────────────────────────
  const isChapterUnlocked = useCallback((chapterId: number): boolean => {
    if (chapterId === 1) return true
    // Unlocked if chapterProgress record exists (set when previous chapter completes)
    // OR if the previous chapter is complete
    const prevCp = progress.chapterProgress[chapterId - 1]
    return !!(prevCp && isChapterFullyComplete(prevCp)) || chapterId in progress.chapterProgress
  }, [progress])

  const isChapterComplete = useCallback((chapterId: number): boolean => {
    const cp = progress.chapterProgress[chapterId]
    return !!(cp && isChapterFullyComplete(cp))
  }, [progress])

  const getChapterProgress = useCallback((chapterId: number): ChapterProgress => {
    return progress.chapterProgress[chapterId] ?? defaultChapterProgress()
  }, [progress])

  const getOverallPercent = useCallback((): number => {
    let totalSteps = chapters.length * 4 // reading, videos, comicQuiz, chapterQuiz
    let completedSteps = 0

    for (const cp of Object.values(progress.chapterProgress)) {
      if (cp.readingDone) completedSteps++
      if (cp.videosDone) completedSteps++
      if (cp.comicQuizPassed) completedSteps++
      if (cp.chapterQuizPassed) completedSteps++
    }

    // Add sector progress steps
    for (const sector of sectors) {
      const sectorActivitiesCount = sector.activities?.length || 0
      totalSteps += sectorActivitiesCount
      const sp = progress.sectorProgress?.[sector.id]
      if (sp && sp.completedActivities) {
        completedSteps += sp.completedActivities.length
      }
    }

    return totalSteps === 0 ? 0 : Math.round((completedSteps / totalSteps) * 100)
  }, [progress])

  const getCompletedCount = useCallback((): number => {
    const completedChapters = Object.values(progress.chapterProgress).filter(isChapterFullyComplete).length
    const completedSectors = Object.values(progress.sectorProgress || {}).filter(sp => sp.isCompleted).length
    return completedChapters + completedSectors
  }, [progress])

  // ── Mutating actions ──────────────────────────────────────────────────────
  const markReadingDone = useCallback((chapterId: number) => {
    dispatch({ type: 'MARK_READING', chapterId })
  }, [])

  const markVideosDone = useCallback((chapterId: number) => {
    dispatch({ type: 'MARK_VIDEOS', chapterId })
  }, [])

  const markComicQuizPassed = useCallback((chapterId: number) => {
    dispatch({ type: 'MARK_COMIC_QUIZ', chapterId })
  }, [])

  const markChapterQuizPassed = useCallback((chapterId: number, score: number) => {
    dispatch({ type: 'MARK_CHAPTER_QUIZ', chapterId, score })
  }, [])

  const dismissUnlockNotification = useCallback(() => {
    dispatch({ type: 'DISMISS_UNLOCK' })
  }, [])

  const value: ProgressContextValue = {
    progress,
    isChapterUnlocked,
    isChapterComplete,
    getChapterProgress,
    getOverallPercent,
    getCompletedCount,
    markReadingDone,
    markVideosDone,
    markComicQuizPassed,
    markChapterQuizPassed,
    dismissUnlockNotification,
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>')
  return ctx
}
