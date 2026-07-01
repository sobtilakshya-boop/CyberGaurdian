"use client"

import { useProgress } from '@/lib/progress-context'
import { chapters } from '@/data/courseData'
import ProgressRing from '@/components/dashboard/progress-ring'
import DailyTipCard from '@/components/dashboard/daily-tip-card'
import StatCard from '@/components/dashboard/stat-card'
import CyberHygieneSection from '@/components/dashboard/cyber-hygiene-section'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BookOpen, Flame, Award, ShieldAlert, Cpu } from 'lucide-react'

interface UserSession {
  userId: string
  name: string
  email: string
  phone: string
}

interface DashboardHomeContentProps {
  user: UserSession
}

export default function DashboardHomeContent({ user }: DashboardHomeContentProps) {
  const { progress, getOverallPercent, getCompletedCount, isChapterUnlocked } = useProgress()
  
  const overallPct = getOverallPercent()
  const completedCount = getCompletedCount()

  // Find the latest unlocked but incomplete chapter to "Continue Learning"
  let continueChapterId = 1
  for (let i = 1; i <= chapters.length; i++) {
    if (isChapterUnlocked(i)) {
      continueChapterId = i
    }
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between border-b border-slate-900 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-bold font-mono text-white tracking-wide">
            Welcome back, <span className="text-cyan-400">{user.name}</span>
          </h2>
          <p className="text-xs font-mono text-slate-500">
            System Status: Nominal | All endpoints reporting security telemetry.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0 font-mono text-[10px] uppercase bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-3 py-1.5 rounded-lg w-fit">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>Security Clearance Level 1 Verified</span>
        </div>
      </div>

      {/* Gamified Core Metrics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Overall Completion Ring */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl flex items-center justify-around gap-6">
          <ProgressRing
            percent={overallPct}
            size={120}
            label="Complete"
            sublabel={`${completedCount}/9 Chapters`}
          />
          <div className="flex flex-col gap-2">
            <h3 className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
              Academy Progress
            </h3>
            <p className="font-mono text-xs text-slate-500 leading-relaxed">
              Complete reading, watch guides, clear strips, and pass quizzes to unlock your credential certificate.
            </p>
            <Link href={`/dashboard/learn/${continueChapterId}`}>
              <button className="w-fit px-4 py-2 mt-1 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                Continue learning
              </button>
            </Link>
          </div>
        </div>

        {/* Gamified Stats Summary */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-slate-800/60 bg-slate-950/45">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">XP Points</span>
            <span className="font-mono text-2xl font-extrabold text-yellow-400">{progress.xp}</span>
            <span className="font-mono text-[9px] text-slate-600">Total course: {9 * 220} XP</span>
          </div>

          <div className="flex flex-col gap-1.5 p-4 rounded-xl border border-slate-800/60 bg-slate-950/45">
            <span className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Day Streak</span>
            <div className="flex items-center gap-1.5">
              <Flame className={`h-5 w-5 ${progress.streak > 0 ? 'text-orange-400 fill-orange-500/10 animate-pulse' : 'text-slate-600'}`} />
              <span className="font-mono text-2xl font-extrabold text-white">{progress.streak}</span>
            </div>
            <span className="font-mono text-[9px] text-slate-600">Daily logins count</span>
          </div>
        </div>

        {/* Daily Tip component */}
        <DailyTipCard />
      </div>

      {/* Badges Inventory Section */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl">
        <h3 className="font-mono text-xs font-bold text-white uppercase tracking-widest mb-4">
          🔓 Earned Security Badges ({progress.badges.length})
        </h3>
        {progress.badges.length > 0 ? (
          <div className="flex flex-wrap gap-3.5">
            {progress.badges.map(badge => (
              <motion.div
                key={badge}
                whileHover={{ y: -2 }}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-yellow-500/25 bg-yellow-500/10 text-yellow-400 font-mono text-xs font-bold shadow-md"
              >
                <Award className="h-4.5 w-4.5 text-yellow-400 shrink-0" />
                <span>{badge}</span>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="font-mono text-xs text-slate-500">
            No badges unlocked yet. Finish Chapter 1 to earn your first badge.
          </p>
        )}
      </div>

      {/* Statistics Counter Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Security Score"
          value={98}
          suffix="%"
          subtext="Integrity score of system devices"
          iconType="shield"
        />
        <StatCard
          title="Verified Users"
          value={398}
          subtext="Total authenticated operators"
          iconType="users"
        />
        <StatCard
          title="Active Threat Vectors"
          value={0}
          subtext="Threat intrusions identified"
          iconType="alert"
          colorClass="text-green-400 border-green-500/20"
        />
        <StatCard
          title="System Logs Parsed"
          value={1249}
          subtext="Real-time security logs processed"
          iconType="activity"
        />
      </div>

      {/* Cyber Hygiene Module Section */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-xl shadow-md">
        <div className="flex flex-col gap-2 mb-6">
          <h3 className="font-mono text-base font-bold text-white uppercase tracking-wider">
            Cyber Academy: Cyber Hygiene Core
          </h3>
          <p className="text-xs font-mono text-slate-500">
            Explore interactive educational resources to implement zero-trust guidelines and digital environment hygiene.
          </p>
        </div>

        <CyberHygieneSection />
      </div>
    </div>
  )
}
