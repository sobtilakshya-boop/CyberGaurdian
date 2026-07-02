"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useProgress } from '@/lib/progress-context'
import { Award, Trophy, Flame, Zap } from 'lucide-react'

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

const BADGE_THEMES: Record<string, { from: string, to: string, border: string, text: string, iconBg: string }> = {
  'First Steps':     { from: 'from-cyan-500/15', to: 'to-blue-500/5', border: 'border-cyan-500/30', text: 'text-cyan-600', iconBg: 'bg-cyan-500/10' },
  'Learner':         { from: 'from-sky-500/15', to: 'to-indigo-500/5', border: 'border-sky-500/30', text: 'text-sky-600', iconBg: 'bg-sky-500/10' },
  'Cyber Apprentice':{ from: 'from-teal-500/15', to: 'to-emerald-500/5', border: 'border-teal-500/30', text: 'text-teal-650', iconBg: 'bg-teal-500/10' },
  'Security Analyst':{ from: 'from-violet-500/15', to: 'to-purple-500/5', border: 'border-violet-500/30', text: 'text-violet-600', iconBg: 'bg-violet-500/10' },
  'Cyber Guardian':  { from: 'from-pink-500/15', to: 'to-rose-500/5', border: 'border-pink-500/30', text: 'text-pink-600', iconBg: 'bg-pink-500/10' },
  'Week Streak':     { from: 'from-orange-500/15', to: 'to-amber-500/5', border: 'border-orange-500/30', text: 'text-orange-600', iconBg: 'bg-orange-500/10' },
  'Month Warrior':   { from: 'from-red-500/15', to: 'to-orange-500/5', border: 'border-red-500/30', text: 'text-red-650', iconBg: 'bg-red-500/10' },
  'XP Hunter':       { from: 'from-emerald-500/15', to: 'to-teal-500/5', border: 'border-emerald-500/30', text: 'text-emerald-600', iconBg: 'bg-emerald-500/10' },
  'XP Master':       { from: 'from-fuchsia-500/15', to: 'to-purple-500/5', border: 'border-fuchsia-500/30', text: 'text-fuchsia-600', iconBg: 'bg-fuchsia-500/10' },
  'Perfect Score':   { from: 'from-yellow-500/15', to: 'to-amber-500/5', border: 'border-yellow-500/30', text: 'text-yellow-600', iconBg: 'bg-yellow-500/10' },
}

export default function AchievementsPage() {
  const { progress } = useProgress()
  const [session, setSession] = useState<UserSession | null>(null)

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
      <div className="flex flex-col gap-1.5 pb-6 border-b border-[var(--db-border-strong)]">
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-pink-500 h-1.5 w-24 rounded-full mb-2" />
        <span className="font-mono text-[10px] text-[var(--db-accent)] uppercase tracking-widest font-bold">
          Operator Records
        </span>
        <h1 className="text-2xl font-bold font-mono tracking-tight text-[var(--db-text-primary)] uppercase flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[var(--db-accent)]" />
          Achievements & Badges
        </h1>
        <p className="text-xs text-[var(--db-text-secondary)] font-mono leading-relaxed">
          Track your course XP progress, active daily streak, and unlock cybersecurity badging milestones.
        </p>
      </div>

      {/* Progress Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* XP Status card */}
        <div 
          className="rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:translate-y-[-2px]"
          style={{ 
            background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(255,255,255,0.92) 100%)', 
            border: '1px solid var(--db-border-strong)', 
            boxShadow: 'var(--db-shadow-md)' 
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--db-text-secondary)] uppercase tracking-wider">Experience Level</span>
            <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-500 border border-cyan-500/20">
              <Zap className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-1.5">
              <span className="text-3xl font-bold font-mono text-[var(--db-text-primary)]">Level {currentLevel}</span>
              <span className="text-xs font-mono text-[var(--db-text-secondary)]">({progress.xp} Total XP)</span>
            </div>
            {/* progress bar */}
            <div className="h-1.5 rounded-full overflow-hidden bg-slate-200/80 mb-1">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                style={{ width: `${levelProgressPct}%` }}
              />
            </div>
            <div className="flex justify-between font-mono text-[9px] text-[var(--db-text-secondary)]">
              <span>{progress.xp} XP</span>
              <span>{nextLevelXp} XP (Next Level)</span>
            </div>
          </div>
        </div>

        {/* Learning Streak card */}
        <div 
          className="rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:translate-y-[-2px]"
          style={{ 
            background: 'linear-gradient(135deg, rgba(245,158,11,0.12) 0%, rgba(255,255,255,0.92) 100%)', 
            border: '1px solid var(--db-border-strong)', 
            boxShadow: 'var(--db-shadow-md)' 
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--db-text-secondary)] uppercase tracking-wider">Active Streak</span>
            <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500 border border-amber-500/20">
              <Flame className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-bold font-mono text-[var(--db-text-primary)]">{progress.streak} Day{progress.streak !== 1 ? 's' : ''}</span>
            </div>
            <p className="text-xs font-mono text-[var(--db-text-secondary)] leading-relaxed">
              {progress.streak > 0 
                ? 'Keep completing guides and tasks daily to grow your streak!' 
                : 'Streak idle. Complete any cybersecurity section to trigger a streak!'}
            </p>
          </div>
        </div>

        {/* Badge unlock metrics */}
        <div 
          className="rounded-2xl p-5 flex flex-col justify-between gap-4 transition-all duration-300 hover:translate-y-[-2px]"
          style={{ 
            background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(255,255,255,0.92) 100%)', 
            border: '1px solid var(--db-border-strong)', 
            boxShadow: 'var(--db-shadow-md)' 
          }}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-[var(--db-text-secondary)] uppercase tracking-wider">Badges Earned</span>
            <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500 border border-purple-500/20">
              <Award className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-3xl font-bold font-mono text-[var(--db-text-primary)]">{progress.badges.length} / 10</span>
            </div>
            <p className="text-xs font-mono text-[var(--db-text-secondary)]">
              Earn badges by completing courses, scoring perfect quizzes, and retaining daily streaks.
            </p>
          </div>
        </div>
      </div>

      {/* Badges Inventory Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-sm font-bold font-mono tracking-tight text-[var(--db-text-primary)] uppercase">
          Badge Inventory
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {BADGES_CONFIG.map(badge => {
            const hasBadge = progress.badges.includes(badge.name)
            const theme = BADGE_THEMES[badge.name]

            return (
              <div
                key={badge.name}
                className={`rounded-2xl border p-4.5 flex flex-col items-center text-center gap-3 transition-all duration-300 hover:scale-[1.02] ${
                  hasBadge
                    ? `bg-gradient-to-br ${theme.from} ${theme.to} ${theme.border} shadow-[0_4px_12px_rgba(0,0,0,0.03)]`
                    : 'bg-[var(--db-surface-2)]/40 border-[var(--db-border)] opacity-55'
                }`}
              >
                {/* Badge Icon Grid */}
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${
                  hasBadge
                    ? `bg-white/90 ${theme.border} ${theme.text}`
                    : 'bg-slate-200/50 border-slate-300 text-slate-400'
                }`}>
                  <Award className="h-5 w-5" />
                </div>
                
                <div>
                  <h4 className={`font-mono text-xs font-bold leading-tight ${hasBadge ? 'text-[var(--db-text-primary)]' : 'text-slate-400'}`}>
                    {badge.name}
                  </h4>
                  <p className="font-mono text-[9px] text-[var(--db-text-secondary)] mt-1 leading-normal">
                    {badge.desc}
                  </p>
                </div>

                <span className={`px-2 py-0.5 rounded border font-mono text-[8px] font-bold uppercase tracking-wider mt-auto ${
                  hasBadge
                    ? `bg-white/40 ${theme.border} ${theme.text}`
                    : 'bg-slate-200/40 border-slate-300 text-slate-400'
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
