"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  BookOpen,
  Shield,
  GraduationCap,
  Newspaper,
  Trophy,
  Award,
  User,
  Settings,
  LogOut,
  Loader,
  ChevronDown,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { useProgress } from '@/lib/progress-context'

interface UserSession {
  userId: string
  name: string
  email: string
  phone: string
}

interface SidebarProps {
  user: UserSession
}

const navGroups = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
    ],
  },
  {
    label: 'Learning',
    items: [
      { name: 'My Learning', href: '/dashboard/course', icon: GraduationCap },
      { name: 'Cyber Hygiene', href: '/dashboard/hygiene', icon: Shield },
      { name: 'News & Awareness', href: '/dashboard/news', icon: Newspaper },
    ],
  },
  {
    label: 'Progress',
    items: [
      { name: 'Achievements', href: '/dashboard/achievements', icon: Trophy },
      { name: 'Certificates', href: '/dashboard/certificates', icon: Award },
    ],
  },
  {
    label: 'Account',
    items: [
      { name: 'Profile', href: '/dashboard/profile', icon: User },
      { name: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
  },
]

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)
  const { progress, getOverallPercent } = useProgress()
  const overallPct = getOverallPercent()

  async function handleLogout() {
    setLoggingOut(true)
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        router.push('/login')
        router.refresh()
      }
    } catch (err) {
      console.error('Logout failed:', err)
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <aside
      className="hidden md:flex flex-col w-64 shrink-0 select-none relative z-20"
      style={{
        background: 'var(--db-surface)',
        borderRight: '1px solid var(--db-border)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'var(--db-shadow-md)',
      }}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-5" style={{ borderBottom: '1px solid var(--db-border)' }}>
        <div
          className="relative flex items-center justify-center w-9 h-9 rounded-xl overflow-hidden shrink-0"
          style={{ background: 'var(--db-accent-light)', border: '1px solid var(--db-border-strong)' }}
        >
          <Image
            src="/images/cyberpeace-logo.webp"
            alt="CyberPeace"
            width={28}
            height={28}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-sm tracking-tight" style={{ color: 'var(--db-text-primary)' }}>
            CyberGuardian
          </span>
          <span className="text-[10px] font-mono tracking-widest uppercase" style={{ color: 'var(--db-accent)' }}>
            by CyberPeace
          </span>
        </div>
      </div>

      {/* User Progress Card */}
      <div className="mx-4 my-4 p-3.5 rounded-xl" style={{ background: 'var(--db-accent-light)', border: '1px solid var(--db-border-strong)' }}>
        <div className="flex items-center gap-2.5 mb-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-mono shrink-0"
            style={{ background: 'var(--db-accent)', color: '#fff' }}
          >
            {user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold truncate" style={{ color: 'var(--db-text-primary)' }}>{user.name}</span>
            <span className="text-[9px] font-mono truncate" style={{ color: 'var(--db-text-muted)' }}>Level 1 Trainee</span>
          </div>
        </div>
        {/* XP bar */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-[9px] font-mono" style={{ color: 'var(--db-text-secondary)' }}>Course Progress</span>
          <span className="text-[9px] font-mono font-bold" style={{ color: 'var(--db-accent)' }}>{overallPct}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(14,165,233,0.15)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, var(--db-accent), #8B5CF6)' }}
            initial={{ width: 0 }}
            animate={{ width: `${overallPct}%` }}
            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 px-3 flex flex-col gap-5 overflow-y-auto pb-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p
              className="px-3 mb-1.5 text-[9px] font-mono font-bold uppercase tracking-[0.2em]"
              style={{ color: 'var(--db-text-muted)' }}
            >
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                    style={{
                      color: isActive ? 'var(--db-accent)' : 'var(--db-text-secondary)',
                      background: isActive ? 'var(--db-accent-light)' : 'transparent',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActive"
                        className="absolute inset-0 rounded-xl"
                        style={{ background: 'var(--db-accent-light)', border: '1px solid var(--db-border-strong)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {isActive && (
                      <div
                        className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r"
                        style={{ background: 'var(--db-accent)' }}
                      />
                    )}
                    <Icon className="h-4 w-4 shrink-0 relative z-10" />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4" style={{ borderTop: '1px solid var(--db-border)' }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer disabled:opacity-60"
          style={{ color: 'var(--db-red)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {loggingOut ? (
            <Loader className="h-4 w-4 animate-spin shrink-0" />
          ) : (
            <LogOut className="h-4 w-4 shrink-0" />
          )}
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  )
}
