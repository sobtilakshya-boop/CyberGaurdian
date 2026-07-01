"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useProgress } from '@/lib/progress-context'
import { Award, Trophy, Flame, Zap, ShieldCheck, HelpCircle } from 'lucide-react'

interface UserSession {
  userId: string
  name: string
  email: string
  phone: string
}

const BADGES_CONFIG = [
  { name: 'First Steps', desc: 'Completed your first learning chapter', condition: 'Complete 1 chapter' },
  { name: 'Learner', desc: 'Completed three learning chapters', condition: 'Complete 3 chapters' },
  { name: 'Cyber Apprentice', desc: 'Completed five learning chapters', condition: 'Complete 5 chapters' },
  { name: 'Security Analyst', desc: 'Completed seven learning chapters', condition: 'Complete 7 chapters' },
  { name: 'Cyber Guardian', desc: 'Fully mastered all security course chapters', condition: 'Complete 9 chapters' },
  { name: 'Week Streak', desc: 'Maintained a 7-day study streak', condition: 'Streak of 7+ days' },
  { name: 'Month Warrior', desc: 'Maintained a 30-day study streak', condition: 'Streak of 30+ days' },
  { name: 'XP Hunter', desc: 'Accumulated 500 XP across all activities', condition: 'Reach 500 XP' },
  { name: 'XP Master', desc: 'Accumulated 1500 XP across all activities', condition: 'Reach 1500 XP' },
  { name: 'Perfect Score', desc: 'Scored 100% on any validation assessment', condition: 'Get 100% score on any quiz' },
]

export default function AchievementsPage() {
  const { progress, getCompletedCount } = useProgress()
  const [session, setSession] = useState<UserSession | null>(null)

  const completedCount = getCompletedCount()

  useEffect(() => {
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        if (data.session) setSession(data.session)
      })
      .catch(() => {})
  }, [])

  // XP level calculation (Level 1 per 500 XP)
  const currentLevel = Math.max(1, Math.floor(progress.xp / 500) + 1)
  const nextLevelXp = currentLevel * 500
  const prevLevelXp = (currentLevel - 1) * 500
  const levelProgressPct = Math.min(100, Math.round(((progress.xp - prevLevelXp) / 500) * 100))

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col gap-1.5 pb-6 border-b border-slate-800">
        <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest">
          Operator Records
        </span>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-white uppercase flex items-center gap-2">
          <Trophy className="h-6 w-6 text-cyan-450" />
          Achievements & Badges
        </h1>
        <p className="text-xs text-slate-500 font-mono">
          Track your course XP progress, active daily streak, and unlock cybersecurity badging milestones.
        </p>
      </div>

      {/* Progress Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* XP Status card */}
        <div 
          className="rounded-2xl p-5 flex flex-col justify-between gap-4"
          style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-md)' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Experience Level</span>
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/20">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-1.5">
              <span className="text-3xl font-bold font-mono text-slate-900">Level {currentLevel}</span>
              <span className="text-xs font-mono text-slate-400">({progress.xp} Total XP)</span>
            </div>
            {/* progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden bg-slate-205/60 mb-1">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-sky-500 transition-all duration-500"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] text-slate-500">
              <span>{progress.xp} XP</span>
              <span>{nextLevelXp} XP (Next Level)</span>
            </div>
          </div>
        </div>

        {/* Learning Streak card */}
        <div 
          className="rounded-2xl p-5 flex flex-col justify-between gap-4"
          style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-md)' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Active Streak</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-bold font-mono text-slate-900">{progress.streak} Day{progress.streak !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-xs font-mono text-slate-500">
              {progress.streak > 0 
                ? 'Keep completing guides and tasks daily to grow your streak!' 
                : 'Streak idle. Complete any cybersecurity section to trigger a streak!'}
            </p>
          </div>
        </div>

        {/* Badge unlock metrics */}
        <div 
          className="rounded-2xl p-5 flex flex-col justify-between gap-4"
          style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-md)' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">Badges Earned</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/20">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-bold font-mono text-slate-900">{progress.badges.length} / 10</span>
            </div>
            <p className="text-xs font-mono text-slate-500">
              Earn badges by completing courses, scoring perfect quizzes, and retaining daily streaks.
            </p>
          </div>
        </div>
      </div>

      {/* Badges Inventory Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-bold font-mono tracking-tight text-white uppercase">
          Badge Inventory
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {BADGES_CONFIG.map(badge => {
            const hasBadge = progress.badges.includes(badge.name)
            return (
              <div
                key={badge.name}
                className={`rounded-2xl border p-4.5 flex flex-col items-center text-center gap-3 transition-all duration-300 ${
                  hasBadge
                    ? 'bg-slate-900/30 border-cyan-500/30 hover:border-cyan-500/60 shadow-[0_0_15px_rgba(6,182,212,0.03)]'
                    : 'bg-slate-950/40 border-slate-900 text-slate-600 opacity-60'
                }`}
              >
                {/* Badge Icon Grid */}
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${
                  hasBadge
                    ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
                    : 'bg-slate-900 border-slate-800 text-slate-700'
                }`}>
                  <Award className="h-5 w-5" />
                </div>
                
                <div>
                  <h4 className={`font-mono text-xs font-bold leading-tight ${hasBadge ? 'text-slate-100' : 'text-slate-600'}`}>
                    {badge.name}
                  </h4>
                  <p className="font-mono text-[9px] text-slate-500 mt-1 leading-normal">
                    {badge.desc}
                  </p>
                </div>

                <span className={`px-2 py-0.5 rounded border font-mono text-[8px] font-bold uppercase tracking-wider mt-auto ${
                  hasBadge
                    ? 'bg-cyan-500/5 border-cyan-500/20 text-cyan-400'
                    : 'bg-slate-900 border-slate-800 text-slate-600'
                }`}>
                  {hasBadge ? 'Unlocked' : badge.condition}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
