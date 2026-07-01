"use client"

import { useEffect, useState, Suspense, lazy } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useProgress } from '@/lib/progress-context'
import { chapters } from '@/data/courseData'
import ProgressRing from '@/components/dashboard/progress-ring'
import DailyTipCard from '@/components/dashboard/daily-tip-card'
import StatCard from '@/components/dashboard/stat-card'
import ChapterCompleteModal from '@/components/dashboard/chapter-complete-modal'
import { BookOpen, Flame, Award, ArrowRight, GraduationCap, ShieldCheck } from 'lucide-react'

// Lazy-load the 3D scene to keep initial paint fast
const AstronautScene = lazy(() => import('@/components/dashboard/astronaut-scene'))

interface UserSession { userId: string; name: string; email: string; phone: string }

interface DashboardMetrics {
  userCount: number
  securityScore: number
  activeThreats: number
  logsProcessed: number
  isDemoData: boolean
}

interface DashboardHomeContentProps { user: UserSession }

const METRIC_TOOLTIPS = {
  securityScore: 'Calculated from device patch status, MFA coverage, endpoint protection health, and password hygiene scores across all registered users. 100% = fully hardened posture.',
  userCount: 'Total number of verified accounts in the CyberGuardian system with completed email and phone verification.',
  activeThreats: 'Active threat vectors identified by the telemetry engine across your connected digital environment. 0 = clean.',
  logsProcessed: 'Total real-time security event logs ingested and analyzed by the monitoring engine in the current session.',
}

export default function DashboardHomeContent({ user }: DashboardHomeContentProps) {
  const { progress, getOverallPercent, getCompletedCount, isChapterUnlocked } = useProgress()
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null)

  const overallPct = getOverallPercent()
  const completedCount = getCompletedCount()

  // Find the chapter to continue (last unlocked incomplete chapter)
  let continueChapterId = 1
  for (let i = 1; i <= chapters.length; i++) {
    if (isChapterUnlocked(i)) continueChapterId = i
  }

  // Fetch live/demo metrics from server route
  useEffect(() => {
    fetch('/api/dashboard/metrics')
      .then(r => r.json())
      .then(setMetrics)
      .catch(() => setMetrics({ userCount: 398, securityScore: 98, activeThreats: 0, logsProcessed: 1249, isDemoData: true }))
  }, [])

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto">
      {/* Unlock celebration modal */}
      <ChapterCompleteModal />

      {/* ── Hero row: Welcome + 3D Astronaut ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
        {/* Welcome text left column */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-xs font-mono font-bold uppercase tracking-[0.25em] mb-2"
              style={{ color: 'var(--db-accent)' }}
            >
              Welcome back
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
              className="text-3xl md:text-4xl font-bold tracking-tight leading-tight"
              style={{ color: 'var(--db-text-primary)' }}
            >
              {user.name.split(' ')[0]}, your digital defense<br />
              <span style={{ color: 'var(--db-accent)' }}>starts here.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="mt-3 text-sm leading-relaxed"
              style={{ color: 'var(--db-text-secondary)' }}
            >
              You've completed <strong>{completedCount}</strong> of 9 chapters. 
              Keep building your cyber hygiene skills — every completed chapter unlocks the next.
            </motion.p>
          </div>

          {/* Quick stats row */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--db-accent-light)', border: '1px solid var(--db-border-strong)', color: 'var(--db-accent)' }}
            >
              <GraduationCap className="h-4 w-4" />
              <span>{overallPct}% Complete</span>
            </div>

            {progress.streak > 0 && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.20)', color: '#D97706' }}
              >
                <Flame className="h-4 w-4" />
                <span>{progress.streak}-day streak</span>
              </div>
            )}

            {progress.badges.length > 0 && (
              <div
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.20)', color: '#8B5CF6' }}
              >
                <Award className="h-4 w-4" />
                <span>{progress.badges.length} Badge{progress.badges.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </motion.div>

          {/* Continue learning CTA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.28 }}
          >
            <Link href={`/dashboard/course/${continueChapterId}`}>
              <button
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold text-sm transition-all cursor-pointer"
                style={{ background: 'linear-gradient(135deg, var(--db-accent), #8B5CF6)', boxShadow: 'var(--db-shadow-glow)' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <BookOpen className="h-4 w-4" />
                Continue Learning
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </motion.div>
        </div>

        {/* 3D Astronaut right column */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(14,165,233,0.06), rgba(139,92,246,0.06))',
            border: '1px solid var(--db-border)',
            boxShadow: 'var(--db-shadow-md)',
          }}
        >
          <Suspense fallback={
            <div className="h-[380px] flex items-center justify-center" style={{ color: 'var(--db-text-muted)' }}>
              <div className="flex flex-col items-center gap-3 text-xs font-mono">
                <div className="h-8 w-8 rounded-full border-2 border-sky-400 border-t-transparent animate-spin" />
                Loading 3D scene...
              </div>
            </div>
          }>
            <AstronautScene />
          </Suspense>
        </div>
      </div>

      {/* ── Metric Stat Cards ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Security Score"
          value={metrics?.securityScore ?? 0}
          suffix="%"
          subtext="Overall device & account hygiene rating"
          iconType="shield"
          tooltipText={METRIC_TOOLTIPS.securityScore}
          isDemo={metrics?.isDemoData}
        />
        <StatCard
          title="Verified Users"
          value={metrics?.userCount ?? 0}
          subtext="Authenticated operators in the system"
          iconType="users"
          tooltipText={METRIC_TOOLTIPS.userCount}
          isDemo={metrics?.isDemoData}
        />
        <StatCard
          title="Active Threats"
          value={metrics?.activeThreats ?? 0}
          subtext="Threat vectors identified this session"
          iconType="alert"
          tooltipText={METRIC_TOOLTIPS.activeThreats}
          isDemo={metrics?.isDemoData}
        />
        <StatCard
          title="Logs Processed"
          value={metrics?.logsProcessed ?? 0}
          subtext="Security telemetry events analyzed"
          iconType="activity"
          tooltipText={METRIC_TOOLTIPS.logsProcessed}
          isDemo={metrics?.isDemoData}
        />
      </div>

      {/* ── Progress + Daily Tip row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course progress panel */}
        <div
          className="rounded-2xl p-6 flex items-center gap-6"
          style={{
            background: 'rgba(255,255,255,0.90)',
            border: '1px solid var(--db-border)',
            boxShadow: 'var(--db-shadow-md)',
          }}
        >
          <ProgressRing percent={overallPct} size={110} label="Done" sublabel={`${completedCount}/9`} />
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-bold" style={{ color: 'var(--db-text-primary)' }}>Course Progress</h3>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--db-text-secondary)' }}>
              Complete all 9 chapters to earn your Cyber Hygiene Certificate.
            </p>
            <div className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'var(--db-accent)' }}>
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>{progress.xp} XP earned</span>
            </div>
          </div>
        </div>

        {/* Daily tip — spans 2 columns */}
        <div className="lg:col-span-2">
          <DailyTipCard />
        </div>
      </div>

      {/* ── Badges Inventory ─────────────────────────────────────────── */}
      {progress.badges.length > 0 && (
        <div
          className="rounded-2xl p-6"
          style={{ background: 'rgba(255,255,255,0.90)', border: '1px solid var(--db-border)', boxShadow: 'var(--db-shadow-md)' }}
        >
          <h3 className="text-sm font-bold mb-4" style={{ color: 'var(--db-text-primary)' }}>
            🏅 Earned Badges ({progress.badges.length})
          </h3>
          <div className="flex flex-wrap gap-3">
            {progress.badges.map(badge => (
              <motion.div
                key={badge}
                whileHover={{ y: -2, scale: 1.03 }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold"
                style={{
                  background: 'rgba(139,92,246,0.08)',
                  border: '1px solid rgba(139,92,246,0.20)',
                  color: '#8B5CF6',
                }}
              >
                <Award className="h-3.5 w-3.5" />
                {badge}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
